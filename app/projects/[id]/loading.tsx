export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero video skeleton */}
      <div className="w-full flex justify-center pt-8 pb-6">
        <div className="w-full max-w-[900px] mx-4 aspect-video rounded-2xl bg-muted" />
      </div>

      {/* CTA buttons skeleton */}
      <div className="flex justify-center gap-4 pb-10">
        <div className="h-11 w-32 rounded-full bg-muted" />
        <div className="h-11 w-36 rounded-full bg-muted" />
        <div className="h-11 w-40 rounded-full bg-muted" />
      </div>

      {/* Content skeleton */}
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 pb-20">
          {/* Sidebar TOC skeleton */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-3 w-40 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
              <div className="h-3 w-36 rounded bg-muted" />
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          </div>

          {/* README content skeleton */}
          <div className="space-y-6">
            {/* Title */}
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/5 rounded bg-muted" />

            {/* Paragraph */}
            <div className="h-4 w-full rounded bg-muted mt-8" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />

            {/* Code block */}
            <div className="h-32 w-full rounded-lg bg-muted mt-6" />

            {/* More paragraphs */}
            <div className="h-4 w-full rounded bg-muted mt-6" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />

            {/* Image placeholder */}
            <div className="h-48 w-full rounded-lg bg-muted mt-6" />

            <div className="h-4 w-full rounded bg-muted mt-6" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
