<script setup>
// 01〜07 共通の背景：White + Very Pale Blue の上に、ごく淡い「AI Network / 星座 / 幾何学」
// ・variant でセクションごとの形を切り替える（同じ図形のコピーはしない）
// ・各セクションの端で切れた線が、次のセクションの同じ位置から続いて見えるように配置
//   （例：01 左下の線 x=300 → 02 左上の x=300 から続く）
// ・動き：線（実在する Network Line）に沿って進む小さな光（SVG animateMotion）＋直後だけ線がわずかに明るくなる
//   ＋通過した点がほんの少し明るくなる／一部の点の明滅／全体のごく小さな浮遊／曲線上を進む点
// ・画面から大きく外れたセクションは一時停止（再開時は止めた位置から続く）
// ・すべてコンテンツの後ろ（z-index: -1）・クリックを邪魔しない（pointer-events: none）
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // 'members' | 'work' | 'growth' | 'support' | 'career' | 'interview' | 'flow' | 'menu'（SPメニュー） | 'opening'（オープニング） | 'header'
  variant: { type: String, required: true }
})

/*
  cluster：1つの SVG（点と線のまとまり）
    at    : 置く角（'tl' | 'tr' | 'bl' | 'br'）。座標は viewBox（w × h）上の px
    nodes : 点 [x, y]
    edges : 線 'a-b'（末尾 d で点線）
    polys : 薄く塗る多角形（点の番号）
    pulse : 明滅する点の番号（[番号, delay秒] で始まりをずらせる。pulseDur で1周の長さ）
    edges : 末尾 f で、点線の上をごく薄い信号がゆっくり流れる線
    spHide: SP では描かない点の番号（つながる線・多角形も省く。SPで線が密集しないように）
    movers: 線に沿って進む点 { p: [通る点の番号（実在する線の順）], dur, delay, pcOnly }
    orbits: 曲線（円の一部）＋曲線上を進む点 { cx, cy, r, from, to, dur, delay }
    o     : 全体の濃さ（コンテンツに近いものは低く）
    pcOnly: SP では表示しない（SPの装飾量を約半分にするため）
    spOnly: SP（767px 以下）だけ表示
    x / y : 置く角からのずらし（数値は px、'16%' のような文字列も可。省略時 0）
    wideOnly: 1199px 以下では表示しない（07 のメモがフローの下へ回り込む幅で、メモの後ろに来ないように）
*/
const VARIANTS = {
  // 01 MEMBERS：右上〜右側に角ばったネットワーク／左下に薄い多角形（線は 02 左上へ続く）
  members: {
    clusters: [
      {
        at: 'tr', w: 460, h: 380, o: 1, float: 14,
        nodes: [[460, 40], [380, 70], [300, 40], [250, 120], [340, 160], [420, 210], [300, 250], [210, 200], [380, 320], [460, 290], [160, 90]],
        edges: '0-1 1-2 2-3 3-4 1-4 4-5 5-9 4-6 6-7 3-7 3-10d 2-10 6-8 8-9 5-8d',
        polys: [[1, 2, 3, 4], [4, 6, 7], [5, 8, 9]],
        pulse: [4, 8],
        movers: [{ p: [10, 3, 4, 5], dur: 12, delay: 0 }] // 右上：斜めに
      },
      {
        at: 'bl', w: 380, h: 300, o: 0.85, float: 17, pcOnly: true,
        nodes: [[0, 120], [90, 60], [190, 130], [120, 220], [30, 262], [250, 236], [300, 300], [196, 300]],
        edges: '0-1 1-2 2-3 3-0d 3-4 4-0 2-5 5-6 3-7 5-7d',
        polys: [[0, 1, 2, 3], [2, 5, 3]],
        pulse: [2],
        movers: [{ p: [1, 2, 5, 6], dur: 16, delay: -5 }]
      }
    ],
    grids: [{ at: 'tl', x: 28, y: 56, cols: 6, rows: 4, pcOnly: true }],
    waves: [{ at: 'bottom', h: 200, d: 'M0 120 C260 40 560 60 820 120 C1080 180 1260 150 1440 90 V200 H0 Z' }]
  },

  // 02 OUR WORK：左側に縦のネットワーク（01 から続く）／右下に小さな点の並び＋03 へ続く短い線
  work: {
    clusters: [
      {
        at: 'tl', w: 320, h: 660, o: 0.9, float: 16,
        nodes: [[300, 0], [200, 36], [96, 22], [28, 92], [0, 150], [46, 238], [16, 330], [54, 430], [0, 520], [38, 604], [120, 660]],
        edges: '0-1 1-2 2-3 1-3 3-4 3-5 4-5d 5-6 6-7 7-8 7-9 8-9d 9-10',
        polys: [[1, 2, 3], [5, 6, 7]],
        pulse: [3, 7],
        movers: [{ p: [0, 1, 2, 3], dur: 14, delay: -2.5 }] // 左側：横方向へ
      },
      {
        at: 'br', w: 220, h: 200, o: 0.9, float: 13,
        nodes: [[220, 36], [150, 80], [100, 150], [140, 200], [200, 130]],
        edges: '0-1 1-2 2-3 1-4 4-3d',
        polys: [[1, 4, 3, 2]],
        pulse: [1]
      }
    ],
    grids: [{ at: 'br', x: 120, y: 64, cols: 7, rows: 5 }]
  },

  // 03 GROWTH STEP：右端を縦に流れる星座（タイムラインの外側）／左下に薄い角ばった多角形
  growth: {
    clusters: [
      {
        at: 'tr', w: 240, h: 820, o: 0.9, float: 18,
        nodes: [[140, 0], [200, 70], [150, 150], [215, 232], [172, 330], [228, 420], [182, 520], [214, 612], [160, 700], [92, 770], [200, 790]],
        edges: '0-1 1-2 2-3 3-4 4-5 5-6 6-7 7-8 8-9 8-10 2-4d 5-7d',
        polys: [[2, 3, 4], [6, 7, 8]],
        pulse: [4, 8],
        movers: [{ p: [1, 2, 3, 4, 5, 6, 7, 8], dur: 18, delay: -7.5 }] // 右端：上 → 下
      },
      {
        at: 'bl', w: 320, h: 260, o: 0.8, float: 15, pcOnly: true,
        nodes: [[0, 80], [100, 110], [200, 170], [80, 220], [150, 260], [0, 200]],
        edges: '0-1 1-2 2-3 3-0 3-5 2-4 3-4d',
        polys: [[0, 1, 2, 3]],
        pulse: [2]
      }
    ],
    grids: [{ at: 'br', x: 300, y: 48, cols: 6, rows: 4, pcOnly: true }],
    waves: [{ at: 'bottom', h: 220, d: 'M0 90 C220 150 480 170 760 120 C1020 70 1240 60 1440 120 V220 H0 Z' }]
  },

  // 04 SUPPORT：左上（03 から続く）から上部の余白を通って右上へつながる線（カードの裏は避ける）
  support: {
    clusters: [
      {
        at: 'tl', w: 600, h: 120, o: 0.95, float: 14,
        nodes: [[150, 0], [80, 52], [0, 96], [200, 74], [330, 30], [460, 84], [600, 44]],
        edges: '0-1 1-2 1-3 0-3d 3-4 4-5 5-6',
        polys: [[0, 1, 3]],
        pulse: [3],
        movers: [{ p: [1, 3, 4, 5], dur: 13, delay: -2.5 }] // 分岐点 → 外側へ
      },
      {
        at: 'tr', w: 420, h: 280, o: 0.9, float: 16,
        nodes: [[0, 50], [110, 20], [200, 82], [300, 30], [420, 70], [400, 140], [410, 250], [372, 214]],
        edges: '0-1 1-2 2-3 3-4 2-5d 4-5 5-6 5-7 6-7d',
        polys: [[1, 2, 3], [5, 6, 7]],
        pulse: [5]
      },
      {
        at: 'br', w: 260, h: 160, o: 0.9, float: 13, pcOnly: true,
        nodes: [[260, 30], [170, 70], [200, 132], [120, 160]],
        edges: '0-1 1-2 2-3 1-3d',
        movers: [{ p: [0, 1, 2, 3], dur: 17, delay: -10 }]
      }
    ]
  },

  // 05 CAREER PATH：中心の点から複数方向へ広がる、少し広めの幾何学ネットワーク（キャリアの広がり）
  career: {
    clusters: [
      {
        at: 'tr', w: 640, h: 300, o: 0.9, float: 15,
        nodes: [[300, 92], [150, 100], [40, 70], [400, 30], [500, 0], [460, 104], [610, 70], [250, 190], [606, 236], [230, 22]],
        edges: '2-1 1-0 0-3 3-4 0-5 5-6 0-7 7-1d 1-9 9-3d 6-8d 3-5d',
        polys: [[0, 3, 5], [1, 0, 7]],
        pulse: [0, 6],
        // 中心の点から、左右の複数方向へデータが広がる
        movers: [
          { p: [0, 1, 2], dur: 15, delay: 0 },
          { p: [0, 5, 6], dur: 18, delay: -7.5, pcOnly: true }
        ]
      },
      {
        at: 'br', w: 220, h: 180, o: 0.85, float: 14, pcOnly: true,
        nodes: [[220, 40], [140, 90], [170, 180], [90, 150]],
        edges: '0-1 1-2 1-3d 3-2'
      }
    ],
    grids: [{ at: 'bl', x: 24, y: 40, cols: 6, rows: 5 }],
    waves: [{ at: 'bottom', h: 200, d: 'M0 110 C300 50 620 70 900 120 C1140 165 1300 150 1440 110 V200 H0 Z' }]
  },

  // 06 INTERVIEW：人物画像が主役なので控えめ。右上に細い角ばった線／左下にごく薄い曲線（07 の曲線へつながる）
  interview: {
    clusters: [
      {
        at: 'tr', w: 300, h: 240, o: 0.75, float: 16,
        nodes: [[170, 0], [250, 48], [290, 120], [230, 176], [300, 230]],
        edges: '0-1 1-2 2-3 3-4d 1-3d',
        pulse: [2],
        movers: [{ p: [0, 1, 2, 3], dur: 16, delay: -5 }]
      },
      {
        at: 'bl', w: 440, h: 320, o: 0.8, float: 18, pcOnly: true,
        nodes: [],
        orbits: [{ cx: -60, cy: 470, r: 400, from: -76, to: -28, dur: 18, delay: -9 }]
      },
      // 右下：画像の周り（右の余白・画像の下）から右端まで広がり、07 右上へ続くネットワーク
      // （下端を右から 125 の位置・傾き 1:2 で抜け、07 の同じ位置から続く）。06 は静かに：明滅のみ
      {
        at: 'br', w: 520, h: 560, o: 0.75, float: 15,
        nodes: [
          [407.5, 585], [355, 480], [280, 430], [430, 400], [500, 450], [520, 520], [340, 360],
          [470, 250], [515, 150], [478, 40], [520, 92], [380, 262], [250, 300], [180, 382]
        ],
        edges: '0-1 1-2 1-3 3-4 4-5d 3-6 6-2d 6-11 11-7 7-3 7-8 8-9 9-10d 8-10 11-12d 12-6 12-13 13-2 4-7d',
        polys: [[1, 3, 2], [6, 11, 7, 3], [8, 9, 10]],
        // 06 右 → 07 右上 → 07 右下 の順に、上から下へ淡く光る（0.9 秒ずつ）
        pulse: [[8, 0], [3, 0.9]],
        pulseDur: 6.3,
        spHide: [8, 9, 10, 12, 13]
      }
    ]
  },

  // 07 FLOW：選考フローが主役。上部の余白・右上・フロー下の帯・右下にだけ配置し、中央はあけておく
  flow: {
    clusters: [
      // 左上：06 左下の曲線（x≈311 で下端へ抜ける）から続く短い角ばった線（見出しより上の余白）
      {
        at: 'tl', w: 340, h: 110, o: 0.85, float: 16,
        nodes: [[311, 0], [220, 44], [110, 30], [0, 78]],
        edges: '0-1 1-2 2-3 1-3d'
      },
      // 右上：角ばったネットワーク＋多角形（05 の番号より上）。06 右下から続く
      {
        at: 'tr', w: 560, h: 280, o: 0.9, float: 15,
        // 10：06 右下の線の続き（上端を右から 125 の位置・同じ傾きで入り、1 の点へつながる）
        // 11〜12：右端の余白を縦に下りる線（右から 18 の位置）。右下のネットワークの同じ縦線と重なり、1本につながる
        nodes: [[560, 36], [470, 70], [380, 24], [300, 100], [400, 150], [500, 128], [560, 230], [330, 226], [200, 50], [120, 110], [422.5, -25], [542, 300], [542, 560]],
        edges: '0-1 1-2 2-3 3-4 1-4 4-5 5-0d 5-6 4-7 3-7d 2-8 8-9 8-3d 10-1 6-11 11-12',
        polys: [[3, 4, 7], [1, 4, 5]],
        pulse: [[1, 1.8], [5, 2.7]],
        pulseDur: 6.3,
        spHide: [0, 7, 11, 12],
        movers: [{ p: [9, 8, 2, 1, 4, 5], dur: 14, delay: 0 }]
      },
      // 左下：大きめの薄い曲線＋ノード（左端の余白とフロー下の帯だけ）
      {
        at: 'bl', w: 520, h: 200, o: 0.85, float: 18, pcOnly: true,
        nodes: [[77, 120], [0, 170], [200, 150], [300, 186], [380, 140], [260, 112]],
        edges: '0-1 0-2 2-3 3-4 4-5 5-2d',
        polys: [[2, 3, 4, 5]],
        pulse: [2],
        orbits: [{ cx: 520, cy: -300, r: 620, from: 126, to: 147, dur: 17, delay: -8 }]
      },
      // 右下：右端の縦線（右上から続く）→ メモの右・下を通る多角形ネットワーク。07 で最も動きのある場所
      //   A：小さな青い点が 5 → 6 → 7 → 8 → 9 → 10 へゆっくり進む
      //   B：点が上から順に淡く明滅（右上・06 から続く順番）
      //   C：点線の上を、ごく薄い信号が静かに流れる（f の3本）
      {
        at: 'br', w: 340, h: 330, o: 0.9, float: 15, pcOnly: true, wideOnly: true,
        nodes: [
          [340, 220], [270, 250], [300, 320], [210, 300], [170, 330], [322, 10], [292, 92],
          [330, 160], [240, 190], [150, 205], [92, 262], [40, 316], [322, -150]
        ],
        edges: '12-5 5-6 6-7 7-0 7-8 8-1 0-1 1-2 1-3 3-2d 3-4 8-9f 9-10 10-11f 9-3f 6-8d',
        polys: [[1, 2, 3], [7, 8, 1, 0]],
        pulse: [[5, 3.6], [7, 4.5], [8, 5.4]],
        pulseDur: 6.3,
        movers: [{ p: [5, 6, 7, 8, 9, 10], dur: 12, delay: -3, small: true }]
      }
    ]
  },

  // ヘッダー（高さ 56〜60px）：ロゴ・ナビ・ボタンの後ろは避け、余白にだけ小さく配置
  header: {
    clusters: [
      // PC：ロゴとナビの間の余白に、横長の小さな星座（1200px 以上）
      {
        at: 'tl', x: '16%', w: 280, h: 60, o: 0.75, float: 16, pcOnly: true, wideOnly: true,
        nodes: [[0, 38], [49, 14], [107, 30], [157, 10], [206, 40], [255, 18], [280, 46], [78, 50]],
        edges: '0-1 1-2 2-3 3-4 4-5 5-6d 1-7d 7-2 2-4d',
        polys: [[1, 2, 7]],
        pulse: [[3, 0], [5, 2.5]],
        pulseDur: 5.5,
        movers: [{ p: [0, 1, 2, 3, 4, 5], dur: 12, delay: -3 }]
      },
      // PC：右端の余白（ボタンの右）に、ごく小さな三角形（1200px 以上）
      {
        at: 'tr', w: 64, h: 60, o: 0.7, float: 18, pcOnly: true, wideOnly: true,
        nodes: [[64, 10], [30, 24], [50, 50], [10, 44]],
        edges: '0-1 1-2 2-3d 1-3',
        pulse: [[1, 1.2]],
        pulseDur: 6
      },
      // SP：ロゴとメニューボタンの間に1つだけ（PC より小さく・薄く）
      {
        at: 'tl', x: 140, w: 220, h: 108, o: 0.6, float: 16, spOnly: true,
        nodes: [[0, 70], [50, 30], [110, 60], [160, 22], [220, 56], [80, 96], [190, 96]],
        edges: '0-1 1-2 2-3 3-4 2-5d 5-0 4-6d',
        polys: [[0, 1, 2, 5]],
        pulse: [[3, 0.5]],
        pulseDur: 5.5,
        movers: [{ p: [0, 1, 2, 3, 4], dur: 10, delay: -2 }]
      }
    ]
  },

  // オープニング画面：中央（ロゴ・メッセージ）はあけ、右上と左下の角にだけ配置
  opening: {
    clusters: [
      {
        at: 'tr', w: 520, h: 380, o: 0.9, float: 14,
        nodes: [[520, 40], [430, 20], [340, 70], [420, 140], [520, 180], [300, 170], [380, 250], [480, 300], [220, 60], [160, 140]],
        edges: '0-1 1-2 2-3 3-0d 3-4 2-5 5-3 5-6 6-7 7-4d 2-8 8-9 9-5d',
        polys: [[1, 2, 3], [5, 6, 3]],
        pulse: [[3, 0], [6, 1.5]],
        pulseDur: 5,
        movers: [{ p: [9, 8, 2, 3, 4], dur: 10, delay: -2 }]
      },
      {
        at: 'bl', w: 560, h: 360, o: 0.9, float: 16,
        nodes: [[0, 120], [90, 60], [200, 140], [120, 240], [30, 330], [300, 90], [380, 200], [280, 300], [480, 280], [560, 360], [420, 360]],
        edges: '0-1 1-2 2-3 3-0d 3-4 1-5 5-6 6-2 6-7 7-3 7-8 8-9d 8-10 10-7d 6-8',
        polys: [[1, 2, 5], [6, 7, 8]],
        pulse: [[2, 0.8], [8, 2.2]],
        pulseDur: 5,
        movers: [{ p: [0, 1, 5, 6, 8, 9], dur: 11, delay: -3 }]
      }
    ]
  },

  // SPメニュー：文字の後ろは避け、右上・左端・下部の余白に配置（SPでは座標×0.52 の大きさ）
  menu: {
    clusters: [
      // 右上：ヘッダーの下から、小さな三角形のネットワーク（ロゴ・×の周りはあけておく）
      {
        at: 'tr', y: 64, w: 300, h: 230, o: 0.85, float: 16,
        nodes: [[300, 10], [230, 30], [160, 8], [270, 84], [300, 150], [250, 214], [300, 226]],
        edges: '0-1 1-2 1-3 0-3 3-4 4-5d 4-6',
        polys: [[0, 1, 3]],
        pulse: [[3, 1]],
        pulseDur: 5.5
      },
      // 左端：ナビの左の余白を縦に流れる星座（文字の左側だけ）
      {
        at: 'tl', y: 150, w: 70, h: 540, o: 0.8, float: 18,
        nodes: [[0, 0], [30, 64], [12, 150], [40, 236], [8, 324], [36, 410], [0, 470], [46, 540]],
        edges: '0-1 1-2 2-3 3-4 4-5 5-6d 5-7 1-3d',
        polys: [[1, 2, 3]],
        pulse: [[3, 2.5]],
        pulseDur: 6,
        movers: [{ p: [1, 2, 3, 4, 5], dur: 12, delay: -4 }]
      },
      // 下部：見出しの下の余白に、少し広めの多角形ネットワーク
      {
        at: 'bl', w: 760, h: 600, o: 0.9, float: 15,
        nodes: [
          [0, 180], [110, 120], [230, 200], [150, 300], [40, 380], [330, 110], [450, 190], [380, 320],
          [560, 140], [680, 230], [620, 370], [760, 300], [500, 460], [260, 470], [120, 560], [700, 520],
          [400, 600], [760, 90]
        ],
        edges: '0-1 1-2 2-3 3-0d 3-4 1-5 5-6 6-2 6-7 7-3 5-8d 8-9 9-6 9-10 10-7 9-11 11-10d 10-12 12-7 12-13 13-3 13-14 14-4d 12-15 15-10 12-16 13-16d 8-17 17-11d',
        polys: [[0, 1, 2, 3], [6, 7, 10, 9], [12, 13, 16]],
        pulse: [[2, 0], [9, 1.5], [13, 3]],
        pulseDur: 6,
        movers: [
          { p: [0, 1, 5, 6, 9, 11], dur: 12, delay: 0 },
          { p: [4, 3, 13, 12, 15], dur: 14, delay: -6 }
        ]
      }
    ]
  }
}

