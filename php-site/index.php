<?php
declare(strict_types=1);

require __DIR__ . '/functions.php';
require __DIR__ . '/auth.php';

$route = trim((string) ($_GET['route'] ?? ''), '/');
$segments = $route === '' ? [] : explode('/', $route);

if ($route === 'admin/logout') {
    session_destroy();
    redirect('admin/login');
}

if ($route === 'admin/login') {
    if (currentUser()) redirect('admin');
    $error = null;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $statement = db()->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
        $statement->execute([trim((string) ($_POST['email'] ?? ''))]);
        $user = $statement->fetch();
        if ($user && password_verify((string) ($_POST['password'] ?? ''), $user['password_hash'])) {
            unset($user['password_hash']);
            session_regenerate_id(true);
            $_SESSION['user'] = $user;
            redirect('admin');
        }
        $error = 'Invalid email or password.';
    }
    pageStart('Admin Login');
    ?><section class="section narrow"><p class="eyebrow">OlyxMedia CMS</p><h1>Sign in</h1><?php if ($error) echo '<p class="error">' . e($error) . '</p>'; ?><form method="post"><label>Email<input type="email" name="email" required></label><label>Password<input type="password" name="password" required></label><button class="button" type="submit">Sign in</button></form></section><?php pageEnd(); exit;
}

if ($route === 'admin/blogs') {
        requireAdmin();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $action = (string) ($_POST['action'] ?? '');
            $id = (int) ($_POST['id'] ?? 0);
            if ($action === 'delete' && $id > 0) {
                db()->prepare('DELETE FROM posts WHERE id = ?')->execute([$id]);
            } elseif ($action === 'create') {
                $title = trim((string) ($_POST['title'] ?? ''));
                $slug = trim((string) ($_POST['slug'] ?? ''));
                $content = trim((string) ($_POST['content'] ?? ''));
                $status = ($_POST['status'] ?? 'DRAFT') === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
                if ($title !== '' && preg_match('/^[a-z0-9-]+$/', $slug) && $content !== '') {
                    $statement = db()->prepare('INSERT INTO posts (title, slug, excerpt, content, status, published_at) VALUES (?, ?, ?, ?, ?, ?)');
                    $statement->execute([$title, $slug, trim((string) ($_POST['excerpt'] ?? '')), $content, $status, $status === 'PUBLISHED' ? date('Y-m-d H:i:s') : null]);
                }
            }
            redirect('admin/blogs');
        }
        $posts = db()->query('SELECT id, title, slug, status, published_at FROM posts ORDER BY created_at DESC')->fetchAll();
        pageStart('Manage Blog');
        ?><section class="section"><p class="eyebrow">CMS</p><h1>Blog</h1><div class="grid"><article><h2>Create article</h2><form method="post"><input type="hidden" name="action" value="create"><label>Title<input name="title" required></label><label>Slug<input name="slug" pattern="[a-z0-9-]+" required></label><label>Excerpt<textarea name="excerpt" rows="3"></textarea></label><label>Content<textarea name="content" rows="8" required></textarea></label><label>Status<select name="status"><option>DRAFT</option><option>PUBLISHED</option></select></label><button class="button" type="submit">Save article</button></form></article><article><h2>Articles</h2><?php foreach ($posts as $post): ?><p><strong><?= e($post['title']) ?></strong><br><small><?= e($post['status']) ?> · <?= e($post['slug']) ?></small></p><form method="post"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int) $post['id'] ?>"><button type="submit">Delete</button></form><?php endforeach; if (!$posts) echo '<p>No articles yet.</p>'; ?></article></div></section><?php pageEnd(); exit;
}

