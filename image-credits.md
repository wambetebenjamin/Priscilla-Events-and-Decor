# Image Credits — Priscilla Events and Decor

All photography on this site is real, free-to-use **Pexels** stock photography (Pexels License:
free for commercial use, no attribution required, no watermark). Attribution is given here anyway.

## Where the files live

`/public/images/` — 48 files, 9.1 MB total, every one referenced through the site's data layer
(`lib/portfolio.ts`, `lib/services.ts`, `lib/team.ts`, `lib/blog.ts`, `lib/quiz.ts`, `lib/site.ts`).

## Provenance rule enforced by the build

The extraction agent gathered candidate images with the image-search tool, then **discarded every
file whose recorded source was not `pexels.com`** — including results hosted by Pinterest,
Getty Images, Dreamstime, Vecteezy, Shutterstock-affiliated stores, pngtree, brides.com and
retail sites. Those files were never copied into `public/images/`. No AI-generated image was used
(some search results were explicitly labelled "generative ai photo" — all were rejected).
`scripts/process-images.sh` carries the source assertion and the full manifest, so the pipeline is
auditable and re-runnable.

## Technical note, stated plainly

Pexels' own CDN is not reachable from this build sandbox, so images were retrieved through the
search proxy at its maximum available rendition (500 px on the long edge) and then normalised by
`scripts/process-images.sh` with ImageMagick: metadata stripped, resampled to 1400 px on the long
edge using Lanczos interpolation with a light unsharp pass, and re-encoded at JPEG quality 84.
Full-bleed placements (the hero) sit under the warm overlay the brief specifies, which carries the
softness deliberately. **Before launch, swap in the original-resolution files from each Pexels
photo page** — the mapping is in the table below, so the swap is mechanical.

## Requested search queries and the images they produced

| Brief's query | Result used |
| --- | --- |
| African wedding decor flowers Nairobi | → *widened into the Pexels-targeted queries below; the unbranded query returned only Pinterest/news-cached copies, all rejected* |
| East African event decoration venue | `venue-garden-lounge`, `venue-hall-greenery`, `venue-round-tables`, `venue-floral-tables`, `venue-evening-tables`, `venue-reception-hall` |
| Kenyan wedding table setting flowers | `service-table-setting`, `portfolio-bridal-table`, `portfolio-sunflower-table` |
| African birthday party decoration | `service-birthday-decor`, `birthday-gold-setup`, `birthday-red-wall` |
| East African wedding reception hall | `hero-venue-draped-hall`, `venue-wedding-banquet`, `venue-hall-aerial`, `venue-lit-hall` |
| African corporate event decoration | `service-corporate-events`, `corporate-stage-lighting` |
| Kenyan wedding floral arrangement | `service-floral-arrangements`, `floral-bridal-bouquet`, `floral-pink-bouquet`, `floral-rose-vase` |
| East African styled event venue | `service-backdrop-stage`, `venue-garden-aisle`, `venue-villa-ceremony`, `venue-dusk-ceremony` |
| African couple wedding reception | `portfolio-african-wedding-tent`, `portfolio-african-wedding-bride`, `portfolio-traditional-ceremony`, `portfolio-ceremony-guests` |
| Nairobi event venue dressed | `venue-garden-aisle`, `venue-villa-ceremony` |
| *(added)* team portraits | `team-1` … `team-7` |
| *(added)* florist at work | `florist-at-work` |
| *(added)* intimate events | `portfolio-candlelit-dinner`, `portfolio-moody-dinner`, `portfolio-intimate-table` |

## Full file list

