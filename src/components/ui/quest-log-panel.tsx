/**
 * Quest Log Panel
 * Visual style taken from the parchment + blood-splatter asset sheet.
 */

import { cn } from '../../lib/utils';

export interface QuestEntry {
  id: string;
  title: string;
  description: string;
  icon?: string;          // optional icon url or emoji placeholder
  status?: 'active' | 'completed' | 'failed';
}

interface QuestLogPanelProps {
  quests: QuestEntry[];
  className?: string;
}

export function QuestLogPanel({ quests, className }: QuestLogPanelProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-amber-900/60 bg-gradient-to-b from-amber-950/90 to-stone-950/95',
        'p-4 shadow-xl shadow-black/50',
        'bg-[url("/assets/ui/parchment-texture.png")] bg-cover bg-center',
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-amber-800/50 pb-2">
        <h3 className="font-serif text-lg font-bold tracking-wide text-amber-100">
          Quest Log
        </h3>
        <span className="text-xs text-amber-600/80">{quests.length} active</span>
      </div>

      {/* Quest list */}
      <div className="space-y-3">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className="flex gap-3 rounded border border-amber-900/40 bg-black/30 p-3 transition hover:border-amber-700/60"
          >
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-zinc-900/80 border border-zinc-700">
              {quest.icon ? (
                <img src={quest.icon} alt="" className="h-7 w-7 object-contain" />
              ) : (
                <span className="text-lg">📜</span>
              )}
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-amber-50 leading-tight">{quest.title}</h4>
                {quest.status === 'active' && (
                  <span className="shrink-0 rounded bg-emerald-900/60 px-1.5 py-0.5 text-[10px] text-emerald-300">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-amber-200/70 line-clamp-2">
                {quest.description}
              </p>
            </div>
          </div>
        ))}

        {quests.length === 0 && (
          <p className="py-6 text-center text-sm text-amber-700/60">No active contracts.</p>
        )}
      </div>
    </div>
  );
}
