/**
 * オールペア法（ペアワイズテスト）- モック実装用
 */

export interface PairwiseResult {
  combinations: string[][];
  pairsCovered: number;
  totalPairs: number;
}

export function generatePairwise(factors: string[][]): PairwiseResult {
  if (factors.length === 0) {
    return { combinations: [], pairsCovered: 0, totalPairs: 0 };
  }

  // 全ペアの組み合わせ数を計算
  const totalPairs = calculateTotalPairs(factors);

  // グリーディアルゴリズムで組み合わせを生成
  const combinations: string[][] = [];
  const coveredPairs = new Set<string>();

  // 最大100パターン、または全ペアをカバーするまで
  const maxCombinations = Math.min(100, Math.ceil(totalPairs / 2));

  for (let i = 0; i < maxCombinations; i++) {
    const combination = generateBestCombination(factors, coveredPairs);
    if (combination.length === 0) break;

    combinations.push(combination);

    // このコンボで覆われたペアを記録
    for (let j = 0; j < combination.length; j++) {
      for (let k = j + 1; k < combination.length; k++) {
        const pairKey = `${j}:${combination[j]}|${k}:${combination[k]}`;
        coveredPairs.add(pairKey);
      }
    }
  }

  return {
    combinations,
    pairsCovered: coveredPairs.size,
    totalPairs,
  };
}

function calculateTotalPairs(factors: string[][]): number {
  let pairCount = 0;
  for (let i = 0; i < factors.length; i++) {
    for (let j = i + 1; j < factors.length; j++) {
      pairCount += factors[i].length * factors[j].length;
    }
  }
  return pairCount;
}

function generateBestCombination(
  factors: string[][],
  coveredPairs: Set<string>
): string[] {
  let bestCombination: string[] = [];
  let maxNewPairs = 0;

  // ランダムに複数の候補を試して最良を選択
  for (let attempt = 0; attempt < 10; attempt++) {
    const combination = factors.map((factor) => {
      return factor[Math.floor(Math.random() * factor.length)];
    });

    // このコンボで新しくカバーできるペア数を計算
    let newPairs = 0;
    for (let i = 0; i < combination.length; i++) {
      for (let j = i + 1; j < combination.length; j++) {
        const pairKey = `${i}:${combination[i]}|${j}:${combination[j]}`;
        if (!coveredPairs.has(pairKey)) {
          newPairs++;
        }
      }
    }

    if (newPairs > maxNewPairs) {
      maxNewPairs = newPairs;
      bestCombination = combination;
    }
  }

  return bestCombination;
}
