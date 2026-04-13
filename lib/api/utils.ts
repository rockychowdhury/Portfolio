/**
 * Generic fetch wrapper with a timeout.
 * Prevents requests from hanging indefinitely and causing API timeouts.
 */
export async function fetchWithTimeout(
  resource: string,
  options: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 8000 } = options; // Default 8s timeout

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: unknown) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout: ${resource} exceeded ${timeout}ms`);
    }
    throw error;
  }
}