const config = computed(() => VARIANTS[props.variant] || { clusters: [] })
const uid = `ainet-${props.variant}`

// ---------- 画面幅・動きを減らす設定 ----------
const mq = (q) => (typeof window !== 'undefined' ? window.matchMedia(q) : null)
const spQuery = mq('(max-width: 767px)')
const reduceQuery = mq('(prefers-reduced-motion: reduce)')
const isSp = ref(!!spQuery?.matches)
const motionOk = ref(!reduceQuery?.matches)

// x / y：数値は px、文字列（例 '16%'）はそのまま
const len = (v) => (typeof v === 'string' ? v : `${v || 0}px`)
const corner = (at, extra = {}) => ({
  [at[0] === 't' ? 'top' : 'bottom']: len(extra.y),
  [at[1] === 'l' ? 'left' : 'right']: len(extra.x)
})

const rad = (deg) => (deg * Math.PI) / 180
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])

// 動く点の速度カーブ：ほぼ一定速度、始まりと終わりだけごくわずかにゆるやか（光の帯も同じカーブで同期）
const SPLINE = [0.3, 0.05, 0.7, 0.95]
const SPLINE_ATTR = SPLINE.join(' ')
// 進んだ割合 f に点が到達する「時間の割合」を求める（3次ベジェを二分法で解く）
const timeAt = (f) => {
  const [x1, y1, x2, y2] = SPLINE
  const bz = (u, a, b) => 3 * a * u * (1 - u) ** 2 + 3 * b * u ** 2 * (1 - u) + u ** 3
  let lo = 0
  let hi = 1
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (bz(mid, y1, y2) < f) lo = mid
    else hi = mid
  }
  return bz((lo + hi) / 2, x1, x2)
}

