// Downloads one Wikimedia Commons reference photograph for every AniQuest profile.
// Each image keeps its source, photographer, and licence in app/profile-photos.ts.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import { createServer } from "vite";

const projectRoot = resolve(import.meta.dirname, "..");
const photoDirectory = resolve(projectRoot, "public/wildlife/profiles");
const outputFile = resolve(projectRoot, "app/profile-photos.ts");
const commonsApi = "https://commons.wikimedia.org/w/api.php";
const wikidataApi = "https://www.wikidata.org/w/api.php";
const taxonomySearch = {
  "malayan-horned-frog": "Megophrys nasuta",
};

const existing = {
  "sunda-colugo": {
    src: "/wildlife/sunda-colugo.webp", width: 1200, height: 1500,
    alt: "Sunda colugo gripping a tree trunk in Singapore's Central Catchment Nature Reserve",
    name: "Sunda colugo", location: "Central Catchment, Singapore", date: "18 Jun 2006",
    photographer: "Lip Kee Yap", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Colugo_(Galeopterus_variegatus,_adult_female),_Central_Catchment_Area,_Singapore_-_20060618.jpg",
    position: "38% 20%",
  },
  "oriental-pied-hornbill": {
    src: "/wildlife/oriental-pied-hornbill.webp", width: 900, height: 1800,
    alt: "Oriental pied hornbill with a pale bill and casque at Changi Beach Park, Singapore",
    name: "Oriental pied hornbill", location: "Changi Beach Park, Singapore", date: "22 Jan 2019",
    photographer: "JJ Harrison", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Anthracoceros_albirostris_-_Changi_Beach_Park.jpg",
    position: "50% 17%",
  },
  "smooth-coated-otter": {
    src: "/wildlife/smooth-coated-otter.webp", width: 1600, height: 1067,
    alt: "Two smooth-coated otters in water at Jurong Eco Garden, Singapore; one is eating a fish",
    name: "Smooth-coated otter", location: "Jurong Eco Garden, Singapore", date: "2 Jul 2019",
    photographer: "JJ Harrison", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lutrogale_perspicillata_-_Jurong_Eco_Garden.jpg",
    position: "50% 50%",
  },
};

function cleanMetadata(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/&(?:quot|amp|lt|gt);/g, (entity) => ({ "&quot;": '"', "&amp;": "&", "&lt;": "<", "&gt;": ">" })[entity]).replace(/\s+/g, " ").trim();
}

async function json(url, params) {
  const requestUrl = `${url}?${new URLSearchParams({ format: "json", formatversion: "2", origin: "*", ...params })}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(requestUrl, { headers: { "User-Agent": "AniQuest local reference-photo preparer/1.0" } });
    if (response.ok) return response.json();
    if (response.status !== 429 || attempt === 3) throw new Error(`Request failed: ${response.status}`);
    const retrySeconds = Number(response.headers.get("retry-after")) || 5;
    await new Promise((resolve) => setTimeout(resolve, retrySeconds * 1000));
  }
  throw new Error("Request did not complete");
}

async function getPhoto(scientific, animal) {
  const taxon = taxonomySearch[animal.id] ?? scientific;
  const search = await json(wikidataApi, { action: "wbsearchentities", search: taxon, language: "en", type: "item", limit: "8" });
  const match = search.search.find((item) => item.label?.toLowerCase() === taxon.toLowerCase()) ?? search.search[0];
  let info;
  if (match) {
    const entity = await json(wikidataApi, { action: "wbgetentities", ids: match.id, props: "claims" });
    const filename = entity.entities[match.id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    if (filename) {
      const image = await json(commonsApi, { action: "query", prop: "imageinfo", titles: `File:${filename}`, iiprop: "url|extmetadata", iiurlwidth: "1200" });
      info = image.query.pages.find((page) => page.imageinfo?.[0])?.imageinfo?.[0];
    }
  }
  if (!info) {
    const image = await json(commonsApi, { action: "query", generator: "search", gsrnamespace: "6", gsrlimit: "10", gsrsearch: taxon, prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "1200" });
    info = image.query?.pages?.find((page) => page.imageinfo?.[0])?.imageinfo?.[0];
  }
  if (!info?.thumburl) {
    try {
      return await getINaturalistPhoto(taxon, animal);
    } catch {
      return getGBIFPhoto(taxon, animal);
    }
  }
  const bytes = Buffer.from(await (await fetch(info.thumburl, { headers: { "User-Agent": "AniQuest local reference-photo preparer/1.0" } })).arrayBuffer());
  const target = resolve(photoDirectory, `${animal.id}.webp`);
  const result = await sharp(bytes).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86 }).toFile(target);
  const metadata = info.extmetadata ?? {};
  return {
    src: `/wildlife/profiles/${animal.id}.webp`, width: result.width, height: result.height,
    alt: `Reference photograph of ${animal.name}`,
    name: animal.name, location: "Wikimedia Commons reference photograph",
    photographer: cleanMetadata(metadata.Artist?.value) || "Wikimedia Commons contributor",
    license: cleanMetadata(metadata.LicenseShortName?.value) || "Licence shown on source page",
    licenseUrl: metadata.LicenseUrl?.value || info.descriptionurl,
    sourceUrl: info.descriptionurl,
    position: "50% 50%",
  };
}

async function getINaturalistPhoto(taxon, animal) {
  const response = await fetch(`https://api.inaturalist.org/v1/observations?${new URLSearchParams({ taxon_name: taxon, photos: "true", photo_license: "CC0,CC-BY,CC-BY-SA", per_page: "30", order: "desc", order_by: "created_at" })}`, { headers: { "User-Agent": "AniQuest local reference-photo preparer/1.0" } });
  if (!response.ok) throw new Error(`iNaturalist request failed: ${response.status}`);
  const result = await response.json();
  const openLicences = new Set(["CC0", "CC-BY", "CC-BY-SA"]);
  const observation = result.results.find((item) => item.taxon?.name?.toLowerCase() === taxon.toLowerCase() && item.photos?.some((photo) => openLicences.has(photo.license_code)));
  const image = observation?.photos.find((photo) => openLicences.has(photo.license_code));
  if (!image?.medium_url || !image.id) throw new Error(`No open reference photograph for ${taxon}`);
  const target = resolve(photoDirectory, `${animal.id}.webp`);
  const bytes = Buffer.from(await (await fetch(image.medium_url, { headers: { "User-Agent": "AniQuest local reference-photo preparer/1.0" } })).arrayBuffer());
  const resized = await sharp(bytes).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86 }).toFile(target);
  const license = image.license_code;
  return {
    src: `/wildlife/profiles/${animal.id}.webp`, width: resized.width, height: resized.height,
    alt: `Reference photograph of ${animal.name}`,
    name: animal.name, location: "iNaturalist reference photograph",
    photographer: cleanMetadata(image.attribution) || "iNaturalist contributor",
    license,
    licenseUrl: license === "CC0" ? "https://creativecommons.org/publicdomain/zero/1.0/" : `https://creativecommons.org/licenses/${license.replace(/^CC-/, "").toLowerCase()}/4.0/`,
    sourceUrl: `https://www.inaturalist.org/photos/${image.id}`,
    position: "50% 50%",
  };
}

