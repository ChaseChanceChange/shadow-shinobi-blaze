/**
 * UI Showcase — preview all core panels built from the asset sheets
 * Route: /ui-showcase
 */

import { createFileRoute } from '@tanstack/react-router';
import {
  QuestLogPanel,
  CraftingPanel,
  EnchantmentPanel,
  EquipmentSet,
} from '../components/ui';

export const Route = createFileRoute('/ui-showcase')({
  component: UIShowcasePage,
});

function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 space-y-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">UI Showcase</h1>
        <p className="text-zinc-400 mt-1">
          Core panels built from the Shadow Shinobi asset sheets (real coded UI).
        </p>
      </header>

      {/* Quest Log */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-amber-200">Quest Log Panel</h2>
        <div className="max-w-md">
          <QuestLogPanel
            quests={[
              {
                id: '1',
                title: 'The Crimson Moon Pact',
                description:
                  'The true moon rests in the ancient waters. Seek the whispering caves of the Crimson Moon Pact.',
                status: 'active',
              },
              {
                id: '2',
                title: 'Silence the Whispering Cave',
                description:
                  'Silence the Whispering Cave. Everything for a quest, and to the piercing cries of the Whispering.',
                status: 'active',
              },
              {
                id: '3',
                title: 'Guest Scaless',
                description: 'Have many ways to monster scales, monster scales.',
                status: 'active',
              },
            ]}
          />
        </div>
      </section>

      {/* Crafting */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-cyan-300">Crafting Panel</h2>
        <div className="max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <CraftingPanel
            materials={[
              { id: 'm1', name: 'Ore', quantity: 3 },
              { id: 'm2', name: 'Cloth', quantity: 1 },
              { id: 'm3', name: 'Scale', quantity: 2 },
              { id: 'm4', name: 'Crystal', quantity: 1 },
            ]}
            result={{ name: 'Obsidian Naginata' }}
            canCraft={true}
          />
        </div>
      </section>

      {/* Enchantment */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-violet-300">Enchantment Panel</h2>
        <div className="max-w-md rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <EnchantmentPanel
            primaryItem={{ name: 'Shadow Blade' }}
            runeSlots={[null, null, null, null]}
            canEnchant={false}
          />
        </div>
      </section>

      {/* Equipment Set */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-cyan-200">Equipment Set</h2>
        <div className="max-w-lg">
          <EquipmentSet
            setName="Obsidian Serpent Set"
            pieces={[
              { id: '1', slot: 'helm', name: 'Serpent Helm' },
              { id: '2', slot: 'chest', name: 'Serpent Chest' },
              { id: '3', slot: 'gloves', name: 'Serpent Gloves' },
              { id: '4', slot: 'boots', name: 'Serpent Boots' },
              { id: '5', slot: 'weapon', name: 'Obsidian Naginata' },
            ]}
          />
        </div>
      </section>

      <p className="text-sm text-zinc-500 pt-8">
        These are real React components. Once your asset icons are uploaded they will replace the placeholders.
      </p>
    </div>
  );
}
