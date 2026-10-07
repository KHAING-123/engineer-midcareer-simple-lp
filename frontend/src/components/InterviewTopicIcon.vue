<script setup>
// 06「面接でお話しすること」のアイコン（白い円＋細い青い弧＋線画）
// type：'person' | 'briefcase' | 'growth' | 'chat'
// 4つはそれぞれ違う動き（5.5秒前後・0.6秒ずつずらす）

const props = defineProps({
  type: { type: String, required: true },
  index: { type: Number, default: 0 }
})

// 青い弧：円周の約21%（75°）。4つとも同じ形で、回転の開始位置だけずらす
const arcPath = 'M27 89.84 A46 46 0 0 1 5.57 38.1'
</script>

<template>
  <span class="ti" :class="`ti--${type}`" :style="{ '--i': props.index }" aria-hidden="true">
    <!-- 外側の細い青い弧（少しだけ揺れる） -->
    <svg class="ti-arc" viewBox="0 0 100 100" fill="none">
      <g class="ti-arc-move">
        <path class="ti-arc-path" :d="arcPath" stroke="#56B5EE" stroke-linecap="round" />
      </g>
    </svg>

    <!-- 線画アイコン -->
    <svg class="ti-icon" viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <!-- 01 人物：頭がゆっくり呼吸するように上下 -->
      <template v-if="type === 'person'">
        <g class="ti-head"><circle class="ti-line" cx="24" cy="15" r="6.5" /></g>
        <path class="ti-line" d="M11 40 C11 31 17 26 24 26 C31 26 37 31 37 40" />
      </template>

      <!-- 02 かばん：全体がわずかに浮き、持ち手だけ少し遅れて上がる -->
      <g v-else-if="type === 'briefcase'" class="ti-case">
        <g class="ti-handle"><path class="ti-line" d="M18 15 V11 H30 V15" /></g>
        <path class="ti-line" d="M7 15 H41 V38 H7 Z M7 25 H41" />
        <path class="ti-line" d="M21.5 22.5 H26.5 V28 H21.5 Z" />
      </g>

      <!-- 03 成長：棒が左から順に伸び、そのあと矢印が右上へ -->
      <template v-else-if="type === 'growth'">
        <g class="ti-bar" style="--bd: 0s; --from: 0.82"><path class="ti-line" d="M8 31 H14 V40 H8 Z" /></g>
        <g class="ti-bar" style="--bd: 0.18s; --from: 0.72"><path class="ti-line" d="M19 25 H25 V40 H19 Z" /></g>
        <g class="ti-bar" style="--bd: 0.36s; --from: 0.62"><path class="ti-line" d="M30 18 H36 V40 H30 Z" /></g>
        <g class="ti-arrow">
          <path class="ti-line" d="M8 22 L18 14 L24 17 L38 7 M32.5 7 H38 V12.5" />
        </g>
      </template>

      <!-- 04 会話：吹き出しがわずかに大きくなり、中の「・・・」が順番に動く -->
      <template v-else-if="type === 'chat'">
        <g class="ti-bubble">
          <path class="ti-line" d="M24 8 C35 8 42 14.5 42 22.5 C42 30.5 35 37 24 37 C21.5 37 19 36.6 17 36 L9 40 L11 32.5 C7.5 29.8 6 26.5 6 22.5 C6 14.5 13 8 24 8 Z" />
        </g>
        <g class="ti-dot" style="--dd: 0s"><circle class="ti-fill" cx="17" cy="22.5" r="2.2" /></g>
        <g class="ti-dot" style="--dd: 0.25s"><circle class="ti-fill" cx="24" cy="22.5" r="2.2" /></g>
        <g class="ti-dot" style="--dd: 0.5s"><circle class="ti-fill" cx="31" cy="22.5" r="2.2" /></g>
      </template>
    </svg>
  </span>
</template>

