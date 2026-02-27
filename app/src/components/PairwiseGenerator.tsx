import React, { useState } from 'react';

interface PairwiseResult {
  combinations: string[][];
  pairsCovered: number;
  totalPairs: number;
}

const PairwiseGenerator: React.FC = () => {
  const [factors, setFactors] = useState<string[][]>([
    ['Chrome', 'Firefox', 'Safari'],
    ['Windows', 'Mac', 'Linux'],
    ['版1.0', '版1.1', '版2.0'],
  ]);
  const [result, setResult] = useState<PairwiseResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddFactor = () => {
    setFactors([...factors, ['']]);
  };

  const handleRemoveFactor = (index: number) => {
    setFactors(factors.filter((_, i) => i !== index));
  };

  const handleFactorChange = (factorIndex: number, valueIndex: number, newValue: string) => {
    const newFactors = factors.map((factor, fIdx) => {
      if (fIdx === factorIndex) {
        return factor.map((val, vIdx) => vIdx === valueIndex ? newValue : val);
      }
      return factor;
    });
    setFactors(newFactors);
  };

  const handleAddValue = (factorIndex: number) => {
    const newFactors = factors.map((factor, idx) => {
      if (idx === factorIndex) {
        return [...factor, ''];
      }
      return factor;
    });
    setFactors(newFactors);
  };

  const handleRemoveValue = (factorIndex: number, valueIndex: number) => {
    const newFactors = factors.map((factor, fIdx) => {
      if (fIdx === factorIndex) {
        return factor.filter((_, vIdx) => vIdx !== valueIndex);
      }
      return factor;
    });
    setFactors(newFactors);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // GraphQL クエリ
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GeneratePairwise($factors: [[String!]!]!) {
              generatePairwise(factors: $factors) {
                id
                factors
                combinations
              }
            }
          `,
          variables: { factors }
        })
      });
      const data = await response.json();
      if (data.data?.generatePairwise) {
        const combinations = data.data.generatePairwise.combinations;
        setResult({
          combinations,
          pairsCovered: combinations.length,
          totalPairs: combinations.length,
        });
      }
    } catch (error) {
      console.error('Failed to generate pairwise:', error);
      alert('ペアワイズ生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!result) return;

    const csv = [
      result.combinations.map((_, idx) => `因子${idx + 1}`).join(','),
      ...result.combinations.map(combo => combo.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pairwise_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="PairwiseGenerator">
      <h2>🔀 ペアワイズテスト生成</h2>

      <div className="FactorsEditor">
        <h3>因子と水準の定義</h3>
        {factors.map((factor, factorIdx) => (
          <div key={factorIdx} className="FactorGroup">
            <div className="FactorLabel">
              <strong>因子 {factorIdx + 1}</strong>
              {factors.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFactor(factorIdx)}
                  className="Button Button-danger Button-small"
                >
                  ×
                </button>
              )}
            </div>
            <div className="ValuesList">
              {factor.map((value, valueIdx) => (
                <div key={valueIdx} className="ValueInput">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleFactorChange(factorIdx, valueIdx, e.target.value)}
                    placeholder={`水準 ${valueIdx + 1}`}
                  />
                  {factor.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(factorIdx, valueIdx)}
                      className="Button Button-danger Button-small"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddValue(factorIdx)}
                className="Button Button-secondary Button-small"
              >
                + 水準追加
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddFactor}
          className="Button Button-secondary"
        >
          + 因子追加
        </button>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="Button Button-primary Button-large"
      >
        {loading ? '生成中...' : '🧮 ペアワイズを生成'}
      </button>

      {result && (
        <div className="Results">
          <h3>📊 生成結果</h3>
          <p className="ResultsInfo">
            {result.combinations.length} 件の組み合わせが生成されました
            （ペアカバレッジ: {result.pairsCovered}/{result.totalPairs}）
          </p>

          <div className="ResultsTable">
            <table>
              <thead>
                <tr>
                  {factors.map((_, idx) => <th key={idx}>因子 {idx + 1}</th>)}
                </tr>
              </thead>
              <tbody>
                {result.combinations.map((combo, idx) => (
                  <tr key={idx}>
                    {combo.map((value, vIdx) => (
                      <td key={vIdx}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={exportToCSV}
            className="Button Button-secondary"
          >
            📥 CSV にエクスポート
          </button>
        </div>
      )}
    </div>
  );
};

export default PairwiseGenerator;
