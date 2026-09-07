/** Real photographs. Each profile file keeps a visible source and licence link. */
import { PROFILE_PHOTOS, type WildlifePhotoRecord } from "./profile-photos";

export const WILDLIFE_PHOTOS: Record<string, WildlifePhotoRecord> = {
  colugo: PROFILE_PHOTOS["sunda-colugo"],
  hornbill: PROFILE_PHOTOS["oriental-pied-hornbill"],
  otter: PROFILE_PHOTOS["smooth-coated-otter"],
  ...PROFILE_PHOTOS,
};

export function profilePhotoFor(speciesId: string) {
  return PROFILE_PHOTOS[speciesId];
}

export function WildlifePhoto({ animal, priority = false, className = "" }: { animal: string; priority?: boolean; className?: string }) {
  const photo = WILDLIFE_PHOTOS[animal];
  if (!photo) return null;
  return <figure className={`aq-photo aq-photo-${animal} ${className}`}>
    <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading={priority ? "eager" : "lazy"} decoding="async" style={{ objectPosition: photo.position }} />
    <figcaption>
      <span>{photo.name} · {photo.location}{photo.date ? ` · ${photo.date}` : ""}</span>
      <span><a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">Photo: {photo.photographer}</a>{photo.license && photo.licenseUrl ? <> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a></> : " · Bird Society account"}</span>
    </figcaption>
  </figure>;
}
