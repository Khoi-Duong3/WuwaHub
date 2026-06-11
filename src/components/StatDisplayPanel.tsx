import type { CharacterStatsSnapshot } from "@/types/calculator";
import type { Character, ScalingStat } from "@/types/database";
import {
  Sword,
  Heart,
  Shield,
  Sparkles,
  Orbit,
  Swords,
  Flame,
  Zap,
  Wind,
  Sun,
  MoonStar,
  Cross,
  Snowflake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Pencil } from "lucide-react";


type Props = {
    character: Character | null;
    stats: CharacterStatsSnapshot | null;
    onOpenStatsInput: () => void;
};

const EMPTY_STATS: CharacterStatsSnapshot = {
    hp: 0,
    atk: 0,
    def: 0,
    critRate: 0,
    critDmg: 1.5,
    energyRegen: 1,
    healingBonus: 0,
    fusionBonus: 0.0,
    glacioBonus: 0.0,
    aeroBonus: 0.0,
    spectroBonus: 0.0,
    havocBonus: 0.0,
    electroBonus: 0.0,
    basicDamageBonus: 0,
    heavyDamageBonus: 0,
    skillDamageBonus: 0,
    liberationDamageBonus: 0,
    echoDamageBonus: 0,
    flatDamageBonus: 0,
    spectroFrazzleDamageBonus: 0,
    aeroErosionDamageBonus: 0,
    glacioChafeDamageBonus: 0,
    electroFlareDamageBonus: 0,
    fusionBurstDamageBonus: 0,
    havocBaneDamageBonus: 0,
};

type StatRow = {
	key: keyof CharacterStatsSnapshot;
	label: string;
	icon: LucideIcon;
	iconClassName?: string;
	format: (v: number) => string;
};

const STAT_ROWS: StatRow[] = [
	{ key: "atk", label: "ATK", icon: Sword, format: (v) => Math.round(v).toLocaleString() },
	{ key: "hp", label: "HP", icon: Heart, format: (v) => Math.round(v).toLocaleString() },
	{ key: "def", label: "DEF", icon: Shield, format: (v) => Math.round(v).toLocaleString() },
	{ key: "critRate", label: "Crit Rate", icon: Sparkles, format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "critDmg", label: "Crit DMG", icon: Sparkles, format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "energyRegen", label: "Energy Regen", icon: Orbit, format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "basicDamageBonus", label: "Basic Attack DMG Bonus", icon: Swords, format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "heavyDamageBonus", label: "Heavy Attack DMG Bonus", icon: Swords, format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "skillDamageBonus", label: "Resonance Skill DMG Bonus", icon: Cross, format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "liberationDamageBonus", label: "Resonance Liberation DMG Bonus", icon: Cross, format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "fusionBonus", label: "Fusion DMG Bonus", icon: Flame, iconClassName: "text-catppuccin-red", format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "electroBonus", label: "Electro DMG Bonus", icon: Zap, iconClassName: "text-catppuccin-mauve", format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "aeroBonus", label: "Aero DMG Bonus", icon: Wind, iconClassName: "text-catppuccin-teal", format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "spectroBonus", label: "Spectro DMG Bonus", icon: Sun, iconClassName: "text-catppuccin-yellow", format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "havocBonus", label: "Havoc DMG Bonus", icon: MoonStar, iconClassName: "text-catppuccin-pink", format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "glacioBonus", label: "Glacio DMG Bonus", icon: Snowflake, iconClassName: "text-catppuccin-blue", format: (v) => `${(v * 100).toFixed(1)}%` },
	{ key: "healingBonus", label: "Healing Bonus", icon: Heart, format: (v) => `${(v * 100).toFixed(1)}%` },
];

function StatRowItem({
	row,
	value,
	index,
}: {
	row: StatRow;
	value: number;
	index: number;
}) {
	const Icon = row.icon;
	const isEven = index % 2 === 0;

  return (
    <div
      className={`grid grid-cols-[1fr_auto] items-center px-4 py-3 ${
        isEven ? "bg-catppuccin-base" : "bg-catppuccin-mantle"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          size={18}
          strokeWidth={1.9}
          className={row.iconClassName ?? "text-catppuccin-subtext1"}
        />
        <span className="text-sm text-catppuccin-subtext1">{row.label}</span>
      </div>

      <div className="text-right text-sm text-catppuccin-text">
        {row.format(value)}
      </div>
    </div>
  );
}

export function StatsDisplayPanel({
  stats, onOpenStatsInput
}: Props) {
  const current = stats ?? EMPTY_STATS;

  return (
    <section className="overflow-hidden rounded-lg border border-catppuccin-surface0 bg-catppuccin-base pt-3">
		<div className="flex items-center justify-end px-3 pb-1">
			<button
				onClick={onOpenStatsInput}
				className="flex items-center gap-1.5 rounded-lg bg-catppuccin-surface0 px-3 py-1.5
				text-xs text-catppuccin-subtext1 hover:text-catppuccin-text
				hover:bg-catppuccin-surface1 transition-colors"
			>
				<Pencil size={12} />
				Edit
			</button>
		</div>
		<div>
			{STAT_ROWS.map((row, index) => (
			<StatRowItem
				key={row.key}
				row={row}
				value={current[row.key] as number}
				index={index}
			/>
			))}
		</div>
    </section>
  );
}