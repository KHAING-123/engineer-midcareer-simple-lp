<script setup>
// 04 AI時代の成長環境：カード上部の線画イラスト（4種類）
// type：'tools' | 'daily' | 'build' | 'dx'
// 動き（5.5秒で1周・カードごとに0.55秒ずつずらす）：
//   0% 通常 → 20% 外へ広がる → 40% 中央へ動き始める → 55〜62% 集まって少し止まる → 82% また広がる → 100% 通常
// ・接続線は、つながっているパーツに合わせて伸び縮みする（線の太さは変わらない）
// ・青い点は外側 → 中央へ流れる
import { useId } from 'vue'

const props = defineProps({
  type: { type: String, required: true },
  index: { type: Number, default: 0 }
})

const gradId = `si-glow-${useId()}`

// 接続線と、その先のパーツをセットで動かす
//   origin：中央側の線の端 ／ end：パーツ側の線の端 ／ k：線の長さに対して何割広がるか
// → パーツは「線の向き × k」だけ動くので、線の先端とパーツが離れない
const link = (ox, oy, ex, ey, k) => ({
  line: { '--ox': `${ox}px`, '--oy': `${oy}px`, '--k': k },
  part: { '--px': `${(ex - ox) * k}px`, '--py': `${(ey - oy) * k}px` }
})
// 線のないパーツ（点など）の動き
const part = (x, y) => ({ '--px': `${x}px`, '--py': `${y}px` })
// 青い点が A→B へ流れる（tools / build / dx）
const travel = (ax, ay, bx, by, delay = 0) => ({
  '--ax': `${ax}px`, '--ay': `${ay}px`, '--bx': `${bx}px`, '--by': `${by}px`, '--td': `${delay}s`
})
// 青い点が A→B（ノートPCへ入る）→ C→D（AIへ出る）と流れる（daily）
const travel2 = (ax, ay, bx, by, cx, cy, dx, dy) => ({
  '--ax': `${ax}px`, '--ay': `${ay}px`, '--bx': `${bx}px`, '--by': `${by}px`,
  '--cx': `${cx}px`, '--cy': `${cy}px`, '--dx': `${dx}px`, '--dy': `${dy}px`
})
// カードにマウスを乗せたときに、さらに外へ広がる量
const out = (x, y) => ({ '--hx': `${x}px`, '--hy': `${y}px` })

// 01：4つのツールが中央のAIへ
const t = {
  tl: link(86, 47, 70, 36, 0.5),
  tr: link(114, 47, 130, 36, 0.5),
  bl: link(86, 63, 70, 76, 0.5),
  br: link(114, 63, 130, 76, 0.5)
}
// 02：資料 → ノートPC → AI
const d = {
  doc: link(76, 48, 52, 45, 0.35),
  ai: link(124, 46, 140, 42, 0.45)
}
// 03：歯車・ワークフロー・データベースがコード画面へ
const b = {
  gear: link(78, 44, 58, 36, 0.4),
  flow: link(122, 44, 134, 36, 0.6),
  db: link(122, 64, 132, 76, 0.62)
}
// 04：企業・人・資料・グラフが中央のAIへ
const x = {
  co: link(86, 47, 72, 36, 0.6),
  pe: link(114, 47, 128, 36, 0.6),
  doc: link(86, 63, 72, 74, 0.6),
  gr: link(114, 63, 128, 74, 0.6)
}
</script>

