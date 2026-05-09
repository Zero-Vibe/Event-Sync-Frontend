import { Sparkles, GitBranch, XIcon, Link2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">EventSync</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The real-time event platform for organizers, speakers, and attendees who care about the experience.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Schedules</a></li>
              <li><a href="#" className="hover:text-foreground">Live Q&amp;A</a></li>
              <li><a href="#" className="hover:text-foreground">Networking</a></li>
              <li><a href="#" className="hover:text-foreground">Analytics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Customers</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
              <li><a href="#" className="hover:text-foreground">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} EventSync, Inc. All rights reserved.</p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="hover:text-foreground"><XIcon className="h-4 w-4" /></a>
            <a href="#" aria-label="GitHub" className="hover:text-foreground"><GitBranch className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground"><Link2 className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}