if ($route === 'admin/leads') {
    requireAdmin();
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'], $_POST['status'])) {
        $allowedStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST'];
        $status = (string) $_POST['status'];
        if (in_array($status, $allowedStatuses, true)) {
            db()->prepare('UPDATE leads SET status = ? WHERE id = ?')->execute([$status, (int) $_POST['id']]);
        }
        redirect('admin/leads');
    }
    $leads = db()->query('SELECT id, name, email, phone, message, status, created_at FROM leads ORDER BY created_at DESC')->fetchAll();
    pageStart('Manage Leads');
    ?><section class="section"><p class="eyebrow">CMS</p><h1>Leads</h1><div class="grid"><?php foreach ($leads as $lead): ?><article><h2><?= e($lead['name']) ?></h2><p><?= e($lead['email']) ?> · <?= e($lead['phone']) ?></p><p><?= nl2br(e($lead['message'])) ?></p><form method="post"><input type="hidden" name="id" value="<?= (int) $lead['id'] ?>"><label>Status<select name="status"><?php foreach (['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST'] as $status): ?><option <?= $lead['status'] === $status ? 'selected' : '' ?>><?= $status ?></option><?php endforeach; ?></select></label><button type="submit">Update</button></form></article><?php endforeach; if (!$leads) echo '<p>No leads yet.</p>'; ?></div></section><?php pageEnd(); exit;
}

if ($route === 'admin/media') {
    requireAdmin();
    $uploadError = null;
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $allowed = ['image/jpeg' => '.jpg', 'image/png' => '.png', 'image/webp' => '.webp', 'image/gif' => '.gif', 'video/mp4' => '.mp4', 'video/webm' => '.webm'];
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        if ($file['error'] !== UPLOAD_ERR_OK || !isset($allowed[$mime]) || $file['size'] > 50 * 1024 * 1024) {
            $uploadError = 'Invalid file or file is larger than 50MB.';
        } else {
            $filename = bin2hex(random_bytes(16)) . $allowed[$mime];
            $directory = __DIR__ . '/uploads';
            if (!is_dir($directory)) mkdir($directory, 0755, true);
            move_uploaded_file($file['tmp_name'], $directory . '/' . $filename);
            $statement = db()->prepare('INSERT INTO media (url, filename, mime_type, size, alt_text) VALUES (?, ?, ?, ?, ?)');
            $statement->execute(['uploads/' . $filename, $file['name'], $mime, $file['size'], trim((string) ($_POST['alt_text'] ?? ''))]);
        }
    }
    $media = db()->query('SELECT * FROM media ORDER BY created_at DESC')->fetchAll();
    pageStart('Media Library');
    ?><section class="section"><p class="eyebrow">CMS</p><h1>Media Library</h1><?php if ($uploadError) echo '<p class="error">' . e($uploadError) . '</p>'; ?><form method="post" enctype="multipart/form-data"><label>File<input type="file" name="file" required></label><label>Alt text<input name="alt_text"></label><button class="button" type="submit">Upload file</button></form><div class="grid"><?php foreach ($media as $item): ?><article><p><?= e($item['filename']) ?></p><small><?= e($item['mime_type']) ?> · <?= (int) $item['size'] ?> bytes</small></article><?php endforeach; ?></div></section><?php pageEnd(); exit;
}

if ($route === 'admin') {
    $user = requireAdmin();
    $postCount = (int) db()->query("SELECT COUNT(*) FROM posts WHERE status = 'PUBLISHED'")->fetchColumn();
    $leadCount = (int) db()->query("SELECT COUNT(*) FROM leads WHERE status = 'NEW'")->fetchColumn();
    pageStart('Admin Dashboard');
    ?><section class="section narrow"><p class="eyebrow">CMS dashboard</p><h1>Welcome, <?= e($user['name']) ?></h1><div class="grid"><article><h2><?= $postCount ?></h2><p>Published posts</p></article><article><h2><?= $leadCount ?></h2><p>New leads</p></article><article><a class="button" href="<?= e(url('admin/logout')) ?>">Sign out</a></article></div></section><?php pageEnd(); exit;
}

