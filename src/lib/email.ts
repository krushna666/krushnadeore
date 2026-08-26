import "server-only";
import nodemailer from "nodemailer";

function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
}

export async function sendEmail(options: { to: string; subject: string; html: string; text?: string }) {
  const transport = getTransport();
  const from = process.env.SMTP_FROM || "OlyxMedia Website <no-reply@olyxmedia.com>";

  if (!transport) {
    // No SMTP configured (e.g. local dev) — log instead of failing silently.
    console.log(`[email:dev-mode] to=${options.to} subject="${options.subject}"`);
    console.log(options.text || options.html);
    return;
  }

  await transport.sendMail({ from, ...options });
}

export function leadNotificationEmail(lead: {
  name: string;
  company?: string | null;
  phone: string;
  email: string;
  serviceRequired?: string | null;
  budget?: string | null;
  message?: string | null;
  source?: string | null;
}) {
  const rows = [
    ["Name", lead.name],
    ["Company", lead.company || "—"],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Service", lead.serviceRequired || "—"],
    ["Budget", lead.budget || "—"],
    ["Message", lead.message || "—"],
    ["Source", lead.source || "—"],
    ["Timestamp", new Date().toLocaleString("en-IN")],
  ];
  const html = `<h2>New OlyxMedia Website Lead</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`)
    .join("")}</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return { subject: "New OlyxMedia Website Lead", html, text };
}
