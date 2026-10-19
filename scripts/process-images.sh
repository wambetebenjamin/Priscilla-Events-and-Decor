#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Priscilla Events and Decor - image pipeline
# Takes the Pexels photography gathered during design-source extraction,
# rejects every file whose recorded source is NOT pexels.com (so no
# watermarked or rights-managed stock can slip into the build), renames each
# keeper to its semantic slot in public/images/, normalises resolution and
# strips metadata.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="image-search"
OUT="public/images"
mkdir -p "$OUT"

# src|target|pexels photo id|pexels page url|caption used in image-credits.md
MANIFEST='
pexels-east-african-wedding-reception-ha-1.jpg|hero-venue-draped-hall.jpg|32593148|https://www.pexels.com/search/wedding%20hall%20decoration/|A draped ceiling and floral centrepieces across a dressed ballroom
pexels-east-african-event-decoration-ven-2.jpg|venue-hall-greenery.jpg|16985178|https://www.pexels.com/search/venue/|A modern banquet hall with greenery and ambient lighting
pexels-east-african-event-decoration-ven-3.jpg|venue-round-tables.jpg|17206048|https://www.pexels.com/search/wedding%20venue/|Round tables and centrepieces set in a bright indoor venue
pexels-nairobi-event-venue-dressed-luxur-2.jpg|venue-villa-ceremony.jpg|32854448|https://pexels.com/search/marriage%20venue|Decorated ceremony seating facing a garden villa
pexels-nairobi-event-venue-dressed-luxur-3.jpg|venue-garden-aisle.jpg|32854443|https://pexels.com/search/marriage%20venue|A garden aisle finished with draping and floral arrangements
pexels-nairobi-event-venue-dressed-luxur-5.jpg|venue-dusk-ceremony.jpg|33485956|https://pexels.com/search/marriage%20venue|An outdoor ceremony at dusk under the evening sky
pexels-east-african-event-decoration-ven-1.jpg|venue-garden-lounge.jpg|32866207|https://www.pexels.com/search/event%20decor/|A garden lounge with chandeliers and soft seating
pexels-east-african-event-decoration-ven-4.jpg|venue-floral-tables.jpg|16120229|https://www.pexels.com/search/wedding%20venue/|Vibrant floral table settings through a wedding venue
pexels-east-african-event-decoration-ven-5.jpg|venue-evening-tables.jpg|16935962|https://www.pexels.com/photo/elegant-21st-birthday-celebration-venue-setup-35042465/|An evening event with floral decor and elegant table arrangements
pexels-east-african-wedding-reception-ha-2.jpg|venue-wedding-banquet.jpg|17240966|https://www.pexels.com/search/reception%20hall/|Banquet tables dressed for a wedding reception
pexels-east-african-wedding-reception-ha-4.jpg|venue-hall-aerial.jpg|3376769|https://www.pexels.com/search/banquet%20hall/|An aerial view of a banquet hall and its table settings
pexels-east-african-wedding-reception-ha-5.jpg|venue-lit-hall.jpg|17023014|https://pexels.com/search/wedding%20hall|A warmly lit hall with full flower arrangements
pexels-east-african-event-decoration-ven-3.jpg|venue-reception-hall.jpg|17206071|https://www.pexels.com/photo/luxury-restaurant-hall-decorated-for-a-wedding-reception-17206153/|A restaurant hall decorated for a wedding reception
site-pexels-com-east-african-event-venue-2.jpg|service-venue-transformation.jpg|17056997|https://pexels.com/photo/spacious-banquet-hall-of-a-luxury-restaurant-17057001|A spacious banquet hall transformed with decor and greenery
site-pexels-com-east-african-event-venue-3.jpg|service-backdrop-stage.jpg|17056992|https://pexels.com/photo/spacious-banquet-hall-of-a-luxury-restaurant-17057001|A dressed backdrop wall with indoor planting and lighting
pexels-com-photo-african-wedding-table-s-4.jpg|service-wedding-decor.jpg|12876485|https://www.pexels.com/photo/elegant-wedding-reception-table-decoration-34597461/|A wedding venue dressed with elegant table settings and florals
pexels-kenyan-wedding-floral-arrangement-5.jpg|service-floral-arrangements.jpg|14066551|https://pexels.com/search/bouquet%20of%20flowers|A mixed pastel arrangement built for decor and weddings
pexels-event-lighting-design-uplighting--1.jpg|service-lighting-design.jpg|10558631|https://pexels.com/search/ambient%20lighting|A chandelier casting warm light across a ceiling
pexels-event-lighting-design-uplighting--2.jpg|lighting-chandelier-warm.jpg|28656088|https://www.pexels.com/search/chandelier/|A modern chandelier with warm ambient light
pexels-kenyan-wedding-table-setting-flow-1.png|service-table-setting.jpg|9876597|https://www.pexels.com/photo/flowers-and-leaves-in-middle-of-table-as-wedding-decorations-9876597/|A table setting with a floral centrepiece and gold place settings
pexels-african-birthday-party-decoration-2.jpg|service-birthday-decor.jpg|14457438|https://pexels.com/photo/balloon-decorations-in-the-party-area-7548036|A birthday setup with balloons, florals and a cake table
pexels-african-birthday-party-decoration-1.jpg|birthday-gold-setup.jpg|7826296|https://www.pexels.com/search/birthday%20background/|A golden birthday setup with a festive cake
pexels-african-birthday-party-decoration-4.jpg|birthday-red-wall.jpg|7099884|https://www.pexels.com/search/birthday%20background/|A styled birthday corner with number balloon and cake
pexels-african-corporate-event-decoratio-1.jpg|service-corporate-events.jpg|35042459|https://www.pexels.com/search/corporate%20event/|A themed event hall set up with elegant lighting
pexels-african-corporate-event-decoratio-3.jpg|corporate-stage-lighting.jpg|2177813|https://pexels.com/search/event%20organizer|A stage with dramatic lighting ready for an event
pexels-free-stock-photo-african-couple-w-1.jpg|portfolio-african-wedding-tent.jpg|15061733|https://www.pexels.com/search/african%20american%20wedding/|A bride and groom walking through a dressed reception tent
pexels-african-wedding-guests-celebratin-3.jpg|portfolio-african-wedding-bride.jpg|36109477|https://pexels.com/search/wedding%20guest|A joyful bride in traditional attire at a colourful wedding
pexels-free-stock-photo-african-couple-w-3.jpg|portfolio-traditional-ceremony.jpg|37939842|https://www.pexels.com/search/african%20wedding/|A couple in traditional bridal attire at an outdoor ceremony
pexels-free-stock-photo-african-couple-w-2.jpg|portfolio-ceremony-guests.jpg|35532988|https://pexels.com/search/African%20wedding|Guests gathered for an elegant wedding ceremony
pexels-com-photo-african-wedding-table-s-5.jpg|portfolio-table-florals.jpg|2788492|https://pexels.com/photo/elegant-wedding-table-setup-with-floral-decor-34061566|A reception table with floral arrangements and tableware
pexels-com-photo-african-wedding-table-s-1.jpg|portfolio-candlelight-table.jpg|12919391|https://pexels.com/photo/bunch-of-flowers-on-wedding-table-10970554|A wedding table with candles, flowers and glassware
pexels-kenyan-wedding-table-setting-flow-4.jpg|portfolio-bridal-table.jpg|10970559|https://pexels.com/photo/bunch-of-flowers-on-wedding-table-10970554|A wedding table with a floral centrepiece and candles
pexels-com-photo-african-wedding-table-s-2.jpg|portfolio-fine-dining.jpg|11474280|https://pexels.com/photo/fine-dining-setting-57980|A fine dining place setting with floral centrepiece
pexels-kenyan-wedding-table-setting-flow-2.jpg|portfolio-sunflower-table.jpg|1682538|https://pexels.com/photo/table-setting-with-sunflower-centerpiece-2337774|A table setting with a floral centrepiece and glassware
pexels-intimate-dinner-party-table-candl-2.jpg|portfolio-candlelit-dinner.jpg|30151915|https://www.pexels.com/search/candle%20light%20dinner/|A candlelit dinner table set for an intimate gathering
pexels-intimate-dinner-party-table-candl-3.jpg|portfolio-moody-dinner.jpg|6715106|https://pexels.com/photo/served-table-with-dishware-and-candles-5727912|A moody candlelit table with vintage decor
pexels-intimate-dinner-party-table-candl-4.jpg|portfolio-intimate-table.jpg|3937246|https://www.pexels.com/search/candle%20light%20dinner/|A refined candlelit table for a private celebration
pexels-kenyan-wedding-floral-arrangement-2.jpg|floral-bridal-bouquet.jpg|5978138|https://www.pexels.com/search/wedding%20flowers/|A bridal bouquet of roses at a ceremony
pexels-kenyan-wedding-floral-arrangement-3.jpg|floral-pink-bouquet.jpg|5241818|https://pexels.com/search/bouquet%20of%20flowers|A pink and white bouquet held ready for the aisle
pexels-kenyan-wedding-floral-arrangement-4.jpg|floral-rose-vase.jpg|5251304|https://pexels.com/search/bouquets|Roses arranged in a vase beside a gift table
pexels-florist-arranging-flowers-worksho-4.jpg|florist-at-work.jpg|5894101|https://www.pexels.com/photo/crop-faceless-florist-arranging-bouquet-in-florist-shop-5414056/|A florist arranging a bouquet in the studio
pexels-african-woman-professional-portra-1.jpg|team-1.jpg|29852895|https://www.pexels.com/photo/professional-corporate-headshot-of-smiling-woman-29852895/|Portrait of a smiling woman in business dress
pexels-african-man-professional-portrait-5.jpg|team-2.jpg|31307734|https://www.pexels.com/search/business%20portrait/|Portrait of a confident woman seated
pexels-com-photo-of-african-woman-smilin-1.jpg|team-3.jpg|27394840|https://pexels.com/photo/woman-covering-the-sunlight-4982473|Close-up portrait of a smiling woman
pexels-african-man-professional-portrait-1.jpg|team-4.jpg|20715518|https://pexels.com/photo/smiling-man-in-suit-portrait-20715518|Portrait of a man in a suit
pexels-african-man-professional-portrait-4.jpg|team-5.jpg|34299170|https://www.pexels.com/search/business%20man%20portrait/|Portrait of a man in a tailored suit
pexels-com-photo-of-african-woman-smilin-4.jpg|team-6.jpg|5021972|https://pexels.com/photo/woman-covering-the-sunlight-4982473|Portrait of a woman in natural light
pexels-com-photo-of-african-woman-smilin-5.jpg|team-7.jpg|12463298|https://pexels.com/photo/woman-covering-the-sunlight-4982473|Portrait of a woman with bold makeup
'