if ($route === '') {
    pageStart('Digital Marketing That Moves Business');
    ?><section class="hero"><p class="eyebrow">OlyxMedia · Pune</p><h1>Make your marketing impossible to ignore.</h1><p class="lede">Strategy, content and performance marketing for brands ready to grow with clarity.</p><a class="button" href="<?= e(url('contact')) ?>">Start a conversation</a></section>
    <section class="section"><p class="eyebrow">What we do</p><h2>Marketing with a point of view.</h2><div class="grid"><article><h3>Social Media</h3><p>Content systems that earn attention and build trust.</p></article><article><h3>Search & SEO</h3><p>Be found by the people already looking for you.</p></article><article><h3>Paid Growth</h3><p>Campaigns shaped around useful, measurable outcomes.</p></article></div></section><?php
    pageEnd();
    exit;
}

if ($route === 'blog') {
    pageStart('Blog');
    $posts = publishedRows('posts', 'published_at DESC');
    ?><section class="section"><p class="eyebrow">Ideas for growth</p><h1>Blog</h1><div class="grid"><?php foreach ($posts as $post): ?><article><p class="eyebrow">Article</p><h2><?= e($post['title']) ?></h2><p><?= e($post['excerpt'] ?? '') ?></p><a href="<?= e(url('blog/' . $post['slug'])) ?>">Read article</a></article><?php endforeach; ?></div><?php
    if (!$posts) echo '<p>New articles are on their way.</p>';
    ?></section><?php pageEnd(); exit;
}

if ($route === 'case-studies') {
    pageStart('Case Studies');
    $items = publishedRows('case_studies');
    ?><section class="section"><p class="eyebrow">Verified work</p><h1>Case Studies</h1><div class="grid"><?php foreach ($items as $item): ?><article><h2><?= e($item['title']) ?></h2><p><?= e($item['client_name']) ?><?= $item['industry'] ? ' · ' . e($item['industry']) : '' ?></p></article><?php endforeach; ?></div><?php
    if (!$items) echo '<p>Case studies coming soon.</p>';
    ?></section><?php pageEnd(); exit;
}

if (in_array($segments[0] ?? '', ['services', 'industries', 'portfolio', 'testimonials', 'faq', 'glossary', 'resources', 'careers'], true) && count($segments) === 1) {
    $titles = [
        'services' => ['Services', 'Focused digital marketing services for sustainable growth.'],
        'industries' => ['Industries', 'Marketing shaped around the realities of your industry.'],
        'portfolio' => ['Portfolio', 'A selection of work created with care and intent.'],
        'testimonials' => ['Testimonials', 'What clients say about working with OlyxMedia.'],
        'faq' => ['FAQ', 'Answers to common questions about our work.'],
        'glossary' => ['Glossary', 'Plain-language digital marketing definitions.'],
        'resources' => ['Resources', 'Practical resources for your next growth move.'],
        'careers' => ['Careers', 'Build meaningful marketing work with our team.'],
    ];
    [$title, $description] = $titles[$segments[0]];
    pageStart($title, $description);
    ?><section class="section narrow"><p class="eyebrow">OlyxMedia</p><h1><?= e($title) ?></h1><p class="lede"><?= e($description) ?></p><p>We are preparing this section with useful, verified information. Contact us to discuss your goals.</p><a class="button" href="<?= e(url('contact')) ?>">Talk to our team</a></section><?php
    pageEnd(); exit;
}

if (in_array($segments[0] ?? '', ['about', 'pricing', 'contact', 'privacy-policy', 'terms-and-conditions', 'refund-policy', 'cookie-policy'], true) && count($segments) === 1 && $route !== 'contact') {
    $titles = [
        'about' => ['About OlyxMedia', 'A focused digital marketing partner for ambitious businesses.'],
        'pricing' => ['Pricing', 'Clear scopes and practical marketing engagements.'],
        'privacy-policy' => ['Privacy Policy', 'How OlyxMedia handles information submitted through this website.'],
        'terms-and-conditions' => ['Terms and Conditions', 'Terms governing use of this website and our services.'],
        'refund-policy' => ['Refund Policy', 'Our policy for payments and service engagements.'],
        'cookie-policy' => ['Cookie Policy', 'Information about cookies used on this website.'],
    ];
    [$title, $description] = $titles[$segments[0]];
    pageStart($title, $description);
    ?><section class="section narrow"><p class="eyebrow">OlyxMedia</p><h1><?= e($title) ?></h1><p class="lede"><?= e($description) ?></p><p><?= e($description) ?> Please contact our team if you have questions about this page.</p></section><?php
    pageEnd(); exit;
}

