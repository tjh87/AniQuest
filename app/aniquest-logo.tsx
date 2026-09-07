"use client";

import { useId } from "react";

/** Render the original asset on the current surface, without an opaque tile.
 * The SVG is a display mask: it does not rewrite or replace the uploaded image.
 * White lettering and the centre scene stay intact. Wildlife photos never use it.
 */
export function AniQuestLogo({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return <svg className={`aq-logo-image ${className}`} viewBox="0 0 1536 1536" width="148" height="148" role="img" aria-label="AniQuest" focusable="false">
    <defs>
      <filter id={`${id}-paper`} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -8 -8 -8 0 22.6" />
      </filter>
      <clipPath id={`${id}-outline`}>
        <ellipse cx="768" cy="778" rx="706" ry="710" />
        <path d="M0 270L180 230L200 160L400 145L440 195L374 294L381 444L225 650L0 690Z M1200 180L1440 185L1536 430L1536 1435L1300 1475L1160 1300Z M0 470L256 460L330 1375L260 1485L125 1410L0 1380Z" />
      </clipPath>
      <clipPath id={`${id}-interior`}>
        <ellipse cx="768" cy="650" rx="560" ry="490" />
        <path d="M100 1085L160 984L496 955L548 918L641 905L665 943L770 918L880 931L937 977L1262 990L1370 950L1440 989L1450 1258L1400 1290L220 1310L115 1260Z" />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id}-outline)`}>
      <image href="/aniquest-logo.png" width="1536" height="1536" filter={`url(#${id}-paper)`} />
      <image href="/aniquest-logo.png" width="1536" height="1536" clipPath={`url(#${id}-interior)`} />
    </g>
  </svg>;
}
