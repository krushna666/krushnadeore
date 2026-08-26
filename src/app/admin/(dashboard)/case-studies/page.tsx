import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveCaseStudyAction, deleteCaseStudyAction } from "./actions";
import type { CaseStudy } from "@prisma/client";

export const metadata = { title: "Case Studies | OlyxMedia Admin" };

function CaseStudyFields({ cs }: { cs?: CaseStudy }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cs && <input type="hidden" name="id" value={cs.id} />}
      <Input name="title" placeholder="Title" defaultValue={cs?.title} required />
      <Input name="slug" placeholder="Slug (auto from title if blank)" defaultValue={cs?.slug} />
      <Input name="clientName" placeholder="Client name" defaultValue={cs?.clientName} required />
      <Input name="industry" placeholder="Industry" defaultValue={cs?.industry || ""} />
      <Input name="timeline" placeholder="Timeline (e.g. 6 months)" defaultValue={cs?.timeline || ""} />
      <Input name="budgetRange" placeholder="Budget range (optional)" defaultValue={cs?.budgetRange || ""} />
      <Textarea name="challenge" placeholder="Challenge" defaultValue={cs?.challenge || ""} className="sm:col-span-2" rows={2} />
      <Textarea name="strategy" placeholder="Strategy" defaultValue={cs?.strategy || ""} className="sm:col-span-2" rows={2} />
      <Textarea name="execution" placeholder="Execution" defaultValue={cs?.execution || ""} className="sm:col-span-2" rows={2} />
      <Input
        name="servicesUsed"
        placeholder="Services used (comma-separated)"
        defaultValue={cs?.servicesUsed.join(", ") || ""}
        className="sm:col-span-2"
      />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="resultsVerified" defaultChecked={cs?.resultsVerified} /> Results verified
        (only tick once metrics are confirmed with the client)
      </label>
      <Input name="reach" type="number" placeholder="Reach" defaultValue={cs?.reach ?? ""} />
      <Input name="engagement" type="number" placeholder="Engagement" defaultValue={cs?.engagement ?? ""} />
      <Input name="leadsGenerated" type="number" placeholder="Leads generated" defaultValue={cs?.leadsGenerated ?? ""} />
      <Input name="conversions" type="number" placeholder="Conversions" defaultValue={cs?.conversions ?? ""} />
      <Input name="roas" type="number" step="0.01" placeholder="ROAS" defaultValue={cs?.roas ?? ""} />
      <Input name="cpl" type="number" step="0.01" placeholder="CPL" defaultValue={cs?.cpl ?? ""} />
      <Input name="organicTrafficGrowth" type="number" step="0.01" placeholder="Organic traffic growth %" defaultValue={cs?.organicTrafficGrowth ?? ""} />
      <Input name="keywordGrowth" type="number" placeholder="Keyword growth" defaultValue={cs?.keywordGrowth ?? ""} />
      <Select name="status" defaultValue={cs?.status || "DRAFT"}>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </Select>
      <Input name="seoTitle" placeholder="SEO title" defaultValue={cs?.seoTitle || ""} />
      <Textarea name="metaDescription" placeholder="Meta description" defaultValue={cs?.metaDescription || ""} className="sm:col-span-2" rows={2} />
      <Button type="submit" className="sm:col-span-2">
        {cs ? "Save changes" : "Create case study"}
      </Button>
    </div>
  );
}

export default async function CaseStudiesPage() {
  const caseStudies = await prisma.caseStudy.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Case Studies</h1>

      <details className="rounded-2xl border border-border p-4">
        <summary className="cursor-pointer font-semibold">+ New case study</summary>
        <form action={saveCaseStudyAction} className="mt-4">
          <CaseStudyFields />
        </form>
      </details>

      <div className="space-y-3">
        {caseStudies.map((cs) => (
          <details key={cs.id} className="rounded-2xl border border-border p-4">
            <summary className="flex cursor-pointer items-center justify-between">
              <span className="font-medium">
                {cs.title} <span className="text-muted">— {cs.clientName}</span>
              </span>
              <Badge variant={cs.status === "PUBLISHED" ? "success" : "outline"}>{cs.status}</Badge>
            </summary>
            <form action={saveCaseStudyAction} className="mt-4">
              <CaseStudyFields cs={cs} />
            </form>
            <form action={deleteCaseStudyAction.bind(null, cs.id)} className="mt-2">
              <Button size="sm" variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}
