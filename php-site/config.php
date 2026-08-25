<?php
declare(strict_types=1);

$configPath = __DIR__ . '/config.local.php';
if (!is_file($configPath)) {
    http_response_code(500);
    exit('Create php-site/config.local.php from config.example.php before running the site.');
}

return require $configPath;
