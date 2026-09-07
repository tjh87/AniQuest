"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bird, BookOpen, Bot, CalendarDays, CloudRain, Compass, ExternalLink, Feather, FlaskConical,
  Home, Library, LogIn, LogOut, Map, Megaphone, Moon, Newspaper, PawPrint, Pencil,
  Search, ShieldCheck, Sparkles, Sun, Trophy, Volume2, Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SiteSettingsValues } from "./default-settings";
import { QUIZ_QUESTIONS, type QuizDifficulty, type QuizQuestion } from "./quiz-data";
import { SINGAPORE_SPECIES, getSpeciesStatusCounts } from "./species-data";
import { WildlifePhoto } from "./wildlife-photos";
import { randomFactIndex } from "./daily-fact";
import { SINGAPORE_NEWS_STORIES, WORLD_NEWS_STORIES } from "./news-data";
import {
  CALENDAR_MONTHS, CLIMATE_SOURCE, SEASONAL_CATEGORY_LABELS, SEASONAL_EVENTS,
  climateForMonth, eventsForMonth, getSingaporeMonth,
  type CalendarMonth, type SeasonalCategory,
} from "./seasonal-data";
import type { ViewId } from "./view-data";
import { AnimalEventsCalendar } from "./animal-events-calendar";
import { AniQuestLogo } from "./aniquest-logo";
import { AnimalAtlas, SpeciesLibrary } from "./animal-atlas";
import { readLocalProgress, writeLocalProgress } from "./local-progress";
import { appendRecord, gradeAnswer, type AttemptContext, type ActionRecord, type LearningRecord, type AnswerFeedback } from "./learning-records";
import { QuizArena } from "./quiz-arena";
import { SpeciesJourney } from "./species-journey";
import { LearningSummary } from "./learning-summary";
import { FieldResources } from "./field-resources";
import { BirdDirectory, ChickenGuide } from "./bird-directory";

type User = { displayName: string; email: string } | null;
type ProgressState = {
  xp: number;
  level: number;
  streakDays: number;
  completedLessons: string[];
  answeredQuizzes: string[];
  quizBest: number;
  lastView: string;
  learningRecords?: LearningRecord[];
};

const EMPTY_PROGRESS: ProgressState = {
  xp: 0,
  level: 1,
  streakDays: 0,
  completedLessons: [],
  answeredQuizzes: [],
  quizBest: 0,
  lastView: "home",
};

const navItems = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "journey" as const, label: "Guided journeys", icon: Compass },
  { id: "learn" as const, label: "Learn", icon: BookOpen },
  { id: "atlas" as const, label: "Animal Atlas", icon: PawPrint },
  { id: "quiz" as const, label: "Quiz Arena", icon: Trophy },
  { id: "field" as const, label: "Field Lab", icon: FlaskConical },
  { id: "news" as const, label: "News Nest", icon: Newspaper },
  { id: "singapore" as const, label: "Singapore Wild", icon: Feather },
  { id: "calendar" as const, label: "Wildlife Calendar", icon: CalendarDays },
  { id: "collection" as const, label: "Collection", icon: Library },
];

const densityNames = ["Compact", "Standard", "Comfortable"];

