# Shadow Shinobi Blaze

**Clean rebuild** of Shadow Shinobi — a persistent browser-based squad management RPG / browser MMO.

- 100% English
- Zero legacy Portuguese or franchise terminology
- Fresh architecture following the Master Naming Codex and Master Build Specification
- Target repository: https://github.com/ChaseChanceChange/shadow-shinobi-blaze

## Core Fantasy
Recruit, train, equip, and command a squad of elite operatives.  
Push gear beyond safe limits for extreme rewards.  
Make meaningful decisions under risk.

## Core Loop
```
Recruit → Build Squad → Train → Equip → Mission/Raid → Combat
→ Loot → Craft/Enhance → Improve Squad → Unlock Content
→ PvP/Rankings → Repeat
```

## Tech Stack (current foundation)
- TypeScript + Vite + React 19
- TanStack Router / Start
- better-auth
- Kysely + PGlite / Postgres
- Tailwind CSS 4
- Zod, Zustand, React Query

## Canonical Vocabulary (never deviate)
| Concept              | Canonical Term     |
|----------------------|--------------------|
| Player               | Operative          |
| Rank / Level         | Standing           |
| XP                   | Insight            |
| Mana / Resource      | Essence            |
| Ability              | Art                |
| Mission              | Contract           |
| Training             | Discipline         |
| Village / City       | Enclave / Settlement |
| Leader               | Warden             |
| Currency             | Coin               |
| Inventory            | Pack               |
| Storage              | Vault              |

## Project Structure
See `docs/architecture/FOLDER_STRUCTURE.md` for the full layout.

## Asset Pipeline
All visual assets live under `/assets`.  
Follow the RAW → CANDIDATE → TAGGED → APPROVED → IN-USE pipeline.  
Never commit unlicensed or unreviewed assets into production paths.

## Getting Started
```bash
npm install
npm run dev
```

## Development Phases
Follow the phased order in the Master Build Specification:
1. Foundation
2. Squad + Operatives
3. Gear
4. Enhancement (core pillar)
5. Training
6. Missions / Contracts
7. Combat
8. Crafting / Alchemy
9. World
10. Social / PvP
11. Expansion systems

## Content IDs
- Characters: `CHR-####`
- Operatives (player-owned): `OPR-####`
- Equipment: `EQP-####`
- Arts: `ART-####`
- Contracts: `CTR-####`
- Monsters: `MON-####`
- Assets: `AST-[TYPE]-####`

## License
MIT (clean project — no legacy attribution required beyond original engine credit if any third-party code is later audited in).
