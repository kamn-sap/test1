# ローカル開発セットアップガイド

## 🚀 クイックスタート

このプロジェクトをローカルで動作確認するためのステップです。

### 前提条件

- Node.js 18.x 以上
- npm

**注:** Docker & Docker Compose は不要です（iPad環境でも動作可能）

---

## 📝 ステップ 1: モック GraphQL サーバーの起動

```bash
# mock-server ディレクトリに移動
cd mock-server

# 依存パッケージをインストール
npm install

# 開発サーバーを起動（ホットリロード対応）
npm run dev

# または本番ビルド → 実行
npm run build
npm start
```

モックサーバーが起動し、GraphQL エンドポイント `http://localhost:4000/graphql` で利用可能になります。

> 🌐 Apollo GraphQL Playground (`http://localhost:4000/graphql`) で対話的にクエリをテストできます

---

## 📝 ステップ 2: 環境変数の設定

`.env.local` をアプリケーションのルート (`app/` ディレクトリ) に作成：

```bash
# フロントエンド用
REACT_APP_API_ENDPOINT=http://localhost:4000/graphql
```

---

## 📝 ステップ 3: React フロントエンドの起動

```bash
cd app

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm start
```

ブラウザが自動で開き、`http://localhost:3000` でアプリが起動します。

---

## 🧪 ステップ 4: GraphQL API の確認

### GraphQL Playground でクエリテスト

ブラウザで `http://localhost:4000/graphql` を開き、以下のクエリをテストできます：

```graphql
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
```

### テストケース作成の例

```graphql
mutation {
  createTestCase(
    title: "新規テストケース"
    description: "テスト説明"
    purpose: "目的"
    assignee: "担当者"
  ) {
    id
    title
    status
    createdAt
  }
}
```

### ペアワイズ法の実行例

```graphql
mutation {
  generatePairwise(
    factors: [
      ["Chrome", "Firefox", "Safari"]
      ["Windows", "macOS", "Linux"]
      ["English", "Japanese"]
    ]
  ) {
    combinations
    pairsCovered
    totalPairs
  }
}
```

---

## 💡 iPad環境での使用方法

### ローカルネットワークでの共有

iPad上でアプリを開く場合、以下の手順を実行：

1. **ローカルマシンのIPアドレスを確認**

```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

例：`192.168.0.100`

2. **フロントエンドの起動時にホスト指定**

```bash
cd app
REACT_APP_API_ENDPOINT=http://192.168.0.100:4000/graphql npm start -- --host=0.0.0.0
```

3. **iPad のブラウザで以下URLにアクセス**

```
http://192.168.0.100:3000
```

### または、iPad上で Node.js を実行する場合

- **A-Shell** アプリ（iPad 用ターミナル）で本セットアップを実行可能

---

## 🔄 開発ワークフロー

```bash
# ターミナル 1: モック GraphQL サーバー
cd mock-server
npm run dev

# ターミナル 2: React フロントエンド
cd app
npm start

# ターミナル 3: テスト（オプション）
cd app
npm test
```

---

## 📌 トラブルシューティング

### ポート 4000/3000 が既に使用されている場合

```bash
# macOS/Linux：該当プロセスを確認
lsof -i :4000
lsof -i :3000

# プロセスを終了（PIDを指定）
kill -9 <PID>
```

### GraphQL エンドポイントに接続できない場合

1. モックサーバーが起動しているか確認

```bash
curl http://localhost:4000/health
```

2. CORS 設定を確認（`mock-server/src/index.ts`）

3. ファイアウォール設定を確認

### npm install でエラーが出た場合

```bash
# キャッシュクリア
npm cache clean --force

# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

---

## 🌐 本番環境へのデプロイ

### 実際の AWS 環境を使用する場合

```bash
# AWS CLI を設定
aws configure

# CDK をデプロイ
cd infra
npm install
npm run build
npm run cdk deploy
```

---

## 📚 参考資料

- [Apollo Server ドキュメント](https://www.apollographql.com/docs/apollo-server/)
- [GraphQL 公式ドキュメント](https://graphql.org/learn/)
- [React ドキュメント](https://react.dev/)
- [A-Shell（iPad用ターミナル）](https://github.com/holzschu/a-shell)
