"use client";

import { useMemo, useState } from "react";
import type {
  DamageFormulaInput,
  CharacterStatsSnapshot,
  ActiveBuff,
} from "@/types/calculator";
import type { Character, ScalingStat } from "@/types/database";
import { StatsDisplayPanel } from "@/components/StatDisplayPanel";
import { DamageTable } from "@/components/DamageTable";
import { TalentLevelSliders } from "@/components/TalentLevelSlider";
import { TalentLevels } from "@/hooks/useDamageCalc";
import { StatsInputWindow } from "@/components/StatsInputWindow";

type EnemyState = {
    level: number;
    resistance: number;
    elementalResistance?: number;
};

const TEMP_CHARACTER: Character = {
  id: "1210",
  name: "Aemeath",
  rarity: 5,
  element: "Fusion",
  weaponType: "Sword",
  baseStats: {
    hp: 11025,
    atk: 1279,
    def: 1148,
  },
  talents: [],
};

const DEFAULT_STATS: CharacterStatsSnapshot = {
    hp: 11025,
    atk: 1279,
    def: 1148,
    critRate: 0.398,
    critDmg: 2.75,
    energyRegen: 1.108,
    healingBonus: 0,
    fusionBonus: 0.82,
    glacioBonus: 0.0,
    aeroBonus: 0.0,
    spectroBonus: 0.0,
    havocBonus: 0.0,
    electroBonus: 0.0,
    basicDamageBonus: 0,
    heavyDamageBonus: 0,
    skillDamageBonus: 0,
    liberationDamageBonus: 0.116,
    echoDamageBonus: 0,
    flatDamageBonus: 0,
    spectroFrazzleDamageBonus: 0.12,
    aeroErosionDamageBonus: 0.12,
    glacioChafeDamageBonus: 0.12,
    electroFlareDamageBonus: 0.12,
    fusionBurstDamageBonus: 0.12,
    havocBaneDamageBonus: 0.12,
};

export default function DamageCalculatorPage() {
	const [characterId] = useState<number>(1210);
	const [scalingStat, setScalingStat] = useState<ScalingStat>("atk");
	const [charLevel] = useState<number>(90);

	const [characterStats, setCharacterStats] = useState<CharacterStatsSnapshot>(DEFAULT_STATS);
	const [buffs] = useState<ActiveBuff[]>([]);
	const [enemy] = useState<EnemyState>({
		level: 90,
		resistance: 0.1,
	});

	const [isStatsInputOpen, setStatsInputOpen] = useState(false);



  	const [talentLevels, setTalentLevels] = useState<TalentLevels>({
		normal_attack: 10,
		resonance_skill: 10,
		forte_circuit: 10,
		resonance_liberation: 10,
		intro_skill: 10,
	});

	const handleTalentLevelChange = (
		category: keyof TalentLevels,
		level: number
	) => {
		setTalentLevels((prev) => ({
			...prev,
			[category]: level,
		}));
	};

	const baseInput = useMemo<Omit<DamageFormulaInput, "mode">>(() => {
		return {
		character: TEMP_CHARACTER,
		charLevel,
		stats: characterStats,
		buffs,
		enemy,
		hit: {
			talentCategory: "normal_attack",
		},
		};
	}, [characterStats, buffs, enemy, charLevel]);

  return (
    <main className="min-h-screen bg-catppuccin-crust text-catppuccin-text">
      <div className="mx-auto max-w-400 px-6 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-catppuccin-text">
            Damage Calculator
          </h1>
          <p className="mt-1 text-sm text-catppuccin-subtext0">
            {TEMP_CHARACTER.name} · Level {charLevel}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          	<div className="flex flex-col gap-6">
				<StatsDisplayPanel
					character={TEMP_CHARACTER}
					stats={characterStats}
					onOpenStatsInput={() => setStatsInputOpen(true)}
            	/>

				<TalentLevelSliders
					talentLevels={talentLevels}
					onLevelChange={handleTalentLevelChange}
				/>
			</div>
			

          <DamageTable
            characterId={characterId}
            baseInput={baseInput}
            scalingStat={scalingStat}
			talentLevels={talentLevels}
          />
        </div>
      </div>

	  {isStatsInputOpen && (
		<StatsInputWindow 
			stats={characterStats}
			onSave={setCharacterStats}
			onClose={() => setStatsInputOpen (false)}
		/>
	  )}
    </main>
  );
}