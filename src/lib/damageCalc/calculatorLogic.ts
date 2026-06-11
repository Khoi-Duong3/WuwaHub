import type {
    DamageFormulaInput,
    DamageFormulaBreakdown,
    HitDamageResult,
    ActiveBuff,
    CharacterStatsSnapshot,
} from "@/types/calculator"
import type { Character, TalentScaling, DamageType, BaseStats, Element, ScalingStat } from "@/types/database"
import { parseScalingExpression } from "./parseScalingExpression"


export const TALENT_LEVEL_MULTIPLIER: Record<number, number> = {
    1: 1.0,
    2: 1.082,
    3: 1.164,
    4: 1.2788,
    5: 1.3608,
    6: 1.4551,
    7: 1.5863,
    8: 1.7175,
    9: 1.8487,
    10: 1.9881,
};

export interface ResolvedHit {
    hitName: string        
    multiplier: number     
    hitCount: number       
    flatBonus?: number     
    scalingStat: ScalingStat
    damageTypes: DamageType[]
}

export function resolveHits(
    scaling: TalentScaling,
    scalingStat: ScalingStat,
    talentLevel: number
    ): ResolvedHit[] {
    if (!scaling.scalingExpression?.trim()) return []
    
    const levelMultiplier = getTalentLevelMultiplier(talentLevel);
    const parts = parseScalingExpression(scaling.scalingExpression)

    return parts.map((part, i) => ({
        hitName: parts.length === 1
        ? scaling.talentLabel
        : `${scaling.talentLabel} (${i + 1})`,
        multiplier: part.multiplier * levelMultiplier,
        hitCount: part.hitCount,
        scalingStat,
        damageTypes: scaling.damageTypes ?? [],
    }))
}

export function getTalentLevelMultiplier(talentLevel: number): number {
    return TALENT_LEVEL_MULTIPLIER[talentLevel] ?? 1;
}

export function calculateDefenseMultiplier(characterLevel: number, enemyLevel: number, defIgnore: number): number {
    const numerator = 800 + 8 * characterLevel;
    const denominator = numerator + (792 + 8 * enemyLevel) * (1 - defIgnore);
    return numerator / denominator;
}

export function calculateResistanceMultiplier(resistance: number): number {
    return 1 - resistance;
}

// Potentially needs to add defense buffs if there are buffs that buff defense
export function applyBuffToStats (stats: CharacterStatsSnapshot, buffs: ActiveBuff[], baseStats: BaseStats): CharacterStatsSnapshot {
    const active = buffs.filter((b) => b.active);
    const result = {...stats};

    for (const buff of active) {
        if (buff.type === "flat_stat" && buff.stat) {
            const key = buff.stat as keyof CharacterStatsSnapshot;
            if (key in result) {
                (result[key] as number) += buff.value;
            }
        }

        if (buff.type === "percent_stat" && buff.stat === "atk") {
            result.atk += baseStats.atk * buff.value;
        }

        if (buff.type === "crit_rate") result.critRate += buff.value;
        if (buff.type === "crit_damage") result.critDmg += buff.value;
    }

    return result;
}

export function calculateAmplificationMultiplier(damageType: DamageType[], buffs: ActiveBuff[], element: Element): number {
    let amp = 0;
    for (const buff of buffs) {
        if (!buff.active) continue;

        if (buff.type === "all_amp") {
            amp += buff.value;
        }

        if (buff.type === "basic_amp" && damageType.includes("basic")) {
            amp += buff.value;
        }

        if (buff.type === "skill_amp" && damageType.includes("resonance_skill")) {
            amp += buff.value;
        }

        if (buff.type === "liberation_amp" && damageType.includes("resonance_liberation")) {
            amp += buff.value;
        }

        if (buff.type === "heavy_amp" && damageType.includes("heavy")) {
            amp += buff.value;
        }

        if (buff.type === "echo_amp" && damageType.includes("echo")) {
            amp += buff.value;
        }

        if (buff.type === "frazzle_amp" && damageType.includes("frazzle")) {
            amp += buff.value;
        }

        if (buff.type === "erosion_amp" && damageType.includes("erosion")) {
            amp += buff.value;
        }

        if (buff.type === "chafe_amp" && damageType.includes("chafe")) {
            amp += buff.value;
        }

        if (buff.type === "bane_amp" && damageType.includes("bane")) {
            amp += buff.value;
        }

        if (buff.type === "burst_amp" && damageType.includes("burst")) {
            amp += buff.value;
        }

        if (buff.type === "flare_amp" && damageType.includes("flare")) {
            amp += buff.value;
        }

        if (buff.type === "fusion_amp" && element === "Fusion") {
            amp += buff.value;
        }

        if (buff.type === "glacio_amp" && element === "Glacio") {
            amp += buff.value;
        }

        if (buff.type === "electro_amp" && element === "Electro") {
            amp += buff.value;
        }

        if (buff.type === "spectro_amp" && element === "Spectro") {
            amp += buff.value;
        }

        if (buff.type === "aero_amp" && element === "Aero") {
            amp += buff.value;
        }

        if (buff.type === "havoc_amp" && element === "Havoc") {
            amp += buff.value;
        }
    }

    return 1 + amp
}

