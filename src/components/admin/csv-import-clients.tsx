"use client";

import { useActionState } from "react";
import { previewClientCsvAction, confirmClientCsvImportAction, type CsvPreviewState } from "@/app/admin/(dashboard)/clients/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CsvImportClients() {
  const [state, formAction, pending] = useActionState<CsvPreviewState, FormData>(previewClientCsvAction, undefined);

  return (
    <div className="space-y-3 rounded-2xl border border-border p-4">
      <h3 className="font-semibold">Bulk import (CSV)</h3>
      <p className="text-xs text-muted">Columns: company_name, logo_url, website, industry, category, verified, description</p>
      <form action={formAction} className="flex items-center gap-3">
        <Input type="file" name="file" accept=".csv" required />
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Parsing…" : "Preview"}
        </Button>
      </form>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      {state?.rows && (
        <div>
          <p className="mb-2 text-sm text-muted">{state.rows.length} row(s) parsed. Review, then confirm import.</p>
          <div className="max-h-64 overflow-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-surface">
                <tr>
                  {Object.keys(state.rows[0] || {}).map((k) => (
                    <th key={k} className="p-2 text-left">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.rows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="p-2">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form action={confirmClientCsvImportAction} className="mt-3">
            <input type="hidden" name="raw" value={state.raw} />
            <Button type="submit">Confirm import</Button>
          </form>
        </div>
      )}
    </div>
  );
}
