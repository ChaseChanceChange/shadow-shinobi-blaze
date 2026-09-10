/**
 * Crafting UI Concept
 * Hexagonal materials + circular result — matches the asset sheet layout.
 */

import { cn } from '../../lib/utils';

export interface CraftingMaterial {
  id: string;
  name: string;
  icon?: string;
  quantity?: number;
}

interface CraftingPanelProps {
  materials: CraftingMaterial[];
  result?: {
    name: string;
    icon?: string;
  };
  onCraft?: () => void;
  canCraft?: boolean;
  className?: string;
}

export function CraftingPanel({
  materials,
  result,
  onCraft,
  canCraft = false,
  className,
}: CraftingPanelProps) {
  return (
    <div className={cn('flex flex-col items-center gap-6 p-4', className)}>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-400/80">
        Materials
      </h3>

      {/* Hex-style material slots */}
      <div className="relative flex items-center justify-center">
        <div className="grid grid-cols-2 gap-3">
          {materials.slice(0, 4).map((mat, i) => (
            <div
              key={mat.id}
              className={cn(
                'flex h-16 w-16 flex-col items-center justify-center rounded-xl',
                'border-2 border-cyan-800/60 bg-zinc-900/90',
                'shadow-lg shadow-cyan-950/40'
              )}
              style={{
                clipPath: i % 2 === 0
                  ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                  : undefined,
              }}
            >
              {mat.icon ? (
                <img src={mat.icon} alt={mat.name} className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-xl">🪨</span>
              )}
              {mat.quantity !== undefined && (
                <span className="text-[10px] text-cyan-300">{mat.quantity}</span>
              )}
            </div>
          ))}
        </div>

        {/* Connector line to result */}
        <div className="mx-4 h-0.5 w-12 bg-gradient-to-r from-cyan-700 to-cyan-400" />

        {/* Result circle */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Outer rune ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-600/50" />
          <div className="absolute inset-1 rounded-full border border-cyan-500/30" />
          <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-cyan-400/20" />

          <div className="relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-zinc-950 border border-cyan-500/40">
            {result?.icon ? (
              <img src={result.icon} alt={result.name} className="h-10 w-10 object-contain" />
            ) : (
              <span className="text-2xl">⚔️</span>
            )}
            <span className="mt-1 text-[10px] text-cyan-300/80 truncate max-w-[4.5rem]">
              {result?.name ?? 'Result'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCraft}
        disabled={!canCraft}
        className={cn(
          'mt-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition',
          canCraft
            ? 'bg-cyan-700 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        )}
      >
        Craft
      </button>
    </div>
  );
}
