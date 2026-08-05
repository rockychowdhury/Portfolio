import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { fixImagePaths } from "./fixImagePaths";
import { extractTOC, injectHeadingIds, TocItem } from "./extractTOC";

export interface ProcessedMarkdown {
  html: string;
  toc: TocItem[];
}

/**
 * Full markdown processing pipeline:
 * 1. Fix relative image paths → absolute GitHub URLs
 * 2. Extract TOC from headings
 * 3. Parse markdown → HTML (with GFM support)
 * 4. Inject heading IDs for anchor navigation
 */
export async function processMarkdown(
  rawMarkdown: string,
  readmeLink: string
): Promise<ProcessedMarkdown> {
  // Step 1: Fix image paths (must happen before parsing)
  const fixedMarkdown = fixImagePaths(rawMarkdown, readmeLink);

  // Step 2: Extract TOC from raw markdown
  const toc = extractTOC(fixedMarkdown);

  // Step 3: Parse markdown to HTML
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(fixedMarkdown);

  let html = result.toString();

  // Step 4: Inject heading IDs for anchor links
  html = injectHeadingIds(html);

  return { html, toc };
}
