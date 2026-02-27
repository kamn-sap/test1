#!/bin/bash

# ローカル環境への CDK デプロイスクリプト

set -e

echo "🏗️  ローカル環境へのインフラデプロイを開始します..."

# LocalStack の確認
echo "📡 LocalStack の接続確認..."
if ! curl -s http://localhost:4566/_localstack/health > /dev/null; then
  echo "❌ LocalStack が起動していません。"
  echo "   以下を実行してください:"
  echo "   docker-compose up -d"
  exit 1
fi
echo "✅ LocalStack に接続しました"

# インフラディレクトリへ移動
cd "$(dirname "$0")/../infra"

# 依存パッケージをインストール
echo "📦 NPM パッケージをインストール..."
npm install

# TypeScript をコンパイル
echo "🔨 TypeScript をコンパイル..."
npm run build

# CDK をデプロイ
echo "🚀 CDK をローカルスタックにデプロイ..."
export IS_LOCAL=true
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

npx cdk deploy --require-approval=never

echo ""
echo "✅ デプロイが完了しました！"
echo ""
echo "📝 次のステップ:"
echo "   1. React アプリを起動: cd app && npm start"
echo "   2. http://localhost:3000 にアクセス"
echo ""
echo "🔍 確認事項:"
echo "   - DynamoDB テーブル: aws dynamodb list-tables --endpoint-url=http://localhost:4566"
echo "   - GraphQL エンドポイント: http://localhost:4566/graphql"