<template>
  <svg
    class="si"
    :style="{ '--i': props.index }"
    viewBox="0 0 200 110"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <defs>
      <radialGradient :id="gradId" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgb(214, 233, 250)" stop-opacity="0.55" />
        <stop offset="100%" stop-color="rgb(214, 233, 250)" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- 後ろのごく淡いブルーの面 -->
    <ellipse cx="88" cy="56" rx="62" ry="44" :fill="`url(#${gradId})`" />
    <ellipse cx="122" cy="48" rx="46" ry="36" :fill="`url(#${gradId})`" />

    <!-- ========== 01 AIツール費用を会社負担：4つのツールが中央のAIへ集まる ========== -->
    <template v-if="type === 'tools'">
      <path class="si-line si-thin" d="M100 18 V40 M100 70 V92" />
      <circle class="si-blue si-soft" cx="100" cy="16" r="2.2" />
      <circle class="si-blue si-soft" cx="100" cy="94" r="2.2" />
      <circle class="si-travel" r="2.2" :style="travel(100, 16, 100, 40, 0)" />
      <circle class="si-travel" r="2" :style="travel(100, 94, 100, 70, 1.3)" />
      <g class="si-part" :style="part(-6, 0)"><circle class="si-blue" cx="40" cy="58" r="2.4" /></g>
      <g class="si-part" :style="part(6, 0)"><circle class="si-blue" cx="160" cy="56" r="2.6" /></g>

      <g class="si-link" :style="t.tl.line">
        <path class="si-line si-thin" d="M86 47 C78 47 78 36 70 36" />
        <path class="si-flow" d="M70 36 C78 36 78 47 86 47" />
      </g>
      <g class="si-link" :style="t.tr.line"><path class="si-line si-thin" d="M114 47 C122 47 122 36 130 36" /></g>
      <g class="si-link" :style="t.bl.line"><path class="si-line si-thin" d="M86 63 C78 63 78 76 70 76" /></g>
      <g class="si-link" :style="t.br.line">
        <path class="si-line si-thin" d="M114 63 C122 63 122 76 130 76" />
        <path class="si-flow" d="M130 76 C122 76 122 63 114 63" />
      </g>

      <!-- 中央：AI -->
      <path class="si-line" d="M86 40 H114 V70 H86 Z" />
      <text class="si-text" x="100" y="56">AI</text>

      <!-- 左上：資料 -->
      <g class="si-out" :style="out(-1.5, -1.5)"><g class="si-part" :style="t.tl.part">
        <path class="si-line" d="M52 22 H70 V44 H52 Z M56 28 H66 M56 33 H66 M56 38 H62" />
      </g></g>
      <!-- 右上：AIツール（チャット） -->
      <g class="si-out" :style="out(1.5, -1.5)"><g class="si-part" :style="t.tr.part">
        <path class="si-line" d="M130 22 H150 V40 H130 Z" />
        <path class="si-line si-thin" d="M135 27 H145 V33 H140 L137 36 V33 H135 Z" />
      </g></g>
      <!-- 左下：分析 -->
      <g class="si-out" :style="out(-1.5, 1.5)"><g class="si-part" :style="t.bl.part">
        <path class="si-line" d="M52 68 H70 V88 H52 Z M57 83 V78 M61 83 V74 M65 83 V76" />
      </g></g>
      <!-- 右下：AIツール（スパーク） -->
      <g class="si-out" :style="out(1.5, 1.5)"><g class="si-part" :style="t.br.part">
        <path class="si-line" d="M130 68 H150 V88 H130 Z" />
        <path class="si-line si-thin" d="M140 72 L142 76 L146 78 L142 80 L140 84 L138 80 L134 78 L138 76 Z" />
      </g></g>
    </template>

    <!-- ========== 02 AIを日常業務で活用：資料 → ノートPC → AI と流れる ========== -->
    <template v-else-if="type === 'daily'">
      <g class="si-part" :style="part(0, -5)"><circle class="si-blue" cx="128" cy="18" r="2.4" /></g>
      <g class="si-part" :style="part(-5, 4)"><circle class="si-blue" cx="58" cy="82" r="2.6" /></g>
      <g class="si-part" :style="part(4, 4)"><circle class="si-blue si-soft" cx="150" cy="86" r="2" /></g>

      <g class="si-link" :style="d.doc.line">
        <path class="si-line si-thin" d="M76 48 C66 48 62 45 52 45" />
        <path class="si-flow" d="M52 45 C62 45 66 48 76 48" />
      </g>
      <g class="si-link" :style="d.ai.line"><path class="si-line si-thin" d="M124 46 C132 46 134 42 140 42" /></g>

      <!-- 中央：ノートPC（画面の中の線だけ、ゆっくり濃淡） -->
      <path class="si-line" d="M76 30 H124 V62 H76 Z M66 66 H134 L130 71 H70 Z" />
      <path class="si-line si-screen" d="M88 42 H112 M88 50 H102" />

      <!-- 左：資料 -->
      <g class="si-out" :style="out(-1.5, 0)"><g class="si-part" :style="d.doc.part">
        <path class="si-line" d="M34 34 H52 V56 H34 Z M38 40 H48 M38 45 H48 M38 50 H44" />
      </g></g>
      <!-- 右：AI -->
      <g class="si-out" :style="out(1.5, 0)"><g class="si-part" :style="d.ai.part">
        <path class="si-line" d="M140 33 H160 V51 H140 Z" />
        <text class="si-text si-text--sm" x="150" y="42.5">AI</text>
      </g></g>
      <!-- 右端：資料 -->
      <g class="si-part" :style="part(5, 0)">
        <path class="si-line" d="M168 38 H182 V56 H168 Z M171 43 H179 M171 47 H179 M171 51 H176" />
      </g>

      <circle class="si-travel2" r="2.2" :style="travel2(52, 45, 76, 48, 124, 46, 140, 42)" />
    </template>

    <!-- ========== 03 AIで実際につくる：パーツが集まって1つの仕組みになる ========== -->
    <template v-else-if="type === 'build'">
      <path class="si-line si-thin" d="M100 18 V32" />
      <circle class="si-blue si-soft" cx="100" cy="16" r="2.2" />
      <circle class="si-travel" r="2.2" :style="travel(100, 16, 100, 32, 0.4)" />
      <g class="si-part" :style="part(-7, 3)"><circle class="si-blue" cx="38" cy="66" r="2.6" /></g>
      <g class="si-part" :style="part(0, 5)"><circle class="si-blue si-soft" cx="70" cy="86" r="2" /></g>

      <g class="si-link" :style="b.gear.line">
        <path class="si-line si-thin" d="M78 44 C70 44 66 36 58 36" />
        <path class="si-flow" d="M58 36 C66 36 70 44 78 44" />
      </g>
      <g class="si-link" :style="b.flow.line"><path class="si-line si-thin" d="M122 44 C130 44 130 36 134 36" /></g>
      <g class="si-link" :style="b.db.line">
        <path class="si-line si-thin" d="M122 64 C130 64 128 76 132 76" />
        <path class="si-flow" d="M132 76 C128 76 130 64 122 64" />
      </g>

      <!-- 中央：コード画面 -->
      <path class="si-line" d="M78 32 H122 V72 H78 Z M78 40 H122" />
      <circle class="si-ink" cx="83" cy="36" r="1" />
      <circle class="si-ink" cx="87" cy="36" r="1" />
      <circle class="si-ink" cx="91" cy="36" r="1" />
      <path class="si-line" d="M93 51 L89 56 L93 61 M107 51 L111 56 L107 61 M102 49 L98 63" />

      <!-- 左上：歯車（ゆっくり少しだけ回る） -->
      <g class="si-out" :style="out(-1.5, -1)"><g class="si-part" :style="b.gear.part">
        <g class="si-gear">
          <path class="si-line" d="M44 36 A6 6 0 1 0 56 36 A6 6 0 1 0 44 36 M47.5 36 A2.5 2.5 0 1 0 52.5 36 A2.5 2.5 0 1 0 47.5 36" />
          <path class="si-line" d="M50 26.5 V29 M50 43 V45.5 M40.5 36 H43 M57 36 H59.5 M43.3 29.3 L45 31 M55 41 L56.7 42.7 M43.3 42.7 L45 41 M55 31 L56.7 29.3" />
        </g>
      </g></g>
      <!-- 右上：ワークフロー -->
      <g class="si-out" :style="out(1.5, -1.5)"><g class="si-part" :style="b.flow.part">
        <path class="si-line" d="M140 16 H148 V24 H140 Z M134 32 H142 V40 H134 Z M146 32 H154 V40 H146 Z" />
        <path class="si-line si-thin" d="M144 24 V28 M138 28 H150 M138 28 V32 M150 28 V32" />
      </g></g>
      <!-- 右下：データベース -->
      <g class="si-out" :style="out(1, 1.5)"><g class="si-part" :style="b.db.part">
        <path class="si-line" d="M132 72 C132 69 148 69 148 72 V86 C148 89 132 89 132 86 Z M132 72 C132 75 148 75 148 72 M132 79 C132 82 148 82 148 79" />
      </g></g>
    </template>

    <!-- ========== 04 AI・DX案件を経験：企業・人・資料・グラフがAIへ集まる ========== -->
    <template v-else-if="type === 'dx'">
      <path class="si-line si-thin" d="M100 18 V40 M100 70 V92" />
      <circle class="si-blue si-soft" cx="100" cy="16" r="2.2" />
      <circle class="si-blue si-soft" cx="100" cy="94" r="2.2" />
      <circle class="si-travel" r="2.2" :style="travel(100, 16, 100, 40, 0.8)" />
      <circle class="si-travel" r="2" :style="travel(100, 94, 100, 70, 2.1)" />
      <g class="si-part" :style="part(-6, 0)"><circle class="si-blue si-soft" cx="42" cy="56" r="2.2" /></g>
      <g class="si-part" :style="part(6, 0)"><circle class="si-blue" cx="160" cy="56" r="2.4" /></g>

      <g class="si-link" :style="x.co.line"><path class="si-line si-thin" d="M86 47 C78 47 80 36 72 36" /></g>
      <g class="si-link" :style="x.pe.line">
        <path class="si-line si-thin" d="M114 47 C122 47 120 36 128 36" />
        <path class="si-flow" d="M128 36 C120 36 122 47 114 47" />
      </g>
      <g class="si-link" :style="x.doc.line">
        <path class="si-line si-thin" d="M86 63 C78 63 80 74 72 74" />
        <path class="si-flow" d="M72 74 C80 74 78 63 86 63" />
      </g>
      <g class="si-link" :style="x.gr.line"><path class="si-line si-thin" d="M114 63 C122 63 120 74 128 74" /></g>

      <!-- 中央：AI -->
      <path class="si-line" d="M86 40 H114 V70 H86 Z" />
      <text class="si-text" x="100" y="56">AI</text>

      <!-- 左上：企業 -->
      <g class="si-out" :style="out(-1.5, -1.5)"><g class="si-part" :style="x.co.part">
        <path class="si-line" d="M52 20 H64 V42 H52 Z M64 28 H72 V42 H64" />
        <path class="si-line si-thin" d="M55.5 25 H57 M59 25 H60.5 M55.5 30 H57 M59 30 H60.5 M55.5 35 H57 M59 35 H60.5 M67 33 H69 M67 37 H69" />
      </g></g>
      <!-- 右上：人 -->
      <g class="si-out" :style="out(1.5, -1.5)"><g class="si-part" :style="x.pe.part">
        <path class="si-line" d="M137.5 26 A3.5 3.5 0 1 0 144.5 26 A3.5 3.5 0 1 0 137.5 26 M134 40 C134 35 137 32.5 141 32.5 C145 32.5 148 35 148 40" />
        <path class="si-line si-thin" d="M129 29 A3 3 0 1 0 135 29 A3 3 0 1 0 129 29 M127 39 C127 36 129 34.5 131.5 34.5 M147 29 A3 3 0 1 0 153 29 A3 3 0 1 0 147 29 M155 39 C155 36 153 34.5 150.5 34.5" />
      </g></g>
      <!-- 左下：資料 -->
      <g class="si-out" :style="out(-1.5, 1.5)"><g class="si-part" :style="x.doc.part">
        <path class="si-line" d="M54 66 H72 V88 H54 Z M58 72 H68 M58 77 H68 M58 82 H64" />
      </g></g>
      <!-- 右下：グラフ（棒が下から少し伸びる） -->
      <g class="si-out" :style="out(1.5, 1.5)"><g class="si-part" :style="x.gr.part">
        <path class="si-line si-thin" d="M128 88 H152" />
        <path class="si-line si-bar" style="--bd: 0s" d="M131 86 H136 V78 H131 Z" />
        <path class="si-line si-bar" style="--bd: 0.15s" d="M138 86 H143 V73 H138 Z" />
        <path class="si-line si-bar" style="--bd: 0.3s" d="M145 86 H150 V68 H145 Z" />
      </g></g>
    </template>
  </svg>