export function AniQuestApp({
  user,
  signInPath,
  signOutPath,
  settings,
  isAdmin,
  localMode = false,
}: {
  user: User;
  signInPath: string;
  signOutPath: string;
  settings: SiteSettingsValues;
  isAdmin: boolean;
  localMode?: boolean;
}) {
  const [view, setView] = useState<ViewId>("home");
  const [animalSearch, setAnimalSearch] = useState("");
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [selectedAnimalId, setSelectedAnimalId] = useState("sunda-colugo");
  const [journeyId, setJourneyId] = useState("smooth-coated-otter");
  const [dark, setDark] = useState(settings.defaultTheme === "dark");
  const [density, setDensity] = useState(settings.defaultDensity);
  const [uiStyle, setUiStyle] = useState<"classic" | "retro">("classic");
  const [pixelPalette, setPixelPalette] = useState<"arcade" | "forest" | "sunset">("arcade");
  const [localReady, setLocalReady] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [saveMessage, setSaveMessage] = useState(localMode ? "Loading this device’s progress…" : user ? "Loading saved progress…" : "Sign in to save progress");
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    setFactIndex(randomFactIndex(settings.dailyFacts.length));
  }, [settings.dailyFacts.length]);

  useEffect(() => {
    const stored = (key: string) => { try { return window.localStorage.getItem(key); } catch { return null; } };
    const storedTheme = stored("aniquest-theme");
    const defaultDark = settings.defaultTheme === "dark";
    const shouldUseDark = storedTheme === "light" || storedTheme === "dark" ? storedTheme === "dark" : defaultDark;
    const storedDensityValue = stored("aniquest-density");
    const storedDensity = storedDensityValue === null ? settings.defaultDensity : Number(storedDensityValue);
    const frame = window.requestAnimationFrame(() => {
      setDark(shouldUseDark);
      setUiStyle(stored("aniquest-ui-style") === "retro" ? "retro" : "classic");
      setPixelPalette(stored("aniquest-pixel-palette") === "forest" ? "forest" : stored("aniquest-pixel-palette") === "sunset" ? "sunset" : "arcade");
      setDensity(Number.isFinite(storedDensity) ? Math.max(0, Math.min(2, storedDensity)) as 0 | 1 | 2 : settings.defaultDensity);
      setPreferencesReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [settings.defaultDensity, settings.defaultTheme]);

  useEffect(() => {
    if (!preferencesReady) return;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.density = String(density);
    document.documentElement.dataset.uiStyle = uiStyle;
    document.documentElement.dataset.pixelPalette = pixelPalette;
    try {
      window.localStorage.setItem("aniquest-theme", dark ? "dark" : "light");
      window.localStorage.setItem("aniquest-density", String(density));
      window.localStorage.setItem("aniquest-ui-style", uiStyle);
      window.localStorage.setItem("aniquest-pixel-palette", pixelPalette);
    } catch { /* Theme controls still work when preference storage is blocked. */ }
  }, [dark, density, uiStyle, pixelPalette, preferencesReady]);

  useEffect(() => {
    if (!localMode) return;
    try {
      const result = readLocalProgress(window.localStorage);
      if (result.progress) {
        setProgress(result.progress);
        const lastLesson = result.progress.learningRecords?.findLast(r => r.kind === "attempt" && r.phase !== "practice");
        if (lastLesson?.kind === "attempt" && lastLesson.speciesIds[0]) setJourneyId(lastLesson.speciesIds[0]);
        if (navItems.some((item) => item.id === result.progress?.lastView)) setView(result.progress.lastView as ViewId);
      }
      setSaveMessage(result.error ?? "Progress saved on this device");
      setLocalReady(!result.error);
    } catch { setSaveMessage("Progress is not saved: browser storage is blocked."); }
  }, [localMode]);

  useEffect(() => {
    if (!localMode || !localReady) return;
    try {
      const error = writeLocalProgress(window.localStorage, progress);
      setSaveMessage(error ?? "Progress saved on this device");
    } catch { setSaveMessage("Progress is not saved: browser storage is blocked."); }
  }, [progress, localMode, localReady]);

  const availableNavItems = useMemo(() => settings.newsEnabled ? navItems : navItems.filter((item) => item.id !== "news"), [settings.newsEnabled]);
  const mobileNavItems = useMemo(() => availableNavItems.filter((item) => ["home", "learn", "quiz", "calendar", settings.newsEnabled ? "news" : "singapore"].includes(item.id)), [availableNavItems, settings.newsEnabled]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/progress", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        return response.json();
      })
      .then(({ progress: saved }) => {
        setProgress(saved);
        const lastLesson = (saved.learningRecords as LearningRecord[] | undefined)?.findLast(r => r.kind === "attempt" && r.phase !== "practice");
        if (lastLesson?.kind === "attempt" && lastLesson.speciesIds[0]) setJourneyId(lastLesson.speciesIds[0]);
        if (availableNavItems.some((item) => item.id === saved.lastView)) setView(saved.lastView as ViewId);
        setSaveMessage("Progress saved to your account");
      })
      .catch(() => setSaveMessage("Progress will save when storage is available"));
  }, [user, availableNavItems]);

  useEffect(() => {
    if (localMode) return;
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ view }),
      keepalive: true,
    }).catch(() => undefined);
  }, [view, localMode]);

  const postProgress = async (payload: Record<string, unknown>) => {
    if (!user) {
      if (!localMode) setSaveMessage("Sign in to save this progress");
      return null;
    }
    setSaveMessage("Saving…");
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (result.progress) setProgress(result.progress);
      setSaveMessage("Progress saved to your account");
      return result;
    } catch {
      setSaveMessage("Progress could not be saved. Try again.");
      return null;
    }
  };

  const changeView = (next: ViewId) => {
    const allowedView = availableNavItems.some((item) => item.id === next) ? next : "home";
    if (allowedView === "home") setFactIndex((current) => randomFactIndex(settings.dailyFacts.length, current));
    setView(allowedView);
    if (localMode) setProgress((current) => ({ ...current, lastView: allowedView }));
    window.scrollTo({ top: 0, behavior: "smooth" });
    void postProgress({ action: "set_last_view", view: allowedView });
  };

  const openJourney = (id: string) => { setJourneyId(id); changeView("journey"); };

  const completeLesson = async () => {
    const result = await postProgress({ action: "complete_lesson", lessonId: "rainforest-01" });
    if (!user && !result) {
      setProgress((current) => {
        if (current.completedLessons.includes("rainforest-01")) return current;
        const xp = current.xp + settings.lessonRewardXp;
        return { ...current, xp, level: Math.floor(xp / 250) + 1, completedLessons: [...current.completedLessons, "rainforest-01"] };
      });
    }
  };

  const saveLearningProgress = (next: ProgressState) => {
    if (localMode) {
      if (!localReady) return false;
      try {
        const error = writeLocalProgress(window.localStorage, next);
        if (error) { setSaveMessage(error); return false; }
      } catch { setSaveMessage("Progress is not saved: browser storage is blocked."); return false; }
    }
    setProgress(next);
    return true;
  };

  const answerQuiz = async (question: QuizQuestion, answer: string, context: AttemptContext): Promise<AnswerFeedback | null> => {
    if (user) {
      const result = await postProgress({ action: "answer_quiz", quizId: question.id, questionVersion: question.version, answer, hintUsed: context.hintUsed, phase: context.phase ?? "practice", sessionId: context.sessionId ?? "", submissionId: context.submissionId });
      return result?.feedback ?? null;
    }
    const feedback = gradeAnswer(question, answer, context, context.submissionId ?? crypto.randomUUID());
    const reward = feedback.correct && feedback.attempt.phase === "practice" && !progress.answeredQuizzes.includes(question.id);
    const xp = progress.xp + (reward ? settings.quizRewardXp : 0);
    return saveLearningProgress({ ...progress, xp, level: Math.floor(xp / 250) + 1,
      answeredQuizzes: reward ? [...progress.answeredQuizzes, question.id] : progress.answeredQuizzes,
      learningRecords: appendRecord(progress.learningRecords ?? [], feedback.attempt) }) ? feedback : null;
  };

  const recordAction = async (actionId: ActionRecord["actionId"], sessionId: string) => {
    if (user) return !!await postProgress({ action: "record_action", actionId, sessionId });
    const record: ActionRecord = { kind: "action", id: `${sessionId}-${actionId}`, actionId,
      status: actionId === "guidance" ? "guidance-opened" : "self-reported", sessionId, recordedAt: new Date().toISOString() };
    return saveLearningProgress({ ...progress, learningRecords: appendRecord(progress.learningRecords ?? [], record) });
  };

  const initials = useMemo(() => user?.displayName.split(/\s|@/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AQ", [user]);

  return (
    <SidebarProvider open={true} onOpenChange={() => {}} style={{ "--sidebar-width": "13rem" } as React.CSSProperties}>
      <Sidebar collapsible="icon" className="aq-sidebar">
        <SidebarHeader className="aq-brand-wrap">
          <button className="aq-brand" onClick={() => changeView("home")} aria-label="AniQuest home">
            <AniQuestLogo />
          </button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {availableNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton tooltip={item.label} aria-label={item.label} isActive={view === item.id} onClick={() => changeView(item.id)}>
                      <item.icon /><span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="aq-rank-mini">
            <span className="aq-rank-icon">🧭</span>
            <div><strong>Trail Scout</strong><small>Level {progress.level}</small></div>
          </div>
          <Progress value={(progress.xp % 250) / 2.5} aria-label="Level progress" />
          <small className="aq-muted">{progress.xp % 250} / 250 XP</small>
          {localMode && <small className="aq-muted aq-device-note" role="status">{saveMessage}. No cloud sync.</small>}
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="aq-topbar">
          <div className="aq-topbar-left">
            <SidebarTrigger className="aq-mobile-menu-trigger" />
            <div className="aq-mobile-brand"><AniQuestLogo /> AniQuest</div>
            <form className="aq-search" role="search" onSubmit={(event) => { event.preventDefault(); setSpeciesQuery(animalSearch.trim()); changeView("singapore"); }}><Search aria-hidden="true" /><label className="sr-only" htmlFor="animal-search">Find a Singapore animal</label><input id="animal-search" value={animalSearch} onChange={(event) => setAnimalSearch(event.target.value)} placeholder="Find a Singapore animal…" /><button type="submit" aria-label="Search animals">Search</button></form>
          </div>
          <div className="aq-controls">
            <Button variant="ghost" size="icon-sm" onClick={() => setDark((value) => !value)} aria-label={dark ? "Use light theme" : "Use dark theme"}>
              {dark ? <Sun /> : <Moon />}
            </Button>
            <div className="aq-style-control">
              <span className="aq-control-label">UI mode</span>
              <div className="aq-style-options" role="group" aria-label="UI mode">
                <button type="button" aria-pressed={uiStyle === "classic"} onClick={() => setUiStyle("classic")}><span className="aq-style-swatch classic" aria-hidden="true" />Classic</button>
                <button type="button" aria-pressed={uiStyle === "retro"} onClick={() => setUiStyle("retro")}><span className="aq-style-swatch retro" aria-hidden="true" />Pixelated</button>
              </div>
            </div>
            {uiStyle === "retro" && <label className="aq-pixel-palette"><span>Pixel palette</span><select value={pixelPalette} onChange={(event) => setPixelPalette(event.target.value as "arcade" | "forest" | "sunset")} aria-label="Pixel palette"><option value="arcade">Arcade blue</option><option value="forest">Forest green</option><option value="sunset">Sunset amber</option></select></label>}
            <div className="aq-density" title="Change text and card spacing">
              <label className="sr-only" htmlFor="interface-density">Interface density</label>
              <select id="interface-density" value={density} onChange={(event) => setDensity(Number(event.target.value) as 0 | 1 | 2)}>{densityNames.map((name, index) => <option key={name} value={index}>{name}</option>)}</select>
            </div>
            {!localMode && (user ? (
              <div className="aq-account">
                <span className="aq-avatar">{initials}</span>
                <span className="aq-account-copy"><strong>{user.displayName}</strong><small>{saveMessage}</small></span>
                <Button asChild variant="ghost" size="icon-sm"><a href={signOutPath} target="_top" aria-label="Sign out"><LogOut /></a></Button>
              </div>
            ) : (
              <Button asChild size="sm"><a href={signInPath} target="_top"><LogIn /> Sign in to save</a></Button>
            ))}
          </div>
        </header>

        {settings.announcementEnabled && settings.announcementText && <div className="aq-global-announcement" role="status"><Megaphone /><span>{settings.announcementText}</span></div>}

        <div className="aq-content">
          {localMode && /not saved|could not|blocked/i.test(saveMessage) && <p role="alert" className="aq-hint-copy">{saveMessage}</p>}
          {!localMode && !user && <p className="aq-muted">Guest answers stay in this session only. Sign in to save your learning records.</p>}
          {view === "home" && <HomeView progress={progress} onJourney={openJourney} onNavigate={changeView} settings={settings} isAdmin={isAdmin} factIndex={factIndex} />}
          {view === "learn" && <LearnView progress={progress} onJourney={openJourney} onComplete={completeLesson} user={user} signInPath={signInPath} saveMessage={saveMessage} rewardXp={settings.lessonRewardXp} localMode={localMode} />}
          {view === "atlas" && <AnimalAtlas onJourney={openJourney} selectedId={selectedAnimalId} onSelect={setSelectedAnimalId} onBrowse={() => { setSpeciesQuery(""); setAnimalSearch(""); changeView("singapore"); }} />}
          {view === "quiz" && <QuizArena onAnswer={answerQuiz} records={progress.learningRecords ?? []} level={progress.level} xp={progress.xp} answeredQuizzes={progress.answeredQuizzes} hintsEnabled={settings.quizHintsEnabled} rewardXp={settings.quizRewardXp} />}
          {view === "journey" && <SpeciesJourney key={journeyId} speciesId={journeyId} onChoose={openJourney} records={progress.learningRecords ?? []} onAnswer={answerQuiz} onAction={recordAction} onProfile={() => { setSelectedAnimalId(journeyId); changeView("atlas"); }} />}
          {view === "field" && <FieldView onOpen={(id) => { setSelectedAnimalId(id); changeView("atlas"); }} />}
          {view === "news" && settings.newsEnabled && <NewsView reviewDays={settings.contentReviewDays} feeds={settings.newsFeeds} />}
          {view === "singapore" && <SingaporeView query={speciesQuery} onOpen={(id) => { setSelectedAnimalId(id); changeView("atlas"); }} onClear={() => { setSpeciesQuery(""); setAnimalSearch(""); }} />}
          {view === "calendar" && <Tabs defaultValue="events" className="aq-calendar-tabs"><TabsList aria-label="Calendar type"><TabsTrigger value="events">Animal events</TabsTrigger><TabsTrigger value="seasons">Seasonal wildlife</TabsTrigger></TabsList><TabsContent value="events"><AnimalEventsCalendar /></TabsContent><TabsContent value="seasons"><SeasonalCalendarView /></TabsContent></Tabs>}
          {view === "collection" && <CollectionView progress={progress} onNavigate={changeView} />}
          <SiteMapNav onNavigate={changeView} newsEnabled={settings.newsEnabled} />
        </div>

        <nav className="aq-mobile-nav" aria-label="Main navigation">
          {mobileNavItems.map((item) => (
            <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => changeView(item.id)}>
              <item.icon /><span>{item.id === "quiz" ? "Quiz" : item.id === "news" ? "News" : item.id === "calendar" ? "Calendar" : item.label}</span>
            </button>
          ))}
        </nav>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Panel({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`aq-panel ${className}`}>{children}</section>;
}

function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <div className="aq-section-head"><h2>{title}</h2>{action && (onAction ? <button onClick={onAction}>{action}</button> : <span>{action}</span>)}</div>;
}

function SiteMapNav({ onNavigate, newsEnabled }: { onNavigate: (view: ViewId) => void; newsEnabled: boolean }) {
  const [expanded, setExpanded] = useState(true);
  const groups = [
    { title: "🚀 Start Here", ids: ["home", "journey", "learn", "quiz", "collection"] as ViewId[] },
    { title: "🧭 Explore", ids: ["atlas", "singapore", "field"] as ViewId[] },
    { title: "🗓️ Updates", ids: (newsEnabled ? ["news", "calendar"] : ["calendar"]) as ViewId[] },
  ];
  return <nav className="aq-site-map aq-panel" aria-label="AniQuest site map">
    <button type="button" className="aq-site-map-head" aria-expanded={expanded} aria-controls="site-map-pages" onClick={() => setExpanded(!expanded)}><Map aria-hidden="true" /><div><strong>Site map</strong><span>{expanded ? "Hide page directory" : "Show all AniQuest pages"}</span></div></button>
    <div id="site-map-pages" className="aq-site-map-groups" hidden={!expanded}>{groups.map((group) => <section key={group.title}><h2>{group.title}</h2>{group.ids.map((id) => { const item = navItems.find((entry) => entry.id === id)!; return <button type="button" key={id} onClick={() => onNavigate(id)}><item.icon aria-hidden="true" />{item.label}</button>; })}</section>)}</div>
  </nav>;
}

function HomeView({ progress, onNavigate, onJourney, settings, isAdmin, factIndex }: { onJourney: (id: string) => void; progress: ProgressState; onNavigate: (view: ViewId) => void; settings: SiteSettingsValues; isAdmin: boolean; factIndex: number }) {
  const lessonDone = progress.completedLessons.includes("rainforest-01");
  const quizCorrect = progress.answeredQuizzes.length;
  const quizProgress = Math.round((quizCorrect / QUIZ_QUESTIONS.length) * 100);
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setClock(new Date()), 60_000); return () => window.clearInterval(timer); }, []);
  const dailyFact = settings.dailyFacts[factIndex] ?? { text: "Singapore's green spaces support wildlife in forests, wetlands, parks and along the coast.", sourceName: "NParks BiodiversitySG", sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/" };
  const currentMonth = getSingaporeMonth(clock);
  const currentMonthEvent = eventsForMonth(currentMonth).find((event) => event.months.length < 12) ?? eventsForMonth(currentMonth)[0];
  const activeFeedIds = new Set(settings.newsFeeds.map((feed) => feed.id));
  const homeNews = SINGAPORE_NEWS_STORIES.filter((story) => activeFeedIds.has(story.feedId)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const groupSummary = (["Bird", "Mammal", "Reptile", "Amphibian"] as const).map((group) => ({
    group,
    emoji: { Bird: "🐦", Mammal: "🐾", Reptile: "🦎", Amphibian: "🐸" }[group],
    count: SINGAPORE_SPECIES.filter((species) => species.group === group).length,
  }));
  return (
    <div className="aq-view">
      <div className="aq-page-title aq-home-page-title"><div className="aq-home-heading-copy"><span className="aq-eyebrow">🧭 Your Singapore field guide</span><div className="aq-home-heading-row"><h1>🦜 Discover Singapore’s Wild Side</h1><section className="aq-group-summary" aria-label="Profile count by animal group">{groupSummary.map(({ group, emoji, count }) => <span key={group}><b aria-hidden="true">{emoji}</b> <strong>{count}</strong> {group}{count === 1 ? "" : "s"}</span>)}</section><span className="aq-source-chip"><PawPrint /> {SINGAPORE_SPECIES.length} species</span></div><p>🌿 Learn a little. Look a little closer. Follow the evidence.</p></div></div>
      <div className="aq-home-columns">
      <div className="aq-home-main">
        <section className="aq-panel aq-journey-entry"><span className="aq-eyebrow">🦦 Start with a real encounter</span><h2>Saw an Otter Near a Canal?</h2><p>🔎 Compare traits, learn its conservation context, and check what changed in three short steps.</p><Button onClick={() => onJourney("smooth-coated-otter")}>Start the otter journey <Compass /></Button></section>
        <Panel className="aq-hero">
          <div className="aq-hero-copy"><span className="aq-kicker">🌳 START EXPLORING · LESSON 01</span><h2>Life Between<br />Forest Layers</h2><p>🪂 Meet the Sunda colugo. Discover how gliding, gripping and camouflage help animals live among the trees.</p><div className="aq-hero-meta"><span>Rainforest</span><span>About 8 minutes</span></div><Button onClick={() => onNavigate("learn")}>{lessonDone ? "Review lesson" : "Start learning"} <BookOpen /></Button><div className="aq-inline-progress"><Progress value={lessonDone ? 100 : 0} aria-label="Rainforest lesson completion" /><span>{lessonDone ? "Complete" : "Ready to begin"}</span></div></div>
          <WildlifePhoto animal="colugo" priority />
        </Panel>
        <div className="aq-home-highlights">
        <div className="aq-home-left-stack"><Panel className="aq-spotlight">
          <SectionHead title="Species spotlight" action="Explore" onAction={() => onNavigate("singapore")} />
          <WildlifePhoto animal="hornbill" />
          <div><span className="aq-kicker">PARKS & WOODED AREAS</span><h3>Oriental pied hornbill</h3><p>Look for a pale bill with a casque and striking black-and-white plumage.</p><div className="aq-inline-tags"><span className="aq-status-near-threatened">SG: Near Threatened · RDB3</span></div><a className="aq-guidance-link" href="https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/other-birds/oriental-pied-hornbill/" target="_blank" rel="noreferrer">Read the NParks profile <ExternalLink /></a></div>
        </Panel><Panel className="aq-biome-strip"><SectionHead title="Four Ways to Explore Singapore" action="Habitat guides" onAction={() => onNavigate("singapore")} /><div className="aq-biome-cards"><button data-featured={settings.featuredBiome === "rainforest"} onClick={() => onNavigate("learn")}><span aria-hidden="true">🌿</span><div><strong>Rainforest</strong><small>Forest layers, colugos and adaptations</small></div><b>{settings.featuredBiome === "rainforest" && "Featured · "}Start the lesson</b></button><button data-featured={settings.featuredBiome === "mangrove"} onClick={() => onNavigate("singapore")}><span aria-hidden="true">🌱</span><div><strong>Mangrove & mudflat</strong><small>Tidal habitats and wildlife corridors</small></div><b>{settings.featuredBiome === "mangrove" && "Featured · "}Browse the guide</b></button><button data-featured={settings.featuredBiome === "freshwater"} onClick={() => onNavigate("singapore")}><span aria-hidden="true">🦦</span><div><strong>Freshwater & parks</strong><small>Otters and shared urban spaces</small></div><b>{settings.featuredBiome === "freshwater" && "Featured · "}Browse the guide</b></button><button data-featured={settings.featuredBiome === "coast"} onClick={() => onNavigate("singapore")}><span aria-hidden="true">🐢</span><div><strong>Coast & reef</strong><small>Turtles and marine habitats</small></div><b>{settings.featuredBiome === "coast" && "Featured · "}Browse the guide</b></button></div></Panel></div>
        <div className="aq-home-right-stack">{settings.newsEnabled && <Panel className="aq-news-preview"><SectionHead title="From the News Nest" action="All news" onAction={() => onNavigate("news")} /><span className="aq-demo-label">CURATED · SINGAPORE</span>{homeNews.length ? homeNews.map((item) => <a className="aq-news-row" key={item.href} href={item.href} target="_blank" rel="noreferrer"><span aria-hidden="true">{item.emoji}</span><div><small>{item.source} · {item.date}</small><strong>{item.title}</strong></div><ExternalLink /></a>) : <p className="aq-muted">No curated stories from enabled Singapore sources.</p>}<p className="aq-reward-note">Short summaries with direct links to the original reporting. Not a live news feed.</p></Panel>}<ProgressVisuals progress={progress} /></div>
        </div>
      </div>
      <div className="aq-home-side">
        <Panel className="aq-stats-panel">
          <SectionHead title="Your learning activity" />
          <div className="aq-stat-feature">
            <div className="aq-stat-feature-head"><span><BookOpen /></span><div><strong>Quiz progress</strong><small>Correct answers in the current question bank</small></div></div>
            <div className="aq-stat-feature-value"><strong>{quizCorrect}</strong><span>of {QUIZ_QUESTIONS.length}</span></div>
            <Progress value={quizProgress} aria-label={`${quizCorrect} of ${QUIZ_QUESTIONS.length} correct answers`} />
            <div className="aq-stat-feature-meta"><span>{quizProgress}% complete</span><span>{QUIZ_QUESTIONS.length - quizCorrect} remaining</span></div>
          </div>
          <div className="aq-stat-row"><div><Sparkles /><strong>{progress.xp}</strong><small>XP earned</small></div><div><Compass /><strong>{progress.level}</strong><small>current level</small></div></div>
          <div className="aq-quest"><span aria-hidden="true">🌿</span><div><strong>Explore the rainforest</strong><small>{lessonDone ? "Lesson complete · review any time" : "One guided lesson to get started"}</small></div></div>
          <div className="aq-quest"><span aria-hidden="true">🐦</span><div><strong>Test one new idea</strong><small>Choose from three quiz difficulties</small></div></div>
          <Button variant="outline" onClick={() => onNavigate("quiz")}>Open Quiz Arena</Button>
          <small className="aq-reward-note">First completions earn {settings.lessonRewardXp} XP per lesson or {settings.quizRewardXp} XP per question. Suggested daily goal: {settings.dailyGoalXp} XP; daily tracking is planned.</small>
        </Panel>
        <div className="aq-daily-fact aq-side-fact" role="status"><span className="aq-daily-fact-icon" aria-hidden="true">🐾</span><div><small>Random fact</small><strong>{dailyFact.text}</strong><a href={dailyFact.sourceUrl} target="_blank" rel="noreferrer">Source: {dailyFact.sourceName} <ExternalLink /></a></div>{isAdmin && <a className="aq-fact-edit" href="/room#daily-facts"><Pencil /> Edit fact pool</a>}</div>
        {currentMonthEvent && <Panel className="aq-calendar-preview"><SectionHead title="In the field this month" action="Calendar" onAction={() => onNavigate("calendar")} /><div className="aq-season-label"><CalendarDays /><span>{CALENDAR_MONTHS[currentMonth - 1]}<small>Singapore wildlife calendar</small></span></div><h3>{currentMonthEvent.title}</h3><p>{currentMonthEvent.summary}</p><div className="aq-callout"><strong>Typical window</strong><span>{currentMonthEvent.typicalWindow}. Sightings are not guaranteed.</span></div><a className="aq-guidance-link" href={currentMonthEvent.sourceUrl} target="_blank" rel="noreferrer">Calendar source <ExternalLink /></a></Panel>}
        <Panel className="aq-mastery"><SectionHead title="Build your learning trail" /><div className="aq-guide-list"><div><span>1</span><div><strong>Learn one idea</strong><small>{lessonDone ? "Rainforest lesson complete." : "Begin with the rainforest lesson."}</small></div></div><div><span>2</span><div><strong>Check its source</strong><small>Read the linked NParks or research page.</small></div></div><div><span>3</span><div><strong>Test your understanding</strong><small>{progress.answeredQuizzes.length} of {QUIZ_QUESTIONS.length} questions answered correctly.</small></div></div></div><div className="aq-verification-note"><ShieldCheck /><span>Lesson completion and correct answers are recorded. Wider habitat mastery is still planned.</span></div></Panel>
        <LearningSummary records={progress.learningRecords ?? []} />
      </div>
      </div>
    </div>
  );
}

function ProgressVisuals({ progress }: { progress: ProgressState }) {
  const tierData = (["beginner", "intermediate", "advanced"] as QuizDifficulty[]).map((difficulty) => ({
    difficulty: difficulty[0].toUpperCase() + difficulty.slice(1),
    answered: QUIZ_QUESTIONS.filter((question) => question.difficulty === difficulty && progress.answeredQuizzes.includes(question.id)).length,
  }));
  const answered = QUIZ_QUESTIONS.filter((question) => progress.answeredQuizzes.includes(question.id)).length;
  const remaining = Math.max(0, QUIZ_QUESTIONS.length - answered);
  const completionData = [{ name: "Correct", value: answered, color: "var(--chart-1)" }, { name: "Remaining", value: remaining, color: "var(--chart-4)" }];
  const tierSize = QUIZ_QUESTIONS.filter((question) => question.difficulty === "beginner").length;
  const tierSummary = tierData.map((item) => `${item.difficulty}: ${item.answered} of ${tierSize}`).join("; ");
  return <Panel className="aq-progress-visuals"><div className="aq-chart-heading"><div><span className="aq-eyebrow">Your learning picture</span><h2>Correct answers by difficulty</h2><p>Counts use only questions you have answered correctly. Each tier contains {tierSize} questions.</p></div><span className="aq-xp-chip"><Sparkles /> {progress.xp} XP</span></div><div className="aq-progress-chart-grid"><div className="aq-progress-chart" role="img" aria-label={`Correct answers. ${tierSummary}.`}><h3>Correct answers</h3><span className="sr-only">{tierSummary}</span><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 480, height: 280 }}><BarChart data={tierData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="difficulty" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} /><YAxis domain={[0, tierSize]} allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: ".5rem", color: "var(--popover-foreground)" }} formatter={(value) => [`${value} of ${tierSize}`, "Correct"]} /><Bar dataKey="answered" fill="var(--chart-1)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div><div className="aq-donut-card" role="img" aria-label={`Question bank completion: ${answered} correct and ${remaining} remaining out of ${QUIZ_QUESTIONS.length}.`}><h3>Question bank completion</h3><div className="aq-donut-wrap"><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 480, height: 280 }}><PieChart><Pie data={completionData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={78} startAngle={90} endAngle={-270} stroke="var(--card)" strokeWidth={3}>{completionData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: ".5rem", color: "var(--popover-foreground)" }} formatter={(value) => [`${value} questions`, ""]} /></PieChart></ResponsiveContainer><div className="aq-donut-label"><strong>{answered}</strong><span>of {QUIZ_QUESTIONS.length}</span></div></div><div className="aq-chart-legend"><span><i className="mastered" /> Correct {answered}</span><span><i /> Remaining {remaining}</span></div></div></div></Panel>;
}

