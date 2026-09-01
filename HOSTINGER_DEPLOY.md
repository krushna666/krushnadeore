# Deploying OlyxMedia to Hostinger (Node.js App)

## What was fixed before this package was created
Your `package.json` required `nodemailer@^9.0.5`, but `next-auth@5.0.0-beta.32`
only supports `nodemailer@^7.0.7 || ^8.0.5` as a peer dependency. A fresh
`npm install` (which is exactly what Vercel/Hostinger do on every deploy)
failed with an `ERESOLVE` error because of this conflict. This has been
fixed: `nodemailer` is now pinned to `^8.0.5`, and `package-lock.json` has
been regenerated to match. A `server.js` file was also added — see below.

## 1. Database
Hostinger shared/Node.js hosting does not provide PostgreSQL. Use your
Neon/Supabase database. Grab the **pooled connection string** from their
dashboard (important — not the direct/non-pooled one, or you may run out
of connections under load).

## 2. Create the Node.js App in hPanel
1. hPanel → **Advanced → Node.js** → **Create Application**
2. Node.js version: **20.x**
3. Application root: choose a folder, e.g. `olyxmedia`
4. Application startup file: **server.js**
5. Application URL: your domain

## 3. Set environment variables (in the same hPanel screen)
Add each of these as a separate environment variable (values from your
own `.env.example` file, filled in with real values):

```
DATABASE_URL=<your Neon/Supabase pooled connection string>
AUTH_SECRET=<generate: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SEED_ADMIN_EMAIL=admin@yourdomain.com
SEED_ADMIN_PASSWORD=<something strong, change after first login>
SEED_ADMIN_NAME=Your Name
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM="OlyxMedia Website <no-reply@yourdomain.com>"
LEAD_NOTIFICATION_EMAIL=you@yourdomain.com
CRON_SECRET=<generate a random string>
NODE_ENV=production
```

`AUTH_SECRET` is required for admin login. Generate a long random value and
add it in hPanel under the Node.js application's environment variables.
`NEXTAUTH_SECRET` is also accepted for compatibility, but use only one of
the two names. Restart the application after adding or changing it.

Do **not** upload a `.env` file to the server — hPanel environment
variables are what your app will actually read in production.

## 4. Upload the files
Upload this entire folder (it already excludes `node_modules`, `.git`,
and `.env` — do not re-add them) into the Application root you set in
step 2, via File Manager (zip + extract) or FTP/SFTP.

## 5. Install & build (via the SSH terminal Hostinger provides)
```bash
cd ~/olyxmedia          # or wherever your Application root is
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

## 6. Start the app
Back in hPanel's Node.js App screen, click **Restart**. Hostinger's
Passenger process manager will run `server.js` and route your domain's
traffic to it.

## 7. First login
Once it's live, log in at `/admin/login` using the `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` you set — but only if you also ran the seed script:
```bash
npm run db:seed
```
Then immediately change that password from the admin panel.

## If it still fails
Check the app's error log in the same hPanel Node.js screen — it shows
the actual Node.js stack trace, which is what's needed to debug further
(the same way a "Build failed" card on Vercel needs its log expanded).

For `There was a problem with the server configuration`, first verify that
`AUTH_SECRET` or `NEXTAUTH_SECRET` is present in hPanel and restart the app.
Then verify `DATABASE_URL` and run `npm run db:seed` if the admin user has not
yet been created.
