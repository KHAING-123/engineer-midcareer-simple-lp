<script setup>
// 05 キャリアの広がり：細い線画のオリジナルアイコン（5種類）
// type：'pm' | 'consultant' | 'dx' | 'automation' | 'ai-consultant'
// 動き（6.5秒で1周・カードごとに0.6秒ずつずらす）：
//   通常 → 少し外へ広がる → 中央へ集まる → まとまる → また少し広がる → 通常
// ・線は画面に入ったときに1回だけ描かれる
// ・接続線は、つながっているパーツに合わせて伸び縮みする（太さは変わらない）
// ・1アイコンにつき1〜2本の線だけ、線の上をごく淡い光がゆっくり流れる
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  index: { type: Number, default: 0 } // 動き始めを少しずつずらすため
})

const root = ref(null)
let observer

// 動くパーツ：外へ広がる方向と距離（px）。集まるときはこの逆向きに 35%
const part = (x, y, extraDelay = 0) => ({ '--px': `${x}px`, '--py': `${y}px`, '--pd': `${extraDelay}s` })
// 接続線の伸び縮み：起点(ox, oy)から sx / sy の割合で伸びる（横線は sx、縦線は sy だけ）
const stretch = (ox, oy, sx, sy) => ({ '--sox': `${ox}px`, '--soy': `${oy}px`, '--sx': sx, '--sy': sy })
// カードにマウスを乗せたときに、さらに外側へ広がる量
const out = (x, y) => ({ '--ox': `${x}px`, '--oy': `${y}px` })