const TRAIL = 34 // 点の直後だけ明るくなる線の長さ（viewBox 単位）
const FADE = '0;0.06;0.94;1' // 出始め・終わりはふわっと

// 1本の動き（折れ線 or 曲線）を、SVG の属性に変換
const flow = (d, length, opts) => {
  const scale = isSp.value ? 1.25 : 1 // SP は少しゆっくり
  const dur = Math.min(opts.dur * scale, 20)
  const begin = (opts.delay || 0) * scale
  return {
    d,
    still: opts.still,
    orbit: !!opts.orbit,
    r: opts.small ? 2.2 : 3, // small：約4〜5px の小さな点
    dur: `${dur}s`,
    begin: `${begin}s`,
    dash: `${TRAIL} ${length + TRAIL}`,
    dashValues: `${TRAIL};${TRAIL - length}`,
    halos: (opts.halos || [])
      .map(({ x, y, f }) => ({ x, y, t: timeAt(f) }))
      .filter(({ t }) => t > 0.05 && t < 0.95)
      .map(({ x, y, t }) => ({
        x,
        y,
        keyTimes: `0;${(t - 0.035).toFixed(4)};${t.toFixed(4)};${(t + 0.035).toFixed(4)};1`
      }))
  }
}

// 表示用に整形（線・多角形・動く点の通り道）
const clusters = computed(() =>
  config.value.clusters
    .map((c, ci) => {
      const n = c.nodes
      const hidden = new Set(isSp.value ? c.spHide || [] : [])
      const pulse = new Map((c.pulse || []).map((p) => (Array.isArray(p) ? p : [p, null])))
      const nodes = n
        .map(([x, y], k) => ({
          x,
          y,
          k,
          pulse: pulse.has(k),
          style: {
            animationDelay: pulse.get(k) != null ? `${pulse.get(k)}s` : `${-k * 0.9}s`,
            animationDuration: c.pulseDur ? `${c.pulseDur}s` : undefined
          }
        }))
        .filter((node) => !hidden.has(node.k))
      const edges = (c.edges || '').split(' ').filter(Boolean)
        .map((e) => {
          const type = /[df]$/.test(e) ? e.slice(-1) : ''
          const [a, b] = e.replace(/[df]$/, '').split('-').map(Number)
          return { a, b, x1: n[a][0], y1: n[a][1], x2: n[b][0], y2: n[b][1], dashed: type === 'd', flow: type === 'f' }
        })
        .filter((e) => !hidden.has(e.a) && !hidden.has(e.b))
      const polys = (c.polys || [])
        .filter((p) => !p.some((i) => hidden.has(i)))
        .map((p) => p.map((i) => n[i].join(',')).join(' '))

      // 線に沿って進む点：既存の線をたどる折れ線（線の形は変えない）
      const movers = (c.movers || [])
        .filter((m) => !(isSp.value && m.pcOnly))
        .map((m) => {
          const pts = m.p.map((i) => n[i])
          const segs = pts.slice(1).map((pt, i) => dist(pts[i], pt))
          const length = segs.reduce((a, b) => a + b, 0)
          // 途中で通過する点（最初・最後・明滅する点は除く）を、到達した瞬間だけ少し明るく
          let acc = 0
          const halos = []
          m.p.forEach((idx, i) => {
            if (i > 0) acc += segs[i - 1]
            if (i === 0 || i === m.p.length - 1 || pulse.has(idx)) return
            halos.push({ x: n[idx][0], y: n[idx][1], f: acc / length })
          })
          const d = `M${pts.map((pt) => pt.join(' ')).join(' L')}`
          return flow(d, length, { ...m, halos, still: pts[1] })
        })

      // 曲線：線は円の一部のまま。点だけが曲線上を進む（円は回転させない）
      const orbitLines = (c.orbits || []).map((o) => {
        const p = (deg) => [o.cx + o.r * Math.cos(rad(deg)), o.cy + o.r * Math.sin(rad(deg))]
        const [sx, sy] = p(o.from - 30)
        const [ex, ey] = p(o.to + 30)
        return `M${sx} ${sy} A${o.r} ${o.r} 0 0 1 ${ex} ${ey}`
      })
      const orbitFlows = (c.orbits || []).map((o) => {
        const p = (deg) => [o.cx + o.r * Math.cos(rad(deg)), o.cy + o.r * Math.sin(rad(deg))]
        const [sx, sy] = p(o.from)
        const [ex, ey] = p(o.to)
        const d = `M${sx} ${sy} A${o.r} ${o.r} 0 0 1 ${ex} ${ey}`
        return flow(d, rad(o.to - o.from) * o.r, { ...o, orbit: true, still: p((o.from + o.to) / 2) })
      })

      return {
        ...c,
        id: `${uid}-${ci}`,
        nodes,
        edges,
        polys,
        orbitLines,
        flows: [...movers, ...orbitFlows],
        style: { ...corner(c.at, c), '--w': c.w, '--h': c.h, opacity: c.o ?? 1 },
        floatStyle: { animationDuration: `${c.float || 15}s` }
      }
    })
    .filter((c) => !(isSp.value && c.pcOnly) && !(!isSp.value && c.spOnly))
)

