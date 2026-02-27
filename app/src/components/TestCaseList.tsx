import React, { useState } from 'react';

interface TestCase {
  id: string;
  title: string;
  status: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

interface TestCaseListProps {
  testCases: TestCase[];
  onRefresh: () => void;
}

const TestCaseList: React.FC<TestCaseListProps> = ({ testCases, onRefresh }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredCases = filter === 'ALL' 
    ? testCases 
    : testCases.filter(tc => tc.status === filter);

  const statusStats = {
    NOT_EXECUTED: testCases.filter(tc => tc.status === 'NOT_EXECUTED').length,
    PASSED: testCases.filter(tc => tc.status === 'PASSED').length,
    FAILED: testCases.filter(tc => tc.status === 'FAILED').length,
    BLOCKED: testCases.filter(tc => tc.status === 'BLOCKED').length,
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; symbol: string }> = {
      NOT_EXECUTED: { color: '#999', symbol: '⏳' },
      PASSED: { color: '#4CAF50', symbol: '✅' },
      FAILED: { color: '#f44336', symbol: '❌' },
      BLOCKED: { color: '#ff9800', symbol: '🚫' },
    };
    return statusMap[status] || { color: '#999', symbol: '❓' };
  };

  return (
    <div className="TestCaseList">
      <div className="ListHeader">
        <h2>📋 テストケース一覧</h2>
        <button onClick={onRefresh} className="Button Button-secondary">
          🔄 更新
        </button>
      </div>

      <div className="StatsBar">
        <div className="StatCard">
          <span className="StatLabel">未実施</span>
          <span className="StatValue">{statusStats.NOT_EXECUTED}</span>
        </div>
        <div className="StatCard">
          <span className="StatLabel">成功</span>
          <span className="StatValue" style={{ color: '#4CAF50' }}>{statusStats.PASSED}</span>
        </div>
        <div className="StatCard">
          <span className="StatLabel">失敗</span>
          <span className="StatValue" style={{ color: '#f44336' }}>{statusStats.FAILED}</span>
        </div>
        <div className="StatCard">
          <span className="StatLabel">ブロック</span>
          <span className="StatValue" style={{ color: '#ff9800' }}>{statusStats.BLOCKED}</span>
        </div>
      </div>

      <div className="FilterBar">
        {['ALL', 'NOT_EXECUTED', 'PASSED', 'FAILED', 'BLOCKED'].map(status => (
          <button
            key={status}
            className={`FilterButton ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status === 'ALL' ? 'すべて' : status}
          </button>
        ))}
      </div>

      {filteredCases.length === 0 ? (
        <div className="EmptyState">
          <p>テストケースがありません</p>
        </div>
      ) : (
        <table className="TestCaseTable">
          <thead>
            <tr>
              <th>タイトル</th>
              <th>ステータス</th>
              <th>担当者</th>
              <th>作成日</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map(tc => {
              const statusInfo = getStatusBadge(tc.status);
              return (
                <tr key={tc.id} className="TestCaseRow">
                  <td className="TitleCell">{tc.title}</td>
                  <td className="StatusCell">
                    <span 
                      className="StatusBadge"
                      style={{ 
                        backgroundColor: statusInfo.color,
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {statusInfo.symbol} {tc.status}
                    </span>
                  </td>
                  <td>{tc.assignee || '-'}</td>
                  <td>{new Date(tc.createdAt).toLocaleDateString('ja-JP')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestCaseList;