onMounted(() => {
  const el = root.value
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) return
  el.classList.add('ci--pending')
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    el.classList.add('ci--drawing')
    el.classList.remove('ci--pending')
    observer.disconnect()
  }, { threshold: 0.4 })
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <svg
    ref="root"
    class="ci"
    :style="{ '--i': props.index }"
    viewBox="0 0 80 80"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- 01 PM：4つのタスクが中央のプロジェクトへ集まる -->
    <template v-if="type === 'pm'">
      <path class="ci-line" pathLength="1" d="M30 30 H50 V50 H30 Z" />
      <path class="ci-line ci-line--thin" pathLength="1" d="M35 37 H45 M35 41 H45 M35 45 H41" />
      <!-- 中央側の線（固定）。タスク側の線と重なって1本に見える -->
      <path class="ci-line ci-line--thin" pathLength="1" d="M30 30 L18.5 18.5 M50 30 L61.5 18.5 M30 50 L18.5 61.5 M50 50 L61.5 61.5" />
      <path class="ci-flow" d="M18.5 18.5 L30 30" />

      <g class="ci-out" :style="out(-1.5, -1.5)">
        <g class="ci-part" :style="part(-6, -6)">
          <path class="ci-line" pathLength="1" d="M8 8 H17 V17 H8 Z" />
          <path class="ci-line ci-line--thin" pathLength="1" d="M17 17 L27 27" />
        </g>
      </g>
      <g class="ci-out" :style="out(1.5, -1.5)">
        <g class="ci-part" :style="part(6, -6)">
          <path class="ci-line" pathLength="1" d="M63 8 H72 V17 H63 Z" />
          <path class="ci-line ci-line--thin" pathLength="1" d="M63 17 L53 27" />
        </g>
      </g>
      <g class="ci-out" :style="out(-1.5, 1.5)">
        <g class="ci-part" :style="part(-6, 6)">
          <path class="ci-line" pathLength="1" d="M8 63 H17 V72 H8 Z" />
          <path class="ci-line ci-line--thin" pathLength="1" d="M17 63 L27 53" />
        </g>
      </g>
      <g class="ci-out" :style="out(1.5, 1.5)">
        <g class="ci-part" :style="part(6, 6)">
          <path class="ci-line" pathLength="1" d="M63 63 H72 V72 H63 Z" />
          <path class="ci-line ci-line--thin" pathLength="1" d="M63 63 L53 53" />
        </g>
      </g>
    </template>

    <!-- 02 ITコンサルタント：散らばった課題が中央へ集まり、右の解決策へ -->
    <template v-else-if="type === 'consultant'">
      <g class="ci-out" :style="out(-1.5, 0)">
        <g class="ci-part" :style="part(-6, -3, 0)"><circle class="ci-dot" cx="9" cy="22" r="1.7" /></g>
        <g class="ci-part" :style="part(-5, -1.5, 0.15)"><circle class="ci-dot" cx="16" cy="31" r="1.7" /></g>
        <g class="ci-part" :style="part(-6, 0, 0.3)"><path class="ci-line ci-line--thin" pathLength="1" d="M7 39 H11 V43 H7 Z" /></g>
        <g class="ci-part" :style="part(-5, 1.5, 0.15)"><circle class="ci-dot" cx="15" cy="51" r="1.7" /></g>
        <g class="ci-part" :style="part(-6, 3, 0)"><circle class="ci-dot" cx="9" cy="59" r="1.7" /></g>
      </g>
      <path class="ci-line ci-line--thin" pathLength="1" d="M22 24 C34 24 36 40 46 40 M22 40 H46 M22 56 C34 56 36 40 46 40" />
      <path class="ci-flow" d="M22 40 H46" />
      <path class="ci-line" pathLength="1" d="M48 28 H72 V52 H48 Z" />
      <g class="ci-out" :style="out(1.5, 0)">
        <g class="ci-pulse">
          <path class="ci-line" pathLength="1" d="M54 40 L58 44 L66 36" />
        </g>
      </g>
    </template>

    <!-- 03 AI・DXプロジェクトリーダー：人・データ・プロジェクトが中央のAIチップへ集まる -->
    <template v-else-if="type === 'dx'">
      <path class="ci-line" pathLength="1" d="M31 31 H49 V49 H31 Z" />
      <path class="ci-line ci-line--thin" pathLength="1" d="M36 36 H44 V44 H36 Z" />
      <path class="ci-line ci-line--thin" pathLength="1" d="M36 31 V27 M44 31 V27 M36 49 V53 M44 49 V53 M31 36 H27 M31 44 H27 M49 36 H53 M49 44 H53" />

      <!-- 上：人 -->
      <g class="ci-stretch" :style="stretch(40, 27, 0, 0.7)">
        <path class="ci-line ci-line--thin" pathLength="1" d="M40 17 V27" />
        <path class="ci-flow" d="M40 17 V27" />
      </g>
      <g class="ci-out" :style="out(0, -1.5)">
        <g class="ci-part" :style="part(0, -7)">
          <path class="ci-line" pathLength="1" d="M37 9 A3 3 0 1 0 43 9 A3 3 0 1 0 37 9 M34 17 C34 13.5 36.5 12 40 12 C43.5 12 46 13.5 46 17" />
        </g>
      </g>
      <!-- 右：データ -->
      <g class="ci-stretch" :style="stretch(53, 40, 0.7, 0)">
        <path class="ci-line ci-line--thin" pathLength="1" d="M53 40 H63" />
        <path class="ci-flow" d="M63 40 H53" />
      </g>
      <g class="ci-out" :style="out(1.5, 0)">
        <g class="ci-part" :style="part(7, 0)">
          <path class="ci-line" pathLength="1" d="M63 35 C63 33.5 73 33.5 73 35 V45 C73 46.5 63 46.5 63 45 Z M63 40 C63 41.5 73 41.5 73 40" />
        </g>
      </g>
      <!-- 下：プロジェクト -->
      <g class="ci-stretch" :style="stretch(40, 53, 0, 0.7)">
        <path class="ci-line ci-line--thin" pathLength="1" d="M40 53 V63" />
      </g>
      <g class="ci-out" :style="out(0, 1.5)">
        <g class="ci-part" :style="part(0, 7)">
          <path class="ci-line" pathLength="1" d="M35 63 H45 V72 H35 Z" />
        </g>
      </g>
      <!-- 左：ノード -->
      <g class="ci-stretch" :style="stretch(27, 40, 0.7, 0)">
        <path class="ci-line ci-line--thin" pathLength="1" d="M17 40 H27" />
      </g>
      <g class="ci-out" :style="out(-1.5, 0)">
        <g class="ci-part" :style="part(-7, 0)">
          <circle class="ci-dot" cx="13" cy="40" r="3" />
        </g>
      </g>
    </template>

    <!-- 04 AI・自動化エンジニア：○ □ ◇ ◉ の間隔が広がって・縮まって、組み上がっていく -->
    <template v-else-if="type === 'automation'">
      <g class="ci-out" :style="out(-1.5, 0)">
        <g class="ci-part" :style="part(-5, 0)">
          <path class="ci-line" pathLength="1" d="M6 36 A6 6 0 1 0 18 36 A6 6 0 1 0 6 36" />
        </g>
      </g>
      <!-- ○—□ の線：□と一緒に動き、○側へ伸びる -->
      <g class="ci-part" :style="part(-2.5, 0)">
        <g class="ci-stretch" :style="stretch(24, 36, 0.417, 0)">
          <path class="ci-line ci-line--thin" pathLength="1" d="M18 36 H24" />
        </g>
      </g>
      <g class="ci-part" :style="part(-2.5, 0)">
        <path class="ci-line" pathLength="1" d="M24 30 H36 V42 H24 Z" />
        <path class="ci-line ci-line--thin" pathLength="1" d="M30 42 V58" />
        <circle class="ci-dot" cx="30" cy="58" r="1.7" />
      </g>
      <!-- □—◇ の線：中央から両側へ伸びる -->
      <g class="ci-stretch" :style="stretch(40, 36, 0.625, 0)">
        <path class="ci-line ci-line--thin" pathLength="1" d="M36 36 H44" />
      </g>
      <g class="ci-part" :style="part(2.5, 0)">
        <path class="ci-line" pathLength="1" d="M52 28 L60 36 L52 44 L44 36 Z" />
        <path class="ci-line ci-line--thin" pathLength="1" d="M52 58 V44" />
      </g>
      <!-- ◇—◉ の線：◇と一緒に動き、◉側へ伸びる -->
      <g class="ci-part" :style="part(2.5, 0)">
        <g class="ci-stretch" :style="stretch(60, 36, 0.625, 0)">
          <path class="ci-line ci-line--thin" pathLength="1" d="M60 36 H64" />
        </g>
      </g>
      <g class="ci-out" :style="out(1.5, 0)">
        <g class="ci-part" :style="part(5, 0)">
          <path class="ci-line" pathLength="1" d="M64 36 A6 6 0 1 0 76 36 A6 6 0 1 0 64 36" />
          <circle class="ci-dot" cx="70" cy="36" r="2" />
        </g>
      </g>
      <!-- 下の分岐線：中央から両側へ伸びる -->
      <g class="ci-stretch" :style="stretch(41, 58, 0.227, 0)">
        <path class="ci-line ci-line--thin" pathLength="1" d="M30 58 H52" />
        <path class="ci-flow" d="M30 58 H52" />
      </g>
    </template>

    <!-- 05 AIコンサルタント：AIが人へ少し寄り、成長の矢印が少し前へ進む -->
    <template v-else-if="type === 'ai-consultant'">
      <path class="ci-line" pathLength="1" d="M15 24 A6 6 0 1 0 27 24 A6 6 0 1 0 15 24 M9 46 C9 37 14 33 21 33 C28 33 33 37 33 46" />
      <g class="ci-stretch" :style="stretch(28, 22, 0.27, 0)">
        <path class="ci-line ci-line--thin" pathLength="1" d="M28 22 H50" />
        <path class="ci-flow" d="M50 22 H28" />
      </g>
      <g class="ci-out" :style="out(1.5, -1.5)">
        <g class="ci-part" :style="part(6, -3)">
          <path class="ci-line ci-line--thin" pathLength="1" d="M54 13 L68 16 L62 30 Z" />
          <circle class="ci-dot" cx="54" cy="13" r="2.4" />
          <circle class="ci-dot" cx="68" cy="16" r="2.4" />
          <circle class="ci-dot" cx="62" cy="30" r="2.4" />
        </g>
      </g>
      <g class="ci-advance" :style="part(3, -1.8)">
        <path class="ci-line" pathLength="1" d="M10 66 L28 58 L42 62 L68 48" />
        <g class="ci-out" :style="out(1.5, -1)">
          <path class="ci-line" pathLength="1" d="M61 47 L68 48 L65 54" />
        </g>
      </g>
    </template>
  </svg>
