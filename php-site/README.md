# OlyxMedia PHP conversion

This folder is the Hostinger Premium-compatible PHP/MySQL conversion. It is intentionally separate from the original Next.js application while the feature migration is completed.

## Local setup

1. Copy `config.example.php` to `config.local.php` and enter your Hostinger or local MySQL details.
2. Import `schema.sql` in phpMyAdmin.
3. Set the domain in `config.local.php`.
4. Upload the contents of this folder into Hostinger `public_html`.

Create the first admin password hash on a PHP-enabled machine with:

```bash
php -r "echo password_hash('replace-with-a-strong-password', PASSWORD_DEFAULT), PHP_EOL;"
```

Insert the result into `users.password_hash` in phpMyAdmin. Never store a plain-text password.

The current slice includes the shared layout, homepage, public sections, blog and case-study pages, contact form, PDO database layer, clean URLs, and a basic admin login/dashboard. The full admin CMS and remaining content models still need to be migrated before this replaces the Next.js site.
