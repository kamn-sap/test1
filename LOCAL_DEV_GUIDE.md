# ローカル開発セットアップガイド

## 🚀 クイックスタート

このプロジェクトをローカルで動作確認するためのステップです。

### 前提条件

- Docker & Docker Compose
- Node.js 18.x 以上
- npm または yarn
- AWS CLI (ローカルスタック用)

---

## 📝 ステップ 1: LocalStack の起動

```bash
# ルートディレクトリで実行
docker-compose up -d

# ログを確認
docker-compose logs -f localstack
```

LocalStack が起動し、ポート `4566` で利用可能になります。

> オプション: DynamoDB Admin UI は `http://localhost:8001` でアクセス可能です。

---

## 📝 ステップ 2: 環境変数の設定

`.env.local` をアプリケーションのルートに作成：

```bash
# インフラ用
export IS_LOCAL=true
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

# Optional for specific endpoints
export LOCALSTACK_ENDPOINT=http://localhost:4566
```

---

## 📝 ステップ 3: インフラのデプロイ（ローカル）

```bash
cd infra

# 依存パッケージをインストール
npm install

# CDK をコンパイル
npm run build

# LocalStack にデプロイ
AWS_ENDPOINT_URL=http://localhost:4566 npm run cdk deploy --profile localstack
```

または、より簡単に：

```bash
# ローカル環境向けのデプロイスクリプト
./scripts/deploy-local.sh
```

---

## 📝 ステップ 4: React フロントエンドの起動

```bash
cd app

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm start
```

ブラウザが自動で開き、`http://localhost:3000` でアプリが起動します。

---

## 🧪 ステップ 5: API の確認

GraphQL Playground でクエリテスト：

```bash
# AppSync エンドポイント（ローカル）
http://localhost:4566/graphql

# または AWS AppSync コンソール
# CDK の出力で確認できます
```

### サンプルクエリ：

```graphql
query {
  listTestCases {
    id
    title
    status
    createdAt
  }
}

mutation {
  createTestCase(input: {
    title: "ログイン機能のテスト"
    purpose: "ログイン機能が正常に動作することを確認"
    assignee: "田中太郎"
  }) {
    id
    title
    status
  }
}
```

---

## 📊 DynamoDB の確認

LocalStack が DynamoDB テーブルを自動作成しています。

### テーブルの確認：

```bash
aws dynamodb list-tables \
  --endpoint-url=http://localhost:4566 \
  --region=us-east-1
```

### データの確認：

```bash
aws dynamodb scan \
  --table-name TestCasesTable \
  --endpoint-url=http://localhost:4566 \
  --region=us-east-1
```

または DynamoDB Admin UI (`http://localhost:8001`) を使用。

---

## 🔀 ペアワイズ生成テスト

GraphQL で ペアワイズテスト生成をテスト：

```graphql
query {
  generatePairwise(factors: [
    ["Chrome", "Firefox", "Safari"]
    ["Windows", "Mac", "Linux"]
    ["日本語", "英語"]
  ]) {
    id
    combinations
  }
}
```

---

## 🐛 トラブルシューティング

### LocalStack が起動しない

```bash
# ログ確認
docker-compose logs localstack

# 再起動
docker-compose restart localstack
```

### EADDRINUSE エラー（ポートが使用中）

```bash
# プロセスを確認
lsof -i :4566
lsof -i :3000

# 既存プロセスを停止
kill -9 <PID>
```

### GraphQL エンドポイントに接続できない

```bash
# LocalStack が完全に起動するまで待つ（30-60秒）
# アプリケーションを再起動

docker-compose logs localstack | grep -i "ready"
```

### CDK デプロイエラー

```bash
# キャッシュをクリア
rm -rf cdk.out
npm run build
```

---

## 🌐 本番環境へのデプロイ

ローカルでのテストが完了したら、本番環境にデプロイします。

```bash
cd infra

# AWS 認証情報が設定されていることを確認
aws sts get-caller-identity

# 本番環境にデプロイ
npm run deploy
```

> **注意：** 本番用の環境変数 (`AWS_ACCOUNT_ID`, 適切な `AWS_REGION`) が設定されていることを確認。

---

## 📁 ファイル構成

```
test1/
├── infra/                  # AWS CDK (Infrastructure as Code)
│   ├── bin/
│   │   └── infra.ts       # CDK アプリケーションエントリ
│   ├── lib/
│   │   └── infra-stack.ts # スタック定義
│   ├── lambda/            # Lambda 関数コード
│   └── schema.graphql     # GraphQL スキーマ
├── app/                    # React フロントエンド
│   ├── src/
│   │   ├── components/    # React コンポーネント
│   │   └── App.tsx        # メインアプリコンポーネント
│   └── package.json
├── docker-compose.yml      # LocalStack セットアップ
└── README.md
```

---

## 🔗 関連ドキュメント

- [AWS CDK ドキュメント](https://docs.aws.amazon.com/cdk/)
- [LocalStack ドキュメント](https://docs.localstack.cloud/)
- [GraphQL について](https://graphql.org/)
- [React ドキュメント](https://react.dev/)

---

## ✅ チェックリスト

ローカル開発を進める際の確認項目：

- [ ] Docker がインストールされていることを確認
- [ ] Docker Compose でサービスが起動
- [ ] npm パッケージが正常にインストール
- [ ] React アプリが `http://localhost:3000` で起動
- [ ] GraphQL エンドポイントが応答
- [ ] DynamoDB テーブルが作成
- [ ] テストケース作成・取得が可能

---

## 🆘 サポート

問題が発生した場合：

1. ログを確認
2. Docker コンテナの再起動
3. ポートが使用中でないことを確認
4. キャッシュをクリア（`rm -rf node_modules cdk.out`）
