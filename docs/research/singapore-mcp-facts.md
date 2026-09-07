# Singapore habitat facts

Retrieved on 7 September 2026 with the installed `@olano/mcp-singapore` 0.4.1 server over MCP stdio.
Tool: `datagov_get_dataset_metadata`. Publisher: National Parks Board. Portal: data.gov.sg.

| Dataset | Evidence used | Source dates |
| --- | --- | --- |
| d_dfd037f5064cb2e2b2e358ceeccb4af7 | Description explicitly states four nature reserves. Do not count land parcels as reserves. | Gazette 2005; coverage May 2018; metadata updated 22 August 2026 |
| d_af948e3f29cd12bc8b0caea19ae68286 | Description explains layered planting and movement of birds and butterflies between green spaces. | Coverage October 2025; metadata updated 22 August 2026 |
| d_18bcfe0a1b8c77f9b4493cef72ffd717 | Description identifies satellite imagery, bathymetry and expert ground knowledge as map inputs. | Map title specifies 2018; metadata updated 18 March 2026 |

The marine dataset reports coverage beginning November 2025 despite its 2018 map title. Preserve the map edition separately.
These metadata records contain no species population estimates. Profile placement provides habitat context only.
The `singapore_dataset_search` query for `species` scanned 100 pages and 1,000 records without a match.
That search was incomplete: the catalogue reported 462 pages. It does not establish that species datasets are absent.

The site stores these facts locally. It does not call MCP when a visitor opens a profile.