function LearnView({ progress, onComplete, onJourney, user, signInPath, saveMessage, rewardXp, localMode }: { onJourney: (id: string) => void; progress: ProgressState; onComplete: () => void; user: User; signInPath: string; saveMessage: string; rewardXp: number; localMode: boolean }) {
  const complete = progress.completedLessons.includes("rainforest-01");
  const [lessonAnimal, setLessonAnimal] = useState("sunda-colugo");
  const forestLayers = [
    ["Emergent layer", "The tallest crowns receive strong sunlight and wind. Large birds and flying animals can move above the main canopy."],
    ["Canopy", "A dense roof of leaves holds much of a rainforest’s food, shelter and animal activity."],
    ["Understory", "Lower light favours broad leaves. Camouflage and careful movement help animals avoid detection."],
    ["Forest floor", "Fungi, insects and other decomposers recycle fallen material into nutrients."],
  ];
  const adaptations = [
    ["Sunda colugo", "Patagium", "A wide skin membrane creates lift during a controlled glide."],
    ["Oriental pied hornbill", "Large bill", "The bill helps the bird reach, pick up and position fruit."],
    ["Malayan water monitor", "Swimming tail", "This strong swimmer has a long tail that is flattened towards the tip."],
    ["Plantain squirrel", "Gripping claws", "Strong claws help it climb trunks and move among branches in parks and forests."],
  ];
  return (
    <div className="aq-view aq-two-column">
      <div className="aq-page-title"><div><span className="aq-eyebrow">🌿 Guided lesson</span><h1>Singapore rainforest adaptations</h1></div><span className="aq-source-chip"><ShieldCheck /> NParks-linked lesson</span></div>
      <div className="aq-main-column">
        <Panel className="aq-lesson-cover"><WildlifePhoto animal="colugo" /><div><span className="aq-kicker">Lesson 1 · About 8 minutes</span><h2>Life between forest layers</h2><p>Singapore’s rainforests contain several vertical layers. Light, moisture, food and shelter differ from the treetops to the ground, so local animals use different body shapes and behaviours in each layer.</p><div className="aq-lesson-goals"><strong>By the end, you can:</strong><span>name four forest layers</span><span>connect a Singapore animal’s adaptation to its function</span><span>explain one food-web link</span></div></div></Panel>
        <Panel><SectionHead title="Three ideas to remember" /><div className="aq-concept-grid"><article><span>🌿</span><h3>Structure</h3><p>The canopy, understory and forest floor provide different resources.</p></article><article><span>🦎</span><h3>Adaptation</h3><p>Grip, camouflage and gliding help animals use these spaces.</p></article><article><span>🕸️</span><h3>Connection</h3><p>Each species forms part of a larger food web.</p></article></div></Panel>
        <Panel><SectionHead title="The forest from top to bottom" /><div className="aq-detail-list">{forestLayers.map(([name, text], index) => <article key={name}><span>{index + 1}</span><div><h3>{name}</h3><p>{text}</p></div></article>)}</div></Panel>
        <Panel><SectionHead title="Adaptation examples" /><div className="aq-info-grid">{adaptations.map(([animal, feature, text]) => <article key={animal}><span>{animal}</span><h3>{feature}</h3><p>{text}</p></article>)}</div></Panel>
      </div>
      <aside className="aq-side-column">
        <Panel><SectionHead title="Lesson progress" /><Progress value={complete ? 100 : 0} /><p className="aq-muted">{complete ? `Completed · ${rewardXp} XP earned` : "Ready to begin · 8 minutes"}</p><Button onClick={onComplete} disabled={complete}>{complete ? "Lesson complete" : `Complete lesson · +${rewardXp} XP`}</Button>{!user && !localMode && <Button asChild variant="outline"><a href={signInPath} target="_top"><LogIn /> Sign in before saving</a></Button>}<small className="aq-save-state" role="status">{saveMessage}</small></Panel>
        <Panel><SectionHead title={`${SINGAPORE_SPECIES.length} animal journeys`} /><label>Choose a species<select aria-label="Choose a guided lesson" value={lessonAnimal} onChange={e => setLessonAnimal(e.target.value)}>{SINGAPORE_SPECIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label><p>Each lesson covers traits, habitat, food, conservation and careful observation.</p><Button onClick={() => onJourney(lessonAnimal)}>Open this animal lesson</Button></Panel>
        <Panel><SectionHead title="Key terms" /><dl className="aq-glossary"><div><dt>Adaptation</dt><dd>A feature or behaviour that improves survival or reproduction in an environment.</dd></div><div><dt>Patagium</dt><dd>A skin membrane used for gliding in animals such as colugos.</dd></div><div><dt>Decomposer</dt><dd>An organism that breaks down dead material and returns nutrients to the ecosystem.</dd></div></dl></Panel>
        <Panel><SectionHead title="Lesson sources" /><p className="aq-compact-copy">These NParks records support the animal examples. Forest layers are a simplified learning model, not fixed boundaries.</p><div className="aq-source-list"><a href="https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/sunda-colugo/" target="_blank" rel="noreferrer">Sunda colugo <ExternalLink /></a><a href="https://biodiversitysg.nparks.gov.sg/our-biodiversity/birds/other-birds/oriental-pied-hornbill/" target="_blank" rel="noreferrer">Oriental pied hornbill <ExternalLink /></a><a href="https://www.nparks.gov.sg/visit/parks/park-detail/lower-peirce-reservoir-park/" target="_blank" rel="noreferrer">Water monitor at Lower Peirce <ExternalLink /></a><a href="https://biodiversitysg.nparks.gov.sg/our-biodiversity/mammals/other-mammals/plantain-squirrel/" target="_blank" rel="noreferrer">Plantain squirrel <ExternalLink /></a><a href="https://www.nparks.gov.sg/sbg/research/publications/-/media/sbg/gardenwise/1997-jul-gardenwise-vol-09.pdf" target="_blank" rel="noreferrer">Forest structure · Gardenwise PDF <ExternalLink /></a></div></Panel>
      </aside>
    </div>
  );
}



function FieldView({ onOpen }: { onOpen: (id: string) => void }) {
return <SimpleView eyebrow="🔬 Field Lab" title="Practise careful observation"><div className="aq-field-grid"><Panel><SectionHead title="Observation methods" /><div className="aq-feature-list"><article><Volume2 /><div><h2>Sound patterns</h2><p>Compare rhythm, pitch and repetition. Record the time, weather and distance. Do not identify a species from one weak signal.</p></div></article><article><PawPrint /><div><h2>Tracks and signs</h2><p>Use size, shape, habitat and direction together. A single mark is a clue, not proof.</p></div></article><article><Bot /><div><h2>Assisted identification</h2><p>Compare possible matches with a trusted field guide or a local expert. AniQuest does not yet accept identification uploads.</p></div></article></div></Panel><Panel><SectionHead title="Field-note checklist" /><p>Use this checklist in your own notebook. Saving field notes in AniQuest is still planned.</p><ol className="aq-checklist"><li><span>1</span><div><strong>Where?</strong><p>Record the habitat and a safe, non-sensitive location.</p></div></li><li><span>2</span><div><strong>When?</strong><p>Add the date, time and weather.</p></div></li><li><span>3</span><div><strong>What?</strong><p>Describe size, colour, movement, sound and group size.</p></div></li><li><span>4</span><div><strong>Confidence?</strong><p>Separate what you observed from what you inferred.</p></div></li></ol></Panel><Panel className="aq-field-ethics"><SectionHead title="Watch wildlife responsibly" /><div className="aq-info-grid"><article><span>Distance</span><h3>Give animals space</h3><p>Use binoculars or a camera zoom. Never chase an animal for a closer view.</p></article><article><span>Food</span><h3>Do not feed wildlife</h3><p>Human food can change behaviour and harm animal health.</p></article><article><span>Nests</span><h3>Protect sensitive sites</h3><p>Do not share the exact location of nests or threatened animals.</p></article><article><span>Evidence</span><h3>Keep the original record</h3><p>Save the unedited photo or audio with your field notes.</p></article></div></Panel></div><FieldResources /><ChickenGuide onOpen={onOpen} /><BirdDirectory onOpen={onOpen} /></SimpleView>;
}

export function SeasonalCalendarView() {
  const currentMonth = getSingaporeMonth();
  const [selectedMonth, setSelectedMonth] = useState<CalendarMonth>(currentMonth);
  const [category, setCategory] = useState<SeasonalCategory | "all">("all");
  const selectedEvents = eventsForMonth(selectedMonth, category);
  const currentEvents = eventsForMonth(currentMonth).filter((event) => event.months.length < 12).slice(0, 3);
  const currentClimate = climateForMonth(currentMonth);
  const categoryIcons: Record<SeasonalCategory, typeof Bird> = {
    migration: Bird,
    coastal: Waves,
    breeding: PawPrint,
    weather: CloudRain,
  };
  const categories = Object.entries(SEASONAL_CATEGORY_LABELS) as Array<[SeasonalCategory, string]>;

  return <SimpleView eyebrow="Singapore wildlife calendar" title="Plan a year of careful observation">
    <div className="aq-scope-note"><CalendarDays /><div><strong>Wildlife is active all year</strong><span>These are typical windows, not guaranteed sightings. Rain, tides, lunar phase, food supply, migration and yearly weather can change the timing.</span></div><span className="aq-calendar-reviewed">Reviewed 5 Sep 2026</span></div>

    <div className="aq-calendar-lead">
      <Panel className="aq-calendar-now">
        <div className="aq-calendar-panel-head"><div><span className="aq-eyebrow">Now in Singapore</span><h2>{CALENDAR_MONTHS[currentMonth - 1]} field signals</h2><p>{currentClimate.label} · {currentClimate.note}</p></div><Button variant="outline" size="sm" onClick={() => { setSelectedMonth(currentMonth); setCategory("all"); }}>View this month</Button></div>
        <div className="aq-now-list">{currentEvents.map((event) => <article key={event.id}><span aria-hidden="true">{event.emoji}</span><div><strong>{event.title}</strong><small>{event.typicalWindow}</small><p>{event.summary}</p></div></article>)}</div>
      </Panel>
      <Panel className="aq-calendar-plan">
        <SectionHead title="Check conditions before you go" />
        <div className="aq-planning-links">
          <a href="https://www.nea.gov.sg/corporate-functions/weather/tide-timings" target="_blank" rel="noreferrer"><Waves /><span><strong>Current tide times</strong><small>Needed for intertidal plans</small></span><ExternalLink /></a>
          <a href="https://www.nea.gov.sg/corporate-functions/weather" target="_blank" rel="noreferrer"><CloudRain /><span><strong>Weather and lightning</strong><small>Check on the day of the visit</small></span><ExternalLink /></a>
          <a href="https://avs.nparks.gov.sg/wildlife/encountering-wildlife/hawksbill-turtles/" target="_blank" rel="noreferrer"><ShieldCheck /><span><strong>Turtle encounter guide</strong><small>Keep away from turtles and nests</small></span><ExternalLink /></a>
        </div>
        <p className="aq-calendar-caution"><ShieldCheck /> A low-tide time is not a safety guarantee. Check weather, closures and site rules. Never reveal a nest location.</p>
      </Panel>
    </div>

    <Panel className="aq-calendar-year">
      <div className="aq-calendar-panel-head"><div><span className="aq-eyebrow">Year view</span><h2>Typical wildlife windows</h2><p>Select a category and month. Every active period also appears in words.</p></div><span className="aq-source-chip"><ShieldCheck /> {SEASONAL_EVENTS.length} sourced signals</span></div>
      <div className="aq-calendar-filters" role="group" aria-label="Filter calendar categories">
        <button className={category === "all" ? "active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}><CalendarDays /> All signals</button>
        {categories.map(([id, label]) => { const Icon = categoryIcons[id]; return <button key={id} className={`${id} ${category === id ? "active" : ""}`} aria-pressed={category === id} onClick={() => setCategory(id)}><Icon /> {label}</button>; })}
      </div>
      <div className="aq-month-rail" aria-label="Select calendar month">
        {CALENDAR_MONTHS.map((month, index) => { const value = (index + 1) as CalendarMonth; return <button key={month} className={selectedMonth === value ? "selected" : ""} aria-pressed={selectedMonth === value} aria-current={currentMonth === value ? "date" : undefined} onClick={() => setSelectedMonth(value)}><span>{month.slice(0, 3)}</span><small>{eventsForMonth(value, category).length}</small></button>; })}
      </div>
      <div className="aq-calendar-table-wrap">
        <table className="aq-calendar-table">
          <caption className="sr-only">Singapore wildlife activity windows by month</caption>
          <thead><tr><th scope="col">Wildlife signal</th>{CALENDAR_MONTHS.map((month, index) => <th key={month} scope="col" className={currentMonth === index + 1 ? "current" : ""}>{month.slice(0, 3)}</th>)}</tr></thead>
          <tbody>{SEASONAL_EVENTS.filter((event) => category === "all" || event.category === category).map((event) => <tr key={event.id}><th scope="row"><span>{event.title}</span><small>{SEASONAL_CATEGORY_LABELS[event.category]}</small></th>{CALENDAR_MONTHS.map((month, index) => { const value = (index + 1) as CalendarMonth; const active = event.months.includes(value); return <td key={month} className={`${active ? `active ${event.category}` : ""} ${currentMonth === value ? "current" : ""}`} aria-label={`${month}: ${event.title} ${active ? "is in its typical window" : "is outside its listed window"}`}><span aria-hidden="true" /></td>; })}</tr>)}</tbody>
        </table>
      </div>
      <div className="aq-climate-strip"><span className="aq-eyebrow">Climate layer</span>{["Northeast Monsoon · Dec–early Mar", "Inter-monsoon · late Mar–May", "Southwest Monsoon · Jun–Sep", "Inter-monsoon · Oct–Nov"].map((item) => <span key={item}>{item}</span>)}<a href={CLIMATE_SOURCE.url} target="_blank" rel="noreferrer">MSS source <ExternalLink /></a></div>
    </Panel>

    <section className="aq-calendar-details" aria-labelledby="selected-month-heading">
      <div className="aq-calendar-panel-head"><div><span className="aq-eyebrow">Selected month</span><h2 id="selected-month-heading">{CALENDAR_MONTHS[selectedMonth - 1]} wildlife guide</h2><p>{selectedEvents.length} {selectedEvents.length === 1 ? "signal" : "signals"} match this view.</p></div></div>
      {selectedEvents.length ? <div className="aq-calendar-card-grid">{selectedEvents.map((event) => <Panel key={event.id} className={`aq-calendar-card ${event.category}`}>
        <div className="aq-calendar-card-head"><span aria-hidden="true">{event.emoji}</span><div><small>{SEASONAL_CATEGORY_LABELS[event.category]}</small><h3>{event.title}</h3></div></div>
        <p>{event.summary}</p>
        <dl><div><dt>Typical window</dt><dd>{event.typicalWindow}</dd></div><div><dt>Timing factor</dt><dd>{event.timingFactor}</dd></div><div><dt>Where to notice it</dt><dd>{event.habitat}</dd></div><div><dt>Observe responsibly</dt><dd>{event.observe}</dd></div></dl>
        <div className="aq-card-sources"><a href={event.sourceUrl} target="_blank" rel="noreferrer">{event.sourceName} <ExternalLink /></a>{event.secondarySources?.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} <ExternalLink /></a>)}</div>
      </Panel>)}</div> : <Panel><p className="aq-muted">No entries match this category and month. Choose All signals or another month.</p></Panel>}
    </section>
  </SimpleView>;
}