const grids = computed(() =>
  (config.value.grids || []).map((g) => ({
    ...g,
    style: { ...corner(g.at, g), '--cols': g.cols, '--rows': g.rows }
  }))
)

const waves = computed(() => config.value.waves || [])

// ---------- 画面外では一時停止（SMIL は pauseAnimations で止めた位置から再開） ----------
const root = ref(null)
let observer
let visible = true

const applyPause = () => {
  const el = root.value
  if (!el) return
  el.classList.toggle('is-paused', !visible)
  el.querySelectorAll('svg.ainet__cluster').forEach((svg) => {
    if (visible) svg.unpauseAnimations?.()
    else svg.pauseAnimations?.()
  })
}

// SP切替などで SVG を作り直したときも、停止状態を合わせる
watch([isSp, motionOk], () => nextTick(applyPause))

const onSp = (e) => { isSp.value = e.matches }
const onReduce = (e) => { motionOk.value = !e.matches }

onMounted(() => {
  spQuery?.addEventListener('change', onSp)
  reduceQuery?.addEventListener('change', onReduce)
  if (!('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    applyPause()
  }, { rootMargin: '30% 0px' })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  spQuery?.removeEventListener('change', onSp)
  reduceQuery?.removeEventListener('change', onReduce)
})
</script>

