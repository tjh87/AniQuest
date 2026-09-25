"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Expand } from "lucide-react";
import type PhotoSwipe from "photoswipe";
/** Real photographs. Each profile file keeps a visible source and licence link. */
import { PROFILE_PHOTOS, type WildlifePhotoRecord } from "./profile-photos";
import { isBundledPhoto, useOfflineEdition } from "./offline-context";

export const WILDLIFE_PHOTOS: Record<string, WildlifePhotoRecord> = {
  colugo: PROFILE_PHOTOS["sunda-colugo"],
  hornbill: PROFILE_PHOTOS["oriental-pied-hornbill"],
  otter: PROFILE_PHOTOS["smooth-coated-otter"],
  ...PROFILE_PHOTOS,
};

export function profilePhotoFor(speciesId: string) {
  return PROFILE_PHOTOS[speciesId];
}

export function WildlifePhoto({ animal, priority = false, className = "", zoomable = false }: { animal: string; priority?: boolean; className?: string; zoomable?: boolean }) {
  const photo = WILDLIFE_PHOTOS[animal];
  if (!photo) return null;
  return <WildlifePhotoFrame key={photo.src} photo={photo} animal={animal} priority={priority} className={className} zoomable={zoomable} />;
}

function WildlifePhotoFrame({ photo, animal, priority, className, zoomable }: {
  photo: WildlifePhotoRecord; animal: string; priority: boolean; className: string; zoomable: boolean;
}) {
  const viewer = useRef<PhotoSwipe | null>(null);
  const request = useRef(0);
  const [loading, setLoading] = useState(false);
  const [viewerFailed, setViewerFailed] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const externalPhoto = useOfflineEdition() && !isBundledPhoto(photo.src);

  useEffect(() => () => {
    request.current += 1;
    viewer.current?.destroy();
  }, []);

  async function openPhoto(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const trigger = event.currentTarget;
    const image = trigger.querySelector("img");
    // The native image link remains available before loading or if JavaScript fails.
    if (!image?.naturalWidth || !image.naturalHeight) return;
    event.preventDefault();
    if (loading || viewer.current) return;
    const currentRequest = ++request.current;
    setLoading(true);
    setViewerFailed(false);
    try {
      const { openPhotoViewer } = await import("./photo-viewer");
      if (currentRequest !== request.current) return;
      viewer.current = openPhotoViewer(photo, image, trigger);
      viewer.current.on("destroy", () => { viewer.current = null; });
    } catch (error) {
      console.error("Photo viewer could not open", error);
      if (currentRequest === request.current) setViewerFailed(true);
    } finally {
      if (currentRequest === request.current) setLoading(false);
    }
  }

  const image = <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading={priority ? "eager" : "lazy"} decoding="async" onError={() => setPhotoFailed(true)} style={{ objectPosition: photo.position }} />;
  return <figure className={`aq-photo aq-photo-${animal} ${className}`}>
    {externalPhoto ? <div className="aq-photo-unavailable"><strong>Photo source online</strong><span>This photo is not in the offline package. Open its source when connected.</span></div>
      : photoFailed ? <div className="aq-photo-unavailable"><strong>Photo unavailable</strong><span>Use the photo source below.</span></div>
      : zoomable ? <a className="aq-photo-open" href={photo.src} target="_blank" rel="noopener noreferrer" aria-haspopup="dialog" aria-label={`Open photograph: ${photo.name}`} aria-busy={loading} onClick={openPhoto}>
        {image}<span className="aq-photo-open-label"><Expand aria-hidden="true" />{loading ? "Opening photograph…" : "View larger"}</span>
      </a> : image}
    {viewerFailed && <p className="aq-photo-error" role="status">The viewer could not open. <a href={photo.src} target="_blank" rel="noopener noreferrer">Open the original image</a>.</p>}
    <figcaption>
      <span>{photo.name} · {photo.location}{photo.date ? ` · ${photo.date}` : ""}</span>
      <span><a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">Photo: {photo.photographer}</a>{photo.license && photo.licenseUrl ? <> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a></> : " · Source page"}</span>
    </figcaption>
  </figure>;
}
