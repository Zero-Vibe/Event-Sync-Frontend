export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold">EventSync</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Real-time event platform for organizers and attendees.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              About
            </a>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} EventSync, Inc.
        </p>
      </div>
    </footer>
  );
}
