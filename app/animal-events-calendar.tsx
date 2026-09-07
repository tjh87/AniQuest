"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Download, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANIMAL_EVENTS, EVENT_CATEGORY_LABELS, EVENT_ORGANISERS, EVENTS_REVIEWED_ON, EVENT_TIME_ZONE, calendarCells, eventCalendarFile, eventsCalendarFile, eventsInMonth, eventState, singaporeDateKey, type AnimalEvent } from "./animal-events-data";

function monthLabel(key: string) { return new Intl.DateTimeFormat("en-SG", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${key}-01T00:00:00Z`)); }
function dayLabel(key: string) { return new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${key}T00:00:00Z`)); }
function timeLabel(iso: string) { return new Intl.DateTimeFormat("en-SG", { timeZone: EVENT_TIME_ZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso)); }

function downloadEvent(event: AnimalEvent) {
  downloadCalendar(eventCalendarFile(event), `AniQuest-${event.id}.ics`);
}
function downloadCalendar(contents: string, filename: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function AnimalEventsCalendar() {
  const [now, setNow] = useState(() => new Date());
  const [month, setMonth] = useState(() => singaporeDateKey().slice(0, 7));
  const [day, setDay] = useState<string | null>(null);
  const [organiser, setOrganiser] = useState("all");
  const [category, setCategory] = useState("all");
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 60_000); return () => window.clearInterval(timer); }, []);
  const today = singaporeDateKey(now);
  const events = useMemo(() => eventsInMonth(month, organiser, category), [month, organiser, category]);
  const monthEvents = useMemo(() => eventsInMonth(month), [month]);
  const shown = day ? events.filter((event) => event.start.startsWith(day)) : events;
  const cells = calendarCells(month);
  const stale = now.getTime() - new Date(`${EVENTS_REVIEWED_ON}T00:00:00+08:00`).getTime() > 30 * 86400000;

  const shiftMonth = (delta: number) => {
    const date = new Date(`${month}-01T00:00:00Z`);
    date.setUTCMonth(date.getUTCMonth() + delta);
    setMonth(date.toISOString().slice(0, 7)); setDay(null);
  };

  return <div className="aq-view aq-events-view">
    <div className="aq-page-title"><div><span className="aq-eyebrow">Singapore · walks, talks & animal welfare</span><h1>Meet the wildlife community</h1></div></div>
    <p className="aq-events-intro">Find dated activities from government agencies and animal organisations. Times are Singapore time (SGT, UTC+8). Confirm availability with the organiser before going.</p>
    <nav className="aq-event-source-strip" aria-label="Event source pages"><strong>Event sources</strong>{EVENT_ORGANISERS.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer">{item.name} <ExternalLink /></a>)}</nav>
    {stale && <div className="aq-scope-note" role="status"><ShieldCheck /><span>This collection is more than 30 days old. Check the linked organiser pages for cancellations, new dates and registration updates.</span></div>}
    <div className="aq-event-filters">
      <label><span>Organiser</span><select aria-label="Filter event organiser" value={organiser} onChange={(event) => { setOrganiser(event.target.value); setDay(null); }}><option value="all">All organisers</option>{EVENT_ORGANISERS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label><span>Activity</span><select aria-label="Filter event activity" value={category} onChange={(event) => { setCategory(event.target.value); setDay(null); }}><option value="all">All activities</option>{Object.entries(EVENT_CATEGORY_LABELS).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      {(organiser !== "all" || category !== "all" || day) && <Button variant="ghost" onClick={() => { setOrganiser("all"); setCategory("all"); setDay(null); }}>Clear filters</Button>}
      <span className="aq-event-count" role="status">{events.length} dated {events.length === 1 ? "session" : "sessions"} this month</span>
    </div>
    <div className="aq-events-layout">
      <section className="aq-panel aq-event-month" aria-labelledby="event-month-heading">
        <div className="aq-event-month-head"><h2 id="event-month-heading">{monthLabel(month)}</h2><div><Button variant="outline" size="icon-sm" aria-label="Previous event month" onClick={() => shiftMonth(-1)}><ChevronLeft /></Button><Button variant="outline" size="icon-sm" aria-label="Next event month" onClick={() => shiftMonth(1)}><ChevronRight /></Button></div></div>
        <div className="aq-event-month-actions"><Button variant="ghost" size="sm" onClick={() => { setMonth(today.slice(0,7)); setDay(null); }}>This month</Button><Button variant="ghost" size="sm" disabled={!day} onClick={() => setDay(null)}>All month’s events</Button><Button variant="outline" size="sm" disabled={!monthEvents.length} onClick={() => downloadCalendar(eventsCalendarFile(monthEvents), `AniQuest-${month}.ics`)}><Download /> Export month (.ics)</Button></div>
        <div className="aq-event-weekdays" aria-hidden="true">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((name) => <span key={name}>{name}</span>)}</div>
        <div className="aq-event-grid" role="group" aria-label={`Choose a date in ${monthLabel(month)}`}>
          {cells.map((key, index) => {
            if (!key) return <span className="aq-event-blank" key={`blank-${index}`} aria-hidden="true" />;
            const dayEvents = events.filter((event) => event.start.startsWith(key));
            const count = dayEvents.length;
            const colours = [...new Set(dayEvents.map((event) => event.category))];
            return <button key={key} type="button" className={`aq-event-day ${day === key ? "selected" : ""} ${count ? "has-events" : ""}`} onClick={() => setDay(key)} aria-pressed={day === key} aria-current={today === key ? "date" : undefined} aria-label={`${dayLabel(key)}, ${count} ${count === 1 ? "event" : "events"}${today === key ? ", today" : ""}`}><strong>{Number(key.slice(-2))}</strong>{count > 0 && <><small>{count} {count === 1 ? "event" : "events"}</small><span className="aq-event-day-colours" aria-hidden="true">{colours.map((colour) => <i key={colour} className={`event-${colour}`} />)}</span></>}</button>;
          })}
        </div>
        <p className="aq-event-calendar-note">Select a date for its activities. Dates without a number of events have no verified listing in this collection.</p>
        <details className="aq-event-sources"><summary>Organiser pages & undated programmes</summary><div>{EVENT_ORGANISERS.map((item) => <article key={item.id}><a href={item.url} target="_blank" rel="noreferrer">{item.name} <ExternalLink /></a><small>{item.kind}</small><p>{item.note}</p></article>)}<article><a href="https://avs.nparks.gov.sg/outreach/events/pets-day-out/" target="_blank" rel="noreferrer">Pets’ Day Out <ExternalLink /></a><p>Next date not announced on the page checked. No date has been added to the calendar.</p></article></div></details>
      </section>
      <section className="aq-event-agenda" aria-labelledby="event-agenda-heading">
        <div className="aq-section-head"><h2 id="event-agenda-heading">{day ? dayLabel(day) : `${monthLabel(month)} agenda`}</h2><span>{shown.length} {shown.length === 1 ? "session" : "sessions"}</span></div>
        {shown.length ? shown.map((event) => {
          const status = eventState(event, now);
          const host = EVENT_ORGANISERS.find((item) => item.id === event.organiser)!;
          const deadlinePassed = event.registrationDeadline && event.registrationDeadline < today;
          return <article key={event.id} className={`aq-panel aq-event-card event-${event.category}`}>
            <div className="aq-event-card-top"><span className="aq-event-type">{EVENT_CATEGORY_LABELS[event.category]}</span><span className={`aq-event-status ${status.toLowerCase()}`}>{status}</span></div>
            <h3>{event.title}</h3>
            <div className="aq-event-host"><strong>{host.name}</strong>{host.kind === "Government" && <span>Government-led</span>}</div>
            {event.partners && <p className="aq-event-partners">{event.partners}</p>}
            <div className="aq-event-meta"><span><CalendarDays aria-hidden="true" />{dayLabel(event.start.slice(0,10))}</span><span><Clock3 aria-hidden="true" />{timeLabel(event.start)}{event.end ? `–${timeLabel(event.end)}` : " · end not listed"} SGT</span><span><MapPin aria-hidden="true" />{event.location}</span></div>
            <p>{event.summary}</p>
            {event.registrationDeadline && <small className="aq-event-deadline">{deadlinePassed ? "Listed registration deadline passed" : "Listed registration deadline"}: {dayLabel(event.registrationDeadline)}. Places may fill earlier.</small>}
            <a className="aq-event-source-link" href={event.sourceUrl} target="_blank" rel="noreferrer">Source: {host.name} event page <ExternalLink /></a>
            <div className="aq-event-actions"><Button asChild variant="outline" size="sm"><a href={event.sourceUrl} target="_blank" rel="noreferrer">Open event source <ExternalLink /></a></Button><Button variant="ghost" size="sm" onClick={() => downloadEvent(event)} aria-label={`Download calendar file for ${event.title}`}><Download /> Calendar file</Button></div>
          </article>;
        }) : <div className="aq-panel aq-event-empty"><CalendarDays aria-hidden="true" /><h3>No verified events in this view</h3><p>{organiser === "acres" ? "ACRES has no dated public event in this collection. Open its organiser page for visits and programmes." : "Try another month or clear the filters. An empty calendar does not mean that no events exist."}</p><Button variant="outline" onClick={() => { setMonth(ANIMAL_EVENTS.find((event) => eventState(event,now) !== "Past")?.start.slice(0,7) ?? EVENTS_REVIEWED_ON.slice(0,7)); setOrganiser("all"); setCategory("all"); setDay(null); }}>Show dated collection</Button></div>}
      </section>
    </div>
  </div>;
}
