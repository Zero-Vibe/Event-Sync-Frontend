"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, CalendarRange } from "lucide-react";
import { EventCard } from "@/src/components/EventCard";
import { events } from "@/src/data/mock";

const cities = ["All cities", ...Array.from(new Set(events.map((e) => e.city)))];
const dateFilters = [
  { id: "all", label: "Any time" },
  { id: "live", label: "Live now" },
  { id: "30", label: "Next 30 days" },
  { id: "90", label: "Next 90 days" },
];

export default function EventsPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All cities");
  const [date, setDate] = useState("all");

  const filtered = useMemo(() => {
    const now = Date.now();
    return events.filter((e) => {
      if (q && !`${e.name} ${e.tagline} ${e.city}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (city !== "All cities" && e.city !== city) return false;
      if (date === "live" && !e.isLive) return false;
      if (date === "30" && new Date(e.startDate).getTime() - now > 30 * 86400000) return false;
      if (date === "90" && new Date(e.startDate).getTime() - now > 90 * 86400000) return false;
      return true;
    });
  }, [q, city, date]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Browse</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">All events</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Search across {events.length} curated events worldwide.
          </p>

          <div className="mt-10 grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 backdrop-blur md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events, cities, topics…"
                className="h-11 w-full rounded-lg bg-background/60 pl-9 pr-3 text-sm outline-none ring-1 ring-border/60 transition focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg bg-background/60 pl-9 pr-8 text-sm outline-none ring-1 ring-border/60 focus:ring-2 focus:ring-primary md:w-56"
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-background/60 p-1 ring-1 ring-border/60">
              <CalendarRange className="ml-2 h-4 w-4 text-muted-foreground" />
              {dateFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setDate(f.id)}
                    data-active={date === f.id}
                    className="h-9 rounded-md px-3 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    {f.label}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-muted-foreground">
          Showing <span className="text-foreground">{filtered.length}</span> of {events.length} events
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
            <p className="text-muted-foreground">No events match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>
    </div>
  );
}