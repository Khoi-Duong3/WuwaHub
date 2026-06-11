import { describe, it, expect } from "vitest"
import type { DamageFormulaInput } from "../../types/calculator"
import type { Character } from "../../types/database"
import type { ResolvedHit } from "./calculatorLogic"
import {
    calculateDefenseMultiplier,
    calculateResistanceMultiplier,
    calculateDefenseIgnore,
    calculateHitDamage,
} from "./calculatorLogic"

const mockCharacter: Character = {
    id: "char-1",
    name: "Aemeath",
    rarity: 5,
    element: "Fusion",
    weaponType: "Sword",
    baseStats: {
        atk: 1012,
        def: 1148,
        hp: 11025
    },
    talents: [],
};

const mockInputCrit: DamageFormulaInput = {
    character: mockCharacter,
    charLevel: 90,
    stats: {
        hp: 20763,
        atk: 1911,
        def: 1148,
        critRate: 0.643,
        critDmg: 2.08,
        energyRegen: 1.4,
        healingBonus: 0,
        fusionBonus: 0.82,
        glacioBonus: 0.0,
        aeroBonus: 0.0,
        spectroBonus: 0.0,
        havocBonus: 0.0,
        electroBonus: 0.0,
        basicDamageBonus: 0.0,
        heavyDamageBonus: 0.0,
        skillDamageBonus: 0.0,
        liberationDamageBonus: 0.25,
        echoDamageBonus: 0.0,
        flatDamageBonus: 0,
        spectroFrazzleDamageBonus: 0,
        aeroErosionDamageBonus: 0,
        glacioChafeDamageBonus: 0,
        electroFlareDamageBonus: 0,
        fusionBurstDamageBonus: 0,
        havocBaneDamageBonus: 0,
    },
    enemy: {
        level: 90,
        resistance: 0.1,
    },
    hit: {
        talentCategory: "normal_attack",

    },
    buffs: [],
    mode: {
        critMode: "crit",
    },
};

const mockInputNonCrit: DamageFormulaInput = {
    character: mockCharacter,
    charLevel: 90,
    stats: {
        hp: 20763,
        atk: 1911,
        def: 1148,
        critRate: 0.643,
        critDmg: 2.08,
        energyRegen: 1.4,
        healingBonus: 0,
        fusionBonus: 0.82,
        glacioBonus: 0.0,
        aeroBonus: 0.0,
        spectroBonus: 0.0,
        havocBonus: 0.0,
        electroBonus: 0.0,
        basicDamageBonus: 0.0,
        heavyDamageBonus: 0.0,
        skillDamageBonus: 0.0,
        liberationDamageBonus: 0.25,
        echoDamageBonus: 0.0,
        flatDamageBonus: 0,
        spectroFrazzleDamageBonus: 0,
        aeroErosionDamageBonus: 0,
        glacioChafeDamageBonus: 0,
        electroFlareDamageBonus: 0,
        fusionBurstDamageBonus: 0,
        havocBaneDamageBonus: 0,
    },
    enemy: {
        level: 90,
        resistance: 0.1,
    },
    hit: {
        talentCategory: "normal_attack",
    },
    buffs: [],
    mode: {
        critMode: "non_crit",
    },
};

const mockScaling: ResolvedHit = {
   hitName: "Basic Stage 1",
   multiplier: 0.2331,
   hitCount: 1,
   flatBonus: 0,
   scalingStat: "atk",
   damageTypes: ["basic"],
};

const myAemeath: Character = {
	id: "char-2",
    name: "Aemeath",
    rarity: 5,
    element: "Fusion",
    weaponType: "Sword",
    baseStats: {
        atk: 1012,
        def: 1148,
        hp: 11025
    },
    talents: [],
}

