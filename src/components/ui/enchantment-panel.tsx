/**
 * Enchantment / Runic Fusion Panel
 * Circular rune interface inspired by the asset sheet.
 */

import { cn } from '../../lib/utils';

interface EnchantmentPanelProps {
  primaryItem?: { name: string; icon?: string };
  runeSlots?: (string | null)[];   // up to 4 rune ids
  result?: { name: string; icon?: string };
  onEnchant?: () => void;
  canEnchant?: boolean;
  className?: string;
}

export function EnchantmentPanel({
  primaryItem,
  runeSlots = [null, null, null, null],
  result,
  onEnchant,
  canEnchant = false,
  className,
}: EnchantmentPanelProps) {
  return (
    <div className={cn('flex flex-col items-center gap-4 p-4', className)}>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-violet-400/80">
        Enchantment Table
      </h3>

      <div className="relative flex h-64 w-64 items-center justify-center">
        {/* Outer decorative ring */}
        <div className="absolute inset-0 rounded-full border-2 border-violet-800/40" />
        <div className="absolute inset-3 rounded-full border border-violet-700/30" />
        <div className="absolute inset-6 rounded-full border border-dashed border-violet-600/20" />

        {/* Center – Primary Slot */}
        <div className="absolute z-20 flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-violet-500/60 bg-zinc-950 shadow-lg shadow-violet-950/50">
          {primaryItem?.icon ? (
            <img src={primaryItem.icon} alt="" className="h-10 w-10 object-contain" />
          ) : (
            <span className="text-xs text-violet-400/60">Primary</span>
          )}
        </div>

        {/* Rune slots around the circle */}
        {runeSlots.map((rune, i) => {
          const angle = (i * 90) - 45; // 4 slots
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 90;
          const y = Math.sin(rad) * 90;

          return (
            <div
              key={i}
              className="absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border border-violet-600/50 bg-zinc-900"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              {rune ? (
                <span className="text-xs text-violet-300">{rune}</span>
              ) : (
                <span className="text-[10px] text-violet-700">Rune</span>
              )}
            </div>
          );
        })}

        {/* Result slot (bottom) */}
        <div className="absolute bottom-0 z-20 flex h-14 w-14 translate-y-4 items-center justify-center rounded-lg border border-violet-500/40 bg-zinc-950">
          {result?.icon ? (
            <img src={result.icon} alt="" className="h-8 w-8 object-contain" />
          ) : (
            <span className="text-[10px] text-violet-600">Result</span>
          )}
        </div>
      </div>

      <button
        onClick={onEnchant}
        disabled={!canEnchant}
        className={cn(
          'rounded-lg px-6 py-2 text-sm font-semibold transition',
          canEnchant
            ? 'bg-violet-700 hover:bg-violet-600 text-white'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        )}
      >
        Fuse Runes
      </button>
    </div>
  );
}
