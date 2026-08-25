<?php
declare(strict_types=1);

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function url(string $path = ''): string
{
    $config = require __DIR__ . '/config.php';
    return rtrim($config['site_url'], '/') . '/' . ltrim($path, '/');
}

function redirect(string $path): never
{
    header('Location: ' . url($path), true, 303);
    exit;
}

function pageStart(string $title, string $description = ''): void
{
    $config = require __DIR__ . '/config.php';
    $description = $description ?: 'Digital marketing, social media and growth services from OlyxMedia.';
    ?><!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= e($title) ?> | <?= e($config['site_name']) ?></title>
<meta name="description" content="<?= e($description) ?>">
<link rel="stylesheet" href="<?= e(url('assets/site.css')) ?>">
</head><body>
<header class="site-header"><a class="logo" href="<?= e(url()) ?>">OlyxMedia</a><nav>
<a href="<?= e(url('services')) ?>">Services</a><a href="<?= e(url('case-studies')) ?>">Case Studies</a><a href="<?= e(url('blog')) ?>">Blog</a><a class="nav-cta" href="<?= e(url('contact')) ?>">Contact</a>
</nav></header><main>
<?php
}

function pageEnd(): void
{
    ?><footer class="site-footer"><div><strong>OlyxMedia</strong><p>Digital marketing for ambitious businesses.</p></div><p>&copy; <?= date('Y') ?> OlyxMedia</p></footer></main></body></html><?php
}

function publishedRows(string $table, string $order = 'updated_at DESC', int $limit = 100): array
{
    if (!preg_match('/^[a-z_]+$/', $table) || !preg_match('/^[a-z_]+ (ASC|DESC)$/i', $order)) {
        throw new InvalidArgumentException('Invalid database query identifier.');
    }
    $statement = db()->query("SELECT * FROM `$table` WHERE status = 'PUBLISHED' ORDER BY $order LIMIT " . (int) $limit);
    return $statement->fetchAll();
}
