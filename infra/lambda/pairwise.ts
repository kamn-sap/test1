/**
 * オールペア法（ペアワイズテスト）実装
 * 因子と水準を组み合わせて、全ペアの組み合わせを生成
 */

export interface PairwiseInput {
  factors: string[][];  // [[値1, 値2, ...], [値A, 値B, ...], ...]
}

export interface PairwiseResult {
  combinations: string[][];
  pairsCovered: number;
  totalPairs: number;
}

export function generatePairwise(factors: string[][]): PairwiseResult {
  if (factors.length === 0) {
    return { combinations: [], pairsCovered: 0, totalPairs: 0 };
  }

  const combinations: string[][] = [];
  const pairs = new Set<string>();

  // 全ペアを列挙
  for (let i = 0; i < factors.length; i++) {
    for (let j = i + 1; j < factors.length; j++) {
      for (const val1 of factors[i]) {
        for (const val2 of factors[j]) {
          pairs.add(`${i}:${val1}|${j}:${val2}`);
        }
      }
    }
  }

  const totalPairs = pairs.size;
  const coveredPairs = new Set<string>();

  // グリーディアルゴリズムで組み合わせを生成
  while (coveredPairs.size < Math.min(totalPairs, 100)) { // 最大100組み合わせ
    const combo = generateRandomCombination(factors);
    combinations.push(combo);

    // このコンボで覆われたペアを記録
    for (let i = 0; i < combo.length; i++) {
      for (let j = i + 1; j < combo.length; j++) {
        const pairKey = `${i}:${combo[i]}|${j}:${combo[j]}`;
        coveredPairs.add(pairKey);
      }
    }
  }

  return {
    combinations,
    pairsCovered: coveredPairs.size,
    totalPairs
  };
}

function generateRandomCombination(factors: string[][]): string[] {
  return factors.map(factor => factor[Math.floor(Math.random() * factor.length)]);
}

/**
 * より効率的なペアワイズ生成（IPOGアルゴリズム風）
 */
export function generatePairwiseOptimized(factors: string[][]): string[][] {
  if (factors.length === 0) return [];
  if (factors.length === 1) return factors[0].map(v => [v]);

  let combinations: string[][] = [];

  // 最初の2つの因子のすべての組み合わせで初期化
  for (const val0 of factors[0]) {
    for (const val1 of factors[1]) {
      combinations.push([val0, val1]);
    }
  }

  // 3番目以降の因子を追加
  for (let idx = 2; idx < factors.length; idx++) {
    combinations = extendCombinations(combinations, factors[idx], idx);
  }

  return combinations;
}

function extendCombinations(
  existing: string[][],
  newFactor: string[],
  factorIndex: number
): string[][] {
  const extended: string[][] = [];

  for (const value of newFactor) {
    // この値で最も新しいペアをカバーできるコンボを探す
    let bestCombo = null;
    let maxNewPairs = -1;

    for (const combo of existing) {
      const testCombo = [...combo];
      testCombo[factorIndex] = value;
      const newPairs = countNewPairs(testCombo, existing, factorIndex);

      if (newPairs > maxNewPairs) {
        maxNewPairs = newPairs;
        bestCombo = testCombo;
      }
    }

    if (bestCombo) {
      extended.push(bestCombo);
    }
  }

  return extended.length > 0 ? extended : existing;
}

function countNewPairs(combo: string[], existing: string[][], factorIndex: number): number {
  let count = 0;
  for (let i = 0; i < factorIndex; i++) {
    const pair = `${i}:${combo[i]}|${factorIndex}:${combo[factorIndex]}`;
    if (!existingPairs(existing).has(pair)) {
      count++;
    }
  }
  return count;
}

function existingPairs(combinations: string[][]): Set<string> {
  const pairs = new Set<string>();
  for (const combo of combinations) {
    for (let i = 0; i < combo.length; i++) {
      for (let j = i + 1; j < combo.length; j++) {
        pairs.add(`${i}:${combo[i]}|${j}:${combo[j]}`);
      }
    }
  }
  return pairs;
}
