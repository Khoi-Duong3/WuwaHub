import type {
    Character,
    Weapon,
    TalentCategory,
    DamageType,
    ScalingStat,
    Element
} from "@/types/database"

export type BonusCategory =
    | "all"
    | "elemental"
    | "basic"
    | "heavy"
    | "mid_air"
    | "skill"
    | "liberation"
    | "forte"
    | "intro"
    | "outro"
    | "echo"
    | "frazzle"
    | "bane"
    | "erosion"
    | "chafe"
    | "burst"
    | "flare"

export type BuffType =
    | "flat_stat"
    | "percent_stat"
    | "damage_bonus"
    | "crit_rate"
    | "crit_damage"
    | "resistance_shred"
    | "defense_shred"
    | "ignore_defense"
    | "multiplier_bonus"
    | "all_amp"
    | "basic_amp"
    | "heavy_amp"
    | "liberation_amp"
    | "skill_amp"
    | "echo_amp"
    | "frazzle_amp"
    | "erosion_amp"
    | "chafe_amp"
    | "flare_amp"
    | "bane_amp"
    | "burst_amp"
    | "fusion_amp"
    | "glacio_amp"
    | "spectro_amp"
    | "havoc_amp"
    | "aero_amp"
    | "electro_amp"

export type StatKey =
    | "hp"
    | "atk"
    | "def"
    | "critRate"
    | "critDmg"
    | "energyRegen"

export interface CharacterStatsSnapshot {
    hp: number
    atk: number
    def: number
    critRate: number
    critDmg: number
    energyRegen: number
    healingBonus: number
    fusionBonus: number
    glacioBonus: number
    electroBonus: number
    spectroBonus: number
    havocBonus: number
    aeroBonus: number
    basicDamageBonus: number
    heavyDamageBonus: number
    skillDamageBonus: number
    liberationDamageBonus: number
    echoDamageBonus: number
    flatDamageBonus: number
    spectroFrazzleDamageBonus: number
    aeroErosionDamageBonus: number
    glacioChafeDamageBonus: number
    havocBaneDamageBonus: number
    fusionBurstDamageBonus: number
    electroFlareDamageBonus: number
}

export interface EnemyStats {
    level: number
    resistance: number
    elementalResistance?: number
    element?: Element
}

export interface ActiveBuff {
    id: string
    name: string
    source: string
    type: BuffType
    value: number
    stat?: StatKey
    bonusCategory?: BonusCategory
    appliesTo?: DamageType[]
    active: boolean
    durationSeconds?: number
    stacks?: number
    maxStacks?: number
    condition?: string
}

export interface HitContext {
    talentCategory: TalentCategory
    flatBonus?: number
    hitCount?: number
    element?: Element
}

export interface CalculationMode {
    critMode: "non_crit" | "crit" | "average"
}

export interface DamageFormulaInput {
    character: Character
    weapon?: Weapon
    stats: CharacterStatsSnapshot
    enemy: EnemyStats
    charLevel: number
    hit: HitContext
    buffs: ActiveBuff[]
    mode: CalculationMode
}

export interface DamageFormulaBreakdown {
    scalingStatValue: number
    rawMultiplierDamage: number
    flatBonusDamage: number
    bonusMultiplier: number
    critMultiplier: number
    defenseMultiplier: number
    resistanceMultiplier: number
    totalDamage: number
}

export interface HitDamageResult {
    hitName: string
    damageType: DamageType[]
    totalDamage: number
    perHitDamage: number
    hitCount: number
    critMode: CalculationMode["critMode"]
    breakdown: DamageFormulaBreakdown
}

export interface TalentDamageResult {
    talentCategory: TalentCategory
    talentName: string
    talentLevel: number
    hits: HitDamageResult[]
    totalDamage: number
}

export interface CalculatorState {
    selectedCharacterId: string | null
    selectedWeaponId: string | null
    characterLevel: number
    characterAscension: number
    weaponLevel: number
    weaponAscension: number
    talentLevels: Partial<Record<TalentCategory, number>>
    statOverrides?: Partial<CharacterStatsSnapshot>
    buffs: ActiveBuff[]
    enemy: EnemyStats
    critMode: CalculationMode["critMode"]
}

export interface RotationStep {
    id: string
    label: string
    talentCategory: TalentCategory
    hitNames?: string[]
}

export interface RotationResult {
    steps: Array<{
        stepId: string
        label: string
        totalDamage: number
    }>
    totalDamage: number
}

export type DamageInput = {
  motionValue: number;       
  totalAttack: number;
  critDamage: number;        
  damageBonus: number;       
  enemyResistance: number;   
  defIgnore: number;         
  charLevel: number;
  enemyLevel: number;
};

export type DamageResult = {
  damage: number;
  resistanceMultiplier: number;
  defenseMultiplier: number;
};