function NewsView({ reviewDays, feeds }: { reviewDays: number; feeds: SiteSettingsValues["newsFeeds"] }) {
  const [scope, setScope] = useState<"singapore" | "world">("singapore");
  const activeFeeds = feeds.filter((feed) => feed.scope === scope);
  const activeFeedIds = new Set(activeFeeds.map((feed) => feed.id));
  const stories = (scope === "singapore" ? SINGAPORE_NEWS_STORIES : WORLD_NEWS_STORIES).filter((story) => activeFeedIds.has(story.feedId)).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  return <SimpleView eyebrow="📰 News Nest" title="Animal news from trusted sources">
    <div className="aq-news-scope" role="group" aria-label="Choose news region"><button aria-pressed={scope === "singapore"} className={scope === "singapore" ? "active" : ""} onClick={() => setScope("singapore")}>🇸🇬 Singapore</button><button aria-pressed={scope === "world"} className={scope === "world" ? "active" : ""} onClick={() => setScope("world")}>🌏 World</button></div>
    <Panel>
      <div className="aq-news-intro"><div><span className="aq-demo-label">{scope.toUpperCase()} · CURATED COLLECTION</span><h2>{scope === "singapore" ? "Local wildlife, research and animal policy" : "Animal science and conservation worldwide"}</h2><p>Each short summary is written for AniQuest. Follow the direct link to the original newsroom or government source and note the event date as well as the publication date.</p></div><div className="aq-review-cycle"><ShieldCheck /><strong>{reviewDays}-day review target</strong><span>Editorial target, not a live refresh. See source dates on each story.</span></div></div>
      {stories.length ? <div className="aq-news-grid">{stories.map((story) => <article key={story.href} className="aq-news-card"><div className="aq-news-meta"><span className="aq-news-emoji" aria-hidden="true">{story.emoji}</span><div><span className="aq-news-topic">{story.topic}</span><small>{story.date}{story.official ? " · Official source" : ""}</small></div></div><h2>{story.title}</h2><p>{story.summary}</p><div className="aq-news-lesson"><strong>Learning lens</strong><span>{story.lesson}</span></div><a href={story.href} target="_blank" rel="noreferrer" aria-label={`Read ${story.title} at ${story.source}`}><span>Read at {story.source}</span><ExternalLink /></a></article>)}</div> : <div className="aq-news-empty"><span>🪺</span><h2>No curated stories in this region</h2><p>An administrator can add trusted sources in the control room. New stories appear after editorial review.</p></div>}
    </Panel>
    <Panel>
      <div className="aq-source-panel-head"><div><span className="aq-eyebrow">Trusted directory</span><h2>{scope === "singapore" ? "Singapore animal sources" : "World animal sources"}</h2></div><span className="aq-source-chip"><ShieldCheck /> {activeFeeds.length} active {activeFeeds.length === 1 ? "source" : "sources"}</span></div>
      {activeFeeds.length ? <div className="aq-feed-directory">{activeFeeds.map((feed) => <a key={feed.id} href={feed.url} target="_blank" rel="noreferrer"><span><strong>{feed.name}</strong><small>{feed.official ? "Official agency" : "Independent newsroom or science source"}</small></span><ExternalLink /></a>)}</div> : <p className="aq-muted">No trusted sources are enabled for this region.</p>}
    </Panel>
    <Panel><div className="aq-source-panel-head"><div><span className="aq-eyebrow">Source skills</span><h2>Before you share an animal story</h2></div><span className="aq-source-chip"><ShieldCheck /> {stories.length} original source links</span></div><div className="aq-source-ladder"><div><b>1</b><strong>Check two dates</strong><span>Publication date and event date may differ.</span></div><div><b>2</b><strong>Find the evidence</strong><span>Look for a study, survey, agency record or direct observation.</span></div><div><b>3</b><strong>Read the limits</strong><span>A sighting is not automatically a population trend.</span></div><div><b>4</b><strong>Compare scope</strong><span>Keep Singapore evidence separate from global claims.</span></div></div></Panel>
  </SimpleView>;
}