function openGbifLicence(url = "") {
  return /creativecommons\.org\/(?:licenses\/(?:by|by-sa)\/|publicdomain\/zero\/)/i.test(url);
}

async function getGBIFPhoto(taxon, animal) {
  const response = await fetch(`https://api.gbif.org/v1/occurrence/search?${new URLSearchParams({ scientificName: taxon, mediaType: "StillImage", limit: "100" })}`, { headers: { "User-Agent": "AniQuest local reference-photo preparer/1.0" } });
  if (!response.ok) throw new Error(`GBIF request failed: ${response.status}`);
  const result = await response.json();
  const record = result.results.find((item) => item.species?.toLowerCase() === taxon.toLowerCase() && item.media?.some((media) => media.identifier && openGbifLicence(media.license || item.license)));
  const image = record?.media.find((media) => media.identifier && openGbifLicence(media.license || record.license));
  if (!record || !image) throw new Error(`No open reference photograph for ${taxon}`);
  const target = resolve(photoDirectory, `${animal.id}.webp`);
  const bytes = Buffer.from(await (await fetch(image.identifier, { headers: { "User-Agent": "AniQuest local reference-photo preparer/1.0" } })).arrayBuffer());
  const resized = await sharp(bytes).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86 }).toFile(target);
  const licenseUrl = image.license || record.license;
  return {
    src: `/wildlife/profiles/${animal.id}.webp`, width: resized.width, height: resized.height,
    alt: `Reference photograph of ${animal.name}`,
    name: animal.name, location: "GBIF occurrence reference photograph",
    photographer: cleanMetadata(image.creator || record.recordedBy) || "GBIF contributor",
    license: /publicdomain\/zero/i.test(licenseUrl) ? "CC0" : /by-sa/i.test(licenseUrl) ? "CC BY-SA" : "CC BY",
    licenseUrl,
    sourceUrl: `https://www.gbif.org/occurrence/${record.key}`,
    position: "50% 50%",
  };
}

function asModule(records) {
  return `/** Real reference photographs. Source and licence data are retained for every file. */\nexport type WildlifePhotoRecord = { src: string; width: number; height: number; alt: string; name: string; location: string; date?: string; photographer: string; license: string; licenseUrl: string; sourceUrl: string; position: string };\n\nexport const PROFILE_PHOTOS: Record<string, WildlifePhotoRecord> = ${JSON.stringify(records, null, 2)};\n`;
}

async function priorRecords() {
  try {
    const source = await readFile(outputFile, "utf8");
    const json = source.match(/export const PROFILE_PHOTOS: Record<string, WildlifePhotoRecord> = (\{[\s\S]*\});\s*$/)?.[1];
    return json ? JSON.parse(json) : {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

const vite = await createServer({ appType: "custom", configFile: false, root: projectRoot, server: { middlewareMode: true, hmr: false } });
try {
  const { SINGAPORE_SPECIES } = await vite.ssrLoadModule("/app/species-data.ts");
  await mkdir(photoDirectory, { recursive: true });
  const records = { ...await priorRecords() };
  const failures = [];
  for (const animal of SINGAPORE_SPECIES) {
    try {
      if (records[animal.id]) {
        console.log(`Kept ${animal.id}`);
        continue;
      }
      records[animal.id] = existing[animal.id] ?? await getPhoto(animal.scientific, animal);
      console.log(`Prepared ${animal.id}`);
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } catch (error) {
      failures.push(`${animal.id}: ${error.message}`);
      console.error(`Could not prepare ${animal.id}: ${error.message}`);
    }
  }
  await writeFile(outputFile, asModule(records));
  if (failures.length) process.exitCode = 1;
} finally {
  await vite.close();
}