</template>

<style scoped>
.si {
  --ink: #17243A;
  --ink-sub: #26364D;
  --blue: #6FA8DC;
  --cycle: 5.5s;
  --cdelay: calc(var(--i) * 0.55s);   /* カードごとにずらす */
  --amp: 1;                            /* 動く量（SP は小さく） */
  --ease: cubic-bezier(0.4, 0, 0.2, 1);

  display: block;
  overflow: visible;
  transition: transform 0.6s ease-out;
}

/* 線：拡大縮小しても太さが変わらないように画面上の太さで指定 */
.si-line {
  stroke: var(--ink);
  stroke-width: 1.5px;
  vector-effect: non-scaling-stroke;
}

.si-thin {
  stroke: var(--ink-sub);
  stroke-width: 1.1px;
}

.si-ink {
  fill: var(--ink);
}

.si-blue {
  fill: var(--blue);
}

.si-soft {
  opacity: 0.45;
}

.si-text {
  fill: var(--ink);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-anchor: middle;
  dominant-baseline: central;
}

.si-text--sm {
  font-size: 9px;
}

/* ---------- パーツ：広がる → 集まる → 少し止まる → 広がる ---------- */
.si-part {
  animation: siGather var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes siGather {
  0%, 100% { transform: translate(0, 0); }
  20% { transform: translate(calc(var(--px) * var(--amp)), calc(var(--py) * var(--amp))); }
  40% { transform: translate(calc(var(--px) * var(--amp) * 0.4), calc(var(--py) * var(--amp) * 0.4)); }
  55%, 62% { transform: translate(calc(var(--px) * var(--amp) * -0.45), calc(var(--py) * var(--amp) * -0.45)); }
  82% { transform: translate(calc(var(--px) * var(--amp) * 0.9), calc(var(--py) * var(--amp) * 0.9)); }
}

/* 接続線：中央側の端を起点に、パーツと同じ割合で伸び縮み */
.si-link {
  transform-box: view-box;
  transform-origin: var(--ox) var(--oy);
  animation: siStretch var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes siStretch {
  0%, 100% { transform: scale(1); }
  20% { transform: scale(calc(1 + var(--k) * var(--amp))); }
  40% { transform: scale(calc(1 + var(--k) * var(--amp) * 0.4)); }
  55%, 62% { transform: scale(calc(1 - var(--k) * var(--amp) * 0.45)); }
  82% { transform: scale(calc(1 + var(--k) * var(--amp) * 0.9)); }
}

/* 線の上を流れる淡い光（1アイコンにつき1〜2本） */
.si-flow {
  stroke: rgba(111, 168, 220, 0.9);
  stroke-width: 1.6px;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 3 14;
  animation: siFlow 2.8s linear infinite;
  animation-delay: var(--cdelay);
}

@keyframes siFlow {
  to { stroke-dashoffset: -17; }
}

/* 青い点：外側 → 中央へ流れて消える */
.si-travel {
  fill: var(--blue);
  animation: siTravel 3.2s ease-in-out infinite;
  animation-delay: calc(var(--cdelay) + var(--td));
}

@keyframes siTravel {
  0% { transform: translate(var(--ax), var(--ay)); opacity: 0; }
  15% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translate(var(--bx), var(--by)); opacity: 0; }
}

/* 02：資料 → ノートPCへ入り、AI へ出ていく */
.si-travel2 {
  fill: var(--blue);
  animation: siTravel2 var(--cycle) ease-in-out infinite;
  animation-delay: var(--cdelay);
}

@keyframes siTravel2 {
  0% { transform: translate(var(--ax), var(--ay)); opacity: 0; }
  8% { opacity: 1; }
  38% { transform: translate(var(--bx), var(--by)); opacity: 1; }
  44% { transform: translate(var(--bx), var(--by)); opacity: 0; }
  56% { transform: translate(var(--cx), var(--cy)); opacity: 0; }
  62% { opacity: 1; }
  90% { transform: translate(var(--dx), var(--dy)); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
}

/* 02：ノートPCの画面の中の線だけ、ゆっくり濃淡 */
.si-screen {
  animation: siScreen var(--cycle) ease-in-out infinite;
  animation-delay: var(--cdelay);
}

@keyframes siScreen {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}

/* 03：歯車が少しだけ回る（0 → 20° → -5° → 0） */
.si-gear {
  transform-box: fill-box;
  transform-origin: center;
  animation: siGear var(--cycle) var(--ease) infinite;
  animation-delay: var(--cdelay);
}

@keyframes siGear {
  0%, 100% { transform: rotate(0deg); }
  45% { transform: rotate(20deg); }
  75% { transform: rotate(-5deg); }
}

/* 04：グラフの棒が下から少し伸びる */
.si-bar {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: siBar var(--cycle) var(--ease) infinite;
  animation-delay: calc(var(--cdelay) + var(--bd));
}

@keyframes siBar {
  0%, 20%, 100% { transform: scaleY(0.7); }
  55%, 70% { transform: scaleY(1); }
}

/* ---------- カードにマウスを乗せたとき ---------- */
.si-out {
  transition: transform 0.6s ease-out;
}

@media (hover: hover) {
  .support__item:hover .si {
    transform: translateY(-3px);
  }

  .support__item:hover .si-out {
    transform: translate(var(--hx), var(--hy));
  }
}

/* SP：動く量を少し小さく */
@media (max-width: 767px) {
  .si {
    --amp: 0.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .si,
  .si-part,
  .si-link,
  .si-flow,
  .si-travel,
  .si-travel2,
  .si-screen,
  .si-gear,
  .si-bar,
  .si-out {
    animation: none !important;
    transition: none !important;
  }

  .si-flow,
  .si-travel,
  .si-travel2 {
    display: none;
  }

  .support__item:hover .si,
  .support__item:hover .si-out {
    transform: none;
  }
}
</style>