const myAemeathCrit: DamageFormulaInput = {
    character: mockCharacter,
    charLevel: 90,
    stats: {
        hp: 18881,
        atk: 1982,
        def: 1372,
        critRate: 0.778,
        critDmg: 2.834,
        energyRegen: 1.192,
        healingBonus: 0,
        fusionBonus: 0.82,
        glacioBonus: 0.0,
        aeroBonus: 0.0,
        spectroBonus: 0.0,
        havocBonus: 0.0,
        electroBonus: 0.0,
        basicDamageBonus: 0.0,
        heavyDamageBonus: 0.15,
        skillDamageBonus: 0.0,
        liberationDamageBonus: 0.351,
        echoDamageBonus: 0.0,
        flatDamageBonus: 0,
        spectroFrazzleDamageBonus: 0,
        aeroErosionDamageBonus: 0,
        glacioChafeDamageBonus: 0,
        electroFlareDamageBonus: 0,
        fusionBurstDamageBonus: 0,
        havocBaneDamageBonus: 0,
    },
    enemy: {
        level: 83,
        resistance: 0.1,
    },
    hit: {
        talentCategory: "normal_attack",
    },
    buffs: [
		{
			id: "buff-1",
			name: "Rejuvenating Glow",
			source: "Echo Set",
			type: "percent_stat",
			stat: "atk",
			value: 0.15,
			active: true,
		},

		{
			id: "buff-2",
			name: "Phallacy",
			source: "Echo Skill",
			type: "percent_stat",
			stat: "atk",
			value: 0.1,
			active: true,
		},

		{
			id: "buff-3",
			name: "SK Weapon",
			source: "Weapon",
			type: "percent_stat",
			stat: "atk",
			value: 0.14,
			active: true,
		}
	],
    mode: {
        critMode: "crit",
    },
};

const myAemeathNonCrit: DamageFormulaInput = {
    character: mockCharacter,
    charLevel: 90,
    stats: {
        hp: 18881,
        atk: 1982,
        def: 1372,
        critRate: 0.778,
        critDmg: 2.834,
        energyRegen: 1.192,
        healingBonus: 0,
        fusionBonus: 0.82,
        glacioBonus: 0.0,
        aeroBonus: 0.0,
        spectroBonus: 0.0,
        havocBonus: 0.0,
        electroBonus: 0.0,
        basicDamageBonus: 0.0,
        heavyDamageBonus: 0.15,
        skillDamageBonus: 0.0,
        liberationDamageBonus: 0.351,
        echoDamageBonus: 0.0,
        flatDamageBonus: 0,
        spectroFrazzleDamageBonus: 0,
        aeroErosionDamageBonus: 0,
        glacioChafeDamageBonus: 0,
        electroFlareDamageBonus: 0,
        fusionBurstDamageBonus: 0,
        havocBaneDamageBonus: 0,
    },
    enemy: {
        level: 83,
        resistance: 0.1,
    },
    hit: {
        talentCategory: "normal_attack",
    },
    buffs: [
		{
			id: "buff-1",
			name: "Rejuvenating Glow",
			source: "Echo Set",
			type: "percent_stat",
			stat: "atk",
			value: 0.15,
			active: true,
		},

		{
			id: "buff-2",
			name: "Phallacy",
			source: "Echo Skill",
			type: "percent_stat",
			stat: "atk",
			value: 0.1,
			active: true,
		},

		{
			id: "buff-3",
			name: "SK Weapon",
			source: "Weapon",
			type: "percent_stat",
			stat: "atk",
			value: 0.14,
			active: true,
		}
	],
    mode: {
        critMode: "non_crit",
    },
};

