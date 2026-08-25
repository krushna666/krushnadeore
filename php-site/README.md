# OlyxMedia PHP conversion

This folder is the Hostinger Premium-compatible PHP/MySQL conversion. It is intentionally separate from the original Next.js application while the feature migration is completed.

## Local setup

1. Copy `config.example.php` to `config.local.php` and enter your Hostinger or local MySQL details.
2. Import `schema.sql` in phpMyAdmin.
3. Set the domain in `config.local.php`.
4. Upload the contents of this folder into Hostinger `public_html`.

The current slice includes the shared layout, homepage, blog listing, case-study listing, contact form, PDO database layer, and clean URLs. The admin CMS and remaining content models still need to be migrated before this replaces the Next.js site.
