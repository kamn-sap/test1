# 🗾 北海道トラベルマップ - Interactive 3D Experience

> 北海道の四季を舞台にした、リアルで美しい3Dインタラクティブマップ

---

## ✨ 主な機能

### 🎨 季節ごとの美しいビジュアル

| 季節 | 🌸春 | ☀️夏 | 🍂秋 | ❄️冬 |
|------|------|------|------|------|
| **景色** | 桜色の島 | 海色の島 | 秋色の島 | 雪色の島 |
| **エフェクト** | 🌸 桜の花びら舞う | 🦦 ラッコが海に浮く | 🐟 鮭が川を遡上 | ❄️ 雪が舞う |
| **光** | 柔らかい光 | 明るい光 | 温かい光 | 冷たい光 |
| **霧** | 薄い霧 | 薄い霧 | 深い霧 | 深い霧 |

### 🎮 インタラクティブなコントロール

```
┌─────────────────────────────────┐
│     マウス操作                    │
├─────────────────────────────────┤
│ 🖱️  ドラッグ  →  3D回転           │
│ 🔍  スクロール → ズーム in/out    │
│ 📍  クリック  → スポット選択      │
│ 🔄  リセット  → 初期位置に戻す    │
│ 🌤️  四季    → 季節を変更         │
└─────────────────────────────────┘
```

### 🚂 動的な交通システム

- **電車** 🚆：北海道各地を結ぶカーブ状の線路を走行
- **リアルな線路**：複数の観光地を繋ぐルート

---

## 🌍 北海道の観光地 - 7つの絶景スポット

