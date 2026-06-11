// src/lib/damageCalc/parseScalingExpression.test.ts

import { describe, it, expect } from 'vitest';
import {
    parseScalingExpression,
    totalHitCount,
    totalEffectiveMultiplier,
} from './parseScalingExpression';

describe('parseScalingExpression', () => {
    it('parses a single hit with no repeat', () => {
        expect(parseScalingExpression('33.92%')).toEqual([
        { multiplier: 0.3392, hitCount: 1 },
        ]);
    });

    it('parses a multi-hit string with different values (Stage 2)', () => {
        expect(parseScalingExpression('10.17%+15.25%+25.42%')).toEqual([
        { multiplier: 0.1017, hitCount: 1 },
        { multiplier: 0.1525, hitCount: 1 },
        { multiplier: 0.2542, hitCount: 1 },
        ]);
    });

    it('parses a repeated hit followed by a single (Stage 3)', () => {
        expect(parseScalingExpression('6.82%*3+13.63%+34.08%')).toEqual([
        { multiplier: 0.0682, hitCount: 3 },
        { multiplier: 0.1363, hitCount: 1 },
        { multiplier: 0.3408, hitCount: 1 },
        ]);
    });

    it('parses Stage 4 with *5 repeat', () => {
        expect(parseScalingExpression('4.93%*5+73.88%')).toEqual([
        { multiplier: 0.0493, hitCount: 5 },
        { multiplier: 0.7388, hitCount: 1 },
        ]);
    });

    it('parses Dodge Counter expression', () => {
        expect(parseScalingExpression('19.04%*3+38.08%+95.19%')).toEqual([
        { multiplier: 0.1904, hitCount: 3 },
        { multiplier: 0.3808, hitCount: 1 },
        { multiplier: 0.9519, hitCount: 1 },
        ]);
    });

    it('parses Heavy Attack Charged I', () => {
        expect(parseScalingExpression('13.59%+54.36%')).toEqual([
        { multiplier: 0.1359, hitCount: 1 },
        { multiplier: 0.5436, hitCount: 1 },
        ]);
    });

    it('handles whitespace around the expression', () => {
        expect(parseScalingExpression('  33.92%  ')).toEqual([
        { multiplier: 0.3392, hitCount: 1 },
        ]);
    });

    it('throws on an empty string', () => {
        expect(() => parseScalingExpression('')).toThrow();
    });

    it('throws on a malformed segment', () => {
        expect(() => parseScalingExpression('33.92+15%')).toThrow(
        /invalid segment/
        );
    });
});

describe('totalHitCount', () => {
    it('sums hit counts across all parts', () => {
        const parts = parseScalingExpression('6.82%*3+13.63%+34.08%');
        expect(totalHitCount(parts)).toBe(5);
    });
});

describe('totalEffectiveMultiplier', () => {
    it('computes sum of multiplier * hitCount', () => {
        const parts = parseScalingExpression('6.82%*3+13.63%+34.08%');
        // 0.0682*3 + 0.1363 + 0.3408 = 0.2046 + 0.1363 + 0.3408 = 0.6817
        expect(totalEffectiveMultiplier(parts)).toBeCloseTo(0.6817, 4);
    });
});