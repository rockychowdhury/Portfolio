/**
 * Converts relative image paths in markdown to absolute GitHub raw URLs.
 *
 * Handles patterns like:
 *   ![alt](./images/screenshot.png)
 *   ![alt](images/screenshot.png)
 *   ![alt](docs/image.png)
 *
 * Extracts the base URL from the readmeLink to construct absolute URLs.
 */
export function fixImagePaths(markdown: string, readmeLink: string): string {
  // Extract base URL from readmeLink
  // e.g. https://raw.githubusercontent.com/user/repo/main/README.md
  //   → https://raw.githubusercontent.com/user/repo/main/
  const lastSlash = readmeLink.lastIndexOf("/");
  const baseUrl = readmeLink.substring(0, lastSlash + 1);

  // Fix markdown image paths: ![alt](relative/path)
  // Match relative paths (not starting with http://, https://, or //)
  let result = markdown.replace(
    /!\[([^\]]*)\]\((?!https?:\/\/|\/\/)\.?\/?([^)]+)\)/g,
    (match, alt, path) => {
      // Don't modify if it's already an absolute URL
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return match;
      }
      return `![${alt}](${baseUrl}${path})`;
    }
  );

  // Fix HTML img src attributes
  result = result.replace(
    /src=["'](?!https?:\/\/|\/\/)\.?\/?([^"']+)["']/g,
    (match, path) => {
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return match;
      }
      return `src="${baseUrl}${path}"`;
    }
  );

  return result;
}
