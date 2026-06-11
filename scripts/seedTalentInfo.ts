import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

const talentInfoPath = path.join(__dirname, 'lynae-talent-info.json');

type TalentInfoRow = {
    characterId: number;
    talentCategory: string;
    talentName: string;
    descriptionHtml: string;
    orderIndex: number;
    mediaURL: string | null;
};

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function seedTalentInfo() {
    const client = await pool.connect();
    try {
        const fileContents = fs.readFileSync(talentInfoPath, 'utf-8');
        const rows: TalentInfoRow[] = JSON.parse(fileContents);

        await client.query("BEGIN");

        for (const row of rows) {
            await client.query(
                `
                INSERT INTO talent_information (
                    character_id,
                    talent_category,
                    talent_name,
                    description,
                    order_index,
                    media_url
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (character_id, talent_category, talent_name)
                DO UPDATE SET
                    description = EXCLUDED.description,
                    order_index = EXCLUDED.order_index,
                    media_url = EXCLUDED.media_url
                `,
                [
                    row.characterId,
                    row.talentCategory,
                    row.talentName,
                    row.descriptionHtml,
                    row.orderIndex,
                    row.mediaURL,
                ]
            );
        }

        await client.query("COMMIT");
        console.log(`Seeded ${rows.length} talent_information rows`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding talent_information:', err);
    } finally {
        client.release();
    }
}

seedTalentInfo().then(() => process.exit(0));