if (($segments[0] ?? '') === 'blog' && !empty($segments[1])) {
    $statement = db()->prepare("SELECT * FROM posts WHERE slug = ? AND status = 'PUBLISHED' LIMIT 1");
    $statement->execute([$segments[1]]);
    $post = $statement->fetch();
    if (!$post) { http_response_code(404); pageStart('Article Not Found'); echo '<section class="section narrow"><h1>Article not found</h1></section>'; pageEnd(); exit; }
    pageStart($post['title'], $post['excerpt'] ?? '');
    ?><article class="section narrow"><p class="eyebrow">Article</p><h1><?= e($post['title']) ?></h1><p class="lede"><?= e($post['excerpt'] ?? '') ?></p><div class="article-content"><?= $post['content'] ?></div></article><?php pageEnd(); exit;
}

if (($segments[0] ?? '') === 'case-studies' && !empty($segments[1])) {
    $statement = db()->prepare("SELECT * FROM case_studies WHERE slug = ? AND status = 'PUBLISHED' LIMIT 1");
    $statement->execute([$segments[1]]);
    $item = $statement->fetch();
    if (!$item) { http_response_code(404); pageStart('Case Study Not Found'); echo '<section class="section narrow"><h1>Case study not found</h1></section>'; pageEnd(); exit; }
    pageStart($item['title'], $item['client_name']);
    ?><article class="section narrow"><p class="eyebrow">Verified case study</p><h1><?= e($item['title']) ?></h1><p class="lede"><?= e($item['client_name']) ?><?= $item['industry'] ? ' · ' . e($item['industry']) : '' ?></p><?php if ($item['challenge']) echo '<h2>Challenge</h2><p>' . nl2br(e($item['challenge'])) . '</p>'; if ($item['strategy']) echo '<h2>Strategy</h2><p>' . nl2br(e($item['strategy'])) . '</p>'; if ($item['execution']) echo '<h2>Execution</h2><p>' . nl2br(e($item['execution'])) . '</p>'; ?></article><?php pageEnd(); exit;
}

if ($route === 'contact') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $name = trim((string) ($_POST['name'] ?? ''));
        $email = trim((string) ($_POST['email'] ?? ''));
        $phone = trim((string) ($_POST['phone'] ?? ''));
        $message = trim((string) ($_POST['message'] ?? ''));
        if ($name !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) && $phone !== '') {
            $statement = db()->prepare('INSERT INTO leads (name, email, phone, message, status) VALUES (?, ?, ?, ?, ?)' );
            $statement->execute([$name, $email, $phone, $message, 'NEW']);
            redirect('thank-you');
        }
        $error = 'Please enter your name, valid email and phone number.';
    }
    pageStart('Contact');
    ?><section class="section narrow"><p class="eyebrow">Let’s talk</p><h1>Tell us what you’re building.</h1><?php if (!empty($error)) echo '<p class="error">' . e($error) . '</p>'; ?><form method="post"><label>Name<input name="name" required></label><label>Email<input type="email" name="email" required></label><label>Phone<input name="phone" required></label><label>Message<textarea name="message" rows="6"></textarea></label><button class="button" type="submit">Send enquiry</button></form></section><?php pageEnd(); exit;
}

if ($route === 'thank-you') {
    pageStart('Thank You');
    ?><section class="section narrow"><h1>Thanks for reaching out.</h1><p>We’ve received your enquiry and will be in touch soon.</p></section><?php pageEnd(); exit;
}

http_response_code(404);
pageStart('Page Not Found');
?><section class="section narrow"><h1>Page not found</h1><p>The page you requested does not exist.</p></section><?php pageEnd();