function SpeciesStatistics() {
  const groups = (["Mammal", "Bird", "Reptile", "Amphibian"] as const).map((name) => ({ name, count: SINGAPORE_SPECIES.filter((species) => species.group === name).length }));
  const threatened = SINGAPORE_SPECIES.filter((species) => ["VU", "EN", "CR"].includes(species.statusCode)).length;
  const native = SINGAPORE_SPECIES.filter((species) => species.origin === "Native").length;
  return <div className="aq-species-visuals">
    <Panel className="aq-group-visual"><div className="aq-chart-heading"><div><span className="aq-eyebrow">Collection composition</span><h2>Animal groups</h2><p>Profile counts in this guide, not Singapore’s full fauna.</p></div><strong>{SINGAPORE_SPECIES.length}</strong></div><div className="aq-stacked-bar" role="img" aria-label={groups.map((group) => `${group.name}: ${group.count}`).join("; ")}>{groups.map((group) => <span key={group.name} className={`group-${group.name.toLowerCase()}`} style={{ width: `${(group.count / SINGAPORE_SPECIES.length) * 100}%` }} />)}</div><div className="aq-visual-legend">{groups.map((group) => <div key={group.name}><i className={`group-${group.name.toLowerCase()}`} /><span>{group.name}</span><strong>{group.count}</strong></div>)}</div></Panel>
    <Panel className="aq-risk-visual"><div><span className="aq-eyebrow">Conservation snapshot</span><h2>{threatened} profiles are nationally threatened</h2><p>Vulnerable, Endangered or Critically Endangered in Singapore RDB3.</p><a href="https://www.nparks.gov.sg/resources/singapore-species-red-data-book" target="_blank" rel="noreferrer">Source: NParks Red Data Book methodology <ExternalLink /></a></div><div className="aq-risk-ring" role="img" aria-label={`${threatened} of ${SINGAPORE_SPECIES.length} profiles are nationally threatened`} style={{ "--risk-share": `${(threatened / SINGAPORE_SPECIES.length) * 360}deg` } as React.CSSProperties}><strong>{threatened}</strong><span>of {SINGAPORE_SPECIES.length}</span></div><div className="aq-mini-stat"><strong>{native}</strong><span>native profiles</span></div></Panel>
  </div>;
}

