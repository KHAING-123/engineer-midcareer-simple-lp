<script setup>
// 07 選考の流れ：線画アイコン（5種類）
// type：'document' | 'chat' | 'person' | 'search' | 'flag'
// 線はすべて Dark Navy（stroke 2）。一部だけ Blue / Cyan
// 動きは transform / opacity のみ。「少し外へ広がる → 元の位置へ集まる」をベースに、アイコンの意味に合わせて変える
defineProps({
  type: { type: String, required: true },
  index: { type: Number, default: 0 } // 動き始めを少しずつずらすため
})

// 広がる方向と距離（px）
const spread = (x, y) => ({ '--px': `${x}px`, '--py': `${y}px` })
</script>

<template>
  <svg
    class="fi"
    :class="`fi--${type}`"
    :style="{ '--i': index }"
    viewBox="0 0 48 48"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- 01 書類選考：書類＋本文の線＋後ろの小さな青い書類 -->
    <template v-if="type === 'document'">
      <g class="fi-part" :style="spread(3, 3)">
        <rect class="fi-fill" x="21" y="17" width="17" height="21" rx="3" />
        <path class="fi-blue" d="M25 33 H33" />
      </g>
      <path class="fi-ink fi-paper" d="M12 8 H26 L34 16 V38 a2 2 0 0 1 -2 2 H14 a2 2 0 0 1 -2 -2 V10 a2 2 0 0 1 2 -2 Z" />
      <path class="fi-ink" d="M26 8 V16 H34" />
      <path class="fi-ink fi-part" :style="spread(0, -1.5)" d="M17 21 H29" />
      <path class="fi-ink" d="M17 26 H29" />
      <path class="fi-ink fi-part" :style="spread(0, 1.5)" d="M17 31 H24" />
    </template>

    <!-- 02 カジュアル面談：2つの吹き出し＋3つの点＋小さな青いアクセント -->
    <template v-else-if="type === 'chat'">
      <g class="fi-part" :style="spread(4, 0)">
        <path class="fi-blue fi-paper" d="M21 20 H37 a3 3 0 0 1 3 3 V31 a3 3 0 0 1 -3 3 H35 V38 L30 34 H24 a3 3 0 0 1 -3 -3 Z" />
      </g>
      <g class="fi-part" :style="spread(-4, 0)">
        <path class="fi-ink fi-paper" d="M8 12 H27 a3 3 0 0 1 3 3 V25 a3 3 0 0 1 -3 3 H17 L11 32.5 V28 H8 a3 3 0 0 1 -3 -3 V15 a3 3 0 0 1 3 -3 Z" />
        <circle class="fi-dot" cx="12" cy="20" r="1.6" />
        <circle class="fi-dot" cx="17.5" cy="20" r="1.6" />
        <circle class="fi-dot" cx="23" cy="20" r="1.6" />
      </g>
      <g class="fi-part" :style="spread(1.5, -1.5)">
        <path class="fi-cyan" d="M36 6.5 L35 10 M40.5 9 L38 11.5 M42.5 14 L39 14.5" />
      </g>
    </template>

    <!-- 03 面接：頭＋肩のライン＋話している様子の小さな線 -->
    <template v-else-if="type === 'person'">
      <circle class="fi-ink fi-head" cx="22" cy="17" r="7" />
      <path class="fi-ink fi-body" d="M9 40 V38 a13 11 0 0 1 26 0 V40" />
      <g class="fi-part" :style="spread(2, -2)">
        <path class="fi-cyan" d="M34.5 6 L34 9.5 M39.5 8 L37 10.5 M41.5 13 L38 13.5" />
      </g>
    </template>

    <!-- 04 条件確認：書類（固定）＋虫めがね（小さく動いて確認している様子） -->
    <template v-else-if="type === 'search'">
      <path class="fi-ink fi-paper" d="M10 7 H24 L32 15 V24 M23 41 H12 a2 2 0 0 1 -2 -2 V9 a2 2 0 0 1 2 -2" />
      <path class="fi-ink" d="M24 7 V15 H32" />
      <path class="fi-ink" d="M15 20 H26 M15 25 H21 M15 30 H19" />
      <g class="fi-scan">
        <circle class="fi-fill" cx="31" cy="31" r="7" />
        <circle class="fi-blue" cx="31" cy="31" r="7" />
        <path class="fi-ink" d="M36.2 36.2 L41 41" />
        <path class="fi-blue fi-blue--thin" d="M28 29.5 a3.5 3.5 0 0 1 3 -2" />
      </g>
    </template>

    <!-- 05 内定：旗竿（固定）＋旗（軽くなびく）＋小さなアクセント -->
    <template v-else-if="type === 'flag'">
      <g class="fi-wave">
        <path class="fi-fill fi-flag" d="M14 9 L35 18 L14 27 Z" />
        <path class="fi-blue" d="M14 9 L35 18 L14 27" />
      </g>
      <path class="fi-ink" d="M14 8 V41" />
      <g class="fi-part" :style="spread(2, -2)">
        <path class="fi-cyan" d="M34 5.5 L33.5 9 M39 7.5 L36.5 10 M41 12.5 L37.5 13" />
      </g>
    </template>
  </svg>