| # | 地名 | 絵文字 | 特徴 | 公式サイト |
|---|------|-------|------|-----------|
| 1️⃣ | **札幌** | 🍜 | ラーメン文化の中心地 | [sapporo.travel](https://www.sapporo.travel/) |
| 2️⃣ | **小樽** | 🌊 | 歴史的な運河の町 | [otaru.lg.jp](https://www.city.otaru.lg.jp/) |
| 3️⃣ | **富良野** | 🌼 | 紫色のラベンダー畑 | [furano.ne.jp](https://www.furano.ne.jp/) |
| 4️⃣ | **ニセコ** | ⛷️ | スキーの国際的なメッカ | [niseko.gr.jp](https://niseko.gr.jp/) |
| 5️⃣ | **洞爺湖** | 🚤 | 活火山と温泉リゾート | [toyako.hokkaido.jp](https://www.toyako.hokkaido.jp/) |
| 6️⃣ | **釧路** | 🦐 | 新鮮な海の幸 | [kushiro.pref.hokkaido.lg.jp](https://www.kushiro.pref.hokkaido.lg.jp/) |
| 7️⃣ | **網走** | 🧊 | 流氷の絶景 | [abashiri.jp](https://abashiri.jp/) |

---

## 🔧 インストール & セットアップ

### 必要な環境
- **Node.js** 16以上
- **npm** またはお好みのパッケージマネージャー

### インストール手順

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd hokkaido-3d-map

# 2. 依存パッケージをインストール
npm install

# 3. 開発サーバーを起動
npm run dev

# ✅ ブラウザで http://localhost:5173 を開く
```

### ビルド & デプロイ

```bash
# プロダクションビルド
npm run build

# ビルドをプレビュー
npm run preview
```

---

## 📁 プロジェクト構成

```
hokkaido-3d-map/
├── 📄 index.html                 # HTML エントリーポイント
├── 📦 package.json               # プロジェクト設定
├── 📄 vite.config.js             # Vite設定
│
└── 📂 src/
    ├── 🚀 main.js                # アプリケーション メイン
    ├── 🎨 styles.css             # グローバルスタイル
    │
    ├── 📂 data/
    │   └── 🗺️  spots.js           # 観光地データ（7箇所）
    │
    ├── 📂 objects/
    │   ├── 🏗️  geometry.js        # 3Dジオメトリ & エフェクト
    │   ├── 💡 lights.js          # ライティング設定
    │   └── 📍 markers.js         # 観光地マーカー
    │
    ├── 📂 interactions/
    │   └── 🎮 handlers.js        # ユーザーインタラクション
    │
    └── 📂 utils/
        └── 📊 stats.js          # パフォーマンス統計
```

---

## 🛠️ カスタマイズガイド

### 🆕 新しい観光地を追加

**ファイル:** `src/data/spots.js`

```javascript
{
  id: 'newplace',
  name: '新しい地名',
  emoji: '📍',
  color: '#ff6b6b',
  website: 'https://example.com',
  position: new THREE.Vector3(x, y, z),
  description: '説明文',
  mood: '旅の気分',
  fact: '面白い事実'
}
```

### 🎨 色とテーマをカスタマイズ

**ファイル:** `src/main.js` → `SEASON_PRESETS`

```javascript
const SEASON_PRESETS = {
  spring: {
    background: 0x2a8fb8,    // 背景色（16進数）
    islandColor: 0x9ad8a6,   // 島の色
    topColor: 0xb9e8bf,      // 島の頂上色
    // ... 他の設定
  }
};
```

### 🚗 線路・電車の経路変更

**ファイル:** `src/objects/geometry.js` → `createRailwayWithTrain()`

```javascript
const railPoints = [
  spots[0].position,  // 札幌
  spots[1].position,  // 小樽
  spots[4].position,  // 洞爺湖
  // ... ルートを設定
];
```

### ✨ パーティクル効果の調整

**ファイル:** `src/objects/geometry.js`

| 関数 | 説明 | パーティクル数 |
|------|------|----------------|
| `createCherryBlossoms()` | 桜の花びら | 1200 |
| `createOtterFloat()` | ラッコ | 15 |
| `createSalmonJump()` | 鮭が跳ねる | 25 |
| `createSnowCrystals()` | 雪の結晶 | 1600 |

---

## 🚀 パフォーマンス最適化

### フレームレート低下時の対策

```javascript
// 1️⃣ パーティクル数を減らす
const count = 800;  // 1200 → 800に変更

// 2️⃣ 島の詳細度を下げる
new THREE.PlaneGeometry(130, 130, 100, 100);  // 150→100に変更

// 3️⃣ カメラの視野範囲を調整
controls.minDistance = 25;  // 最小距離
controls.maxDistance = 180; // 最大距離
```

---

## 🌐 ブラウザ対応

| ブラウザ | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| **対応** | ✅ 完全対応 | ✅ 完全対応 | ✅ WebGL2必須 | ✅ 完全対応 |

### 📱 モバイル対応

- ✅ タッチコントロール対応
- ✅ レスポンシブデザイン
- ✅ ピンチズーム対応

---

## 🎯 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Three.js** | r186 | 3Dレンダリング |
| **Vite** | 5.0+ | ビルドツール |
| **WebGL 2** | - | グラフィックス |
| **MapControls** | - | カメラ操作 |

### 主な機能

🔹 **物理ベースマテリアル (PBM)**
- 現実的な光の反射・屈折

🔹 **シャドウマッピング**
- リアルな影の表現

🔹 **パーティクルシステム**
- 季節ごとの美しいエフェクト

🔹 **Catmull-Rom曲線**
- なめらかな電車の軌跡

---

## 📊 アーキテクチャ

```
┌─────────────────────────────────────┐
│       index.html (UI層)             │
└────────────────┬────────────────────┘
                 │
┌─────────────────▼────────────────────┐
│   main.js (アプリケーション層)        │
│  - シーン初期化                       │
│  - 季節管理                           │
│  - アニメーションループ               │
└────────────────┬────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼──┐  ┌─────▼──┐  ┌──────▼───┐
│geometry.js│lights.js│markers.js│
│ 3D形状     │照明     │マーカー  │
└──────┘  └────────┘  └────────┘
    │
┌───▼─────────────────────────┐
│   handlers.js (入力層)       │
│  - カメラ操作                │
│  - クリック検出              │
│  - イベント処理              │
└─────────────────────────────┘
```

---

## 🤝 コントリビューション

このプロジェクトへの改善提案・バグ報告は大歓迎です！

```bash
# 1. ブランチを作成
git checkout -b feature/amazing-feature

# 2. 変更をコミット
git commit -m "✨ Add amazing feature"

# 3. プッシュ
git push origin feature/amazing-feature

# 4. プルリクエストを作成
```

---

## 📝 ライセンス

MIT License - 自由に使用・改変・配布できます

---

## 💝 謝辞

このプロジェクトは以下にインスパイアされて作成されました：

- 🏔️ 北海道の美しい自然
- 🎨 Three.jsのすばらしいコミュニティ
- 🌟 インタラクティブな体験への情熱

---

## 📞 お問い合わせ

- 🐛 [Issue Report](https://github.com/kamn-sap/test1/issues)
- 💬 [Discussion](https://github.com/kamn-sap/test1/discussions)

---

<div align="center">

### ❤️ 北海道の四季の美しさを、3Dで体験しよう！

**Made with ❤️ for Hokkaido lovers**

</div>
