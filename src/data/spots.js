import { geoToMap } from '../utils/geo.js';

export const HOKKAIDO_SPOTS = [
  {
    id: 'sapporo',
    name: '札幌',
    emoji: '🍜',
    color: '#ff8b5e',
    website: 'https://www.city.sapporo.jp/',
    coordinates: [141.3545, 43.0621],
    position: geoToMap([141.3545, 43.0621], 5),
    description: '札幌の夜は、ラーメンと雪の匂いで一気に旅行の気分が最高になる。',
    mood: '朝の冷えた空気に、味噌ラーメンが一番のブースト。',
    fact: '味噌・醤油・塩・豚骨の4大ラーメン激戦地。'
  },
  {
    id: 'otaru',
    name: '小樽',
    emoji: '🌊',
    color: '#67d7ff',
    website: 'https://www.city.otaru.lg.jp/',
    coordinates: [140.9944, 43.1907],
    position: geoToMap([140.9944, 43.1907], 4),
    description: '運河に浮かぶ光と、観光客が一瞬だけスムーズに生きる雰囲気がある。',
    mood: 'すべてがちゃんと美しい。まるでデザイン会社の達人が作った夕方。',
    fact: '明治時代のガス灯が夜景を演出。'
  },
  {
    id: 'furano',
    name: '富良野',
    emoji: '🌼',
    color: '#8fe88f',
    website: 'https://www.city.furano.hokkaido.jp/',
    coordinates: [142.457, 43.342],
    position: geoToMap([142.457, 43.342], 8),
    description: '夏のラベンダーに、北海道が絶対に大人になる瞬間がある。',
    mood: '香りが強く、日差しが高く、人生の優先順位が少し整理される。',
    fact: 'ラベンダーの香りは天然の鎮静作用。'
  },
  {
    id: 'niseko',
    name: 'ニセコ',
    emoji: '⛷️',
    color: '#a5d6ff',
    website: 'https://www.town.niseko.lg.jp/',
    coordinates: [140.6845, 42.8048],
    position: geoToMap([140.6845, 42.8048], 6),
    description: '降る雪で世界の音が一瞬だけ心に優しくなる、ちょっと贅沢な町。',
    mood: 'リフトで上がるたび、ちょっとだけ自分を愛してしまう。',
    fact: 'パウダースノーの質は世界最高レベル。'
  },
  {
    id: 'toyako',
    name: '洞爺湖',
    emoji: '🚤',
    color: '#7fe0d2',
    website: 'https://www.town.toyako.hokkaido.jp/',
    coordinates: [140.77, 42.55],
    position: geoToMap([140.77, 42.55], 6),
    description: '湖の水面に映る夜景。無言で旅行に成功したと感じる時間。',
    mood: 'ボートに乗ってないのに、気分だけは海上にいる。',
    fact: '昭和新山は今も活動中の火山。'
  },
  {
    id: 'kushiro',
    name: '釧路',
    emoji: '🦐',
    color: '#ffd166',
    website: 'https://www.city.kushiro.lg.jp/',
    coordinates: [144.38, 42.985],
    position: geoToMap([144.38, 42.985], 5),
    description: '湿地帯の気配と海鮮の威圧感が、北海道の本質を教えてくれる。',
    mood: '今日は海鮮で勝負すると言いたくなる街。',
    fact: '釧路湿原は日本最大の湿地帯。'
  },
  {
    id: 'abashiri',
    name: '網走',
    emoji: '🧊',
    color: '#d9f0ff',
    website: 'https://www.city.abashiri.hokkaido.jp/',
    coordinates: [144.27, 44.02],
    position: geoToMap([144.27, 44.02], 6),
    description: '北の果ての冷たさに、いちばん大きい人生のモヤモヤが固まる。',
    mood: 'こんな景色の前では、今日の小さな悩みがちょっと笑える。',
    fact: '流氷観光で有名。冬は氷に覆われる。'
  }
];
