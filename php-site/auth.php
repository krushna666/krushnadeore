<?php
declare(strict_types=1);

session_start();

function currentUser(): ?array
{
    return $_SESSION['user'] ?? null;
}

function requireAdmin(): array
{
    $user = currentUser();
    if (!$user || !in_array($user['role'], ['ADMIN', 'EDITOR'], true)) {
        redirect('admin/login');
    }
    return $user;
}
