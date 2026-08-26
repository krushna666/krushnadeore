/**
 * Custom entry point for Hostinger's Node.js App hosting (Passenger).
 * Hostinger does not run "next start" directly — it expects a plain
 * Node.js file that starts an HTTP server. This file boots the built
 * Next.js app and listens on the port Hostinger assigns.
 *
 * Do NOT delete this file. Do NOT rename it unless you also update
 * the "Application startup file" field in hPanel to match.
 */

const { createServer } = require("node:http");
const next = require("next");

// Hostinger/Passenger sets PORT automatically. Fall back to 3000 for
// local testing of this file only (normal local dev should still use
// `npm run dev`, not this file).
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    })
      .once("error", (err) => {
        console.error("Server failed to start:", err);
        process.exit(1);
      })
      .listen(port, hostname, () => {
        console.log(`> OlyxMedia ready on http://${hostname}:${port}`);
      });
  })
  .catch((err) => {
    console.error("Next.js app failed to prepare:", err);
    process.exit(1);
  });
