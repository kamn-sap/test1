import React, { useState, useEffect } from 'react';
import './App.css';
import TestCaseForm from './components/TestCaseForm';
import TestCaseList from './components/TestCaseList';
import PairwiseGenerator from './components/PairwiseGenerator';

interface TestCase {
  id: string;
  title: string;
  description?: string;
  purpose?: string;
  preconditions?: string;
  steps?: string;
  expectedResult?: string;
  status: 'NOT_EXECUTED' | 'PASSED' | 'FAILED' | 'BLOCKED';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'pairwise'>('list');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    setLoading(true);
    try {
      // GraphQL クエリ
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              listTestCases {
                id
                title
                status
                assignee
                createdAt
                updatedAt
              }
            }
          `
        })
      });
      const data = await response.json();
      if (data.data?.listTestCases) {
        setTestCases(data.data.listTestCases);
      }
    } catch (error) {
      console.error('Failed to fetch test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestCase = async (newTestCase: Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation CreateTestCase($input: CreateTestCaseInput!) {
              createTestCase(input: $input) {
                id
                title
                status
                createdAt
                updatedAt
              }
            }
          `,
          variables: { input: newTestCase }
        })
      });
      const data = await response.json();
      if (data.data?.createTestCase) {
        setTestCases([...testCases, data.data.createTestCase]);
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Failed to create test case:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧪 テスト項目管理システム</h1>
        <p>アプリケーションテスト、効率化ツール</p>
      </header>

      <nav className="Tab-navigation">
        <button 
          className={`Tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 テストケース一覧 ({testCases.length})
        </button>
        <button 
          className={`Tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ➕ 新規作成
        </button>
        <button 
          className={`Tab-button ${activeTab === 'pairwise' ? 'active' : ''}`}
          onClick={() => setActiveTab('pairwise')}
        >
          🔀 ペアワイズ生成
        </button>
      </nav>

      <main className="App-main">
        {loading && <div className="Loading">読み込み中...</div>}

        {activeTab === 'list' && (
          <TestCaseList 
            testCases={testCases} 
            onRefresh={fetchTestCases}
          />
        )}

        {activeTab === 'create' && (
          <TestCaseForm onSubmit={handleCreateTestCase} />
        )}

        {activeTab === 'pairwise' && (
          <PairwiseGenerator />
        )}
      </main>
    </div>
  );
}

export default App;
