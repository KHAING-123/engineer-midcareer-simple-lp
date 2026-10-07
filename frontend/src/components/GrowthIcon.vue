<script setup>
// 03 成長ステップ：線画アイコン（4種類）
// type：'book' | 'code' | 'team' | 'growth'
// 線はすべて Dark Navy（stroke 1.8）。一部だけ Blue
// 動きは transform / opacity のみ。アイコンの意味に合わせて別々の小さな動き
defineProps({
  type: { type: String, required: true },
  index: { type: Number, default: 0 } // 動き始めを少しずつずらすため
})
</script>

<template>
  <svg
    class="gi"
    :class="`gi--${type}`"
    :style="{ '--i': index }"
    viewBox="0 0 48 48"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- STEP 01 実践型AI・IT研修：開いた本。左右のページが背表紙を軸に少し開く → 戻る -->
    <template v-if="type === 'book'">
      <g class="gi-page gi-page--left">
        <path class="gi-ink gi-paper" d="M24 14 C19.5 11 13 10.5 7 12.5 V35.5 C13 33.5 19.5 34 24 37 Z" />
        <path class="gi-ink gi-thin" d="M11 18.5 C14 17.6 17 17.6 20 18.6 M11 23.5 C14 22.6 17 22.6 20 23.6 M11 28.5 C13 27.9 15 27.9 17 28.4" />
      </g>
      <g class="gi-page gi-page--right">
        <path class="gi-ink gi-paper" d="M24 14 C28.5 11 35 10.5 41 12.5 V35.5 C35 33.5 28.5 34 24 37 Z" />
        <path class="gi-blue gi-thin" d="M28 18.6 C31 17.6 34 17.6 37 18.5 M28 23.6 C31 22.6 34 22.6 37 23.5 M28 28.4 C30 27.9 32 27.9 34 28.5" />
      </g>
      <path class="gi-ink" d="M24 14 V37" />
    </template>

    <!-- STEP 02 OJT・プロジェクト参加：コードウィンドウ。< / > が中央へ集まる → 少し外へ広がる → 戻る -->
    <template v-else-if="type === 'code'">
      <rect class="gi-ink gi-paper" x="6" y="9" width="36" height="30" rx="3.5" />
      <path class="gi-ink" d="M6 16 H42" />
      <circle class="gi-dot" cx="10.5" cy="12.6" r="1" />
      <circle class="gi-dot" cx="14" cy="12.6" r="1" />
      <circle class="gi-dot" cx="17.5" cy="12.6" r="1" />
      <path class="gi-ink gi-code gi-code--left" d="M18.5 23 L14 27.5 L18.5 32" />
      <path class="gi-blue gi-code gi-code--slash" d="M26 22 L22 33" />
      <path class="gi-ink gi-code gi-code--right" d="M29.5 23 L34 27.5 L29.5 32" />
    </template>

    <!-- STEP 03 定期的なキャリア1on1：3人。左右の人が中央の人へ少し寄る → 戻る -->
    <template v-else-if="type === 'team'">
      <g class="gi-person gi-person--left">
        <circle class="gi-ink" cx="11.5" cy="19.5" r="3.6" />
        <path class="gi-ink" d="M4.5 35 C4.5 30 7.5 27.2 11.5 27.2 C13.2 27.2 14.6 27.6 15.8 28.4" />
      </g>
      <g class="gi-person gi-person--right">
        <circle class="gi-ink" cx="36.5" cy="19.5" r="3.6" />
        <path class="gi-ink" d="M43.5 35 C43.5 30 40.5 27.2 36.5 27.2 C34.8 27.2 33.4 27.6 32.2 28.4" />
      </g>
      <g class="gi-person gi-person--center">
        <circle class="gi-blue gi-paper" cx="24" cy="16" r="4.6" />
        <path class="gi-blue gi-paper" d="M14.5 37 C14.5 30.5 18.7 26 24 26 C29.3 26 33.5 30.5 33.5 37" />
      </g>
    </template>

    <!-- STEP 04 継続的なスキルアップ：棒グラフが順番に伸び、最後に矢印が右上へ -->
    <template v-else-if="type === 'growth'">
      <path class="gi-ink" d="M6 40 H42" />
      <rect class="gi-ink gi-bar gi-bar--1" x="9" y="30" width="6" height="10" rx="0.8" />
      <rect class="gi-ink gi-bar gi-bar--2" x="19" y="24" width="6" height="16" rx="0.8" />
      <rect class="gi-ink gi-bar gi-bar--3" x="29" y="17" width="6" height="23" rx="0.8" />
      <g class="gi-arrow">
        <path class="gi-blue" d="M8 22 L17 14.5 L23 18.5 L38 8" />
        <path class="gi-blue" d="M32.5 8 H38 V13.5" />
      </g>
    </template>
  </svg>
