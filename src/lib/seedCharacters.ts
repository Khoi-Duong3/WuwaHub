import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Pool } from 'pg';
import data from './characters.json';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

async function seed() {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');

		for (const character of data) {
			await client.query(
				`
				INSERT INTO characters (character_id, name, element, weapon, rarity)
				VALUES ($1, $2, $3, $4, $5)
				ON CONFLICT (character_id) DO UPDATE SET
					name = EXCLUDED.name,
					element = EXCLUDED.element,
					weapon = EXCLUDED.weapon,
					rarity = EXCLUDED.rarity
				`,
				[character.character_id, character.name, character.element, character.weapon, character.rarity]
			);
		}

		await client.query('COMMIT');
		console.log(`Seeded ${data.length} characters`);
	} catch (err) {
		await client.query('ROLLBACK');
		console.error('Seed failed:', err);
		process.exit(1);
	} finally {
		client.release();
	}
}

seed();