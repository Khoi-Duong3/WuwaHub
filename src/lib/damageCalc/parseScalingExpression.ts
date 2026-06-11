export interface ParsedHitPart {
    multiplier: number;
    hitCount: number;
}


export function parseScalingExpression(expression: string): ParsedHitPart[] {
    if (!expression || expression.trim() === '') {
        throw new Error('parseScalingExpression: expression must not be empty');
    }

    const segments = expression.trim().split('+');

    return segments.map((segment, index) => {
        const match = segment.match(/^(\d+(?:\.\d+)?)%(?:\*(\d+))?$/);
        if (!match) {
            throw new Error(`parseScalingExpression: invalid segment "${segment}" at index ${index} in expression "${expression}"`);
        }

        const multiplier = percentToDecimal(Number(match[1]));
        const hitCount = match[2] ? Number(match[2]) : 1;
        return {multiplier, hitCount};
    });
}

export function totalHitCount(parts: ParsedHitPart[]): number {
    return parts.reduce((sum, part) => sum + part.hitCount, 0);
}

export function totalEffectiveMultiplier(parts: ParsedHitPart[]): number {
    return parts.reduce((sum, part) => sum + part.multiplier * part.hitCount, 0);
}

function percentToDecimal(value: number): number {
    return Math.round(value * 100) / 10000;
}