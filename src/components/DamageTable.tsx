import { Copy } from "lucide-react";
import { useDamageCalc, type DamageRow } from "@/hooks/useDamageCalc";
import type { DamageFormulaInput } from "@/types/calculator";
import type { ScalingStat } from "@/types/database";
import { TalentLevels } from "@/hooks/useDamageCalc";

type Props = {
    characterId: number;
    baseInput: Omit<DamageFormulaInput, "mode"> | null;
    scalingStat: ScalingStat;
    talentLevels: TalentLevels;
};

function DamageSection({
    title,
    rows,
}: {
    title: string;
    rows: DamageRow[];
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-catppuccin-surface0 bg-catppuccin-base">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[20px] font-semibold text-catppuccin-text">{title}</h2>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-catppuccin-crust text-catppuccin-subtext0 transition-colors hover:text-catppuccin-text"
          aria-label="Copy damage table"
        >
          <Copy size={18} strokeWidth={1.85} />
        </button>
      </div>

      <div className="grid grid-cols-[1fr_120px_120px_120px] border-b border-catppuccin-surface0 px-5 py-3 text-sm text-catppuccin-subtext0">
        <div />
        <div className="text-right font-medium">Normal</div>
        <div className="text-right font-medium">Average</div>
        <div className="text-right font-medium">Crit</div>
      </div>

      <div>
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`grid grid-cols-[1fr_120px_120px_120px] items-center px-5 py-3 text-sm ${
              index % 2 === 0 ? "bg-catppuccin-base" : "bg-catppuccin-mantle"
            }`}
          >
            <div className="pr-4 text-catppuccin-subtext1">{row.label}</div>
            <div className="text-right tabular-nums text-catppuccin-text">
              {row.normal.toLocaleString()}
            </div>
            <div className="text-right tabular-nums text-catppuccin-text">
              {row.average.toLocaleString()}
            </div>
            <div className="text-right tabular-nums text-catppuccin-text">
              {row.crit.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DamageTable({ characterId, baseInput, scalingStat, talentLevels }: Props) {
    const { sections, isLoading, error } = useDamageCalc(characterId, baseInput, scalingStat, talentLevels);

    if (isLoading) {
        return (
            <div className="rounded-lg border border-catppuccin-surface0 bg-catppuccin-base px-5 py-8 text-sm text-catppuccin-subtext0">
                Loading damage values...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-catppuccin-red/30 bg-catppuccin-base px-5 py-8 text-sm text-catppuccin-red">
                Failed to load damage rows.
            </div>
        );
    }

    if (!baseInput) {
        return (
            <div className="rounded-lg border border-catppuccin-surface0 bg-catppuccin-base px-5 py-8 text-sm text-catppuccin-subtext0">
                Enter stats on the left to see calculated damage.
            </div>
        );
    }

    if (!sections.length) {
        return (
            <div className="rounded-lg border border-catppuccin-surface0 bg-catppuccin-base px-5 py-8 text-sm text-catppuccin-subtext0">
                No talent scaling rows were returned.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {sections.map((section) => (
                <DamageSection 
                    key={section.category}
                    title={section.title}
                    rows={section.rows}
                />
            ))}
        </div>
    );
}