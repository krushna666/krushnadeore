import { slugify } from "@/lib/utils";

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** Extracts H2/H3 headings from stored HTML and returns both a TOC and the
 * HTML with ids injected on those headings, so TOC links can jump to them. */
export function extractToc(html: string): { toc: TocItem[]; html: string } {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const withIds = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (!text) return match;

    let id = slugify(text);
    const count = seen.get(id) || 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    toc.push({ id, text, level: Number(level) as 2 | 3 });
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });

  return { toc, html: withIds };
}
