import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
	const rows = await query(
		'SELECT character_id, name, element, weapon, rarity FROM characters ORDER BY character_id',
	);
	return NextResponse.json(rows);
}