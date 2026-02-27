# アーキテクチャ・構成ファイル概要

## システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    フロントエンド層                              │
│  React (Single Page Application)                           │
│  - テストケース管理 UI                                       │
│  - ペアワイズ生成ツール                                       │
│  - リアルタイム同期                                          │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/GraphQL
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               API・認証層                                     │
│  AWS AppSync (GraphQL)                                      │
│  - リアルタイム購読                                          │
│  - 複雑なリレーション管理                                     │
│                                                              │
│  Amazon Cognito                                             │
│  - ユーザー認証                                               │
│  - 権限管理 (チームごと)                                      │
└───────────────┬──────────────────────────────────────────┬──┘
                │                                           │
                ▼                                           ▼
┌──────────────────────────────────┐  ┌──────────────────┐
│      ビジネスロジック層              │  │ データベース層    │
│  AWS Lambda Functions             │  │                  │
│  - テストケース CRUD              │  │ DynamoDB        │
│  - ペアワイズ生成                  │  │ テストケース保存  │
│  - エビデンス処理                  │  │                  │
│  - CSV/Excel インポート            │  │ インデックス:    │
│  - 自動テスト連携                  │  │  - id (Primary) │
└──────────────────────────────────┘  │  - status       │
                                       │  - assignee     │
                                       └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               ストレージ層                                    │
│  Amazon S3                                                   │
│  - エビデンス画像、ログ、生成ファイル                           │
│  - CloudFront経由で配信                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## ファイル構成と責務

### 📂 `/infra` - Infrastructure as Code (AWS CDK)

```
infra/
├── bin/
│   └── infra.ts               # CDK アプリケーションエントリーポイント
│                               # ローカル/本番環境の切り替え
├── lib/
│   └── infra-stack.ts         # AWS リソース定義
│                               # - S3, CloudFront
│                               # - Cognito, AppSync
│                               # - Lambda, DynamoDB
│                               # - IAM ロール・権限
├── lambda/
│   ├── testcase-handler.ts    # テストケース CRUD 操作
│   │                           # - Create: 新規作成
│   │                           # - Read: 取得・一覧
│   │                           # - Update: 更新
│   │                           # - Delete: 削除
│   └── pairwise.ts            # ペアワイズテスト生成
│                               # - IPOGアルゴリズム
│                               # - オールペア法実装
├── schema.graphql             # GraphQL スキーマ定義
│                               # - Query, Mutation, Type 定義
├── package.json               # Node.js 依存関係
└── tsconfig.json              # TypeScript 設定
```

### 📂 `/app` - React Frontend

```
app/
├── src/
│   ├── App.tsx                # メインアプリケーションコンポーネント
│   │                           # - タブナビゲーション
│   │                           # - GraphQL 連携
│   ├── App.css                # グローバルスタイル
│   │                           # - レスポンシブデザイン
│   │                           # - ダークモード対応予定
│   └── components/
│       ├── TestCaseForm.tsx    # テストケース作成フォーム
│       │                        # - バリデーション
│       │                        # - GraphQL mutation
│       ├── TestCaseList.tsx    # テストケース一覧表示
│       │                        # - ステータス絞込み
│       │                        # - 統計情報表示
│       └── PairwiseGenerator.tsx # ペアワイズ生成ツール
│                                # - 因子・水準入力
│                                # - CSV エクスポート
├── public/
│   └── index.html             # HTML エントリーポイント
├── package.json               # React 依存関係
└── tsconfig.json              # TypeScript 設定
```

### 📄 ルートレベルの設定ファイル

```
.
├── docker-compose.yml         # LocalStack セットアップ
│                               # - DynamoDB
│                               # - AppSync (スタブ)
│                               # - Cognito
│                               # - DynamoDB Admin UI
├── README.md                  # プロジェクト概要
├── LOCAL_DEV_GUIDE.md         # ローカル開発ガイド
├── ARCHITECTURE.md            # このファイル
└── scripts/
    └── deploy-local.sh        # ローカルデプロイスクリプト
```

---

## データフロー

### テストケース作成フロー

```
ユーザー入力
    ↓
React Form (TestCaseForm)
    ↓
GraphQL Mutation (createTestCase)
    ↓
AppSync API
    ↓
Lambda Handler (testcase-handler.ts)
    ↓
DynamoDB Insert
    ↓
✅ 成功レスポンス
```