</template>

<style scoped>
.gi {
  --navy: #0B2A55;
  --blue: #126FD6;
  --amp: 1;       /* 動く量（SPでは小さく） */
  --cycle: 4.6s;  /* 1回の動きの長さ（SPでは長く） */
  --delay: calc(var(--i) * -1.1s);
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.gi * {
  transform-box: fill-box;
  transform-origin: center;
}

/* ---------- 線（4つとも同じ太さ） ---------- */
.gi-ink,
.gi-blue {
  stroke-width: 1.8;
}

.gi-ink {
  stroke: var(--navy);
}

.gi-blue {
  stroke: var(--blue);
}

.gi-thin {
  stroke-width: 1.4;
}

/* 線の下を白く塗り、後ろのパーツを隠す */
.gi-paper {
  fill: #fff;
}

.gi-dot {
  fill: var(--navy);
  stroke: none;
}

/* ---------- STEP 01：ページが背表紙を軸に少し開く（横幅の伸縮で rotateY 風に） ---------- */
.gi-page {
  animation: giPageOpen var(--cycle) ease-in-out infinite;
  animation-delay: var(--delay);
}

.gi-page--left {
  transform-origin: right center;
  --tilt: 1.5deg;
}

.gi-page--right {
  transform-origin: left center;
  --tilt: -1.5deg;
}

@keyframes giPageOpen {
  0%, 70%, 100% { transform: scaleX(1) skewY(0deg); }
  40% { transform: scaleX(calc(1 + 0.07 * var(--amp))) skewY(calc(var(--tilt) * var(--amp))); }
}

/* ---------- STEP 02：< / > が中央へ集まる → 少し外へ広がる → 戻る ---------- */
.gi-code {
  animation: giGather var(--cycle) ease-in-out infinite;
  animation-delay: var(--delay);
}

.gi-code--left { --dir: 1; }
.gi-code--right { --dir: -1; }

.gi-code--slash {
  animation-name: giSlash;
}

@keyframes giGather {
  0%, 100% { transform: translateX(0); }
  30% { transform: translateX(calc(3.5px * var(--dir) * var(--amp))); }
  60% { transform: translateX(calc(-2.5px * var(--dir) * var(--amp))); }
  80% { transform: translateX(0); }
}

@keyframes giSlash {
  0%, 60%, 100% { transform: scale(1); opacity: 1; }
  30% { transform: scale(0.9); opacity: 0.75; }
}

/* ---------- STEP 03：左右の人が中央へ少し寄る → 元の位置へ ---------- */
.gi-person--left,
.gi-person--right {
  animation: giMeet var(--cycle) ease-in-out infinite;
  animation-delay: var(--delay);
}

.gi-person--left { --dir: 1; }
.gi-person--right { --dir: -1; }

@keyframes giMeet {
  0%, 75%, 100% { transform: translateX(0); }
  40%, 50% { transform: translateX(calc(2.5px * var(--dir) * var(--amp))); }
}

/* ---------- STEP 04：棒グラフが低い状態から順番に伸びる → 矢印が最後に右上へ ---------- */
.gi-bar {
  transform-origin: center bottom;
  vector-effect: non-scaling-stroke;
  animation: giBar1 var(--cycle) ease-in-out infinite;
  animation-delay: var(--delay);
}

/* 3本それぞれ少しずつ遅れて伸びるよう、keyframes を分ける */
.gi-bar--1 { animation-name: giBar1; }
.gi-bar--2 { animation-name: giBar2; }
.gi-bar--3 { animation-name: giBar3; }

@keyframes giBar1 {
  0%, 92%, 100% { transform: scaleY(0.72); }
  14%, 80% { transform: scaleY(1); }
}

@keyframes giBar2 {
  0%, 10%, 92%, 100% { transform: scaleY(0.72); }
  26%, 80% { transform: scaleY(1); }
}

@keyframes giBar3 {
  0%, 22%, 92%, 100% { transform: scaleY(0.72); }
  38%, 80% { transform: scaleY(1); }
}

.gi-arrow {
  animation: giArrow var(--cycle) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes giArrow {
  0%, 40%, 92%, 100% { transform: translate(0, 0); }
  55%, 80% { transform: translate(calc(3px * var(--amp)), calc(-3px * var(--amp))); }
}

/* SP：動きを控えめに・ゆっくり */
@media (max-width: 767px) {
  .gi {
    --amp: 0.7;
    --cycle: 6s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gi * {
    animation: none !important;
  }
}
</style>
