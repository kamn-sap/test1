import React, { useState } from 'react';

interface TestCaseFormProps {
  onSubmit: (testCase: any) => void;
}

const TestCaseForm: React.FC<TestCaseFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purpose: '',
    preconditions: '',
    steps: '',
    expectedResult: '',
    assignee: '',
    status: 'NOT_EXECUTED',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('タイトルは必須です');
      return;
    }
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      purpose: '',
      preconditions: '',
      steps: '',
      expectedResult: '',
      assignee: '',
      status: 'NOT_EXECUTED',
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="TestCaseForm">
      <h2>🆕 新規テストケース作成</h2>
      
      {submitted && <div className="Alert Alert-success">テストケースを作成しました！</div>}

      <div className="FormGroup">
        <label htmlFor="title">タイトル *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="例: ログイン画面のバリデーション"
          required
        />
      </div>

      <div className="FormGroup">
        <label htmlFor="purpose">テストの目的</label>
        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="このテストで達成したいこと"
          rows={3}
        />
      </div>

      <div className="FormGroup">
        <label htmlFor="preconditions">前提条件</label>
        <textarea
          id="preconditions"
          name="preconditions"
          value={formData.preconditions}
          onChange={handleChange}
          placeholder="テスト実施前の準備事項"
          rows={3}
        />
      </div>

      <div className="FormGroup">
        <label htmlFor="steps">テスト手順</label>
        <textarea
          id="steps"
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          placeholder="ステップby解説"
          rows={4}
        />
      </div>

      <div className="FormGroup">
        <label htmlFor="expectedResult">期待される結果</label>
        <textarea
          id="expectedResult"
          name="expectedResult"
          value={formData.expectedResult}
          onChange={handleChange}
          placeholder="テスト成功時の結果"
          rows={3}
        />
      </div>

      <div className="FormGroup">
        <label htmlFor="assignee">担当者</label>
        <input
          type="text"
          id="assignee"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          placeholder="担当者名"
        />
      </div>

      <button type="submit" className="Button Button-primary">
        作成
      </button>
    </form>
  );
};

export default TestCaseForm;
