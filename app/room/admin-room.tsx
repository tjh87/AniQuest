"use client";
import { EditorialOverview } from "../content-review";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowLeft, BarChart3, BookOpenCheck, CircleCheck, CircleHelp, CircleX,
  ExternalLink, Eye, FileClock, LayoutDashboard, Link2, LogOut,
  Megaphone, Moon, Newspaper, Palette, Plus, RefreshCw, Rss, Save, ShieldCheck, Sun,
  Sparkles, Trash2, TriangleAlert, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AdminAuditEntry, AdminStats, AdminViewStat, DailyFact, NewsFeed, SiteSettingsSnapshot, SiteSettingsValues } from "../site-settings";
import { VIEW_LABELS } from "../view-data";
import { AniQuestLogo } from "../aniquest-logo";
import type { SourceHealthSnapshot } from "../source-link-health";
import { QUIZ_QUESTIONS } from "../quiz-data";

type Dashboard = { settings: SiteSettingsSnapshot; stats: AdminStats; views: AdminViewStat[]; audit: AdminAuditEntry[]; sourceHealth: SourceHealthSnapshot };
type LinkHealthResponse = { sourceHealth?: SourceHealthSnapshot; scanned?: boolean; reason?: string; error?: string };

const settingKeys: Array<keyof SiteSettingsValues> = [
  "announcementEnabled", "announcementText", "newsEnabled", "quizHintsEnabled",
  "dailyGoalXp", "lessonRewardXp", "quizRewardXp", "defaultTheme",
  "defaultDensity", "contentReviewDays", "featuredBiome", "dailyFacts", "newsFeeds",
];

const settingLabels: Record<keyof SiteSettingsValues, string> = {
  announcementEnabled: "Announcement visibility",
  announcementText: "Announcement message",
  newsEnabled: "News Nest visibility",
  quizHintsEnabled: "Quiz hints",
  dailyGoalXp: "Daily XP goal",
  lessonRewardXp: "Lesson XP reward",
  quizRewardXp: "Quiz XP reward",
  defaultTheme: "Default theme",
  defaultDensity: "Default interface size",
  contentReviewDays: "News review cycle",
  featuredBiome: "Featured biome",
  dailyFacts: "Fact of the day pool",
  newsFeeds: "Trusted news feeds",
};

function settingChanged(before: SiteSettingsValues[keyof SiteSettingsValues], after: SiteSettingsValues[keyof SiteSettingsValues]) {
  return Array.isArray(before) || Array.isArray(after)
    ? JSON.stringify(before) !== JSON.stringify(after)
    : before !== after;
}

