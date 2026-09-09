# Shadow Shinobi Blaze — Full Folder Structure

This is the canonical production layout for the clean rebuild.

```
shadow-shinobi-blaze/
├── app/                          # Domain modules (business logic)
│   ├── Admin/
│   ├── Alchemy/
│   ├── Assets/
│   ├── Combat/
│   ├── Core/
│   ├── Crafting/
│   ├── Economy/
│   ├── Enhancement/              # Core pillar
│   ├── Events/
│   ├── Gear/
│   ├── Inventory/
│   ├── Missions/
│   ├── Operatives/
│   ├── Progression/
│   ├── PvP/
│   ├── Raids/
│   ├── Social/
│   ├── Squad/
│   ├── Training/
│   ├── UI/
│   └── World/
├── assets/                       # PRODUCTION visual & audio assets only
│   ├── audio/
│   │   ├── ambient/
│   │   ├── music/
│   │   └── sfx/
│   ├── backgrounds/
│   ├── banners/
│   ├── candidates/               # Pipeline stages
│   │   ├── raw/
│   │   ├── tagged/
│   │   └── approved/
│   ├── effects/
│   │   ├── combat/
│   │   ├── enhancement/
│   │   ├── particles/
│   │   └── status/
│   ├── environments/
│   ├── fx/
│   ├── gear/
│   │   ├── accessories/
│   │   ├── armor/
│   │   ├── frames/               # Rarity + enhancement frames (layered)
│   │   ├── overlays/             # Awakened / glow layers
│   │   ├── relics/
│   │   └── weapons/
│   ├── icons/
│   ├── materials/
│   ├── monsters/
│   │   ├── beasts/
│   │   ├── bosses/
│   │   ├── constructs/
│   │   ├── humanoids/
│   │   └── spirits/
│   ├── operatives/
│   │   ├── icons/
│   │   ├── portraits/            # Faction-sorted
│   │   │   ├── dustveil/
│   │   │   ├── runeveil/
│   │   │   ├── bloodfang/
│   │   │   ├── voidweave/
│   │   │   ├── ironshade/
│   │   │   └── unbound/
│   │   └── sprites/
│   ├── portraits/                # Legacy / overflow
│   ├── ui/
│   │   ├── buttons/
│   │   ├── frames/
│   │   ├── hud/
│   │   ├── icons/
│   │   └── panels/
│   └── world/
│       ├── backgrounds/
│       ├── enclaves/
│       ├── maps/
│       └── regions/
├── config/
├── content/
│   ├── arts/
│   ├── characters/
│   │   └── seed/
│   ├── factions/
│   ├── gear/
│   ├── locations/
│   ├── materials/
│   ├── missions/
│   └── monsters/
├── database/
│   ├── migrations/
│   └── seeders/
├── docs/
│   ├── architecture/
│   ├── content/
│   ├── naming/
│   └── phases/
├── migrations/
├── public/
├── resources/
├── scripts/
├── server/
├── src/
├── tests/
└── tools/
```

## Asset Naming Convention
- All production files: `lowercase-kebab-case`
- Example portrait: `assets/operatives/portraits/dustveil/sand-saboteur.png`
- Corresponding AST ID: `AST-OPR-0001`
- Never put spaces or special characters in filenames.
