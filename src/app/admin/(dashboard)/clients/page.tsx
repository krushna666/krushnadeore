import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClientAction, deleteClientAction } from "./actions";
import { CsvImportClients } from "@/components/admin/csv-import-clients";
import Image from "next/image";

export const metadata = { title: "Clients & Logos | OlyxMedia Admin" };

const categoryLabels: Record<string, string> = {
  VERIFIED_CLIENT: "Verified Client",
  PORTFOLIO_CLIENT: "Portfolio Client",
  PARTNER: "Partner",
  BRAND_WE_ADMIRE: "Brand We Admire",
};

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { order: "asc" }, include: { logo: true } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Clients &amp; Logos</h1>
        <p className="text-sm text-muted">
          Only &ldquo;Verified Client&rdquo; entries appear under &ldquo;Our Clients&rdquo; on the site. Never mark a
          logo verified without permission and a real relationship.
        </p>
      </div>

      <form action={createClientAction} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
        <Input name="companyName" placeholder="Company name" required />
        <Input name="logoUrl" placeholder="Logo URL (upload via Media Library, paste URL here)" />
        <Input name="website" placeholder="Website" />
        <Input name="industry" placeholder="Industry" />
        <Select name="category" defaultValue="BRAND_WE_ADMIRE">
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="verified" /> Verified
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
        </div>
        <Textarea name="description" placeholder="Description (optional)" className="sm:col-span-2" rows={2} />
        <Button type="submit" className="sm:col-span-2">
          Add
        </Button>
      </form>

      <CsvImportClients />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {clients.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border p-4">
            <div className="mb-2 flex h-16 items-center justify-center">
              {c.logo ? (
                <Image src={c.logo.url} alt={c.logo.alt || c.companyName} width={120} height={64} className="max-h-16 w-auto object-contain grayscale" unoptimized />
              ) : (
                <span className="text-xs text-muted">No logo</span>
              )}
            </div>
            <p className="text-center text-sm font-medium">{c.companyName}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              <Badge variant="outline">{categoryLabels[c.category]}</Badge>
              {c.verified && <Badge variant="success">Verified</Badge>}
            </div>
            <form action={deleteClientAction.bind(null, c.id)} className="mt-3">
              <Button size="sm" variant="destructive" type="submit" className="w-full">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