function formatTime(value: string) {
  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

const sourceStatus = {
  healthy: { label: "Healthy", Icon: CircleCheck },
  warning: { label: "Review", Icon: TriangleAlert },
  broken: { label: "Broken", Icon: CircleX },
  unchecked: { label: "Not checked", Icon: CircleHelp },
} as const;

function SettingRow({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <div className="room-setting-row"><div><strong>{title}</strong><p>{description}</p></div><div className="room-setting-control">{children}</div></div>;
}

export function AdminRoom({ adminName, signOutPath, initialDashboard }: { adminName: string; signOutPath: string; initialDashboard: Dashboard }) {
  const [saved, setSaved] = useState(initialDashboard.settings);
  const [draft, setDraft] = useState(initialDashboard.settings);
  const [audit, setAudit] = useState(initialDashboard.audit);
  const [saving, setSaving] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const preference = window.localStorage.getItem("aniquest-theme");
      const isDark = preference ? preference === "dark" : initialDashboard.settings.defaultTheme === "dark" || (initialDashboard.settings.defaultTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", isDark);
      setDark(isDark);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialDashboard.settings.defaultTheme]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("aniquest-theme", next ? "dark" : "light");
  };
  const [message, setMessage] = useState("All global settings are saved.");
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedScope, setNewFeedScope] = useState<NewsFeed["scope"]>("singapore");
  const [newFeedOfficial, setNewFeedOfficial] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [sourceHealth, setSourceHealth] = useState(initialDashboard.sourceHealth);
  const [sourceChecking, setSourceChecking] = useState(false);
  const [sourceMessage, setSourceMessage] = useState("Automatic checks run when this control room opens and the review cycle is due.");
  const [sourceFilter, setSourceFilter] = useState<"all" | "attention" | "broken" | "unchecked">("all");
  const autoCheckStarted = useRef(false);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (targetId !== "daily-facts" && targetId !== "news-feeds") return;
    let scrollFrame = 0;
    const tabFrame = window.requestAnimationFrame(() => {
      setActiveTab("content");
      scrollFrame = window.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    });
    return () => { window.cancelAnimationFrame(tabFrame); window.cancelAnimationFrame(scrollFrame); };
  }, []);

  useEffect(() => {
    if (autoCheckStarted.current) return;
    autoCheckStarted.current = true;
    const lastCheck = initialDashboard.sourceHealth.lastCompletedAt ? new Date(initialDashboard.sourceHealth.lastCompletedAt).getTime() : Number.NaN;
    const due = !Number.isFinite(lastCheck) || Date.now() - lastCheck >= initialDashboard.settings.contentReviewDays * 86_400_000;
    if (!due) return;
    let mounted = true;
    const frame = window.requestAnimationFrame(() => {
      if (!mounted) return;
      setSourceChecking(true);
      setSourceMessage("Checking approved source links…");
      void fetch("/api/admin/link-health", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "automatic" }),
      }).then(async (response) => {
        const result = await response.json() as LinkHealthResponse;
        if (!response.ok || !result.sourceHealth) throw new Error(result.error || "The automatic source check could not finish.");
        if (!mounted) return;
        setSourceHealth(result.sourceHealth);
        setSourceMessage(result.scanned ? "Automatic source check complete." : "A recent check is already available.");
      }).catch((error) => {
        if (mounted) setSourceMessage(error instanceof Error ? error.message : "The automatic source check could not finish.");
      }).finally(() => { if (mounted) setSourceChecking(false); });
    });
    return () => { mounted = false; window.cancelAnimationFrame(frame); };
  }, [initialDashboard.settings.contentReviewDays, initialDashboard.sourceHealth.lastCompletedAt]);

  const changedKeys = useMemo(() => settingKeys.filter((key) => settingChanged(saved[key], draft[key])), [saved, draft]);
  const dirty = changedKeys.length > 0;

  const setValue = <K extends keyof SiteSettingsValues>(key: K, value: SiteSettingsValues[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setMessage("Unsaved global changes.");
  };

  const addFeed = () => {
    const name = newFeedName.trim();
    const url = newFeedUrl.trim();
    let parsedUrl: URL;
    try { parsedUrl = new URL(url); } catch { setMessage("Enter a valid HTTPS source URL."); return; }
    if (name.length < 2 || parsedUrl.protocol !== "https:" || parsedUrl.username || parsedUrl.password) {
      setMessage("Add a source name and a public HTTPS URL.");
      return;
    }
    if (draft.newsFeeds.length >= 20) { setMessage("AniQuest supports up to 20 active news sources."); return; }
    if (draft.newsFeeds.some((feed) => feed.url === parsedUrl.href)) { setMessage("That news source is already active."); return; }
    const knownId = {
      "www.nparks.gov.sg": "nparks", "www.straitstimes.com": "straits-times", "www.channelnewsasia.com": "cna",
      "apnews.com": "associated-press", "www.theguardian.com": "guardian", "www.sciencenews.org": "science-news",
      "news.mongabay.com": "mongabay", "www.reuters.com": "reuters", "www.fisheries.noaa.gov": "noaa",
      "mothership.sg": "mothership", "www.mothership.sg": "mothership",
      "mustsharenews.com": "mustsharenews", "www.mustsharenews.com": "mustsharenews",
    }[parsedUrl.hostname.toLowerCase()];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 54);
    const base = knownId ?? (slug.length >= 3 ? slug : `source-${slug || "news"}`);
    let id = base;
    let suffix = 2;
    while (draft.newsFeeds.some((feed) => feed.id === id)) {
      id = `${base.slice(0, 58)}-${suffix}`;
      suffix += 1;
    }
    setValue("newsFeeds", [...draft.newsFeeds, { id, name, scope: newFeedScope, url: parsedUrl.href, official: newFeedOfficial }]);
    setNewFeedName("");
    setNewFeedUrl("");
    setNewFeedOfficial(false);
  };

  const updateFact = <K extends keyof DailyFact>(index: number, key: K, value: DailyFact[K]) => {
    setValue("dailyFacts", draft.dailyFacts.map((fact, factIndex) => factIndex === index ? { ...fact, [key]: value } : fact));
  };

  const addFact = () => {
  if (draft.dailyFacts.length >= 24) { setMessage("AniQuest supports up to 24 daily facts."); return; }
    setValue("dailyFacts", [...draft.dailyFacts, {
      text: "Add a verified Singapore animal fact here.",
      sourceName: "NParks source",
      sourceUrl: "https://biodiversitysg.nparks.gov.sg/our-biodiversity/",
    }]);
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage("Publishing settings…");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          expectedVersion: saved.version,
          announcementEnabled: draft.announcementEnabled,
          announcementText: draft.announcementText,
          newsEnabled: draft.newsEnabled,
          quizHintsEnabled: draft.quizHintsEnabled,
          dailyGoalXp: draft.dailyGoalXp,
          lessonRewardXp: draft.lessonRewardXp,
          quizRewardXp: draft.quizRewardXp,
          defaultTheme: draft.defaultTheme,
          defaultDensity: draft.defaultDensity,
          contentReviewDays: draft.contentReviewDays,
          featuredBiome: draft.featuredBiome,
          dailyFacts: draft.dailyFacts.map((fact) => ({ text: fact.text.trim(), sourceName: fact.sourceName.trim(), sourceUrl: fact.sourceUrl.trim() })),
          newsFeeds: draft.newsFeeds,
        }),
      });
      const result = await response.json() as Dashboard & { error?: string };
      if (!response.ok) throw new Error(result.error || "The settings could not be saved.");
      setSaved(result.settings);
      setDraft(result.settings);
      setAudit(result.audit);
      setMessage("Global settings published. Users receive them after reload.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The settings could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const checkSourcesNow = async () => {
    setSourceChecking(true);
    setSourceMessage("Checking approved source links…");
    try {
      const response = await fetch("/api/admin/link-health", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "manual" }),
      });
      const result = await response.json() as LinkHealthResponse;
      if (!response.ok || !result.sourceHealth) throw new Error(result.error || "The source check could not finish.");
      setSourceHealth(result.sourceHealth);
      setSourceMessage(result.scanned ? "Source check complete." : "The last check is still current. Try again in a few minutes.");
    } catch (error) {
      setSourceMessage(error instanceof Error ? error.message : "The source check could not finish.");
    } finally {
      setSourceChecking(false);
    }
  };

  const stats = initialDashboard.stats;
  const viewData = initialDashboard.views.map((item) => ({ name: VIEW_LABELS[item.view as keyof typeof VIEW_LABELS] ?? item.view, visits: item.visits }));
  const learnerData = [
    { name: "Progress records", learners: stats.learners },
    { name: "Updated 7 days", learners: stats.activeLearners7d },
    { name: "Lesson", learners: stats.lessonLearners },
    { name: "Quiz", learners: stats.quizLearners },
    { name: "Full quiz", learners: stats.quizCompleteLearners },
  ];
  const quizCoverage = stats.learners ? Math.round((stats.correctAnswers / (stats.learners * QUIZ_QUESTIONS.length)) * 100) : 0;
  const activeShare = stats.learners ? Math.round((stats.activeLearners7d / stats.learners) * 100) : 0;
  const featureStatus = [
    { name: "Global content controls", detail: "Settings, daily facts and news sources", state: "Active" },
    { name: "Saved learner progress", detail: "Server records for signed-in learners", state: "Active" },
    { name: "Aggregate usage statistics", detail: "Section opens and learning totals", state: "Active" },
    { name: "Source-link health", detail: sourceHealth.lastCompletedAt ? "Last check is available" : "Waiting for first check", state: sourceHealth.lastCompletedAt ? "Active" : "Needs check" },
    { name: "Private field notes", detail: "No storage or analytics yet", state: "Planned" },
    { name: "Event-change alerts", detail: "No change feed or notification service yet", state: "Planned" },
  ];
  const viewSummary = viewData.map((item) => `${item.name}: ${item.visits}`).join("; ");
  const learnerSummary = learnerData.map((item) => `${item.name}: ${item.learners}`).join("; ");
  const visibleSourceRows = sourceHealth.rows.filter((row) => {
    if (sourceFilter === "all") return true;
    if (sourceFilter === "attention") return row.status === "warning" || row.status === "broken";
    return row.status === sourceFilter;
  });

  return <main className="room-shell">
    <header className="room-topbar">
      <div className="room-brand"><AniQuestLogo /><div><small>ANIQUEST</small><strong>Control room</strong></div></div>
      <div className="room-account"><span><ShieldCheck /> Admin only</span><strong>{adminName}</strong><Button variant="ghost" size="icon-sm" aria-label={dark ? "Use light theme" : "Use dark theme"} onClick={toggleTheme}>{dark ? <Sun /> : <Moon />}</Button><Button asChild variant="ghost" size="icon-sm"><a href={signOutPath} target="_top" aria-label="Sign out"><LogOut /></a></Button></div>
    </header>

    <div className="room-content">
      <div className="room-heading"><div><Link href="/"><ArrowLeft /> Return to AniQuest</Link><h1>Global site settings</h1><p>Changes on this page affect all AniQuest users. Access requires server-verified administrator permission.</p></div><span className="room-live"><i /> Live configuration</span></div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="room-tabs">
        <TabsList className="room-tabs-list" aria-label="Admin sections">
          <TabsTrigger value="overview"><LayoutDashboard /> Overview</TabsTrigger>
          <TabsTrigger value="content"><Newspaper /> Content</TabsTrigger>
          <TabsTrigger value="learning"><BookOpenCheck /> Learning</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 /> Analytics</TabsTrigger>
          <TabsTrigger value="sources"><Link2 /> Source health</TabsTrigger>
          <TabsTrigger value="appearance"><Palette /> Appearance</TabsTrigger>
          <TabsTrigger value="audit"><FileClock /> Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="room-tab-content">
          <section className="room-stat-grid" aria-label="Site totals">
            <article className="room-stat-feature">
              <div className="room-stat-feature-head"><span><Users /></span><div><strong>Learning records</strong><small>Signed-in progress records stored by AniQuest</small></div></div>
              <div className="room-stat-feature-value"><strong>{stats.learners}</strong><span>records</span></div>
              <div className="room-stat-meter" aria-label={`${stats.activeLearners7d} of ${stats.learners} records updated in 7 days`}><i style={{ width: `${activeShare}%` }} /></div>
              <div className="room-stat-feature-meta"><span>{stats.activeLearners7d} updated in 7 days</span><span>{activeShare}% active</span></div>
            </article>
            <article><Sparkles /><div><strong>{stats.totalXp.toLocaleString()}</strong><span>total XP earned</span><small>{stats.averageXp} average per record</small></div></article>
            <article><BookOpenCheck /><div><strong>{stats.correctAnswers}</strong><span>correct answers</span><small>{quizCoverage}% of available answer slots</small></div></article>
          </section>
          <section className="room-stat-detail-grid" aria-label="Additional learning totals">
            <article><BookOpenCheck /><div><strong>{stats.lessonCompletions}</strong><span>lesson completions</span></div></article>
            <article><Activity /><div><strong>{stats.quizLearners}</strong><span>records with a correct quiz answer</span></div></article>
            <article><CircleCheck /><div><strong>{stats.quizCompleteLearners}</strong><span>records with every quiz answer correct</span></div></article>
            <article><Eye /><div><strong>{stats.totalVisits.toLocaleString()}</strong><span>recorded section opens</span></div></article>
          </section>
          <div className="room-two-column">
            <section className="room-panel"><div className="room-panel-title"><Eye /><div><h2>Current user experience</h2><p>Active global choices at a glance.</p></div></div><div className="room-summary-list"><div><span>News Nest</span><strong>{draft.newsEnabled ? "Visible" : "Hidden"}</strong></div><div><span>Quiz hints</span><strong>{draft.quizHintsEnabled ? "On" : "Off"}</strong></div><div><span>Default theme</span><strong>{draft.defaultTheme}</strong></div><div><span>News review</span><strong>Every {draft.contentReviewDays} days</strong></div></div></section>
            <section className="room-panel room-security"><div className="room-panel-title"><ShieldCheck /><div><h2>Security controls</h2><p>The server is the security boundary.</p></div></div><ul><li>ChatGPT sign-in is required.</li><li>Only the configured admin account is accepted.</li><li>Every write is validated, rate-limited and logged.</li><li>Individual learner records are not shown here.</li></ul></section>
          </div>
          <section className="room-panel"><div className="room-panel-title"><Activity /><div><h2>Feature status</h2><p>Only released features are marked active. Planned items are not counted in site statistics.</p></div></div><div className="room-feature-status">{featureStatus.map((feature) => <article key={feature.name}><div><strong>{feature.name}</strong><span>{feature.detail}</span></div><small className={feature.state === "Active" ? "active" : feature.state === "Needs check" ? "needs-check" : "planned"}>{feature.state}</small></article>)}</div></section>
        </TabsContent>

        <TabsContent value="content" className="room-tab-content">
          <EditorialOverview />
          <section className="room-panel"><div className="room-panel-title"><Megaphone /><div><h2>Site announcement</h2><p>Show one short message above the main learning area.</p></div></div><SettingRow title="Show announcement" description="Turn the banner on or off for all users."><Switch checked={draft.announcementEnabled} onCheckedChange={(value) => setValue("announcementEnabled", value)} aria-label="Show site announcement" /></SettingRow><label className="room-field"><span>Message</span><Textarea value={draft.announcementText} maxLength={180} placeholder="Add a short service or learning update." onChange={(event) => setValue("announcementText", event.target.value)} /><small>{draft.announcementText.length} / 180</small></label></section>
          <section className="room-panel"><div className="room-panel-title"><Newspaper /><div><h2>Content and news</h2><p>Control discovery and review defaults.</p></div></div><SettingRow title="Show News Nest" description="Turning this off removes News Nest from user navigation."><Switch checked={draft.newsEnabled} onCheckedChange={(value) => setValue("newsEnabled", value)} aria-label="Show News Nest" /></SettingRow><SettingRow title="News review cycle" description="Choose how often links and changing claims must be checked."><div className="room-number"><Input type="number" min={7} max={90} value={draft.contentReviewDays} onChange={(event) => setValue("contentReviewDays", Number(event.target.value))} aria-label="News review days" /><span>days</span></div></SettingRow><SettingRow title="Featured habitat" description="Highlight one Singapore habitat in the home learning trail."><Select value={draft.featuredBiome} onValueChange={(value) => setValue("featuredBiome", value as SiteSettingsValues["featuredBiome"])}><SelectTrigger aria-label="Featured habitat"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rainforest">Rainforest</SelectItem><SelectItem value="mangrove">Mangrove and mudflat</SelectItem><SelectItem value="freshwater">Freshwater and parks</SelectItem><SelectItem value="coast">Coast and coral reef</SelectItem></SelectContent></Select></SettingRow></section>
          <section className="room-panel" id="daily-facts">
            <div className="room-panel-title"><Sparkles /><div><h2>Fact of the day</h2><p>A sourced Singapore animal fact is selected once each Singapore calendar day.</p></div></div>
            <div className="room-fact-list">{draft.dailyFacts.map((fact, index) => <article key={index}><div className="room-fact-number">{index + 1}</div><div className="room-fact-fields"><label><span>Fact</span><Textarea value={fact.text} maxLength={180} onChange={(event) => updateFact(index, "text", event.target.value)} /></label><div><label><span>Source name</span><Input value={fact.sourceName} maxLength={80} onChange={(event) => updateFact(index, "sourceName", event.target.value)} /></label><label><span>HTTPS source URL</span><Input type="url" value={fact.sourceUrl} maxLength={500} onChange={(event) => updateFact(index, "sourceUrl", event.target.value)} /></label></div></div><Button type="button" variant="ghost" size="icon-sm" disabled={draft.dailyFacts.length <= 3} onClick={() => setValue("dailyFacts", draft.dailyFacts.filter((_, factIndex) => factIndex !== index))} aria-label={`Remove fact ${index + 1}`}><Trash2 /></Button></article>)}</div>
            <div className="room-fact-footer"><span>{draft.dailyFacts.length} facts · 3–24 required · 180 characters each</span><Button type="button" variant="outline" size="sm" disabled={draft.dailyFacts.length >= 24} onClick={addFact}><Plus /> Add sourced fact</Button></div>
          </section>
          <section className="room-panel" id="news-feeds">
            <div className="room-panel-title"><Rss /><div><h2>Trusted news feeds</h2><p>Add or remove the source directories that appear in News Nest. Curated story cards linked to a removed source are hidden.</p></div></div>
            <div className="room-feed-list">{draft.newsFeeds.length ? draft.newsFeeds.map((feed) => <article key={feed.id}><div><strong>{feed.name}</strong><span>{feed.scope === "singapore" ? "🇸🇬 Singapore" : "🌏 World"}{feed.official ? " · Official agency" : ""}</span><a href={feed.url} target="_blank" rel="noreferrer">{feed.url} <ExternalLink /></a></div><Button type="button" variant="ghost" size="icon-sm" onClick={() => setValue("newsFeeds", draft.newsFeeds.filter((item) => item.id !== feed.id))} aria-label={`Remove ${feed.name}`}><Trash2 /></Button></article>) : <div className="room-feed-empty"><Rss /><span>No active news sources. News Nest will show an editorial empty state.</span></div>}</div>
            <div className="room-feed-add"><label><span>Source name</span><Input value={newFeedName} maxLength={60} placeholder="e.g. AVS Singapore" onChange={(event) => setNewFeedName(event.target.value)} /></label><label><span>HTTPS source URL</span><Input type="url" value={newFeedUrl} maxLength={500} placeholder="https://…" onChange={(event) => setNewFeedUrl(event.target.value)} /></label><label><span>Region</span><Select value={newFeedScope} onValueChange={(value) => setNewFeedScope(value as NewsFeed["scope"])}><SelectTrigger aria-label="News source region"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="singapore">Singapore</SelectItem><SelectItem value="world">World</SelectItem></SelectContent></Select></label><label className="room-feed-official"><span>Official agency</span><Switch checked={newFeedOfficial} onCheckedChange={setNewFeedOfficial} aria-label="Official government or intergovernmental source" /></label><Button type="button" variant="outline" onClick={addFeed}><Plus /> Add source</Button></div>
            <p className="room-field-note">Adding a source lists it for learners immediately after publishing. Individual news summaries still require editorial review before appearing as story cards.</p>
          </section>
        </TabsContent>

        <TabsContent value="learning" className="room-tab-content">
          <section className="room-panel"><div className="room-panel-title"><BookOpenCheck /><div><h2>Learning defaults</h2><p>Set goals, support and rewards for all learners.</p></div></div><SettingRow title="Quiz hints" description="Allow the Habitat Hint control in Quiz Arena."><Switch checked={draft.quizHintsEnabled} onCheckedChange={(value) => setValue("quizHintsEnabled", value)} aria-label="Allow quiz hints" /></SettingRow><SettingRow title="Daily XP goal" description="Show the recommended amount of XP for one day."><div className="room-number"><Input type="number" min={25} max={500} step={25} value={draft.dailyGoalXp} onChange={(event) => setValue("dailyGoalXp", Number(event.target.value))} aria-label="Daily XP goal" /><span>XP</span></div></SettingRow><SettingRow title="Lesson reward" description="XP added after the current guided lesson is completed."><div className="room-number"><Input type="number" min={10} max={500} step={10} value={draft.lessonRewardXp} onChange={(event) => setValue("lessonRewardXp", Number(event.target.value))} aria-label="Lesson XP reward" /><span>XP</span></div></SettingRow><SettingRow title="Quiz reward" description="XP added for the first correct answer."><div className="room-number"><Input type="number" min={5} max={250} step={5} value={draft.quizRewardXp} onChange={(event) => setValue("quizRewardXp", Number(event.target.value))} aria-label="Quiz XP reward" /><span>XP</span></div></SettingRow></section>
        </TabsContent>

        <TabsContent value="analytics" className="room-tab-content">
          <div className="room-two-column">
            <section className="room-panel"><div className="room-panel-title"><BarChart3 /><div><h2>Recorded section opens</h2><p>Counts signed-in openings, not people or unique visits.</p></div></div>{viewData.length ? <div className="room-chart" role="img" aria-label={`Aggregate section opens. ${viewSummary}.`}><span className="sr-only">{viewSummary}</span><ResponsiveContainer width="100%" height="100%"><BarChart data={viewData} margin={{ top: 8, right: 10, bottom: 36, left: 0 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="name" angle={-28} textAnchor="end" interval={0} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: ".5rem", color: "var(--popover-foreground)" }} formatter={(value) => [`${value} opens`, "Section"]} /><Bar dataKey="visits" fill="var(--chart-1)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div> : <div className="room-empty-audit"><BarChart3 /><strong>No section opens recorded yet</strong><span>Totals appear after signed-in learners open the updated server app.</span></div>}</section>
            <section className="room-panel"><div className="room-panel-title"><Users /><div><h2>Learner participation</h2><p>Saved, signed-in learning data only.</p></div></div><div className="room-chart" role="img" aria-label={`Signed-in learner participation. ${learnerSummary}.`}><span className="sr-only">{learnerSummary}</span><ResponsiveContainer width="100%" height="100%"><BarChart data={learnerData} layout="vertical" margin={{ top: 8, right: 22, bottom: 8, left: 8 }}><CartesianGrid stroke="var(--border)" horizontal={false} /><XAxis type="number" allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} /><YAxis type="category" dataKey="name" width={105} tick={{ fill: "var(--foreground)", fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: ".5rem", color: "var(--popover-foreground)" }} formatter={(value) => [`${value} learners`, "Saved activity"]} /><Bar dataKey="learners" fill="var(--chart-2)" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer></div><div className="room-analytics-summary"><span><strong>{stats.averageXp}</strong> average XP per progress record</span><span><strong>{quizCoverage}%</strong> of all available quiz answer slots completed correctly</span></div></section>
          </div>
          <section className="room-panel room-privacy-note"><ShieldCheck /><div><h2>Privacy-safe site statistics</h2><p>Page statistics are aggregate section opens, not unique visitor counts. AniQuest does not store IP addresses, device identifiers or a per-user browsing history for this chart. Learner totals come only from signed-in progress records.</p></div></section>
        </TabsContent>

        <TabsContent value="sources" className="room-tab-content">
          <section className="room-panel">
            <div className="room-source-health-head"><div className="room-panel-title"><Link2 /><div><h2>Automatic source-link health</h2><p>Checks the links used by facts, quizzes, species, news, the wildlife calendar and guidance.</p></div></div><Button type="button" variant="outline" disabled={sourceChecking} onClick={() => void checkSourcesNow()}><RefreshCw className={sourceChecking ? "room-spin" : ""} /> {sourceChecking ? "Checking…" : "Check now"}</Button></div>
            <div className="room-health-grid" aria-label="Source health totals">
              <article><Link2 /><div><strong>{sourceHealth.counts.total}</strong><span>current sources</span></div></article>
              <article className="healthy"><CircleCheck /><div><strong>{sourceHealth.counts.healthy}</strong><span>healthy</span></div></article>
              <article className="warning"><TriangleAlert /><div><strong>{sourceHealth.counts.warning}</strong><span>need review</span></div></article>
              <article className="broken"><CircleX /><div><strong>{sourceHealth.counts.broken}</strong><span>broken</span></div></article>
              <article className="unchecked"><CircleHelp /><div><strong>{sourceHealth.counts.unchecked}</strong><span>not checked</span></div></article>
            </div>
            <div className="room-health-meta"><span><strong>Last complete check:</strong> {sourceHealth.lastCompletedAt ? formatTime(sourceHealth.lastCompletedAt) : "Not run yet"}</span><span><strong>Next due:</strong> {sourceHealth.nextDueAt ? formatTime(sourceHealth.nextDueAt) : "When this page opens"}</span><span aria-live="polite">{sourceMessage}</span></div>
          </section>

          <section className="room-panel">
            <div className="room-panel-title"><ShieldCheck /><div><h2>Source results</h2><p>Automatic requests use an approved host list, short timeouts and safe redirect checks. AniQuest never hides content automatically.</p></div></div>
            <div className="room-health-filters" role="group" aria-label="Filter source results">
              {([ ["all", "All"], ["attention", "Needs attention"], ["broken", "Broken"], ["unchecked", "Not checked"] ] as const).map(([id, label]) => <button key={id} className={sourceFilter === id ? "active" : ""} aria-pressed={sourceFilter === id} onClick={() => setSourceFilter(id)}>{label}</button>)}
            </div>
            <div className="room-health-table-wrap">
              <Table>
                <TableHeader><TableRow><TableHead>Source</TableHead><TableHead>Used by</TableHead><TableHead>Status</TableHead><TableHead>Response</TableHead><TableHead>Checked</TableHead></TableRow></TableHeader>
                <TableBody>{visibleSourceRows.map((row) => { const meta = sourceStatus[row.status]; const StatusIcon = meta.Icon; return <TableRow key={row.url}><TableCell><a className="room-source-link" href={row.url} target="_blank" rel="noreferrer"><strong>{row.label}</strong><span>{new URL(row.url).hostname}</span><ExternalLink /></a></TableCell><TableCell><span className="room-source-categories">{row.categories.join(", ").replaceAll("-", " ")}</span></TableCell><TableCell><span className={`room-health-status ${row.status}`}><StatusIcon /> {meta.label}</span></TableCell><TableCell><span className="room-health-detail">{row.httpStatus ? `HTTP ${row.httpStatus} · ` : ""}{row.detail}</span></TableCell><TableCell>{row.checkedAt ? formatTime(row.checkedAt) : "—"}</TableCell></TableRow>; })}</TableBody>
              </Table>
              {!visibleSourceRows.length && <div className="room-empty-audit"><CircleCheck /><strong>No sources match this filter</strong><span>Choose All to see the full source register.</span></div>}
            </div>
          </section>

          <section className="room-panel room-privacy-note"><ShieldCheck /><div><h2>Safe checking rules</h2><p>Only server-listed links on approved public hosts are fetched. New hosts added in settings stay marked “Not checked” until they are reviewed in code. Redirects never bypass the approved host list. The checker stores status codes and timing only, not page content or visitor data.</p></div></section>
        </TabsContent>

        <TabsContent value="appearance" className="room-tab-content">
          <section className="room-panel"><div className="room-panel-title"><Palette /><div><h2>First-visit appearance</h2><p>Existing user choices remain on their own device.</p></div></div><SettingRow title="Default theme" description="Used when a visitor has not selected a theme before."><Select value={draft.defaultTheme} onValueChange={(value) => setValue("defaultTheme", value as SiteSettingsValues["defaultTheme"])}><SelectTrigger aria-label="Default theme"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="system">Match device</SelectItem><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem></SelectContent></Select></SettingRow><SettingRow title="Default interface size" description="Sets text and card spacing for first-time visitors."><Select value={String(draft.defaultDensity)} onValueChange={(value) => setValue("defaultDensity", Number(value) as SiteSettingsValues["defaultDensity"])}><SelectTrigger aria-label="Default interface size"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">Compact</SelectItem><SelectItem value="1">Standard</SelectItem><SelectItem value="2">Comfortable</SelectItem></SelectContent></Select></SettingRow><div className="room-theme-preview"><div className="light-preview"><span>Light</span><strong>Clear daylight tones</strong><small>Dark text on pale surfaces</small></div><div className="dark-preview"><span>Dark</span><strong>Low-glare midnight tones</strong><small>Light text on deep surfaces</small></div></div></section>
        </TabsContent>

        <TabsContent value="audit" className="room-tab-content">
          <section className="room-panel"><div className="room-panel-title"><FileClock /><div><h2>Recent global changes</h2><p>The log records which setting groups changed and when.</p></div></div>{audit.length ? <Table><TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Changed settings</TableHead><TableHead>Result</TableHead></TableRow></TableHeader><TableBody>{audit.map((entry) => <TableRow key={entry.id}><TableCell>{formatTime(entry.createdAt)}</TableCell><TableCell className="room-audit-keys">{entry.changedKeys.map((key) => settingLabels[key as keyof SiteSettingsValues] ?? key).join(", ")}</TableCell><TableCell><span className="room-applied"><ShieldCheck /> Applied</span></TableCell></TableRow>)}</TableBody></Table> : <div className="room-empty-audit"><FileClock /><strong>No admin changes yet</strong><span>The first published change will appear here.</span></div>}</section>
        </TabsContent>
      </Tabs>

      <div className={`room-save-bar ${dirty ? "dirty" : ""}`}><div><strong>{dirty ? `${changedKeys.length} unsaved ${changedKeys.length === 1 ? "change" : "changes"}` : "Settings are up to date"}</strong><span aria-live="polite">{message}</span></div><div><Button variant="outline" disabled={!dirty || saving} onClick={() => { setDraft(saved); setMessage("Unsaved changes were discarded."); }}>Discard</Button><AlertDialog><AlertDialogTrigger asChild><Button disabled={!dirty || saving}><Save /> Review and publish</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Publish these settings globally?</AlertDialogTitle><AlertDialogDescription>All AniQuest users receive these changes after they reload the site.</AlertDialogDescription></AlertDialogHeader><ul className="room-change-list">{changedKeys.map((key) => <li key={key}>{settingLabels[key]}</li>)}</ul><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => void saveSettings()}>Publish globally</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></div>
    </div>
  </main>;
}
