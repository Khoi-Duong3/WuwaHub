import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const characterId = url.searchParams.get('characterId');

    if (!characterId) {
        return NextResponse.json(
            { error: 'characterId is required' },
            { status: 400 }
        );
    }

    const rows = await query(
        `
        SELECT 
            ts.talent_id AS "talentId",
            ts.talent_label AS "talentLabel",
            ts.scaling_expression AS "scalingExpression",
            ts.cooldown,
            ts.concerto_regen AS "concertoRegen",
            ts.sta_cost AS "staCost",
            ts.order_index AS "orderIndex",
            ts.damage_types AS "damageTypes",
            ts.scaling_stat AS "scalingStat",
            info.talent_category AS "talentCategory"
        FROM talent_scalings ts
        JOIN talent_information info ON info.id = ts.talent_id
        WHERE info.character_id = $1
        `,
        [characterId]
    );

    return NextResponse.json(rows);
}