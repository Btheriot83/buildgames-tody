# Discover — Tileboard / Cool Letterpress Checklist

Sources: `docs/catalog-cache/` pulled from https://design-catalog-three.vercel.app/data/  
`index.json` → anshuMapping + canonicalApps.tileboard · FOR_AGENTS.md · narrow/DESIGN_CATALOG_GUIDE.md  
Generated: 2026-09-15 ~12:35 AM PT · Do not message Brandon.

## Technique 01 — seed-strings (prompts.json verbatim procedure)

Catalog prompt (`seed-strings` index 1):

```
I want you to build me a landing page for my productivity app.

Follow this procedure:

1. Generate a long, random alphanumeric string using a shell script.
2. Define the creative direction (color scheme, layout, typography, etc.) based on the string. Look beyond the surface for subpatterns, special numbers, anything that inspires you.
3. Use your judgment to bring this direction to life and make it look great.

Don't reveal the string in the design. It's only for your inspiration.
```

Adapted to Tileboard (chore PWA, not landing): ran `openssl rand -hex 32` →

```
42afb12b2f3069ca8f74bbc5f076ca6aa406e5bec38e610b825117e23b628515
```

**Not shown in UI.**

### Subpattern → direction
| Slice | Spark | Pull |
|-------|-------|------|
| `42af`/`b12b` | cool slate / deep ink | cool paper + letterpress black |
| `8f74bbc5` | cool gray-blue mist | paper `#FAF9F7` cool cast |
| `a406e5` / `610b82` | plum digits | ink only — **never** vibe-purple chrome |
| `5117e2`/`3b62` | cool blue-slate | one mark `#3D4F63` |
| `8515` | olive end | quiet done `#3F5A4A` |

Feel: cool letterpress checklist on cotton paper. One job: what’s due in this house today. Not fridge magnet costume. Not red overdue scream.

## Technique 02 — ambitious-prompts (+ 12 ten-options)

Catalog (`ambitious-prompts` index 4) verbatim:

```
I want to come up with a bold, unique design language for my product. Can you list as many ideas as you can, with short, high-level descriptions? Go broad, not deep.
```

### Ten options (12 / prompts.json index 1 spirit — volume, human picks)
1. Cool Letterpress Checklist ← **PICK**
2. Quiet Folio Due Board
3. Cotton Paper Household Index
4. Soft Dry-Erase Family Board (Tody clone risk)
5. Scandinavian Pegboard
6. Fridge Magnet / Quiet Enamel — **REJECT** (Brandon: still ugly)
7. Ceramic Stamp Pad (skeuomorphic risk)
8. Botanical Herbarium slips (costume)
9. Mid-century tile mosaic (busy)
10. Warm Linen & Brass (warmer than seed)

Remix (catalog `ten-options-then-remix` index 2 pattern): option **1** + a little of **2**.

### Human feel notes → sharpen (catalog ambitious index 5 pattern)
Cool Letterpress Checklist:
- Tactile paper/ink, satisfying check-press — not cartoony fridge magnets
- Avoid skeuomorphic tomato magnets / kraft comic offsets (tacky)
- Texture via real letterpress photos, not gray gradient chrome
- One cool slate accent; no red overdue scream; no vibe purple

### Agent POC brief (catalog ambitious index 6)
Build Tileboard as a cool letterpress household checklist: paper `#FAF9F7`, ink `#221C24`, slate `#3D4F63`, Newsreader + Source Sans 3 + IBM Plex Mono. Today due list + ink check-press complete. Local-first. Beat https://todyapp.com/ craft without cloning mint/coral/Dusty.

## Discarded
Fridge Magnet Board / Quiet Enamel; bathhouse; stainless photo; neo-brutal comic offsets; tomato clay primary.
