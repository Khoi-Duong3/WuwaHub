"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import type { CharacterStatsSnapshot } from "@/types/calculator";

type Props = {
	stats: CharacterStatsSnapshot;
	onSave: (stats: CharacterStatsSnapshot) => void;
	onClose: () => void;
}

type FieldDef = {
	key: keyof CharacterStatsSnapshot;
	label: string;
	isPercent: boolean;
}

const FIELD_GROUPS: { title: string; fields: FieldDef[] }[] = [
	{
		title: "Base Stats",
		fields: [
			{ key: "atk",  label: "ATK",  isPercent: false },
			{ key: "hp",   label: "HP",   isPercent: false },
			{ key: "def",  label: "DEF",  isPercent: false },
		],
	},
	{
		title: "Crit",
		fields: [
			{ key: "critRate", label: "Crit Rate", isPercent: true },
			{ key: "critDmg",  label: "Crit DMG",  isPercent: true },
		],
	},
	{
		title: "Utility",
		fields: [
			{ key: "energyRegen",   label: "Energy Regen",   isPercent: true },
			{ key: "healingBonus",  label: "Healing Bonus",  isPercent: true },
		],
	},
	{
		title: "Damage Bonus",
		fields: [
			{ key: "fusionBonus",          label: "Fusion DMG Bonus",          isPercent: true },
			{ key: "glacioBonus",          label: "Glacio DMG Bonus",          isPercent: true },
			{ key: "aeroBonus",          label: "Aero DMG Bonus",          isPercent: true },
			{ key: "havocBonus",          label: "Havoc DMG Bonus",          isPercent: true },
			{ key: "spectroBonus",          label: "Spectro DMG Bonus",          isPercent: true },
			{ key: "electroBonus",          label: "Electro DMG Bonus",          isPercent: true },
			{ key: "basicDamageBonus",        label: "Basic Attack DMG Bonus",       isPercent: true },
			{ key: "heavyDamageBonus",        label: "Heavy Attack DMG Bonus",       isPercent: true },
			{ key: "skillDamageBonus",        label: "Resonance Skill DMG Bonus",    isPercent: true },
			{ key: "liberationDamageBonus",   label: "Resonance Liberation DMG Bonus", isPercent: true },
			{ key: "echoDamageBonus",         label: "Echo DMG Bonus",               isPercent: true },
		],
	},
];

function toDisplay(value: number, isPercent: boolean): string {
	if (isPercent) return (value * 100).toFixed(1);
	return String(Math.round(value));
}

function fromDisplay(raw: string, isPercent: boolean): number {
	const n = parseFloat(raw);
	if (isNaN(n)) return 0;

	return isPercent ? n / 100 : n;
}

export function StatsInputWindow({ stats, onSave, onClose }: Props) {
	const shouldCloseRef = useRef(false);
	const [draft, setDraft] = useState<Record<string, string>>(() => {
		const init: Record<string, string> = {};
		for (const group of FIELD_GROUPS) {
			for (const field of group.fields) {
				init[field.key] = toDisplay(stats[field.key] as number, field.isPercent);
			}
		}

		return init;
	});

	function handleChange(key: keyof CharacterStatsSnapshot, value: string) {
		setDraft((prev) => ({ ...prev, [key]: value}));
	}

	function handleSave() {
		const updated = { ...stats};
		for (const group of FIELD_GROUPS) {
			for (const field of group.fields) {
				(updated[field.key] as number) = fromDisplay(draft[field.key], field.isPercent);
			}
		}
		onSave(updated);
		onClose();
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
			onPointerDown={(e) => {
				shouldCloseRef.current = e.target === e.currentTarget;
			}}
			onPointerUp={(e) => {
				if (shouldCloseRef.current && e.target === e.currentTarget) {
					onClose();
				}
				shouldCloseRef.current = false;
			}}
    	>

		<div
			className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-catppuccin-mantle shadow-2xl"
			onPointerDown={() => {
				shouldCloseRef.current = false;
			}}
		>
			<div className="flex items-center justify-between border-b border-catppuccin-surface0 px-6 py-4">
			<h2 className="text-lg font-semibold text-catppuccin-text">Edit Stats</h2>
			<button
				onClick={onClose}
				className="text-catppuccin-subtext0 hover:text-catppuccin-text transition-colors"
				aria-label="Close"
			>
				<X size={20} />
			</button>
			</div>

			<div className="overflow-y-auto px-6 py-4 space-y-6">
			{FIELD_GROUPS.map((group) => (
				<div key={group.title}>
				<h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-catppuccin-subtext0">
					{group.title}
				</h3>
				<div className="grid grid-cols-2 gap-x-4 gap-y-3">
					{group.fields.map((field) => (
					<div key={field.key}>
						<label className="mb-1 block text-xs text-catppuccin-subtext1">
							{field.label}
							{field.isPercent && (
								<span className="ml-1 text-catppuccin-overlay1">%</span>
							)}
						</label>
						<input
							type="number"
							value={draft[field.key]}
							onChange={(e) => handleChange(field.key, e.target.value)}
							className="w-full rounded-lg bg-catppuccin-surface0 px-3 py-2 text-sm text-catppuccin-text
										border border-catppuccin-surface1
										focus:border-catppuccin-blue focus:outline-none
										transition-colors"
						/>
					</div>
					))}
				</div>
				</div>
			))}
        </div>

        <div className="flex justify-end gap-3 border-t border-catppuccin-surface0 px-6 py-4">
			<button
				onClick={onClose}
				className="rounded-lg px-4 py-2 text-sm text-catppuccin-subtext1
						hover:bg-catppuccin-surface0 transition-colors"
			>
				Cancel
			</button>
			<button
				onClick={handleSave}
				className="rounded-lg bg-catppuccin-blue px-4 py-2 text-sm font-medium
						text-catppuccin-crust hover:opacity-90 transition-opacity"
			>
            Save
          </button>
        </div>
      </div>
    </div>
	)
}