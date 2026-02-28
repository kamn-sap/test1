import { v4 as uuidv4 } from 'uuid';

export interface TestCase {
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

export class Database {
  private testCases: Map<string, TestCase> = new Map();

  constructor() {
    // ダミーデータ
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleCases: TestCase[] = [
      {
        id: uuidv4(),
        title: 'ユーザーログイン - 正常系',
        description: '有効な認証情報でログインできることを確認',
        purpose: 'ログイン機能の動作確認',
        preconditions: 'ユーザーが登録済みの状態',
        steps: '1. ログイン画面を開く\n2. メールアドレスとパスワードを入力\n3. ログインボタンをクリック',
        expectedResult: 'ダッシュボード画面が表示される',
        status: 'NOT_EXECUTED',
        assignee: 'テスター1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: 'テストケース作成 - 基本入力',
        description: '新規テストケースを作成できることを確認',
        purpose: 'テストケース作成機能の動作確認',
        preconditions: 'ユーザーがログイン済みの状態',
        steps: '1. 「新規テストケース」ボタンをクリック\n2. 必須項目を入力\n3. 保存ボタンをクリック',
        expectedResult: 'テストケースが作成され、一覧に表示される',
        status: 'PASSED',
        assignee: 'テスター1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    sampleCases.forEach((tc) => {
      this.testCases.set(tc.id, tc);
    });
  }

  listTestCases(): TestCase[] {
    return Array.from(this.testCases.values());
  }

  getTestCase(id: string): TestCase | null {
    return this.testCases.get(id) || null;
  }

  createTestCase(
    title: string,
    description?: string,
    purpose?: string,
    preconditions?: string,
    steps?: string,
    expectedResult?: string,
    assignee?: string
  ): TestCase {
    const now = new Date().toISOString();
    const testCase: TestCase = {
      id: uuidv4(),
      title,
      description,
      purpose,
      preconditions,
      steps,
      expectedResult,
      status: 'NOT_EXECUTED',
      assignee,
      createdAt: now,
      updatedAt: now,
    };

    this.testCases.set(testCase.id, testCase);
    return testCase;
  }

  updateTestCase(
    id: string,
    updates: Partial<Omit<TestCase, 'id' | 'createdAt'>>
  ): TestCase | null {
    const existing = this.testCases.get(id);
    if (!existing) return null;

    const updated: TestCase = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.testCases.set(id, updated);
    return updated;
  }

  deleteTestCase(id: string): boolean {
    return this.testCases.delete(id);
  }
}

export const db = new Database();