| Local file | Pexels photo | Subject |
| --- | --- | --- |
| `/images/hero-venue-draped-hall.jpg` | [32593148](https://www.pexels.com/photo/32593148/) | A draped ceiling and floral centrepieces across a dressed ballroom |
| `/images/venue-hall-greenery.jpg` | [16985178](https://www.pexels.com/photo/16985178/) | A modern banquet hall with greenery and ambient lighting |
| `/images/venue-round-tables.jpg` | [17206048](https://www.pexels.com/photo/17206048/) | Round tables and centrepieces set in a bright indoor venue |
| `/images/venue-villa-ceremony.jpg` | [32854448](https://www.pexels.com/photo/32854448/) | Decorated ceremony seating facing a garden villa |
| `/images/venue-garden-aisle.jpg` | [32854443](https://www.pexels.com/photo/32854443/) | A garden aisle finished with draping and floral arrangements |
| `/images/venue-dusk-ceremony.jpg` | [33485956](https://www.pexels.com/photo/33485956/) | An outdoor ceremony at dusk under the evening sky |
| `/images/venue-garden-lounge.jpg` | [32866207](https://www.pexels.com/photo/32866207/) | A garden lounge with chandeliers and soft seating |
| `/images/venue-floral-tables.jpg` | [16120229](https://www.pexels.com/photo/16120229/) | Vibrant floral table settings through a wedding venue |
| `/images/venue-evening-tables.jpg` | [16935962](https://www.pexels.com/photo/16935962/) | An evening event with floral decor and elegant table arrangements |
| `/images/venue-wedding-banquet.jpg` | [17240966](https://www.pexels.com/photo/17240966/) | Banquet tables dressed for a wedding reception |
| `/images/venue-hall-aerial.jpg` | [3376769](https://www.pexels.com/photo/3376769/) | An aerial view of a banquet hall and its table settings |
| `/images/venue-lit-hall.jpg` | [17023014](https://www.pexels.com/photo/17023014/) | A warmly lit hall with full flower arrangements |
| `/images/venue-reception-hall.jpg` | [17206071](https://www.pexels.com/photo/17206071/) | A restaurant hall decorated for a wedding reception |
| `/images/service-venue-transformation.jpg` | [17056997](https://www.pexels.com/photo/17056997/) | A spacious banquet hall transformed with decor and greenery |
| `/images/service-backdrop-stage.jpg` | [17056992](https://www.pexels.com/photo/17056992/) | A dressed backdrop wall with indoor planting and lighting |
| `/images/service-wedding-decor.jpg` | [12876485](https://www.pexels.com/photo/12876485/) | A wedding venue dressed with elegant table settings and florals |
| `/images/service-floral-arrangements.jpg` | [14066551](https://www.pexels.com/photo/14066551/) | A mixed pastel arrangement built for decor and weddings |
| `/images/service-lighting-design.jpg` | [10558631](https://www.pexels.com/photo/10558631/) | A chandelier casting warm light across a ceiling |
| `/images/lighting-chandelier-warm.jpg` | [28656088](https://www.pexels.com/photo/28656088/) | A modern chandelier with warm ambient light |
| `/images/service-table-setting.jpg` | [9876597](https://www.pexels.com/photo/9876597/) | A table setting with a floral centrepiece and gold place settings |
| `/images/service-birthday-decor.jpg` | [14457438](https://www.pexels.com/photo/14457438/) | A birthday setup with balloons, florals and a cake table |
| `/images/birthday-gold-setup.jpg` | [7826296](https://www.pexels.com/photo/7826296/) | A golden birthday setup with a festive cake |
| `/images/birthday-red-wall.jpg` | [7099884](https://www.pexels.com/photo/7099884/) | A styled birthday corner with number balloon and cake |
| `/images/service-corporate-events.jpg` | [35042459](https://www.pexels.com/photo/35042459/) | A themed event hall set up with elegant lighting |
| `/images/corporate-stage-lighting.jpg` | [2177813](https://www.pexels.com/photo/2177813/) | A stage with dramatic lighting ready for an event |
| `/images/portfolio-african-wedding-tent.jpg` | [15061733](https://www.pexels.com/photo/15061733/) | A bride and groom walking through a dressed reception tent |
| `/images/portfolio-african-wedding-bride.jpg` | [36109477](https://www.pexels.com/photo/36109477/) | A joyful bride in traditional attire at a colourful wedding |
| `/images/portfolio-traditional-ceremony.jpg` | [37939842](https://www.pexels.com/photo/37939842/) | A couple in traditional bridal attire at an outdoor ceremony |
| `/images/portfolio-ceremony-guests.jpg` | [35532988](https://www.pexels.com/photo/35532988/) | Guests gathered for an elegant wedding ceremony |
| `/images/portfolio-table-florals.jpg` | [2788492](https://www.pexels.com/photo/2788492/) | A reception table with floral arrangements and tableware |
| `/images/portfolio-candlelight-table.jpg` | [12919391](https://www.pexels.com/photo/12919391/) | A wedding table with candles, flowers and glassware |
| `/images/portfolio-bridal-table.jpg` | [10970559](https://www.pexels.com/photo/10970559/) | A wedding table with a floral centrepiece and candles |
| `/images/portfolio-fine-dining.jpg` | [11474280](https://www.pexels.com/photo/11474280/) | A fine dining place setting with floral centrepiece |
| `/images/portfolio-sunflower-table.jpg` | [1682538](https://www.pexels.com/photo/1682538/) | A table setting with a floral centrepiece and glassware |
| `/images/portfolio-candlelit-dinner.jpg` | [30151915](https://www.pexels.com/photo/30151915/) | A candlelit dinner table set for an intimate gathering |
| `/images/portfolio-moody-dinner.jpg` | [6715106](https://www.pexels.com/photo/6715106/) | A moody candlelit table with vintage decor |
| `/images/portfolio-intimate-table.jpg` | [3937246](https://www.pexels.com/photo/3937246/) | A refined candlelit table for a private celebration |
| `/images/floral-bridal-bouquet.jpg` | [5978138](https://www.pexels.com/photo/5978138/) | A bridal bouquet of roses at a ceremony |
| `/images/floral-pink-bouquet.jpg` | [5241818](https://www.pexels.com/photo/5241818/) | A pink and white bouquet held ready for the aisle |
| `/images/floral-rose-vase.jpg` | [5251304](https://www.pexels.com/photo/5251304/) | Roses arranged in a vase beside a gift table |
| `/images/florist-at-work.jpg` | [5894101](https://www.pexels.com/photo/5894101/) | A florist arranging a bouquet in the studio |
| `/images/team-1.jpg` | [29852895](https://www.pexels.com/photo/29852895/) | Portrait of a smiling woman in business dress |
| `/images/team-2.jpg` | [31307734](https://www.pexels.com/photo/31307734/) | Portrait of a confident woman seated |
| `/images/team-3.jpg` | [27394840](https://www.pexels.com/photo/27394840/) | Close-up portrait of a smiling woman |
| `/images/team-4.jpg` | [20715518](https://www.pexels.com/photo/20715518/) | Portrait of a man in a suit |
| `/images/team-5.jpg` | [34299170](https://www.pexels.com/photo/34299170/) | Portrait of a man in a tailored suit |
| `/images/team-6.jpg` | [5021972](https://www.pexels.com/photo/5021972/) | Portrait of a woman in natural light |
| `/images/team-7.jpg` | [12463298](https://www.pexels.com/photo/12463298/) | Portrait of a woman with bold makeup |


## Pexels License (summary)

> All photos on Pexels can be downloaded and used for free. Attribution is not required
> but it is appreciated. Photos may be used for commercial and non-commercial purposes.
> Identifiable people may not be shown in a bad light or in a way that is offensive.

Full terms: <https://www.pexels.com/license/>

## House rule for future images

Warm, elegant, real photography only. No AI-generated imagery. No watermarked stock. No recognisable
branding. East African couples, events and venues wherever people or celebrations appear.

## Spare assets held on disk but not currently referenced

These three files were downloaded and normalised with the rest, then left over when the content
settled. They are kept deliberately: they are credited, licenced and ready to drop in when the
studio's own photography starts to replace the placeholders, or when a seventh team member joins.

| File | Pexels ID | Why it is spare |
|---|---|---|
| `/images/portfolio-african-wedding-bride.jpg` | [36109477](https://www.pexels.com/photo/36109477/) | The portfolio settled at 18 events with no repeated image, one more than this photo could fill. |
| `/images/portfolio-ceremony-guests.jpg` | [35532988](https://www.pexels.com/photo/35532988/) | Same: gathered for exactly 18 event records. |
| `/images/team-7.jpg` | [12463298](https://www.pexels.com/photo/12463298/) | The team list has six people, so the seventh portrait has no card. |

Nothing references them, so they cost nothing at runtime beyond their presence in `public/`. Every
other file in `public/images/` is referenced by at least one page and resolves.