function SingaporeView({ query = "", onClear, onOpen }: { query?: string; onClear?: () => void; onOpen: (id: string) => void }) {
  const [overviewOpen, setOverviewOpen] = useState(false);
  const statusColors: Record<string, string> = { LC: "var(--chart-2)", NT: "var(--chart-4)", VU: "var(--warning)", EN: "var(--chart-3)", CR: "var(--destructive)", NA: "var(--muted-foreground)", UNV: "var(--chart-5)" };
  const statusData = getSpeciesStatusCounts().map((status) => ({ ...status, color: statusColors[status.code] ?? "var(--muted-foreground)" }));
  const statusMax = Math.max(1, ...statusData.map((status) => status.count));
  const statusSummary = statusData.map((status) => `${status.name}: ${status.count}`).join("; ");
  return <SimpleView eyebrow="🇸🇬 Singapore Wild" title="Animals around the island">
    <div className="aq-scope-note"><ShieldCheck /><div><strong>Singapore-only animal guide</strong><span>{SINGAPORE_SPECIES.length} full profiles: mammals, birds, reptiles and amphibians. National risk and encounter frequency are separate. Insects and fish are excluded as profile subjects; they can still appear in food-web explanations.</span></div></div>
    {!query && <><section className="aq-wild-gallery" aria-label="Animals photographed in Singapore"><WildlifePhoto animal="colugo" /><WildlifePhoto animal="hornbill" /><WildlifePhoto animal="otter" /></section><SpeciesStatistics /></>}
    {!query && <details className="aq-guide-overview" onToggle={(event) => setOverviewOpen(event.currentTarget.open)}><summary>Habitat & conservation overview <span>Open the photo guide and status chart</span></summary>{overviewOpen && <div className="aq-guide-overview-content"><Panel className="aq-local-photo-feature"><WildlifePhoto animal="otter" /><div><span className="aq-eyebrow">Wildlife in shared spaces</span><h2>Meet your wild neighbours</h2><p>Smooth-coated otters use mangroves, ponds and urban canals. Seeing an animal often does not mean it is secure across Singapore.</p><a className="aq-guidance-link" href="https://avs.nparks.gov.sg/wildlife/encountering-wildlife/otters/" target="_blank" rel="noreferrer">NParks / AVS otter guidance <ExternalLink /></a></div></Panel><Panel className="aq-habitat-strip"><SectionHead title="Look by habitat" /><div className="aq-habitat-grid"><div><span>🌳</span><strong>Rainforest</strong><small>Canopy, understory and forest floor</small></div><div><span>🦦</span><strong>Freshwater</strong><small>Streams, reservoirs and urban canals</small></div><div><span>🌱</span><strong>Mangrove</strong><small>Tidal roots, mudflats and channels</small></div><div><span>🪸</span><strong>Coast and reef</strong><small>Sandy shores, seagrass and coral</small></div></div></Panel>
    <Panel className="aq-conservation-chart"><div className="aq-chart-heading"><div><span className="aq-eyebrow">Visual guide</span><h2>National status in this {SINGAPORE_SPECIES.length}-animal collection</h2><p>Counts describe this guide, not Singapore’s whole fauna. Non-assessed categories are shown separately from threat levels.</p></div><span className="aq-source-chip">RDB3 · 2024</span></div><div className="aq-chart-wrap" role="img" aria-label={`Featured species grouped by Singapore Red List status. ${statusSummary}.`}><span className="sr-only">{statusSummary}</span><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 480, height: 280 }}><BarChart data={statusData} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 16 }}><CartesianGrid stroke="var(--border)" horizontal={false} /><XAxis type="number" domain={[0, statusMax]} allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} /><YAxis dataKey="name" type="category" width={145} tick={{ fill: "var(--foreground)", fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: ".5rem", color: "var(--popover-foreground)" }} formatter={(value) => [`${value} species`, "Featured count"]} /><Bar dataKey="count" radius={[0, 5, 5, 0]}>{statusData.map((entry) => <Cell key={entry.code} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></div><a className="aq-chart-source" href="https://www.nparks.gov.sg/resources/singapore-species-red-data-book" target="_blank" rel="noreferrer">Read the Singapore Red Data Book methodology <ExternalLink /></a></Panel></div>}</details>}
    <BirdDirectory onOpen={onOpen} initialQuery={query} />
    <ChickenGuide onOpen={onOpen} />
    <SpeciesLibrary query={query} onOpen={onOpen} onClear={onClear} />
    <Panel><SectionHead title="When you meet wildlife" /><div className="aq-three-notes"><div><strong>Observe</strong><span>Keep a respectful distance and watch normal behaviour.</span></div><div><strong>Do not feed</strong><span>Feeding wildlife is harmful and generally illegal in Singapore.</span></div><div><strong>Report safely</strong><span>Use the relevant local service for injured wildlife or immediate danger.</span></div></div><a className="aq-guidance-link" href="https://www.nparks.gov.sg/visit/when-visiting-parks/when-encountering-animals" target="_blank" rel="noreferrer">Read official NParks encounter guidance <ExternalLink /></a></Panel>
  </SimpleView>;
}