<template>
  <div ref="root" class="ainet" aria-hidden="true">
    <!-- セクション間のごく淡い波（上下の端は透明なので境目は見えない） -->
    <svg
      v-for="(wave, i) in waves"
      :key="`w${i}`"
      class="ainet__wave"
      :style="{ height: `${wave.h}px` }"
      :viewBox="`0 0 1440 ${wave.h}`"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient :id="`${uid}-wave${i}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#EAF4FC" stop-opacity="0" />
          <stop offset="0.55" stop-color="#EAF4FC" stop-opacity="0.3" />
          <stop offset="1" stop-color="#EAF4FC" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path :d="wave.d" :fill="`url(#${uid}-wave${i})`" />
    </svg>

    <!-- 小さな点の並び（LP全体で数カ所だけ） -->
    <span
      v-for="(grid, i) in grids"
      :key="`g${i}`"
      class="ainet__grid"
      :class="{ 'is-pc-only': grid.pcOnly }"
      :style="grid.style"
    />

    <!-- 点と線のネットワーク（SP切替・動きの設定が変わったら作り直し、SMIL の時間を合わせる） -->
    <svg
      v-for="c in clusters"
      :key="`${c.id}-${isSp}-${motionOk}`"
      class="ainet__cluster"
      :class="{ 'is-wide-only': c.wideOnly }"
      :style="c.style"
      :viewBox="`0 0 ${c.w} ${c.h}`"
      overflow="visible"
    >
      <defs v-if="c.flows.length">
        <!-- 動く点：中心が少し明るいブルー -->
        <radialGradient :id="`${c.id}-dot`">
          <stop offset="0" stop-color="#EAF6FF" />
          <stop offset="0.45" stop-color="#66C5F5" />
          <stop offset="1" stop-color="#3B9EFF" />
        </radialGradient>
      </defs>
      <g class="ainet__float" :style="c.floatStyle">
        <polygon v-for="(pts, k) in c.polys" :key="`p${k}`" class="ainet__poly" :points="pts" />
        <line
          v-for="(e, k) in c.edges"
          :key="`e${k}`"
          class="ainet__line"
          :class="{ 'is-dashed': e.dashed, 'is-flow': e.flow }"
          :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2"
        />
        <path v-for="(d, k) in c.orbitLines" :key="`o${k}`" class="ainet__line ainet__orbit-line" :d="d" />
        <circle
          v-for="node in c.nodes"
          :key="`n${node.k}`"
          class="ainet__node"
          :class="{ 'is-pulse': node.pulse, 'is-cyan': node.k % 4 === 2 }"
          :cx="node.x" :cy="node.y"
          r="2"
          :style="node.style"
        />

        <!-- データの流れ：線の光（点の直後だけ）→ 通過した点の反応 → 動く点 -->
        <g v-for="(f, k) in c.flows" :key="`f${k}`">
          <template v-if="motionOk">
            <path class="ainet__trail" :d="f.d" :stroke-dasharray="f.dash" :stroke-dashoffset="TRAIL" opacity="0">
              <animate
                attributeName="stroke-dashoffset" :values="f.dashValues" keyTimes="0;1"
                calcMode="spline" :keySplines="SPLINE_ATTR" :dur="f.dur" :begin="f.begin" repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0;1;1;0" :keyTimes="FADE" :dur="f.dur" :begin="f.begin" repeatCount="indefinite" />
            </path>
            <g v-for="(h, hk) in f.halos" :key="`h${hk}`" :transform="`translate(${h.x} ${h.y})`">
              <circle class="ainet__halo" r="2" opacity="0">
                <animate attributeName="opacity" values="0;0;0.9;0;0" :keyTimes="h.keyTimes" :dur="f.dur" :begin="f.begin" repeatCount="indefinite" />
                <animateTransform
                  attributeName="transform" type="scale" values="1;1;1.25;1;1" :keyTimes="h.keyTimes"
                  :dur="f.dur" :begin="f.begin" repeatCount="indefinite"
                />
              </circle>
            </g>
            <circle class="ainet__mover" :class="{ 'is-orbit': f.orbit, 'is-small': f.r < 3 }" :r="f.r" :fill="`url(#${c.id}-dot)`" opacity="0">
              <animateMotion
                :path="f.d" keyPoints="0;1" keyTimes="0;1" calcMode="spline" :keySplines="SPLINE_ATTR"
                :dur="f.dur" :begin="f.begin" repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0;0.95;0.95;0" :keyTimes="FADE" :dur="f.dur" :begin="f.begin" repeatCount="indefinite" />
            </circle>
          </template>
          <!-- 動きを減らす設定：点は線の途中に置いたまま -->
          <circle
            v-else
            class="ainet__mover is-still"
            :class="{ 'is-orbit': f.orbit, 'is-small': f.r < 3 }"
            :r="f.r"
            :fill="`url(#${c.id}-dot)`"
            :cx="f.still[0]" :cy="f.still[1]"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.ainet {
  --s: 1; /* 図形の大きさ（画面幅で調整） */
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.ainet__wave {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}

.ainet__cluster {
  position: absolute;
  width: calc(var(--w) * var(--s) * 1px);
  height: calc(var(--h) * var(--s) * 1px);
}

.ainet__node,
.ainet__float {
  transform-origin: center;
}

.ainet__node {
  transform-box: fill-box;
}

/* ---------- 線・多角形・点 ---------- */
.ainet__line {
  fill: none;
  stroke: rgba(70, 145, 210, 0.17);
  stroke-width: 0.8;
  vector-effect: non-scaling-stroke;
}

.ainet__line.is-dashed {
  stroke: rgba(70, 145, 210, 0.14);
  stroke-dasharray: 3 4;
}

.ainet__line.is-flow {
  stroke: rgba(86, 170, 235, 0.22);
  stroke-dasharray: 3 8;
  animation: ainetSignal 12s linear infinite;
}

.ainet__orbit-line {
  stroke: rgba(70, 145, 210, 0.13);
}

.ainet__poly {
  fill: rgba(80, 160, 230, 0.028);
  stroke: none;
}

.ainet__node {
  fill: #68B7F7;
  opacity: 0.55;
}

.ainet__node.is-cyan {
  fill: #36BFEA;
}

.ainet__node.is-pulse {
  fill: #4DA3FF;
  animation: ainetPulse 5.5s ease-in-out infinite;
}

/* ---------- データの流れ ---------- */
/* 点の直後だけ、線がほんの少しブルーに（短い帯が点と一緒に進む） */
.ainet__trail {
  fill: none;
  stroke: rgba(82, 182, 248, 0.45);
  stroke-width: 1;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

/* 動く点：小さく、ごく弱い光 */
.ainet__mover {
  filter:
    drop-shadow(0 0 2.5px rgba(60, 160, 240, 0.35))
    drop-shadow(0 0 5px rgba(60, 160, 240, 0.12));
}

.ainet__mover.is-orbit {
  stroke: #fff;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.ainet__mover.is-small {
  filter: drop-shadow(0 0 3px rgba(85, 185, 243, 0.35));
}

.ainet__mover.is-still {
  opacity: 0.7;
}

/* 通過した点：少しだけ明るく・大きく（データが届いた合図） */
.ainet__halo {
  fill: #4DA3FF;
  filter: drop-shadow(0 0 3px rgba(60, 160, 240, 0.3));
}

/* ---------- ネットワーク全体のごく小さな浮遊 ---------- */
.ainet__float {
  transform-box: view-box;
  animation: ainetFloat 15s ease-in-out infinite;
}

/* ---------- 小さな点の並び ---------- */
.ainet__grid {
  position: absolute;
  width: calc(var(--cols) * 14px);
  height: calc(var(--rows) * 14px);
  background: radial-gradient(circle, #4DA3FF 1px, transparent 1.4px) 0 0 / 14px 14px;
  opacity: 0.12;
}

/* 画面外：CSS の動きも一時停止（再開時は続きから） */
.ainet.is-paused .ainet__node,
.ainet.is-paused .ainet__line,
.ainet.is-paused .ainet__float {
  animation-play-state: paused;
}

@keyframes ainetPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.15); }
}

/* 点線の上を、ごく薄い信号が線の向き（始点 → 終点）へ静かに流れる */
@keyframes ainetSignal {
  to { stroke-dashoffset: -110; }
}

@keyframes ainetFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@media (max-width: 1279px) {
  .ainet {
    --s: 0.85;
  }
}

@media (max-width: 1199px) {
  .ainet .is-wide-only {
    display: none;
  }
}

/* SP：図形を小さく・数を約半分に（大きな多角形は文章の後ろに来ないよう非表示） */
@media (max-width: 767px) {
  .ainet {
    --s: 0.52;
    opacity: 0.8;
  }

  .ainet .is-pc-only {
    display: none;
  }

  /* 図形を縮小しても点の大きさは近く保つ（node 約3px / 動く点 約5px） */
  .ainet__node,
  .ainet__halo {
    r: 3;
  }

  .ainet__mover {
    r: 4.8;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ainet__node.is-pulse,
  .ainet__line.is-flow,
  .ainet__float {
    animation: none !important;
  }

  .ainet__node.is-pulse {
    opacity: 0.7;
  }
}
</style>