<style scoped>
.ti {
  --ink: #17243A;
  --cycle: 5.5s;
  --cdelay: calc(var(--i) * 0.6s);
  --amp: 1;                         /* 動く量（SP は小さく） */
  --ease: cubic-bezier(0.4, 0, 0.2, 1);

  position: relative;
  display: block;
  width: var(--ti-size, 88px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, #FFFFFF 55%, #F4F9FD 100%);
  /* 白い円だけに、カード背景から少し浮いて見えるやわらかい影（弧には付けない） */
  box-shadow:
    0 10px 24px rgba(25, 55, 90, 0.08),
    0 3px 8px rgba(25, 55, 90, 0.05);
  transition: transform 0.6s ease;
}

.ti-arc {
  position: absolute;
  inset: -8%;
  width: 116%;
  height: 116%;
  overflow: visible;
  transition: transform 0.6s ease;
}

.ti-icon {
  position: absolute;
  inset: 22%;
  width: 56%;
  height: 56%;
  overflow: visible;
}

.ti-line {
  stroke: var(--ink);
  stroke-width: 1.8;
}

.ti-fill {
  fill: var(--ink);
}

/* 青い弧：白い円の外周に沿って、ゆっくり一定の速さで1周（8秒）
   白い円・アイコンは動かさず、弧だけを回す。開始位置は 0 / -2 / -4 / -6 秒ずつずらす */
.ti-arc-path {
  stroke-width: 2.2;
  opacity: 0.9;
}

.ti-arc-move {
  transform-box: view-box;
  transform-origin: 50px 50px;
  animation: tiArcRotate 8s linear infinite;
  animation-delay: calc(var(--i) * -2s);
}

@keyframes tiArcRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 01 人物：頭だけゆっくり上下 */
.ti-head {
  animation: tiBreath var(--cycle) ease-in-out infinite;
  animation-delay: var(--cdelay);
}

@keyframes tiBreath {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(-3.5px * var(--amp))); }
}

/* 02 かばん：全体がわずかに浮く＋持ち手が少し遅れて上がる */
.ti-case {
  animation: tiFloat var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes tiFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(calc(-4px * var(--amp))); }
}

.ti-handle {
  animation: tiHandle var(--cycle) var(--ease) infinite;
  animation-delay: calc(var(--cdelay) + 0.25s);
}

@keyframes tiHandle {
  0%, 30%, 100% { transform: translateY(0); }
  55% { transform: translateY(calc(-3px * var(--amp))); }
}

/* 03 成長：棒が下から順に伸びる → 矢印が右上へ */
.ti-bar {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: tiBar var(--cycle) var(--ease) infinite;
  animation-delay: calc(var(--cdelay) + var(--bd));
}

@keyframes tiBar {
  0%, 100% { transform: scaleY(var(--from)); }
  35%, 70% { transform: scaleY(1); }
}

.ti-arrow {
  animation: tiArrow var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes tiArrow {
  0%, 25%, 100% { transform: translate(0, calc(2px * var(--amp))); }
  55%, 70% { transform: translate(calc(4px * var(--amp)), calc(-4px * var(--amp))); }
}

/* 04 会話：吹き出しがわずかに大きくなる＋「・・・」が順番に上下 */
.ti-bubble {
  transform-box: fill-box;
  transform-origin: center;
  animation: tiBubble var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes tiBubble {
  0%, 100% { transform: scale(0.96); }
  40% { transform: scale(1.03); }
  60% { transform: scale(1); }
}

.ti-dot {
  animation: tiDot 2.4s ease-in-out infinite;
  animation-delay: calc(var(--cdelay) + var(--dd));
}

@keyframes tiDot {
  0%, 60%, 100% { transform: translateY(0); }
  25% { transform: translateY(calc(-4px * var(--amp))); }
}

/* PCのホバー：アイコンが少し浮き、弧が少しだけ回る（動きは続く） */
@media (hover: hover) {
  .interview__topic:hover .ti {
    transform: translateY(-3px);
  }

  .interview__topic:hover .ti-arc {
    transform: rotate(5deg);
  }
}

/* SP：動く量を少し小さく */
@media (max-width: 767px) {
  .ti {
    --amp: 0.7;
    box-shadow:
      0 7px 18px rgba(25, 55, 90, 0.07),
      0 2px 6px rgba(25, 55, 90, 0.04);
  }

  .ti-arc-path {
    stroke-width: 1.8;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ti,
  .ti-arc,
  .ti-arc-move,
  .ti-head,
  .ti-case,
  .ti-handle,
  .ti-bar,
  .ti-arrow,
  .ti-bubble,
  .ti-dot {
    animation: none !important;
    transition: none !important;
  }

  .interview__topic:hover .ti,
  .interview__topic:hover .ti-arc {
    transform: none;
  }

  /* 止めても弧は消さず、4つとも少しずつ違う位置で静止 */
  .ti-arc-move {
    transform: rotate(calc(var(--i) * 90deg));
  }
}
</style>