function CollectionView({ progress, onNavigate }: { progress: ProgressState; onNavigate: (view: ViewId) => void }) {
  const activityCount = progress.completedLessons.length + progress.answeredQuizzes.length;
  const correctIds = new Set(progress.answeredQuizzes);
  const correctByDifficulty = (difficulty: QuizDifficulty) => QUIZ_QUESTIONS.filter((question) => question.difficulty === difficulty && correctIds.has(question.id)).length;
  const beginnerCorrect = correctByDifficulty("beginner");
  const intermediateCorrect = correctByDifficulty("intermediate");
  const advancedCorrect = correctByDifficulty("advanced");
  const cards = [
    { name: "Rainforest Ranger", task: "Complete the rainforest lesson", emoji: "🌿", unlocked: progress.completedLessons.includes("rainforest-01") },
    { name: "First Footprint", task: "Answer one quiz question correctly", emoji: "🐾", unlocked: correctIds.size >= 1 },
    { name: "Canopy Climber", task: "Answer three beginner questions correctly", emoji: "🌳", unlocked: beginnerCorrect >= 3 },
    { name: "Habitat Helper", task: "Answer three intermediate questions correctly", emoji: "🦦", unlocked: intermediateCorrect >= 3 },
    { name: "Evidence Expert", task: "Answer three advanced questions correctly", emoji: "🔎", unlocked: advancedCorrect >= 3 },
    { name: "Quiz Trail Complete", task: `Answer all ${QUIZ_QUESTIONS.length} questions correctly`, emoji: "🏆", unlocked: correctIds.size === QUIZ_QUESTIONS.length },
    { name: "Level Up", task: "Reach level 2", emoji: "✨", unlocked: progress.level >= 2 },
    { name: "Trail Guide", task: "Reach level 3", emoji: "🧭", unlocked: progress.level >= 3 },
    { name: "All-Round Explorer", task: "Complete the lesson and answer one question at each difficulty", emoji: "🦜", unlocked: progress.completedLessons.includes("rainforest-01") && beginnerCorrect >= 1 && intermediateCorrect >= 1 && advancedCorrect >= 1 },
  ];
  const unlockedCount = cards.filter((badge) => badge.unlocked).length;
  return <SimpleView eyebrow="🏅 Collection" title="Your discoveries"><div className="aq-collection-layout"><Panel className="aq-collection-summary"><span className="aq-collection-icon">{activityCount ? "🧭" : "🌱"}</span><div><span className="aq-eyebrow">Trail progress</span><h2>{activityCount ? `${activityCount} learning ${activityCount === 1 ? "activity" : "activities"} completed` : "Your collection starts here"}</h2><p>Every badge can be earned with the lesson and quiz activities available now.</p><Progress value={(unlockedCount / cards.length) * 100} /><small>{unlockedCount} of {cards.length} available badges unlocked</small></div><Button onClick={() => onNavigate("learn")}>{activityCount ? "Continue learning" : "Start first lesson"}</Button></Panel><div className="aq-badge-grid">{cards.map((badge) => <Panel key={badge.name} className={badge.unlocked ? "aq-badge unlocked" : "aq-badge"}><span>{badge.unlocked ? badge.emoji : "🔒"}</span><div><h3>{badge.name}</h3><p>{badge.task}</p><small>{badge.unlocked ? "Unlocked" : "Not earned yet"}</small></div></Panel>)}</div></div></SimpleView>;
}
function SimpleView({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <div className="aq-view"><div className="aq-page-title"><div><span className="aq-eyebrow">{eyebrow}</span><h1>{title}</h1></div></div>{children}</div>; }
