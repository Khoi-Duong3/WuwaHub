export type Rarity = 4 | 5

export type Element =
	| "Aero"
    | "Electro"
    | "Fusion"
    | "Glacio"
    | "Havoc"
    | "Spectro"

export type WeaponType =
    | "Sword"
    | "Broadblade"
    | "Pistols"
    | "Gauntlets"
    | "Rectifier"

export type StatType =
	| "hp"
	| "atk"
	| "def"
	| "critRate"
	| "critDmg"
	| "energyRegen"
	| "healingBonus"
	| "elementalBonus"

export type ScalingStat =
	| "atk"
	| "hp"
	| "def"

export type TalentCategory =
	| "normal_attack"
	| "resonance_skill"
	| "resonance_liberation"
	| "forte_circuit"
	| "intro_skill"
	| "outro_skill"
	| "inherent_skill"
	| "tune_break"

export type TalentScalingRow = TalentScaling & {
	talentCategory: TalentCategory;
	talentName: string;
	talentLabel: string;
	scalingExpression?: string;
};

export type DamageType =
	| "basic"
	| "heavy"
	| "mid_air"
	| "dodge_counter"
	| "resonance_skill"
	| "resonance_liberation"
	| "intro"
	| "outro"
	| "forte"
	| "echo"
	| "frazzle"
	| "chafe"
	| "erosion"
	| "bane"
	| "flare"
	| "burst"

export interface Character {
	id: string
	name: string
	rarity: Rarity
	element: Element
	weaponType: WeaponType
	baseStats: BaseStats
	ascensionStat?: AscensionStat
	talents: TalentInformation[]
	}

export interface BaseStats {
	hp: number
	atk: number
	def: number
}

export interface AscensionStat {
	stat: StatType
	value: number
}

export interface CharacterStatGrowth {
	characterId: string
	level: number
	ascension: number
	hp: number
	atk: number
	def: number
	bonusStat?: {
		stat: StatType
		value: number
	}
}

export interface TalentInformation {
	id: string
	characterId: number           
	talentCategory: TalentCategory 
	talentName: string
	description: string
	orderIndex: number            
	mediaUrl: string | null       
}

export interface TalentScaling {
	id: string
	talentId: string
	talentLabel: string          
	scalingExpression: string | null 
	cooldown: number | null     
	concertoRegen: number | null 
	staCost: number | null       
	orderIndex: number
	scalingStat: ScalingStat;
	damageTypes: DamageType[]    
}

export interface Weapon {
	id: string
	name: string
	rarity: Rarity
	weaponType: WeaponType
	baseAtk: number
	subStat?: WeaponSubStat
	passive?: WeaponPassive
}

export interface WeaponSubStat {
	stat: StatType
	value: number
}

export interface WeaponPassive {
	name: string
	description: string
	refinements: WeaponPassiveRefinement[]
}

export interface WeaponPassiveRefinement {
	rank: 1 | 2 | 3 | 4 | 5
	values: Record<string, number>
}

export interface WeaponStatGrowth {
	weaponId: string
	level: number
	ascension: number
	baseAtk: number
	subStatValue?: number
}

export interface CalculatorStats {
	hp: number
	atk: number
	def: number
	critRate: number
	critDmg: number
	energyRegen: number
	basicDamageBonus: number
	heavyDamageBonus: number
	skillDamageBonus: number
	liberationDamageBonus: number
	elementalDamageBonus: number
	flatDamageBonus: number
}

export interface CalculatorInput {
	character: Character
	weapon?: Weapon
	characterLevel: number
	characterAscension: number
	weaponLevel?: number
	weaponAscension?: number
	talentLevels: Partial<Record<TalentCategory, number>>
	totalStats: CalculatorStats
}

export interface DamageResult {
	talentCategory: TalentCategory
	talentName: string
	level: number
	hitName: string
	baseDamage: number
	critDamage: number
	averageDamage: number
}