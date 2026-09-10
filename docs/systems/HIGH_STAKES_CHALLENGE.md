# High-Stakes Challenge System

**Status:** Designed & Scaffolded  
**Canonical Name:** Challenge (High-Stakes mode)  
**Risk Fantasy:** Calculated high-risk decisions with permanent item loss/gain

---

## 1. Overview

Players can challenge each other using their real trained and equipped Operatives in realtime combat.  
Higher risk tiers unlock the chance to permanently take an item from the opponent’s inventory or equipment.

This is a core high-stakes pillar that reinforces the enhancement risk fantasy.

---

## 2. Risk Tiers

| Tier     | Entry Cost                          | Normal Loot          | Item Steal Chance | Notes                          |
|----------|-------------------------------------|----------------------|-------------------|--------------------------------|
| Low      | Low Coin                            | Standard             | 0%                | Practice / safe                |
| Medium   | Coin + basic materials              | Improved             | 5–10%             | Light risk                     |
| High     | High Coin + rare materials          | Rare / Epic chance   | 15–25%            | Serious risk                   |
| Extreme  | Challenge Token + heavy cost        | Legendary / Mythic   | 30–50%            | Highest stakes — item can be taken |

---

## 3. Core Rules

### Entry Requirements
- Minimum Standing gate per tier
- Resource cost paid upfront (non-refundable once both sides confirm)
- Daily / weekly limit on Extreme Challenges
- Cooldown between Challenges

### Match Types
- 1v1 (single Operative)
- Squad vs Squad (full squad, limited size)

### Pre-Battle Confirmation
Both players must explicitly confirm:
- Risk tier
- Entry cost
- Which of their items are currently **stealable** (unprotected)
- Which items are **Protected**

### Item Steal (Extreme tier only)
- On victory, server rolls against the configured steal chance
- If successful, one random **unprotected** equipped or inventory item is transferred
- Full audit log is written
- Protected items can never be stolen

### Protection System
Players can spend resources to mark an item as **Protected**:
- Temporary (duration-based)
- Permanent (higher cost)
- Soulbound flag on the item record

---

## 4. Server-Authoritative Flow

1. Player A creates Challenge offer (or accepts open board entry)
2. Player B accepts
3. Both pay entry cost (locked)
4. Both confirm loadout & unprotected items
5. Realtime combat begins
6. Combat resolved server-side
7. Winner receives loot table
8. If Extreme + steal roll succeeds → item transferred
9. Full combat + transfer log written
10. Cooldowns applied

The client never decides outcomes, loot, or item transfers.

---

## 5. Database Tables (Scaffold)

```sql
-- Challenge offers / matches
CREATE TABLE challenges (
  id                TEXT PRIMARY KEY,          -- CHL-####
  challenger_id     TEXT NOT NULL,
  opponent_id       TEXT,
  tier              TEXT NOT NULL,             -- low | medium | high | extreme
  status            TEXT NOT NULL,             -- open | accepted | in_progress | completed | cancelled
  entry_cost_json   JSONB NOT NULL,
  steal_chance      REAL DEFAULT 0,
  winner_id         TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ
);

-- Items at risk for a specific challenge
CREATE TABLE challenge_stakes (
  id                TEXT PRIMARY KEY,
  challenge_id      TEXT NOT NULL REFERENCES challenges(id),
  player_id         TEXT NOT NULL,
  item_id           TEXT NOT NULL,             -- EQP-#### or inventory id
  is_protected      BOOLEAN DEFAULT FALSE,
  was_stolen        BOOLEAN DEFAULT FALSE
);

-- Full audit log
CREATE TABLE challenge_logs (
  id                TEXT PRIMARY KEY,
  challenge_id      TEXT NOT NULL,
  event_type        TEXT NOT NULL,             -- created | accepted | combat_start | combat_end | loot | steal | cancel
  actor_id          TEXT,
  payload           JSONB,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Protection records
CREATE TABLE item_protections (
  id                TEXT PRIMARY KEY,
  item_id           TEXT NOT NULL,
  player_id         TEXT NOT NULL,
  protection_type   TEXT NOT NULL,             -- temporary | permanent
  expires_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. UI Flow

### Challenge Board
- List of open Challenges
- Filter by tier / Standing range
- “Create Challenge” button

### Create / Accept Screen
- Select tier
- Show entry cost
- Show current unprotected items that can be stolen
- Confirm button (double confirmation on Extreme)

### Pre-Battle Ready Screen
- Both players must click “Ready”
- Final list of stealable items shown
- Countdown then combat starts

### Combat Screen
- Realtime tactical combat using existing combat engine
- Clear indication this is a High-Stakes Challenge

### Results Screen
- Winner / Loser
- Loot received
- If item was stolen: dramatic reveal + transfer confirmation
- Full log available

---

## 7. Content & Economy Hooks

- Challenge Token (special limited resource)
- Protection materials / Coin sinks
- Daily Extreme Challenge limit
- Leaderboards for Challenge wins / highest value stolen
- Titles: “Item Reaper”, “Unbroken”, “Void Wager”, etc.

---

## 8. Anti-Abuse

- Rate limits on Challenge creation
- Standing gates
- Full audit trail of every item transfer
- Ability to reverse fraudulent transfers (admin)
- Cooldown after Extreme loss

---

## 9. Implementation Phases

1. Design (this document) ✅
2. Database tables + types
3. Server endpoints (create / accept / confirm / resolve)
4. Basic UI (board + create + results)
5. Integration with combat engine
6. Item steal + protection logic
7. Polish, logging, anti-abuse

---

**This system is now part of the official Shadow Shinobi design.**
