import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const talentScalingPath = path.join(__dirname, 'lynae-talent-scalings.json');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

type TalentScalingIntermediate = {
    characterId: number;
    talentCategory: string;
    talentName: string;
    talentLabel: string;
    scalingExpression: string | null;
    cooldown: number | null;
    concertoRegen: number | null;
    staCost: number | null;
    scaling_stat: string | null;
    damageTypes: string[];
    orderIndex: number;
};

async function seedTalentScalings() {
    const client = await pool.connect();
    try {
        const raw = fs.readFileSync(talentScalingPath, 'utf-8');
        const rows: TalentScalingIntermediate[] = JSON.parse(raw);

        await client.query('BEGIN');
        for (const row of rows) {
            const { rows: talentRows } = await client.query(
                `
                SELECT Id
                FROM talent_information
                WHERE character_id = $1
                    AND talent_category = $2
                    AND talent_name = $3
                `,
                [row.characterId, row.talentCategory, row.talentName],
            );

            if (talentRows.length === 0) {
                console.warn(`Missing talent_information 
                    for (${row.characterId}, ${row.talentCategory}, ${row.talentName}) – skipping "${row.talentLabel}"`);
                continue;
            }

            const talentId: string = talentRows[0].id;

            await client.query(
                `
                INSERT INTO talent_scalings (
                    talent_id,
                    talent_label,
                    scaling_expression,
                    cooldown,
                    concerto_regen,
                    sta_cost,
                    order_index,
                    scaling_stat,
                    damage_types
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (talent_id, talent_label)
                DO UPDATE SET
                    scaling_expression = EXCLUDED.scaling_expression,
                    cooldown = EXCLUDED.cooldown,
                    concerto_regen = EXCLUDED.concerto_regen,
                    sta_cost = EXCLUDED.sta_cost,
                    order_index = EXCLUDED.order_index,
                    scaling_stat = EXCLUDED.scaling_stat,
                    damage_types = EXCLUDED.damage_types
    
                `,
                [
                    talentId,
                    row.talentLabel,
                    row.scalingExpression,
                    row.cooldown,
                    row.concertoRegen,
                    row.staCost,
                    row.orderIndex,
                    row.scaling_stat,
                    row.damageTypes,
                ],
            );
        }

        await client.query('COMMIT');
        console.log(`Seeded ${rows.length} talent_scalings rows (some may be skipped if parent missing)`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding talent_scalings:', err);
    } finally {
        client.release();
    }
}

seedTalentScalings().then(() => process.exit(0));