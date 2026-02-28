import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  // ミドルウェア
  app.use(cors());
  app.use(express.json());

  // ヘルスチェック
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Apollo Server の初期化
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Apollo GraphQL ミドルウェア
  // 型の互換性問題を回避するためキャストする
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  // ルートエンドポイント
  app.get('/', (req, res) => {
    res.json({
      message: 'Test Case Management GraphQL API Mock Server',
      endpoints: {
        graphql: `http://localhost:${PORT}/graphql`,
        health: `http://localhost:${PORT}/health`,
      },
    });
  });

  // サーバー起動
  await new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`🚀 Mock GraphQL Server running at http://localhost:${PORT}/graphql`);
      console.log(`📊 GraphQL Endpoint: http://localhost:${PORT}/graphql`);
      resolve();
    });
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
