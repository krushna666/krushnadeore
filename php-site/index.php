<?php
declare(strict_types=1);

require __DIR__ . '/functions.php';

$route = trim((string) ($_GET['route'] ?? ''), '/');
$segments = $route === '' ? [] : explode('/', $route);

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
