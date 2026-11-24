import { geoToMap } from '../utils/geo.js';

export const RAILWAY_STATIONS = [
  {
    id: 'kutchan', name: '倶知安', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [140.75, 42.9], position: geoToMap([140.75, 42.9], 3.2),
    description: '羊蹄山の麓にあるニセコエリアの玄関口。',
    fact: '倶知安駅は函館本線の駅で、ニセコ観光の拠点。',
    seasonalHighlights: {
      spring: '雪解けの水が羊蹄山麓を潤し、春の高原散策が始まる。',
      summer: '羊蹄山の登山や清流のアクティビティへ出かける拠点。',
      autumn: '山麓の紅葉と、旬を迎えるじゃがいもを楽しめる。',
      winter: 'ニセコのスキー場へ向かう人で賑わう、雪の玄関口。'
    }
  },
  {
    id: 'iwamizawa', name: '岩見沢', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [141.76, 43.2], position: geoToMap([141.76, 43.2], 3.2),
    description: '札幌と空知の各地を結ぶ鉄道の分岐点。',
    fact: '岩見沢駅は函館本線と室蘭本線が接続する駅。',
    seasonalHighlights: {
      spring: 'いわみざわ公園の桜やバラ園が、花の季節を彩る。',
      summer: '広い公園やローズガーデンで、空知の夏をのんびり過ごす。',
      autumn: '稲穂が実る空知の田園風景と、秋の味覚を楽しむ。',
      winter: '雪の多い空知らしい景色と、駅前の冬の街並みが見どころ。'
    }
  },
  {
    id: 'takikawa', name: '滝川', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [141.91, 43.56], position: geoToMap([141.91, 43.56], 3.2),
    description: '空知の田園地帯にある、富良野方面への乗換駅。',
    fact: '滝川駅から根室本線に乗り換えて富良野方面へ向かえる。',
    seasonalHighlights: {
      spring: '空知川沿いに春が訪れ、菜の花や花畑が見頃を迎える。',
      summer: '石狩川・空知川の流れと、広々とした田園風景を楽しむ。',
      autumn: '黄金色の田畑や秋の空知川を眺めながら、富良野方面へ。',
      winter: '一面の雪原を走る列車から、北海道らしい冬景色を眺める。'
    }
  },
  {
    id: 'minami-chitose', name: '南千歳', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [141.68, 42.82], position: geoToMap([141.68, 42.82], 3.2),
    description: '札幌・新千歳空港・道東方面をつなぐ乗換駅。',
    fact: '南千歳駅では石勝線と千歳線が接続する。',
    seasonalHighlights: {
      spring: '空港や道東への旅の起点。雪解け後の支笏湖方面にも便利。',
      summer: '新千歳空港から道東へ乗り継ぎ、湖や高原へ向かう夏の玄関口。',
      autumn: '紅葉の支笏湖や道東の旅へ、列車を乗り継ぐ拠点。',
      winter: '空港アクセスと道東方面の列車が集まる、冬の乗換ポイント。'
    }
  },
  {
    id: 'shintoku', name: '新得', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [142.83, 43.08], position: geoToMap([142.83, 43.08], 3.2),
    description: '十勝の山あいにある、道東方面への鉄道の要所。',
    fact: '新得駅は石勝線と根室本線が接続する。',
    seasonalHighlights: {
      spring: '山の雪解けとともに、十勝のそばや農産物が楽しみな季節。',
      summer: '清流や牧草地に囲まれた十勝の自然へ出かける拠点。',
      autumn: '新そばと実りの季節。山あいの景色も秋色に変わる。',
      winter: '雪に包まれた山間の駅から、十勝の冬景色を楽しめる。'
    }
  },
  {
    id: 'obihiro', name: '帯広', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [143.2, 42.92], position: geoToMap([143.2, 42.92], 3.2),
    description: '十勝の食と農業を代表する道東の中心都市。',
    fact: '帯広は豚丼や菓子など、十勝の食文化で知られる。',
    seasonalHighlights: {
      spring: '畑に緑が戻り始め、十勝の広い空と春の味覚を楽しめる。',
      summer: '十勝の大地で育つ農産物や、緑の牧草地が見どころ。',
      autumn: '収穫期の十勝で、じゃがいもや豆など大地の恵みを味わう。',
      winter: 'ばんえい競馬や温泉など、寒い季節ならではの楽しみがある。'
    }
  },
  {
    id: 'asahikawa', name: '旭川', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [142.365, 43.77], position: geoToMap([142.365, 43.77], 3.2),
    description: '道北・道東へ向かう鉄道路線が集まる北海道第二の都市。',
    fact: '旭川駅は函館本線・宗谷本線・石北本線などの接続駅。',
    seasonalHighlights: {
      spring: '旭山公園などで花が咲き、雪解けの大雪山を望める。',
      summer: '旭山動物園や大雪山への旅の拠点として賑わう。',
      autumn: '大雪山系の紅葉を見に行くときの便利な出発地。',
      winter: '旭川冬まつりや雪景色など、道北の冬を満喫できる。'
    }
  },
  {
    id: 'engaru', name: '遠軽', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [143.52, 44.06], position: geoToMap([143.52, 44.06], 3.2),
    description: '石北本線沿線、オホーツク内陸部の駅。',
    fact: '遠軽駅では石北本線の列車が進行方向を変える。',
    seasonalHighlights: {
      spring: '雪解けの山々と、花が咲き始めるオホーツクの春を楽しむ。',
      summer: '太陽の丘えんがる公園のコスモスが見どころ。',
      autumn: '山の木々が色づき、オホーツクの秋らしい景観が広がる。',
      winter: '雪に包まれた駅と山並みが、内陸の冬の旅を彩る。'
    }
  },
  {
    id: 'kitami', name: '北見', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [143.89, 43.8], position: geoToMap([143.89, 43.8], 3.2),
    description: 'オホーツク内陸の中心都市で、道東周遊の途中駅。',
    fact: '北見はハッカの歴史と焼肉文化で知られる。',
    seasonalHighlights: {
      spring: '北見フラワーパラダイスなどで、花の季節が始まる。',
      summer: '涼しいオホーツクの夏。ハッカの香りや屋外散策を楽しむ。',
      autumn: '玉ねぎなどの収穫期。北見の農業と食を味わえる。',
      winter: '北見厳寒の焼き肉まつりなど、寒さを楽しむ催しがある。'
    }
  },
  {
    id: 'tomakomai', name: '苫小牧', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [141.6, 42.64], position: geoToMap([141.6, 42.64], 3.2),
    description: '太平洋と港に面した、道央の海の玄関口。',
    fact: '苫小牧港は北海道を代表するフェリーターミナルのひとつ。',
    seasonalHighlights: {
      spring: '港町の散策や、春の海産物を楽しめる季節。',
      summer: '海風が心地よい港町で、ウトナイ湖の自然にも立ち寄れる。',
      autumn: '秋鮭など、太平洋の旬の味覚が楽しみ。',
      winter: '港の夜景や温かな海鮮料理で、冬の旅を楽しむ。'
    }
  },
  {
    id: 'muroran', name: '東室蘭', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [141.0, 42.35], position: geoToMap([141.0, 42.35], 3.2),
    description: '室蘭市街や噴火湾方面へ向かう道南の乗換駅。',
    fact: '東室蘭駅から室蘭本線で室蘭市街へアクセスできる。',
    seasonalHighlights: {
      spring: '地球岬や港の遊歩道で、海風と春の景色を楽しむ。',
      summer: '白鳥大橋や工場夜景など、港町の景色が映える季節。',
      autumn: '噴火湾の海岸や室蘭の岬を、澄んだ空気の中で巡る。',
      winter: '雪と海がつくる室蘭の景色や、室蘭やきとりが楽しみ。'
    }
  },
  {
    id: 'oshamambe', name: '長万部', emoji: '🚉', type: 'station', color: '#b8d7ff',
    coordinates: [140.27, 42.51], position: geoToMap([140.27, 42.51], 3.2),
    description: '噴火湾沿いの交通の要所で、道南方面への乗換駅。',
    fact: '長万部駅は函館本線と室蘭本線が接続する。',
    seasonalHighlights: {
      spring: '噴火湾沿いの景色と、春の海産物を楽しむ小さな途中下車。',
      summer: '海沿いの爽やかな風と、名物かにめしを味わう。',
      autumn: '噴火湾の秋景色を眺めながら、道南へ向かう列車旅。',
      winter: '雪の駅で名物かにめしを楽しみ、道南への旅を続ける。'
    }
  }
];