export function calculateDamageBonus(
    stats: CharacterStatsSnapshot, 
    buffs: ActiveBuff[], 
    damageType: DamageType[],
    element: string, 
    talentCategory: DamageFormulaInput["hit"]["talentCategory"]) : number {
    
    
    let bonus = 1;
    
    if (stats.aeroBonus !== 0 && element.toLowerCase() === "aero") {
        bonus += stats.aeroBonus;
    }

    if (stats.havocBonus !== 0 && element.toLowerCase() === "havoc") {
        bonus += stats.havocBonus;
    }

    if (stats.fusionBonus !== 0 && element.toLowerCase() === "fusion") {
        bonus += stats.fusionBonus;
    }

    if (stats.spectroBonus !== 0 && element.toLowerCase() === "spectro") {
        bonus += stats.spectroBonus;
    }

    if (stats.glacioBonus !== 0 && element.toLowerCase() === "glacio") {
        bonus += stats.glacioBonus;
    }

    if (stats.electroBonus !== 0 && element.toLowerCase() === "electro") {
        bonus += stats.electroBonus;
    }

    bonus += stats.flatDamageBonus

    const damageTypeMap: Record<string, keyof CharacterStatsSnapshot> = {
        basic:      "basicDamageBonus",
        heavy:      "heavyDamageBonus",
        skill: "skillDamageBonus",
        liberation: "liberationDamageBonus",
        echo:       "echoDamageBonus",
        frazzle: "spectroFrazzleDamageBonus",
        erosion: "aeroErosionDamageBonus",
        chafe: "glacioChafeDamageBonus",
        flare: "electroFlareDamageBonus",
        burst: "fusionBurstDamageBonus",
        bane: "havocBaneDamageBonus"

    }

    for (const type of damageType) {
        const bonusKey = damageTypeMap[type]
        if (bonusKey) {
                bonus += stats[bonusKey] as number
        }
    }

    const activeDamageBuffs = buffs.filter((b) => b.active && b.type === "damage_bonus");

    for (const buff of activeDamageBuffs) {
        const category = buff.bonusCategory;
        if (!category || category === "all") {
            bonus += buff.value;
            continue;
        }
        if (category === "elemental") {
            bonus += buff.value;
            continue;
        }

        if (
            category === "basic" && damageType.includes("basic") ||
            category === "skill" && damageType.includes("resonance_skill") ||
            category === "liberation" && damageType.includes("resonance_liberation") ||
            category === "heavy" && damageType.includes("heavy") ||
            category === "echo" && damageType.includes("echo") ||
            category === "frazzle" && damageType.includes("frazzle") ||
            category === "erosion" && damageType.includes("erosion") ||
            category === "flare" && damageType.includes("flare") ||
            category === "chafe" && damageType.includes("chafe") ||
            category === "bane" && damageType.includes("bane") ||
            category === "burst" && damageType.includes("burst")
        ) {
            bonus += buff.value;
        }
    }

    return bonus;

}

export function calculateCritMultiplier(critRate: number, critDamage: number, mode: DamageFormulaInput["mode"]["critMode"]): number {
    const clampedCritRate = Math.min(Math.max(critRate, 0), 1);
    switch (mode) {
        case "crit": return critDamage;
        case "non_crit": return 1;
        case "average": return 1 + clampedCritRate * (critDamage - 1)
    }
}

export function resolveScalingStat(stats: CharacterStatsSnapshot, scalingStat: ScalingStat): number {
    switch (scalingStat) {
        case "atk": return stats.atk
        case "hp":  return stats.hp
        case "def": return stats.def
    }
}

export function calculateDefenseIgnore(buffs: ActiveBuff[]): number {
    return buffs.filter((b) => b.active && b.type === "ignore_defense").reduce((sum, b) => sum + b.value, 0);
}

export function roundDamage(value: number): number {
  const integerPart = Math.floor(value)
  const fractionalPart = value - integerPart

  return fractionalPart >= 0.4 ? integerPart + 1 : integerPart
}

export function calculateHitDamage(
    input: DamageFormulaInput,
    hit: ResolvedHit): HitDamageResult {
    
    const buffedStats = applyBuffToStats(input.stats, input.buffs, input.character.baseStats);
    const defIgnore = calculateDefenseIgnore(input.buffs);
    
    const scalingStatValue = resolveScalingStat(buffedStats, hit.scalingStat);
    const rawMultiplierDamage = scalingStatValue * hit.multiplier;
    const flatBonusDamage     = hit.flatBonus ?? 0;

    const critMultiplier = calculateCritMultiplier(buffedStats.critRate, buffedStats.critDmg, input.mode.critMode);
    const bonusMultiplier = calculateDamageBonus(buffedStats, input.buffs, hit.damageTypes,input.character.element, input.hit.talentCategory);

    const resistanceMultiplier = calculateResistanceMultiplier(input.enemy.elementalResistance ?? input.enemy.resistance);
    const defenseMultiplier = calculateDefenseMultiplier(90, input.enemy.level, defIgnore);
    const amplificationMultiplier = calculateAmplificationMultiplier(hit.damageTypes, input.buffs, input.character.element);
    
    const perHitDamage = 
        (rawMultiplierDamage + flatBonusDamage) *
        bonusMultiplier *
        critMultiplier *
        defenseMultiplier *
        amplificationMultiplier *
        resistanceMultiplier;
    
        const perHitDamageRounded = roundDamage(perHitDamage);
    
    const hitCount = hit.hitCount ?? 1;
    const totalDamage = perHitDamageRounded * hitCount;

    const breakdown: DamageFormulaBreakdown = {
        scalingStatValue,
        rawMultiplierDamage,
        flatBonusDamage,
        bonusMultiplier,
        critMultiplier,
        defenseMultiplier,
        resistanceMultiplier,
        totalDamage,
    }

    return {
        hitName: hit.hitName,
        damageType: hit.damageTypes,
        totalDamage,
        perHitDamage,
        hitCount,
        critMode: input.mode.critMode,
        breakdown,
    }
}