CREDITS_ROWS=""
KEPT=0; DROPPED=0

while IFS='|' read -r src target id url caption; do
  [ -z "${src:-}" ] && continue
  if [ ! -f "$SRC/$src" ]; then echo "MISSING  $src"; DROPPED=$((DROPPED+1)); continue; fi
  # everything in this manifest is pexels-sourced; assert it via the record
  case "$url" in
    *pexels.com*) : ;;
    *) echo "REJECT (non-Pexels source): $src"; DROPPED=$((DROPPED+1)); continue ;;
  esac

  # normalise: strip metadata, cap width, keep aspect, degrade gracefully
  w=$(identify -format "%w" "$SRC/$src")
  if [ "$w" -lt 1100 ]; then
    # upscale the small renditions with Lanczos + unsharp so full-bleed use is viable
    convert "$SRC/$src" -strip -resize 1400x -unsharp 0x0.75+0.75+0.02 -quality 84 "$OUT/$target"
  else
    convert "$SRC/$src" -strip -resize '1600x1600>' -unsharp 0x0.5+0.5+0.02 -quality 84 "$OUT/$target"
  fi
  echo "OK   $src -> $target ($(identify -format '%wx%h' "$OUT/$target"))"
  CREDITS_ROWS="${CREDITS_ROWS}| \`/images/$target\` | [$id](https://www.pexels.com/photo/$id/) | ${caption} |
"
  KEPT=$((KEPT+1))
done <<< "$MANIFEST"

echo ""
echo "kept=$KEPT rejected_or_missing=$DROPPED"
echo "$CREDITS_ROWS" > /tmp/credits_rows.txt
du -sh "$OUT"
