import fs from 'fs';
import path from 'path';
import lynae from '../src/lib/lynae.transformed.json';

type TalentScalingRow = {
    characterId: number;
    talentCategory: string;
    talentName: string;
    talentLabel: string;
    scalingExpression: string | null;
    cooldown: number | null;
    concertoRegen: number | null;
    staCost: number | null;
    damageTypes: string[];
    orderIndex: number;
};

type AemeathJson = any;
const data = lynae as AemeathJson;

type TargetField = 'expression' | 'cooldown' | 'concerto_regen' | 'sta_cost';

type AttributeMapping = {
    talentCategory: string;
    talentName: string;
    talentLabel: string;
    target: TargetField;
    orderIndex: number;
};


const ATTRIBUTE_MAP: Record<string, AttributeMapping> = {
    'Basic Attack Stage 1 DMG': {
        talentCategory: 'normal_attack',
        talentName: 'Chroma Drift',
        talentLabel: 'Basic Attack Stage 1 DMG',
        target: 'expression',
        orderIndex: 1,
    },

    'Basic Attack Stage 2 DMG': {
        talentCategory: 'normal_attack',
        talentName: 'Chroma Drift',
        talentLabel: 'Basic Attack Stage 2 DMG',
        target: 'expression',
        orderIndex: 0,
    },

    'Basic Attack Stage 3 DMG': {
        talentCategory: 'normal_attack',
        talentName: 'Chroma Drift',
        talentLabel: 'Basic Attack Stage 3 DMG',
        target: 'expression',
        orderIndex: 0,
    },


};

function extractTalentScaling(): TalentScalingRow[] {
    const characterId = data.Id as number;
    const rows: TalentScalingRow[] = [];

    for (const skill of data.Skills ?? []) {
        const attributes = skill.SkillAttributes ?? [];
        for (const attribute of attributes) {
            const name: string = attribute.attributeName
            const mapping = ATTRIBUTE_MAP[name];
            if (!mapping) continue;

            const firstValue = attribute.values?.[0] as string
            if (!firstValue) continue;

            let scalingExpression: string | null = null;
            let cooldown: number | null = null;
            let concertoRegen: number | null = null;
            let staCost: number | null = null;

            switch (mapping.target) {
                case 'expression':
                    scalingExpression = firstValue;
                    break;
                
                case 'cooldown':
                    cooldown = Number(firstValue);
                    break;

                case 'concerto_regen':
                    concertoRegen = Number(firstValue);
                    break;
                
                case 'sta_cost':
                    staCost = Number(firstValue);
                    break;
            }

            rows.push({
                characterId,
                talentCategory: mapping.talentCategory,
                talentName: mapping.talentName,
                talentLabel: mapping.talentLabel,
                scalingExpression,
                cooldown,
                concertoRegen,
                staCost,
                damageTypes: [], // you will fill this manually later
                orderIndex: mapping.orderIndex,
            });
        }
    }

    return rows
}

function main() {
    const rows = extractTalentScaling();

    const outPath = path.join(__dirname, 'lynae-talents-intermediate.json');
    fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf-8');
    console.log(`Wrote ${rows.length} rows to ${outPath}`);
}

main();