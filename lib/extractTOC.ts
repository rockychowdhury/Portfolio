export interface TocItem {
  text: string;
  level: number;
  slug: string;
}

/**
 * Extracts headings (h1–h3) from markdown source and builds a TOC array.
 * Also injects matching `id` attributes into the rendered HTML.
 */
export function extractTOC(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = slugify(text);

    toc.push({ text, level, slug });
  }

  return toc;
}

/**
 * Injects `id` attributes into heading elements in the rendered HTML.
 */
export function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([1-3])>(.*?)<\/h\1>/gi,
    (match, level, content) => {
      const textContent = content.replace(/<[^>]+>/g, "").trim();
      const slug = slugify(textContent);
      return `<h${level} id="${slug}">${content}</h${level}>`;
    }
  );
}

/**
 * Converts text to a URL-safe slug.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