### ペアワイズ生成フロー

```
ユーザーが因子・水準を入力
    ↓
PairwiseGenerator コンポーネント
    ↓
GraphQL Query (generatePairwise)
    ↓
AppSync API
    ↓
Lambda Handler (pairwise.ts)
    - IPOG アルゴリズム実行
    - ペアカバレッジ計算
    ↓
組み合わせテーブルを返却
    ↓
React でテーブル表示
    ↓
CSV エクスポート
```

---

## デプロイメントの流れ

### ローカル開発環境

```
1. docker-compose up -d    # LocalStack 起動
2. cd infra && npm install # 依存パッケージ
3. npm run build           # TypeScript コンパイル
4. npm run deploy:local    # CDK デプロイ (LocalStack)
5. cd ../app && npm start  # React 開発サーバー起動
```

### 本番環境へのデプロイ

```
1. AWS 認証情報を設定
   - export AWS_ACCOUNT_ID=xxx
   - export AWS_REGION=ap-northeast-1
   
2. cd infra && npm install
3. npm run build
4. npm run deploy          # 本番環境に CDK デプロイ
5. React ビルド & デプロイ
   - cd ../app && npm run build
   - S3 へアップロード
```

---

## 技術スタック

| レイヤー | テクノロジー | 用途 |
|---------|-----------|------|
| **フロントエンド** | React 18 + TypeScript | ユーザーインターフェース |
| **スタイリング** | CSS3 | レスポンシブデザイン |
| **API** | GraphQL (AWS AppSync) | リアルタイム通信 |
| **認証** | Amazon Cognito | ユーザー管理・権限制御 |
| **バックエンド** | AWS Lambda (Node.js) | ビジネスロジック |
| **データベース** | Amazon DynamoDB | テストケース保存 |
| **ホスティング** | S3 + CloudFront | Web サイト配信 |
| **Infrastructure** | AWS CDK (TypeScript) | IaC |
| **ローカル開発** | LocalStack + Docker | 開発環境 |

---

## スケーラビリティと拡張性

### 現在実装済み
- ✅ テストケースの CRUD
- ✅ ペアワイズテスト生成
- ✅ ユーザー認証・権限管理
- ✅ GraphQL API

### 将来追加予定
- 📋 テスト実行管理（Test Run）
- 📊 レポート生成機能
- 🔗 Redmine/GitHub Issues 連携
- 📁 CSV/Excel インポート・エクスポート
- 🤖 AI によるテストケース生成（Copilot 統合）
- 🔌 Selenium/Appium との自動テスト連携
- 📧 メール通知、Slack 連携
- 🌐 複言語対応（日本語、英語、etc.）

---

## パフォーマンス最適化

- **DynamoDB オンデマンドモード**: スケーラブルな課金
- **AppSync キャッシング**: GraphQL クエリの高速化
- **CloudFront CDN**: グローバルな低遅延配信
- **Lambda オートスケーリング**: 負荷に応じた自動スケール
- **React コード分割**: 初期ロード時間削減

---

## セキュリティ考慮事項

- 🔐 Cognito による認証・認可
- 🔒 IAM ロールベースのアクセス制御
- 🛡️ GraphQL クエリ制限
- 🔑 API キー管理
- 📝 CloudTrail による監査ログ

---

## トラブルシューティング

### よくある問題

| 問題 | 原因 | 解決策 |
|------|------|-------|
| LocalStack 接続エラー | コンテナが起動していない | `docker-compose up -d` を実行 |
| ポート競合エラー | ポートが既に使用中 | `lsof -i :4566` で確認して kill |
| GraphQL エラー | スキーマが同期されていない | CDK を再デプロイ |
| Lambda 実行エラー | 環境変数が設定されていない | .env を確認 |

---

## 参考リンク

- [AWS CDK ドキュメント](https://docs.aws.amazon.com/cdk/)
- [AWS AppSync](https://aws.amazon.com/jp/appsync/)
- [LocalStack](https://localstack.cloud/)
- [React ドキュメント](https://react.dev/)
- [GraphQL 公式サイト](https://graphql.org/)
