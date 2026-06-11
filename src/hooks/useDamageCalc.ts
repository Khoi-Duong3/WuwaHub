import useSWR from "swr";
import { useMemo } from "react";
import { calculateHitDamage, resolveHits } from "@/lib/damageCalc/calculatorLogic";
import type { DamageFormulaInput } from "@/types/calculator";
import type {
  TalentScalingRow,
  ScalingStat,
  TalentCategory,
} from "@/types/database";
import fetcher from "@/lib/fetcher";

export interface DamageRow {
  label: string;
  normal: number;
  average: number;
  crit: number;
}

export interface DamageSection {
  category: TalentCategory;
  title: string;
  rows: DamageRow[];
}

const CATEGORY_ORDER: TalentCategory[] = [
    "normal_attack",
    "resonance_skill",
    "resonance_liberation",
    "forte_circuit",
    "intro_skill",
    "outro_skill",
];

export type TalentLevels = {
	normal_attack: number;
	resonance_skill: number;
	forte_circuit: number;
	resonance_liberation: number;
	intro_skill: number;
}

const CATEGORY_TITLES: Record<TalentCategory, string> = {
	normal_attack: "Normal Attack",
	resonance_skill: "Resonance Skill",
	resonance_liberation: "Resonance Liberation",
	forte_circuit: "Forte Circuit",
	intro_skill: "Intro Skill",
	outro_skill: "Outro Skill",
	inherent_skill: "Inherent Skill",
	tune_break: "Tune Break",
};

function getTalentLevel(category: TalentCategory, talentLevels: TalentLevels): number {
	switch (category) {
		case "normal_attack":
		case "resonance_skill":
		case "forte_circuit":
		case "resonance_liberation":
		case "intro_skill":
			return talentLevels[category] ?? 1;
		default:
			return 1;
	}
}

function buildInput(
  base: Omit<DamageFormulaInput, "mode">,
  critMode: "non_crit" | "average" | "crit"
): DamageFormulaInput {
  return {
    ...base,
    mode: { critMode },
  };
}

function calcTotal(
	scaling: TalentScalingRow,
	scalingStat: ScalingStat,
	baseInput: Omit<DamageFormulaInput, "mode">,
	critMode: "non_crit" | "average" | "crit",
	talentLevels: TalentLevels
): number {
	const input = buildInput(baseInput, critMode);
	const talentLevel = getTalentLevel(scaling.talentCategory, talentLevels);
	const hits = resolveHits(scaling, scalingStat, talentLevel);

	return hits.reduce((sum, hit) => {
		const result = calculateHitDamage(input, hit);
		return sum + result.totalDamage;
	}, 0);
}

export function useDamageCalc(
  characterId: number,
  baseInput: Omit<DamageFormulaInput, "mode"> | null,
  scalingStat: ScalingStat,
  talentLevels: TalentLevels
): { sections: DamageSection[]; isLoading: boolean; error: unknown } {
  const { data: scalings, error, isLoading } = useSWR<TalentScalingRow[]>(
    `/api/talents?characterId=${characterId}`, fetcher
  );

  const sections = useMemo<DamageSection[]>(() => {
    if (!scalings || !baseInput) return [];

    const filtered = scalings.filter(
      (s) =>
        s.scalingExpression?.trim() &&
        s.talentCategory !== "inherent_skill" &&
        s.talentCategory !== "tune_break"
    );

    const grouped = new Map<TalentCategory, DamageRow[]>();

    for (const scaling of filtered) {
      const category = scaling.talentCategory;

      const row: DamageRow = {
        label: scaling.talentLabel,
        normal: calcTotal(scaling, scalingStat, baseInput, "non_crit", talentLevels),
        average: calcTotal(scaling, scalingStat, baseInput, "average", talentLevels),
        crit: calcTotal(scaling, scalingStat, baseInput, "crit", talentLevels),
      };

      const existing = grouped.get(category) ?? [];
      existing.push(row);
      grouped.set(category, existing);
    }

    return CATEGORY_ORDER.filter((category) => grouped.has(category)).map(
      (category) => ({
        category,
        title: CATEGORY_TITLES[category],
        rows: grouped.get(category) ?? [],
      })
    );
  }, [scalings, baseInput, scalingStat, talentLevels]);

  return { sections, isLoading, error };
}