# High-Stakes Challenge — UI Flow

## 1. Challenge Board (Main Entry)

Route: `/challenges` or `/pvp/challenges`

- Tabs: Open Challenges | My Challenges | History
- Filters: Tier (Low / Medium / High / Extreme), Standing range
- Each card shows:
  - Challenger name + Standing
  - Tier badge (colour-coded)
  - Entry cost summary
  - Steal chance (if Extreme)
  - “Accept” or “View” button

Primary CTA: **Create Challenge**

---

## 2. Create Challenge Screen

- Select Risk Tier (radio or cards)
- Live preview of entry cost
- Live list of **your currently unprotected items** that would be at risk
- Warning text on Extreme: “You may permanently lose an equipped or inventory item.”
- Double confirmation required for Extreme
- Button: **Post Challenge** (pays cost and creates open offer)

---

## 3. Accept / Confirm Screen

Shown to both players:

- Opponent summary
- Tier + costs
- Side-by-side comparison of unprotected items
- Checkbox / toggle: “I understand the risks”
- Button: **Confirm & Lock Entry**

Once both have confirmed → move to Ready screen.

---

## 4. Ready Screen

- Both players must click **Ready**
- Final stealable item list locked
- Short countdown (5–10 s)
- Then transition to combat

---

## 5. Combat Screen

- Standard tactical combat UI
- Persistent banner: “HIGH-STAKES CHALLENGE — Extreme” (or current tier)
- No surrender without penalty on Extreme

---

## 6. Results Screen

- Winner / Loser banner
- Loot received (with rarity colours)
- If item was stolen:
  - Dramatic full-screen or modal reveal
  - “You have taken [Item Name] from [Opponent]”
  - Item appears in winner’s inventory with transfer history
- Button: **View Full Log**
- Button: **Return to Board**

---

## 7. Protection Management (separate but linked)

Accessible from Inventory / Gear screen:

- Toggle or button: **Protect Item**
- Cost display
- Duration or Permanent option
- Clear visual indicator on protected items (lock icon + tooltip)

---

## Visual Language

- Extreme tier: deep red / void purple accents, warning icons
- Protected items: subtle lock overlay + gold/silver border
- Steal reveal: high-impact animation + sound

All copy remains 100% English and uses canonical terms (Challenge, Operative, Standing, Coin, etc.).
