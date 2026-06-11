import fs from 'fs';
import path from 'path';
import lynae from '../src/lib/lynae.transformed.json';

type TalentInfoRow = {
  characterId: number;
  talentCategory: string;
  talentName: string;
  descriptionHtml: string;
  orderIndex: number;
  mediaURL: string | null;
};

type TransformedSkill = {
  id: number;
  name: string;
  category: string;
  skillType: string;
  description: string;
  media?: string | null;
};

function extractTalentInfo(): TalentInfoRow[] {
  const data = lynae as any;
  const characterId = data.id;

  if (typeof characterId !== 'number') {
    throw new Error('Missing numeric data.id in lynae.transformed.json');
  }

  const skills = data.talents;
  if (!Array.isArray(skills)) {
    throw new Error('Could not find skills array in lynae.transformed.json');
  }

  return (skills as TransformedSkill[]).map((skill, index) => ({
    characterId,
    talentCategory: skill.category ?? 'unknown',
    talentName: skill.name ?? '',
    descriptionHtml: skill.description ?? '',
    orderIndex: index,
    mediaURL: skill.media ?? null,
  }));
}

function main() {
  const rows = extractTalentInfo();
  const outPath = path.join(__dirname, 'lynae-talent-info.json');
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf-8');
  console.log(`Wrote ${rows.length} talent info rows to ${outPath}`);
}

main();