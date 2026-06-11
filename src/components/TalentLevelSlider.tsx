import React from 'react'
import type { TalentLevels } from "@/hooks/useDamageCalc";


type Props = {
    talentLevels: TalentLevels;
    onLevelChange: (category: keyof TalentLevels, level: number) => void;
};

export function TalentLevelSliders({talentLevels, onLevelChange}: Props) {
    return (
        <div className="space-y-4">
            <SliderRow
                label="Normal Attack"
                value={talentLevels.normal_attack}
                onChange={(level) => onLevelChange("normal_attack", level)}
            />
            <SliderRow
                label="Resonance Skill"
                value={talentLevels.resonance_skill}
                onChange={(level) => onLevelChange("resonance_skill", level)}
            />
            <SliderRow
                label="Forte Circuit"
                value={talentLevels.forte_circuit}
                onChange={(level) => onLevelChange("forte_circuit", level)}
            />
            <SliderRow
                label="Resonance Liberation"
                value={talentLevels.resonance_liberation}
                onChange={(level) => onLevelChange("resonance_liberation", level)}
            />
            <SliderRow
                label="Intro Skill"
                value={talentLevels.intro_skill}
                onChange={(level) => onLevelChange("intro_skill", level)}
            />
        </div>
  );
}

type SliderRowProps = {
    label: string,
    value: number
    onChange: (level: number) => void;
};

function SliderRow({ label, value, onChange }: SliderRowProps) {
    return (
        <div>
            <div className="mb-1 flex items-center justify-between">
                <label className="text-sm">{label}</label>
                <span className="text-sm">{value}</span>
            </div>
            <input
                type="range"
                min={1}
                max={10}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-catppuccin-blue"
            />
        </div>
  );
}