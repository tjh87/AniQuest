import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({ appType: "custom", configFile: false, root, resolve: { alias: { "@": root } }, server: { middlewareMode: true, hmr: false } });
after(() => vite.close());

test("event calendar handles month boundaries, leap years and Singapore day changes", async () => {
  const { calendarCells, singaporeDateKey } = await vite.ssrLoadModule("/app/animal-events-data.ts");
  for (const [month, count] of [["2026-09",30],["2026-10",31],["2028-02",29],["2027-02",28]]) {
    const cells = calendarCells(month);
    assert.equal(cells.filter(Boolean).length,count);
    assert.equal(cells.length % 7,0);
    assert.equal(new Set(cells.filter(Boolean)).size,count);
  }
  assert.equal(singaporeDateKey(new Date("2026-09-05T15:59:59Z")),"2026-09-05");
  assert.equal(singaporeDateKey(new Date("2026-09-05T16:00:00Z")),"2026-09-06");
});

test("dated events have approved organiser links, valid times, unique IDs and working filters", async () => {
  const { ANIMAL_EVENTS, EVENT_ORGANISERS, eventsInMonth, eventState } = await vite.ssrLoadModule("/app/animal-events-data.ts");
  const { isApprovedCheckUrl } = await vite.ssrLoadModule("/app/source-url-policy.ts");
  assert.equal(new Set(ANIMAL_EVENTS.map(e=>e.id)).size, ANIMAL_EVENTS.length);
  for (const e of ANIMAL_EVENTS) {
    assert.match(e.start, /\+08:00$/);
    assert.ok(isApprovedCheckUrl(e.sourceUrl));
    assert.ok(EVENT_ORGANISERS.some(o=>o.id===e.organiser));
    if (e.end) assert.ok(new Date(e.end)>new Date(e.start));
    assert.equal(eventState(e,new Date("2027-01-01T00:00:00Z")),"Past");
  }
  assert.equal(eventsInMonth("2026-10","avs").length,2);
  assert.equal(eventsInMonth("2026-09","acres").length,0);
  assert.ok(eventsInMonth("2026-09","nss","walk").every(e=>e.organiser==="nss"&&e.category==="walk"));
  const oct = eventsInMonth("2026-10","avs")[0];
  assert.equal(eventState(oct,new Date("2026-10-03T08:00:00Z")),"Today");
  assert.equal(eventState(oct,new Date("2026-10-03T10:00:00Z")),"Past");
});

test("calendar exports use UTC, exact session times, escaped text and 75-octet lines", async () => {
  const { ANIMAL_EVENTS, eventCalendarFile, eventsCalendarFile } = await vite.ssrLoadModule("/app/animal-events-data.ts");
  const event = {...ANIMAL_EVENTS[1],title:"Birds, butterflies; 🦋 ".repeat(12)};
  const ics = eventCalendarFile(event,new Date("2026-09-05T00:00:00Z"));
  assert.match(ics,/DTSTART:20260909T003000Z/);
  assert.match(ics,/DTEND:20260909T023000Z/);
  assert.match(ics,/\\,/);
  assert.match(ics,/\\;/);
  assert.doesNotMatch(ics,/RRULE/);
  for (const line of ics.split("\r\n")) assert.ok(Buffer.byteLength(line,"utf8")<=75);
  const month = eventsCalendarFile(ANIMAL_EVENTS.filter((item) => item.start.startsWith("2026-09")), new Date("2026-09-05T00:00:00Z"));
  assert.equal((month.match(/BEGIN:VEVENT/g) || []).length, 7);
  assert.match(month, /SUMMARY:Nature Walk at HortPark/);
  assert.match(month, /SUMMARY:Butterfly Walk at Dairy Farm/);
  for (const line of month.split("\r\n")) assert.ok(Buffer.byteLength(line,"utf8")<=75);
});

test("local progress survives a reload and storage failures remain explicit", async () => {
  const {readLocalProgress,writeLocalProgress,LOCAL_PROGRESS_KEY} = await vite.ssrLoadModule("/app/local-progress.ts");
  const {QUIZ_QUESTIONS} = await vite.ssrLoadModule("/app/quiz-data.ts");
  const map = new Map();
  const storage = {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
  const p = {xp:120,level:1,streakDays:0,completedLessons:["rainforest-01"],answeredQuizzes:[QUIZ_QUESTIONS[0].id,QUIZ_QUESTIONS[0].id],quizBest:100,lastView:"learn"};
  assert.equal(writeLocalProgress(storage,p),null);
  assert.equal(readLocalProgress(storage).progress.xp,120);
  assert.equal(readLocalProgress(storage).progress.answeredQuizzes.length,1);
  map.set(LOCAL_PROGRESS_KEY,"broken json");
  assert.ok(readLocalProgress(storage).error);
  assert.equal(map.get(LOCAL_PROGRESS_KEY),"broken json");
  assert.ok(writeLocalProgress({getItem:()=>null,setItem:()=>{throw Error("quota");}},p));
});
