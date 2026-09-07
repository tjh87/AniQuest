import type { ProfileSource } from "./species-profiles";

// Publication years and actual assessment dates are distinct. See docs/research/global-assessment-review.json.
export const ASSESSMENT_UPDATES: Record<string, { globalStatus: string; globalSourceUrl: string; globalReviewedAt: string; globalAssessmentNote: string; globalAssessedAt?: string; assessmentSources: ProfileSource[] }> = {
  "Macaca fascicularis": {
    "globalStatus": "Endangered · 2025",
    "globalSourceUrl": "https://www.iucnredlist.org/species/12551/273015436",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2025. The exact assessment date was not recovered. Global Endangered and Singapore Least Concern describe different geographic populations.",
    "assessmentSources": [
      {
        "name": "Aarhus University · 2025 macaque assessment",
        "url": "https://aias.au.dk/events/show/artikel/research-contributes-to-updating-the-iucn-red-list-for-the-long-tailed-macaque",
        "supports": "Aarhus University announcement for lead assessor Malene Friis Hansen, published 10 October 2025, explicitly describes the new 2025 IUCN assessment as Endangered and links exact IUCN assessment 12551/273015436."
      }
    ]
  },
  "Acridotheres javanicus": {
    "globalStatus": "Vulnerable · 2020",
    "globalSourceUrl": "https://datazone.birdlife.org/species/factsheet/javan-myna-acridotheres-javanicus",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2020. Vulnerable in its global native range; introduced in Singapore, where the national assessment is Not Applicable.",
    "assessmentSources": []
  },
  "Corvus splendens": {
    "globalStatus": "Least Concern · 2018",
    "globalSourceUrl": "https://doi.org/10.2305/IUCN.UK.2018-2.RLTS.T22705938A131944731.en",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2018. Singapore origin follows NParks, which lists the house crow as introduced.",
    "globalAssessedAt": "2018-08-09",
    "assessmentSources": [
      {
        "name": "Global assessment · supporting reference",
        "url": "https://datazone.birdlife.org/species/factsheet/house-crow-corvus-splendens",
        "supports": "BirdLife indexed factsheet independently displays Least Concern."
      }
    ]
  },
  "Eudynamys scolopaceus": {
    "globalStatus": "Least Concern · 2016",
    "globalSourceUrl": "https://datazone.birdlife.org/species/factsheet/western-koel-eudynamys-scolopaceus",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2016. BirdLife uses the common name Western Koel for this scientific species; the Singapore guide uses Asian koel.",
    "assessmentSources": []
  },
  "Oriolus chinensis": {
    "globalStatus": "Least Concern · 2018",
    "globalSourceUrl": "https://datazone.birdlife.org/species/factsheet/black-naped-oriole-oriolus-chinensis",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2018. Category and publication year are recorded in the BirdLife factsheet.",
    "assessmentSources": []
  },
  "Todiramphus chloris": {
    "globalStatus": "Least Concern · 2024",
    "globalSourceUrl": "https://datazone.birdlife.org/species/factsheet/collared-kingfisher-todiramphus-chloris",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2024. This replaces the older 2016 assessment commonly cited online.",
    "assessmentSources": []
  },
  "Gallus gallus": {
    "globalStatus": "Least Concern · 2024",
    "globalSourceUrl": "https://datazone.birdlife.org/species/factsheet/red-junglefowl-gallus-gallus",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2024. Singapore’s Near Threatened category applies to the wild species; domestic and hybrid birds complicate identification.",
    "assessmentSources": [
      {
        "name": "Global assessment · supporting reference",
        "url": "https://www.allaboutbirds.org/guide/Red_Junglefowl/lifehistory",
        "supports": "Cornell Lab cites BirdLife International 2024 and exact DOI 10.2305/IUCN.UK.2024-2.RLTS.T22679199A263732457.en."
      }
    ]
  },
  "Varanus salvator": {
    "globalStatus": "Least Concern · 2021",
    "globalSourceUrl": "https://doi.org/10.2305/IUCN.UK.2021-2.RLTS.T178214A113138439.en",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2021, assessed in 2018. This assessment covers Varanus salvator, not every species formerly grouped as water monitors.",
    "globalAssessedAt": "2018-05-08",
    "assessmentSources": [
      {
        "name": "Global assessment · supporting reference",
        "url": "https://www.researchgate.net/publication/354381307_Varanus_salvator_The_IUCN_Red_List_of_Threatened_Species_2021",
        "supports": "Original IUCN assessment identifies exact taxon, LC ver 3.1, publication 2021, assessment date 8 May 2018. Report discusses elevated former subspecies and retains V. salvator as polytypic."
      }
    ]
  },
  "Malayopython reticulatus": {
    "globalStatus": "Least Concern · 2018",
    "globalSourceUrl": "https://doi.org/10.2305/IUCN.UK.2018-2.RLTS.T183151A1730027.en",
    "globalReviewedAt": "2026-09-06",
    "globalAssessmentNote": "Published in 2018, assessed in 2011. The assessment uses Python reticulatus and lists Malayopython reticulatus as a synonym.",
    "globalAssessedAt": "2011-09-02",
    "assessmentSources": [
      {
        "name": "Global assessment · supporting reference",
        "url": "https://www.researchgate.net/publication/354528580_Malayopython_reticulatus_The_IUCN_Red_List_of_Threatened_Species2018",
        "supports": "Original IUCN report uses Python reticulatus and explicitly lists Malayopython reticulatus as synonym; gives LC ver 3.1, published 2018, assessed 2 September 2011."
      }
    ]
  }
};
