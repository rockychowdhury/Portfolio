export function getLenis(): any {
  if (typeof window === "undefined") return null;
  return (window as any).__lenis || null;
}

interface ScrollToOptions {
  offset?: number;
  immediate?: boolean;
}

export function smoothScrollTo(
  target: string | number | HTMLElement,
  options: ScrollToOptions = {}
) {
  const lenis = getLenis();
  const behavior = options.immediate ? "auto" : "smooth";

  if (lenis) {
    lenis.scrollTo(target, {
      offset: options.offset ?? 0,
      duration: options.immediate ? 0 : 1.1,
    });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
    return;
  }

  const el =
    typeof target === "string"
      ? document.querySelector(target)
      : target;
  el?.scrollIntoView({ behavior, block: "start" });
}