</template>

<style scoped>
.fi {
  --navy: #0B2345;
  --blue: #1677E8;
  --cyan: #36C8E8;
  --amp: 1;          /* 動く量（SPでは小さく） */
  --cycle: 4.2s;
  --delay: calc(var(--i) * -0.7s);
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.fi * {
  transform-box: fill-box;
  transform-origin: center;
}

/* ---------- 線と面 ---------- */
.fi-ink,
.fi-blue,
.fi-cyan {
  stroke-width: 2;
}

.fi-ink {
  stroke: var(--navy);
}

.fi-blue {
  stroke: var(--blue);
}

.fi-blue--thin {
  stroke-width: 1.4;
  opacity: 0.7;
}

.fi-cyan {
  stroke: var(--cyan);
  stroke-width: 1.8;
}

/* 線の下を白く塗り、後ろのパーツを隠す */
.fi-paper {
  fill: #fff;
}

.fi-fill {
  fill: rgba(22, 119, 232, 0.18);
  stroke: none;
}

.fi-dot {
  fill: var(--navy);
  stroke: none;
}

/* ---------- 共通：少し外へ広がる → 元の位置へ集まる ---------- */
.fi-part {
  animation: fiSpread var(--cycle) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes fiSpread {
  0%, 100% { transform: translate(0, 0); }
  45%, 55% { transform: translate(calc(var(--px) * var(--amp)), calc(var(--py) * var(--amp))); }
}

/* ---------- 02：吹き出しの点が順番に明るくなる（会話している様子） ---------- */
.fi-dot {
  animation: fiDot 1.8s ease-in-out infinite;
}

.fi-dot:nth-of-type(2) { animation-delay: 0.3s; }
.fi-dot:nth-of-type(3) { animation-delay: 0.6s; }

@keyframes fiDot {
  0%, 100% { opacity: 0.45; }
  40% { opacity: 1; }
}

/* ---------- 03：頭が少し上がり、肩がわずかに広がる ---------- */
.fi--person .fi-head {
  animation: fiHead var(--cycle) ease-in-out infinite;
  animation-delay: var(--delay);
}

.fi--person .fi-body {
  transform-origin: center bottom;
  animation: fiBody var(--cycle) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes fiHead {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(-2px * var(--amp))); }
}

@keyframes fiBody {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* ---------- 04：虫めがねが書類の上を小さく動く（確認している様子） ---------- */
.fi-scan {
  animation: fiScan 4.6s ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes fiScan {
  0%, 100% { transform: translate(calc(-2px * var(--amp)), calc(1px * var(--amp))); }
  50% { transform: translate(calc(3px * var(--amp)), calc(-2px * var(--amp))); }
}

/* ---------- 05：旗だけが軽くなびく（竿は固定） ---------- */
.fi-wave {
  transform-origin: left center;
  animation: fiWave 3.6s ease-in-out infinite;
}

@keyframes fiWave {
  0%, 100% { transform: rotate(0deg) skewY(0deg) scaleX(1); }
  35% { transform: rotate(2deg) skewY(-1.5deg) scaleX(0.97); }
  70% { transform: rotate(-1deg) skewY(1deg) scaleX(1.01); }
}

.fi-flag {
  fill: rgba(22, 119, 232, 0.2);
}

@media (max-width: 767px) {
  .fi {
    --amp: 0.7;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fi * {
    animation: none !important;
  }

  .fi-dot {
    opacity: 1;
  }
}
</style>
