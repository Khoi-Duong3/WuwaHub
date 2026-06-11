import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import 'dotenv/config';
import { Pool } from 'pg';
import data from './aemeath.transformed.json';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const characterResult = await client.query(
            `
            INSERT INTO characters (character_id, name, element, weapon, rarity)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (character_id) DO UPDATE SET
                name = EXCLUDED.name,
                element = EXCLUDED.element,
                weapon = EXCLUDED.weapon,
                rarity = EXCLUDED.rarity
            RETURNING character_id
            `,
            [
                data.id,
                data.name,
                data.element,
                data.weaponType,
                data.rarity
            ]
        );
        const characterId = characterResult.rows[0].character_id as number;

        const statTypes = ['hp', 'atk', 'def'] as const;
        const rows = data.baseStatsByLevel.flatMap((entry: any, index: number) =>
            statTypes.map((stat) => ({
                character_id: characterId,
                stat_type: stat,
                level: entry.level,
                stat_value: entry[stat],
            })),
        );

        for (const row of rows) {
            await client.query(
                `
                INSERT INTO character_stat_growth
                    (character_id, stat_type, level, stat_value)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (character_id, stat_type, level) DO UPDATE SET
                    level = EXCLUDED.level,
                    stat_value = EXCLUDED.stat_value
                `,
                [row.character_id, row.stat_type, row.level, row.stat_value]
            );
        }

        await client.query('COMMIT');
        console.log(`Seeded ${rows.length} stat rows for ${data.name}`)
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Seed failed:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

seed();