const myAemeathBuffsCrit: DamageFormulaInput = {
    character: mockCharacter,
    charLevel: 90,
    stats: {
        hp: 18881,
        atk: 1982,
        def: 1372,
        critRate: 0.778,
        critDmg: 2.834,
        energyRegen: 1.192,
        healingBonus: 0,
        fusionBonus: 0.82,
        glacioBonus: 0.0,
        aeroBonus: 0.0,
        spectroBonus: 0.0,
        havocBonus: 0.0,
        electroBonus: 0.0,
        basicDamageBonus: 0.0,
        heavyDamageBonus: 0.15,
        skillDamageBonus: 0.0,
        liberationDamageBonus: 0.351,
        echoDamageBonus: 0.0,
        flatDamageBonus: 0,
        spectroFrazzleDamageBonus: 0,
        aeroErosionDamageBonus: 0,
        glacioChafeDamageBonus: 0,
        electroFlareDamageBonus: 0,
        fusionBurstDamageBonus: 0,
        havocBaneDamageBonus: 0,
    },
    enemy: {
        level: 83,
        resistance: 0.1,
    },
    hit: {
        talentCategory: "normal_attack",
    },
    buffs: [
		{
			id: "buff-1",
			name: "Rejuvenating Glow",
			source: "Echo Set",
			type: "percent_stat",
			stat: "atk",
			value: 0.15,
			active: true,
		},

		{
			id: "buff-2",
			name: "Phallacy",
			source: "Echo Skill",
			type: "percent_stat",
			stat: "atk",
			value: 0.1,
			active: true,
		},

		{
			id: "buff-3",
			name: "Shorekeeper Weapon",
			source: "Weapon",
			type: "percent_stat",
			stat: "atk",
			value: 0.14,
			active: true,
		},

		{
			id: "buff-4",
			name: "Shorekeeper Outro",
			source: "Weapon",
			type: "all_amp",
			value: 0.15,
			active: true,
		},

		{
			id: "buff-5",
			name: "Aemeath Inherent Talent",
			source: "Talent",
			type: "crit_damage",
			value: 0.2,
			active: true,
		},

		{
			id: "buff-6",
			name: "Aemeath Echo Set",
			source: "Echo Set",
			type: "damage_bonus",
			value: 0.2,
			active: true,
		},



	],
    mode: {
        critMode: "crit",
    },
};

const myAemeathScaling: ResolvedHit = {
   hitName: "Basic Stage 1",
   multiplier: 0.3392,
   hitCount: 1,
   flatBonus: 0,
   scalingStat: "atk",
   damageTypes: ["basic"],
};


describe("calculatorLogic", () => {
  it("calculates defense multiplier correctly", () => {
    const result = calculateDefenseMultiplier(90, 90, 0);
    expect(result).toBeCloseTo(0.5013, 4);
  })

  it("calculates resistance multiplier correctly", () => {
    const result = calculateResistanceMultiplier(0.1);
    expect(result).toBeCloseTo(0.9, 4);
  })

  it("sums defense ignore buffs correctly", () => {
    const result = calculateDefenseIgnore([
      {
        id: "buff-1",
        name: "Ignore 10%",
        source: "Test",
        type: "ignore_defense",
        value: 0.1,
        active: true,
      },
      {
        id: "buff-2",
        name: "Ignore 20%",
        source: "Test",
        type: "ignore_defense",
        value: 0.2,
        active: true,
      },
      {
        id: "buff-3",
        name: "Inactive Ignore",
        source: "Test",
        type: "ignore_defense",
        value: 0.5,
        active: false,
      },
    ])
    expect(result).toBeCloseTo(0.3, 4);
  });

	it("calculates crit hit damage correctly", () => {
		const result = calculateHitDamage(mockInputCrit, mockScaling);
		expect(result.totalDamage).toBeCloseTo(761, 0);
	});

	it("calculate non crit hit correctly", () => {
		const result = calculateHitDamage(mockInputNonCrit, mockScaling);
		expect(result.totalDamage).toBeCloseTo(366, 0);
	});

	it("calculate non crit hit correctly for my Aemeath", () => {
		const result = calculateHitDamage(myAemeathNonCrit, myAemeathScaling);
		expect(result.totalDamage).toBeCloseTo(675, 0);
	});

	it("calculate crit hit correctly", () => {
		const result = calculateHitDamage(myAemeathCrit, myAemeathScaling);
		expect(result.totalDamage).toBeCloseTo(1911, 0);
	});

	it("calculate crit hit with buffs correctly", () => {
		const result = calculateHitDamage(myAemeathBuffsCrit, myAemeathScaling);
		expect(result.totalDamage).toBeCloseTo(2612, 0);
	});
});


// 2612