</template>

<style scoped>
.ci {
  --ink: #17243A;
  --ink-sub: #26364D;
  --cycle: 6.5s;                       /* 1周の長さ */
  --cdelay: calc(var(--i) * 0.6s);     /* カードごとにずらす */
  --amp: 1;                            /* 動く量（SP は小さく） */
  --ease: cubic-bezier(0.4, 0, 0.2, 1);

  display: block;
  overflow: visible;
  transition: transform 0.7s ease-out;
  /* 線画全体：ゆっくり少し大きく → 元のサイズへ（背景の淡い図形はカード側なので動かない）
     ホバーの transform と競合しないよう、scale プロパティで動かす */
  transform-origin: center;
  animation: careerIconPulse 2.8s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.56s); /* 5枚が同時に動かないよう少しずつずらす */
}

@keyframes careerIconPulse {
  0%, 100% { scale: 1; }
  50% { scale: 1.14; }
}

/* 線：太さ・色はすべて共通 */
.ci-line {
  stroke: var(--ink);
  stroke-width: 1.4;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}

.ci-line--thin {
  stroke: var(--ink-sub);
  stroke-width: 1.1;
}

.ci-dot {
  fill: var(--ink-sub);
}

/* ---------- 線がゆっくり描かれる（画面に入ったとき1回だけ） ---------- */
.ci--pending .ci-line {
  stroke-dashoffset: 1;
}

