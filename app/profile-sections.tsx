"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const STORAGE_KEY = "aniquest-profile-sections-v2";
const LEGACY_STORAGE_KEY = "aniquest-profile-sections-v1";
export const RELATED_GROUP_KEYS = ["relatedGenus", "relatedFamily", "relatedGroup", "relatedHabitat"] as const;
const DEFAULT_SECTIONS = {
  facts: true,
  details: true,
  photo: true,
  sources: true,
  related: true,
  habitat: true,
  review: true,
  relatedGenus: true,
  relatedFamily: true,
  relatedGroup: true,
  relatedHabitat: true,
};

export type ProfileSectionId = keyof typeof DEFAULT_SECTIONS;
type SectionState = Record<ProfileSectionId, boolean>;

export function restoreProfileSections(saved: unknown, legacy = false): SectionState {
  const next = { ...DEFAULT_SECTIONS };
  // Apply the requested expanded default once when upgrading old preferences.
  if (legacy) return next;
  if (saved && typeof saved === "object" && !Array.isArray(saved)) {
    for (const key of Object.keys(next) as ProfileSectionId[]) {
      const value = (saved as Record<string, unknown>)[key];
      if (typeof value === "boolean") next[key] = value;
    }
  }
  return next;
}

export function useProfileSections() {
  const [sections, setSections] = useState<SectionState>({ ...DEFAULT_SECTIONS });
  const [storageAvailable, setStorageAvailable] = useState(true);
  const current = useRef(sections);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const legacy = stored === null;
      const saved: unknown = JSON.parse(stored ?? window.localStorage.getItem(LEGACY_STORAGE_KEY) ?? "null");
      const next = restoreProfileSections(saved, legacy);
      current.current = next;
      setSections(next);
      if (legacy) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Invalid saved preferences must not prevent profiles from opening.
    }
  }, []);

  function save(next: SectionState) {
    current.current = next;
    setSections(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }

  return {
    sections,
    storageAvailable,
    setSection: (key: ProfileSectionId, open: boolean) => save({ ...current.current, [key]: open }),
    setAll: (open: boolean) => save(Object.fromEntries(Object.keys(DEFAULT_SECTIONS).map(key => [key, open])) as SectionState),
    reset: () => save({ ...DEFAULT_SECTIONS }),
  };
}

export function ProfileSectionControls({ activeSections, controls }: {
  activeSections: ProfileSectionId[];
  controls: ReturnType<typeof useProfileSections>;
}) {
  const expanded = activeSections.filter(key => controls.sections[key]).length;
  const allExpanded = expanded === activeSections.length && RELATED_GROUP_KEYS.every(key => controls.sections[key]);
  return <div className="aq-profile-section-controls" role="group" aria-label="Profile section display">
    <div><strong>Page sections</strong><span role="status" aria-live="polite">{expanded} of {activeSections.length} expanded</span></div>
    <div className="aq-profile-section-actions">
      <Button type="button" variant="outline" disabled={allExpanded} onClick={() => controls.setAll(true)}>Expand all</Button>
      <Button type="button" variant="outline" disabled={expanded === 0} onClick={() => controls.setAll(false)}>Minimise all</Button>
      <Button type="button" variant="ghost" onClick={controls.reset}>Default view</Button>
    </div>
    <p>{controls.storageAvailable ? "Section choices apply to all animal profiles and save on this device." : "Section choices work for this visit. This browser cannot save them."}</p>
  </div>;
}

export function ProfileSection({ title, description, open, onOpenChange, className = "", children }: {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}) {
  const headingId = useId();
  return <Collapsible open={open} onOpenChange={onOpenChange} asChild>
    <section className={`aq-panel aq-profile-section ${className}`} aria-labelledby={headingId}>
      <h2 className="aq-profile-section-heading" id={headingId}>
        <CollapsibleTrigger className="aq-profile-section-trigger" aria-label={`${open ? "Minimise" : "Expand"} ${title}`}>
          <span className="aq-profile-section-label"><span>{title}</span>{description && <small>{description}</small>}</span>
          <span className="aq-profile-section-action">{open ? "Minimise" : "Expand"}<ChevronDown aria-hidden="true" /></span>
        </CollapsibleTrigger>
      </h2>
      <CollapsibleContent forceMount hidden={!open} className="aq-profile-section-content">{children}</CollapsibleContent>
    </section>
  </Collapsible>;
}
