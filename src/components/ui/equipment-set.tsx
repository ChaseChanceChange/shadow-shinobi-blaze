/**
 * Equipment Set display
 * Matches the icon row style from the asset sheets (Obsidian Serpent, Sun-Iron, etc.)
 */

import { cn } from '../../lib/utils';

export interface EquipmentPiece {
  id: string;
  slot: 'helm' | 'chest' | 'gloves' | 'boots' | 'weapon' | 'accessory';
  name: string;
  icon?: string;
}

interface EquipmentSetProps {
  setName: string;
  pieces: EquipmentPiece[];
  className?: string;
}

const SLOT_LABELS: Record<string, string> = {
  helm: 'Helm',
  chest: 'Chest',
  gloves: 'Gloves',
  boots: 'Boots',
  weapon: 'Weapon',
  accessory: 'Accessory',
};

export function EquipmentSet({ setName, pieces, className }: EquipmentSetProps) {
  return (
    <div className={cn('rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-4', className)}>
      <h3 className="mb-3 text-center text-sm font-semibold tracking-wide text-cyan-300/90">
        {setName}
      </h3>

      <div className="flex flex-wrap justify-center gap-3">
        {pieces.map((piece) => (
          <div key={piece.id} className="flex flex-col items-center gap-1.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-950 shadow-inner">
              {piece.icon ? (
                <img src={piece.icon} alt={piece.name} className="h-10 w-10 object-contain" />
              ) : (
                <span className="text-xs text-zinc-600">{SLOT_LABELS[piece.slot]?.[0]}</span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400">{SLOT_LABELS[piece.slot]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