.ci--pending .ci-dot,
.ci--pending .ci-flow {
  opacity: 0;
}

.ci--drawing .ci-line {
  transition: stroke-dashoffset 1.8s cubic-bezier(0.45, 0, 0.2, 1);
  transition-delay: calc(var(--i) * 0.12s);
}

.ci--drawing .ci-dot,
.ci--drawing .ci-flow {
  transition: opacity 0.8s ease;
  transition-delay: calc(var(--i) * 0.12s + 1.1s);
}

/* ---------- 広がる → 集まる → 広がる（各パーツ） ---------- */
.ci-part {
  animation: ciGather var(--cycle) var(--ease) infinite;
  animation-delay: calc(var(--cdelay) + var(--pd, 0s));
}

@keyframes ciGather {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(calc(var(--px) * var(--amp)), calc(var(--py) * var(--amp))); }
  45%, 55% { transform: translate(calc(var(--px) * var(--amp) * -0.35), calc(var(--py) * var(--amp) * -0.35)); }
  80% { transform: translate(calc(var(--px) * var(--amp) * 0.8), calc(var(--py) * var(--amp) * 0.8)); }
}

/* 接続線：つながっているパーツと同じタイミングで、線の向きにだけ伸び縮み（太さは変わらない） */
.ci-stretch {
  transform-box: view-box;
  transform-origin: var(--sox) var(--soy);
  animation: ciStretch var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes ciStretch {
  0%, 100% { transform: scale(1, 1); }
  20% { transform: scale(calc(1 + var(--sx) * var(--amp)), calc(1 + var(--sy) * var(--amp))); }
  45%, 55% { transform: scale(calc(1 - var(--sx) * var(--amp) * 0.35), calc(1 - var(--sy) * var(--amp) * 0.35)); }
  80% { transform: scale(calc(1 + var(--sx) * var(--amp) * 0.8), calc(1 + var(--sy) * var(--amp) * 0.8)); }
}

/* 05 の矢印：パーツが集まるタイミングで少しだけ前へ進む */
.ci-advance {
  animation: ciAdvance var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes ciAdvance {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(calc(var(--px) * var(--amp) * -0.3), calc(var(--py) * var(--amp) * -0.3)); }
  45%, 55% { transform: translate(calc(var(--px) * var(--amp)), calc(var(--py) * var(--amp))); }
  80% { transform: translate(calc(var(--px) * var(--amp) * 0.2), calc(var(--py) * var(--amp) * 0.2)); }
}

/* 02 のチェック：集まるタイミングでわずかに大きく（0.96 → 1） */
.ci-pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: ciPulse var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes ciPulse {
  0%, 20%, 80%, 100% { transform: scale(0.96); }
  45%, 55% { transform: scale(1); }
}

/* 線の上を流れる、ごく淡い光（1アイコンにつき1〜2本だけ） */
.ci-flow {
  stroke: rgba(255, 255, 255, 0.85);
  stroke-width: 1.8;
  stroke-dasharray: 2 10;
  animation: ciFlow 3.6s linear infinite;
  animation-delay: var(--cdelay);
}

@keyframes ciFlow {
  to { stroke-dashoffset: -12; }
}

/* ---------- カードにマウスを乗せたとき（控えめ） ---------- */
.ci-out {
  transition: transform 0.7s ease-out;
}

@media (hover: hover) {
  .career__item:hover .ci {
    transform: translateY(-3px) scale(1.02);
  }

  .career__item:hover .ci-out {
    transform: translate(var(--ox), var(--oy));
  }
}

/* SP：動く量を小さく（最大 4〜6px 程度） */
@media (max-width: 767px) {
  .ci {
    --amp: 0.55;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ci,
  .ci-line,
  .ci-dot,
  .ci-out,
  .ci-part,
  .ci-stretch,
  .ci-advance,
  .ci-pulse,
  .ci-flow {
    animation: none !important;
    transition: none !important;
  }

  .ci-flow {
    display: none;
  }

  .ci-pulse {
    transform: none;
  }

  .career__item:hover .ci,
  .career__item:hover .ci-out {
    transform: none;
  }
}
</style>
