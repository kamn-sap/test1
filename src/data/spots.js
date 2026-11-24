import { geoToMap } from '../utils/geo.js';
import { RAILWAY_STATIONS } from './railway-stations.js';

const DESTINATION_SPOTS = [
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
    fact: '味噌・醤油・塩・豚骨の4大ラーメン激戦地。',
    seasonalHighlights: {
      spring: '大通公園や円山公園で桜が咲き、街歩きが心地よい季節。',
      summer: '大通公園のビアガーデンや爽やかな街のイベントを楽しめる。',
      autumn: '紅葉と「さっぽろオータムフェスト」で北海道の味覚めぐり。',
      winter: '雪まつりやイルミネーションで、雪景色の中心街が華やぐ。'
    }
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
    fact: '明治時代のガス灯が夜景を演出。',
    seasonalHighlights: {
      spring: '雪解けの運河沿いを歩きながら、歴史ある倉庫街をゆっくり巡る。',
      summer: '港町の風を感じながら、運河クルーズや海鮮を楽しめる。',
      autumn: '石造りの倉庫と運河の夕景が、落ち着いた散策にぴったり。',
      winter: '雪あかりの路や雪化粧した運河が、小樽らしい冬景色をつくる。'
    }
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
    fact: 'ラベンダーの香りは天然の鎮静作用。',
    seasonalHighlights: {
      spring: '雪解け後の丘や畑に、花の季節へ向かう北海道の春を感じる。',
      summer: 'ラベンダー畑が見頃を迎え、富良野の丘が紫色に染まる。',
      autumn: '収穫期の農園や色づく山並みを眺めながら、旬の味覚を楽しむ。',
      winter: '雪景色の中でスキーや温泉を楽しむ、夏とは違う富良野の魅力。'
    }
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
    fact: 'パウダースノーの質は世界最高レベル。',
    seasonalHighlights: {
      spring: '残雪の羊蹄山を眺めながら、雪解けの高原を散策できる。',
      summer: 'ラフティングや登山など、山と清流のアクティビティが充実。',
      autumn: '羊蹄山麓の紅葉と、収穫期のじゃがいもを楽しめる。',
      winter: '世界的に知られるパウダースノーとスキーリゾートが主役。'
    }
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
    fact: '昭和新山は今も活動中の火山。',
    seasonalHighlights: {
      spring: '湖畔の遊歩道で、雪解けの山々と静かな湖面を眺める。',
      summer: '湖上の花火大会や遊覧船で、洞爺湖の夏を満喫。',
      autumn: '有珠山や湖畔の木々が色づき、温泉と紅葉を一緒に楽しめる。',
      winter: '澄んだ空気の湖畔と温泉で、雪の季節ならではの静けさを味わう。'
    }
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
    fact: '釧路湿原は日本最大の湿地帯。',
    seasonalHighlights: {
      spring: '湿原に新緑が広がり始め、木道や展望台から自然を観察できる。',
      summer: '涼しい海霧の街で、釧路湿原のカヌーや夕景を楽しむ。',
      autumn: '湿原の草紅葉と港町の旬の魚介が見どころ。',
      winter: '釧路湿原でタンチョウを観察し、冬の澄んだ景色を味わう。'
    }
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
    fact: '流氷観光で有名。冬は氷に覆われる。',
    seasonalHighlights: {
      spring: '流氷が去ったオホーツク海と、野鳥が戻る海岸の景色を楽しめる。',
      summer: '知床や網走の海岸線を巡り、オホーツクの青い海を満喫。',
      autumn: '湖や湿原が色づき、海産物もおいしい季節。',
      winter: '流氷観光船などで、オホーツク海を覆う流氷に出会える。'
    }
  }
];

export const HOKKAIDO_SPOTS = [...DESTINATION_SPOTS, ...RAILWAY_STATIONS];
