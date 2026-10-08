<script setup>
import { computed, ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import SectionHeading from './SectionHeading.vue'
import FlowIcon from './FlowIcon.vue'
import AiNetworkBackground from './common/AiNetworkBackground.vue'

const props = defineProps({
  content: { type: Object, required: true }
})

// メモ内の「1週間」だけ青くするため、文字列を分ける
const noteParts = computed(() =>
  (props.content.note || '').split(/(1週間)/).filter(Boolean).map((text) => ({
    text,
    accent: text === '1週間'
  }))
)

// ---------- SP：ジグザグの接続線（01 → 05 → メモ）。点線と動く点は同じ path を使う ----------
const bodyEl = ref(null)
const listEl = ref(null)
const noteLinkEl = ref(null)
const routeD = ref('')
const routeArrows = ref([]) // 01→02〜04→05 の線の中央の矢印（位置と向き）

// transform（表示アニメーション）の影響を受けない、.flow__body から見た位置
const offsetIn = (el, root) => {
  let x = 0
  let y = 0
  while (el && el !== root) {
    x += el.offsetLeft
    y += el.offsetTop
    el = el.offsetParent
  }
  return { x, y }
}

const buildRoute = () => {
  const body = bodyEl.value
  const list = listEl.value
  if (!body || !list || !window.matchMedia('(max-width: 767px)').matches) {
    routeD.value = ''
    routeArrows.value = []
    return
  }
  const centers = [...list.querySelectorAll('.flow__visual')].map((v) => {
    const p = offsetIn(v, body)
    return { x: p.x + v.offsetWidth / 2, y: p.y + v.offsetHeight / 2 }
  })
  const circle = list.querySelector('.flow__circle')
  const r = (circle ? circle.offsetWidth / 2 : 36) + 8 // 六角形の少し外から線を始める（アイコンに重ねない）
  const f = (n) => n.toFixed(1)
  const parts = []
  const arrows = []
  // 円と円：上の円の下端 → 次の円の上端へ斜めに（行と行のすき間を通り、文字に重ならない）
  for (let i = 0; i < centers.length - 1; i++) {
    const a = centers[i]
    const b = centers[i + 1]
    const sy = a.y + r
    const ey = b.y - r
    parts.push(`M${f(a.x)} ${f(sy)} L${f(b.x)} ${f(ey)}`)
    // 線の途中の小さな丸いポイント
    arrows.push({ x: f((a.x + b.x) / 2), y: f((sy + ey) / 2) })
  }
  // 05 → メモ：六角形の下から斜めに、メモの上辺（左寄り）まで（矢印なし・途中に丸いポイント）
  const card = body.querySelector('.flow__note-card')
  const last = centers[centers.length - 1]
  if (card && last) {
    const p = offsetIn(card, body)
    const end = { x: p.x + card.offsetWidth * 0.32, y: p.y - 6 }
    const sy = last.y + r
    parts.push(`M${f(last.x)} ${f(sy)} L${f(end.x)} ${f(end.y)}`)
    arrows.push({ x: f(last.x + (end.x - last.x) * 0.6), y: f(sy + (end.y - sy) * 0.6) })
  }
  routeArrows.value = arrows
  routeD.value = parts.join(' ')
}

let resizeObserver
let spQuery
onMounted(async () => {
  await nextTick()
  buildRoute()
  document.fonts?.ready.then(buildRoute)
  spQuery = window.matchMedia('(max-width: 767px)')
  spQuery.addEventListener('change', buildRoute)
  if ('ResizeObserver' in window && bodyEl.value) {
    resizeObserver = new ResizeObserver(() => buildRoute())
    resizeObserver.observe(bodyEl.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  spQuery?.removeEventListener('change', buildRoute)
})
</script>

<template>
  <section id="flow" class="section flow">
    <!-- 背景：01〜06 と共通のごく淡いAIネットワーク（コンテンツの後ろ） -->
    <AiNetworkBackground variant="flow" />

    <div class="container">
      <SectionHeading
        v-reveal
        char-reveal
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
      />

      <div ref="bodyEl" class="flow__body">
        <!-- SPのみ：ジグザグの点線（01 → 05 → メモ）と、その上をゆっくり進む小さな青い点（同じ path） -->
        <svg v-if="routeD" class="flow__route" aria-hidden="true">
          <path :d="routeD" />
          <!-- 線の途中の小さな丸いポイント（矢印は使わない） -->
          <circle
            v-for="(pt, i) in routeArrows"
            :key="i"
            class="flow__route-point"
            :cx="pt.x"
            :cy="pt.y"
            r="4.5"
          />
        </svg>
        <span v-if="routeD" class="flow__route-dot" :style="{ offsetPath: `path('${routeD}')` }" aria-hidden="true" />

        <!-- 5ステップ：番号 → アイコン（白い円＋回る弧＋点） → 名称 → 期間。ステップ間は点線＋矢印 -->
        <ol ref="listEl" class="flow__list">
          <li
            v-for="(item, index) in content.items"
            :key="item.number"
            v-reveal
            class="flow__item"
            :class="{ 'is-highlight': item.highlight }"
            :style="{ '--reveal-delay': `${index * 0.07}s`, '--i': index }"
          >
            <span class="flow__number">{{ item.number }}</span>

            <span class="flow__visual" aria-hidden="true">
              <!-- 円周の一部だけの短い弧（それぞれ違う速さで回る） -->
              <svg class="flow__arcs" viewBox="0 0 100 100">
                <g class="flow__arc flow__arc--1">
                  <circle cx="50" cy="50" r="47" pathLength="100" stroke-dasharray="11 89" stroke-dashoffset="-58" />
                  <!-- 重なった2本目がわずかに前後し、弧が少し伸び縮みして見える -->
                  <g class="flow__arc-grow">
                    <circle cx="50" cy="50" r="47" pathLength="100" stroke-dasharray="7 93" stroke-dashoffset="-66" />
                  </g>
                </g>
                <g class="flow__arc flow__arc--2">
                  <circle cx="50" cy="50" r="47" pathLength="100" stroke-dasharray="6 94" stroke-dashoffset="-40" />
                </g>
                <g class="flow__arc flow__arc--3">
                  <circle cx="50" cy="50" r="43.5" pathLength="100" stroke-dasharray="9 91" stroke-dashoffset="-10" />
                </g>
              </svg>
              <span class="flow__orbit"><span class="flow__orbit-dot" /></span>
              <!-- SPのみ：六角形の背景（固定）＋外周に沿ってゆっくり進む小さな光点 -->
              <svg class="flow__hex" viewBox="0 0 100 100">
                <path class="flow__hex-shape" d="M50 5 L90 28 V72 L50 95 L10 72 V28 Z" />
                <!-- 外周：ごく淡い六角形の線＋その上を時計回りに進む細い光のライン -->
                <path class="flow__hex-line" d="M50 -1 L95.5 25 V75 L50 101 L4.5 75 V25 Z" />
                <path
                  class="flow__hex-run"
                  d="M50 -1 L95.5 25 V75 L50 101 L4.5 75 V25 Z"
                  pathLength="100"
                  :style="{ animationDelay: `${-index * 1.1}s` }"
                />
                <!-- 角の小さなリング（固定） -->
                <circle class="flow__hex-ring" :cx="index % 2 ? 95.5 : 4.5" cy="25" r="2.6" />
                <circle class="flow__hex-ring" cx="50" :cy="index % 2 ? 101 : -1" r="2.6" />
              </svg>
              <span class="flow__circle">
                <span class="flow__icon">
                  <FlowIcon :type="item.iconType" :index="index" />
                </span>
              </span>
            </span>

            <h3 class="flow__title">{{ item.title }}</h3>
            <p v-if="item.period" class="flow__period">{{ item.period }}</p>

            <!-- 次のステップへの接続（点線＋矢印＋ときどき流れる小さな光）。05 はメモの点まで（矢印なし） -->
            <span
              v-if="index < content.items.length - 1 || content.note"
              class="flow__connector"
              :class="{ 'is-last': index === content.items.length - 1 }"
              aria-hidden="true"
            >
              <span class="flow__connector-travel"><span class="flow__connector-light" /></span>
              <svg v-if="index < content.items.length - 1" class="flow__connector-arrow" viewBox="0 0 16 12">
                <path d="M1 6 H14 M9.5 1.5 L14 6 L9.5 10.5" />
              </svg>
            </span>
          </li>
        </ol>

        <!-- 右端のメモ：最短1週間でご連絡！ -->
        <div v-if="content.note" v-reveal class="flow__note" :style="{ '--reveal-delay': '0.4s' }">
          <span ref="noteLinkEl" class="flow__note-link" aria-hidden="true" />
          <div class="flow__note-card">
            <svg class="flow__clock" viewBox="0 0 40 40" aria-hidden="true">
              <circle class="flow__clock-face" cx="20" cy="20" r="15" />
              <path class="flow__clock-hand flow__clock-hand--hour" d="M20 20 V12.5" />
              <path class="flow__clock-hand flow__clock-hand--minute" d="M20 20 L25.5 23" />
            </svg>
            <p class="flow__note-text pre-line">
              <template v-for="(part, i) in noteParts" :key="i">
                <span v-if="part.accent" class="flow__note-accent">{{ part.text }}</span>
                <template v-else>{{ part.text }}</template>
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.flow {
  --flow-navy: #0B2345;
  --flow-blue: #1677E8;
  --flow-cyan: #36C8E8;
  --flow-pale: #F4F9FD;
  --flow-line: #C9DDEA;
  --flow-arrow: #173A65;
  --flow-number: #8A9AB0;
  --flow-sub: #6B7685;

  --flow-circle: clamp(96px, 7vw, 118px);         /* 白い円の大きさ */
  --flow-box: calc(var(--flow-circle) + 26px);     /* 弧を含めた大きさ */
  --flow-number-h: clamp(28px, 2.1vw, 36px);
  --flow-number-gap: 2px;
  --flow-center: calc(var(--flow-number-h) + var(--flow-number-gap) + var(--flow-box) / 2); /* 円の中心の高さ */
  --flow-gap: clamp(8px, 1vw, 20px); /* 5ステップとメモの間 */

  /* 白い円の影：背景から少し浮いて見える（下側にごく淡いブルー）。SP は少し弱く */
  --flow-circle-shadow:
    0 10px 28px rgba(31, 66, 105, 0.08),
    0 3px 10px rgba(31, 66, 105, 0.05),
    0 16px 30px -8px rgba(54, 137, 210, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.75);
}

/* ---------- レイアウト：5ステップ ＋ メモ ---------- */
.flow__body {
  display: flex;
  align-items: flex-start;
  gap: var(--flow-gap);
  width: min(100%, 1600px);
  margin-top: clamp(48px, 4.4vw, 72px);
}

.flow__list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  min-width: 0;
}

.flow__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.flow__item.reveal {
  transform: translateY(12px);
  transition-duration: 0.65s;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.flow__item.reveal.is-visible {
  transform: translateY(0);
}

/* 番号：細いセリフ体の斜体。円の少し左上 */
.flow__number {
  height: var(--flow-number-h);
  margin-bottom: var(--flow-number-gap);
  transform: translateX(-6%);
  font-family: "Times New Roman", "Noto Serif JP", serif;
  font-size: var(--flow-number-h);
  font-style: italic;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--flow-number);
}

/* ---------- アイコン：白い円＋回る弧＋円周の点 ---------- */
.flow__visual {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--flow-box);
  height: var(--flow-box);
}

.flow__circle {
  display: grid;
  place-items: center;
  width: var(--flow-circle);
  height: var(--flow-circle);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(45, 120, 190, 0.06);
  box-shadow: var(--flow-circle-shadow);
}

.flow__icon {
  display: block;
  width: 50%;
  height: 50%;
}

.flow__arcs {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 0 3px rgba(80, 170, 235, 0.15));
}

.flow__arcs circle {
  fill: none;
  stroke-linecap: round;
}

.flow__arc {
  transform-origin: 50px 50px;
  animation: flowArcSpin 8s linear infinite;
  animation-delay: calc(var(--i) * -1.3s);
}

.flow__arc--1 circle {
  stroke: rgba(52, 139, 235, 0.5);
  stroke-width: 1.6;
}

.flow__arc--2 {
  animation-duration: 11s;
  animation-direction: reverse;
}

.flow__arc--2 circle {
  stroke: rgba(72, 203, 220, 0.45);
  stroke-width: 1.4;
}

.flow__arc--3 {
  animation-duration: 14s;
}

.flow__arc--3 circle {
  stroke: rgba(92, 180, 238, 0.38);
  stroke-width: 1.2;
}

/* 弧の伸び縮み：重ねた短い弧が少し前後し、合わせた長さが変わる */
.flow__arc-grow {
  transform-origin: 50px 50px;
  animation: flowArcGrow 4.8s ease-in-out infinite;
}

@keyframes flowArcSpin {
  to { transform: rotate(360deg); }
}

@keyframes flowArcGrow {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(9deg); }
}

/* 円周を回る小さな点 */
.flow__orbit {
  position: absolute;
  inset: 3%;
  border-radius: 50%;
  animation: flowArcSpin 12s linear infinite;
  animation-delay: calc(var(--i) * -2.4s - 3s);
}

.flow__orbit-dot {
  position: absolute;
  top: -3px;
  left: calc(50% - 3px);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid rgba(52, 139, 235, 0.75);
  box-shadow: 0 0 4px rgba(80, 170, 235, 0.18);
}

/* ---------- 名称・期間 ---------- */
.flow__title {
  margin-top: clamp(14px, 1.2vw, 20px);
  font-size: clamp(15px, 1.1vw, 18px);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--flow-navy);
}

.flow__period {
  margin-top: 6px;
  font-size: clamp(12px, 0.85vw, 14px);
  line-height: 1.6;
  color: var(--flow-sub);
}

/* 05 内定：少しだけ青を強く＋ごく淡い青のグロー */
.flow__item.is-highlight .flow__number,
.flow__item.is-highlight .flow__title {
  color: var(--flow-blue);
}

.flow__item.is-highlight .flow__circle {
  box-shadow:
    var(--flow-circle-shadow),
    0 0 0 6px rgba(22, 119, 232, 0.025),
    0 0 22px rgba(22, 119, 232, 0.07);
}

/* ---------- ステップ間の接続：点線＋中央の矢印＋流れる光 ---------- */
.flow__connector {
  position: absolute;
  top: var(--flow-center);
  left: calc(50% + var(--flow-box) / 2 + 2px);
  width: calc(100% - var(--flow-box) - 4px);
  height: 12px;
  transform: translateY(-50%);
  background: radial-gradient(circle, var(--flow-line) 1px, transparent 1.4px) center / 6px 4px repeat-x;
}

.flow__connector-arrow {
  position: absolute;
  top: 0;
  left: calc(50% - 11px);
  width: 22px;
  height: 12px;
  padding-inline: 3px;
  background: linear-gradient(90deg, transparent, #fbfdff 25%, #fbfdff 75%, transparent);
  fill: none;
  stroke: var(--flow-arrow);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 光：接続線の幅いっぱいを transform だけで移動。01→02→03→04→05 の順に1つずつ流れる */
.flow__connector-travel {
  position: absolute;
  inset: 0;
  animation: flowTravelX 7.5s linear infinite;
  animation-delay: calc(var(--i) * 1.5s);
}

.flow__connector-light {
  position: absolute;
  top: calc(50% - 2.5px);
  left: -2.5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--flow-blue);
  box-shadow: 0 0 6px rgba(30, 140, 230, 0.35);
  opacity: 0;
  animation: flowLight 7.5s linear infinite;
  animation-delay: calc(var(--i) * 1.5s);
}

/* 05 → メモ：05 の円の右端から、列の右端＋メモまでのすき間を越えてメモの点線へ続く */
.flow__connector.is-last {
  width: calc(50% - var(--flow-box) / 2 - 2px + var(--flow-gap));
}

@keyframes flowTravelX {
  0% { transform: translateX(0); }
  20%, 100% { transform: translateX(100%); }
}

@keyframes flowLight {
  0% { opacity: 0; }
  4%, 15% { opacity: 0.9; }
  20%, 100% { opacity: 0; }
}

/* ---------- メモ：最短1週間でご連絡！ ---------- */
.flow__note {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: calc(var(--flow-center) - 58px);
}

/* 05 → メモへの点線の続き＋メモ左の点（高さは 05 の円の中心＝接続線と同じ） */
.flow__note-link {
  position: relative;
  align-self: flex-start;
  width: clamp(24px, 2vw, 36px);
  height: 8px;
  margin-top: 54px;
  margin-right: 4px;
  background: radial-gradient(circle, var(--flow-line) 1px, transparent 1.4px) center / 6px 4px repeat-x;
}

.flow__note-link::after {
  content: '';
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid rgba(22, 119, 232, 0.6);
  box-shadow: 0 0 6px rgba(30, 140, 230, 0.2);
}

.flow__note-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 28px 22px 22px;
  background: linear-gradient(140deg, #FFFFFF 0%, #FAFCFF 55%, var(--flow-pale) 100%);
  border: 1px solid rgba(22, 119, 232, 0.14);
  border-radius: 16px;
  box-shadow:
    0 14px 36px rgba(25, 80, 130, 0.09),
    0 2px 6px rgba(25, 80, 130, 0.04);
  transform: rotate(-3deg);
  animation: flowNoteFloat 5.5s ease-in-out infinite;
}

@keyframes flowNoteFloat {
  0%, 100% { transform: rotate(-3deg) translateY(0); }
  50% { transform: rotate(-3deg) translateY(-3px); }
}

.flow__clock {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  fill: none;
  stroke-linecap: round;
}

.flow__clock-face {
  fill: #fff;
  stroke: var(--flow-blue);
  stroke-width: 2;
  filter: drop-shadow(0 2px 6px rgba(22, 119, 232, 0.15));
}

.flow__clock-hand {
  stroke: var(--flow-navy);
  stroke-width: 2;
  transform-origin: 20px 20px;
}

.flow__clock-hand--minute {
  animation: flowArcSpin 24s linear infinite;
}

.flow__clock-hand--hour {
  animation: flowArcSpin 120s linear infinite;
}

.flow__note-text {
  font-size: clamp(15px, 1.15vw, 18px);
  font-weight: 700;
  line-height: 1.6;
  letter-spacing: 0.06em;
  color: var(--flow-navy);
  white-space: pre-line;
}

/* 下の短い青いライン */
.flow__note-text::after {
  content: '';
  display: block;
  width: 64%;
  height: 2px;
  margin-top: 8px;
  border-radius: 1px;
  background: linear-gradient(90deg, var(--flow-blue), rgba(22, 119, 232, 0.25));
}

.flow__note-accent {
  color: var(--flow-blue);
  font-size: 1.08em;
}

/* ---------- 六角形アイコン（PC・SP 共通）：円の見た目を六角形に置き換え。アイコンそのものは同じ ---------- */
.flow__arcs,
.flow__orbit {
  display: none;
}

.flow__circle,
.flow__item.is-highlight .flow__circle {
  position: relative;
  z-index: 1;
  background: none;
  border: 0;
  box-shadow: none;
}

.flow__hex {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.flow__hex-shape {
  fill: #FFFFFF;
  stroke: rgba(150, 180, 210, 0.3);
  stroke-width: 1;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(0 8px 14px rgba(30, 60, 100, 0.1)) drop-shadow(0 2px 4px rgba(30, 60, 100, 0.05));
}

/* 外周の光点が通る、ごく淡い六角形の線 */
.flow__hex-line {
  fill: none;
  stroke: rgba(120, 165, 215, 0.18);
  stroke-width: 1;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

/* 時計回りに周回する細い光のライン（約5秒で1周） */
.flow__hex-run {
  fill: none;
  stroke: #4A9BE6;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 16 84;
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(0 0 2px rgba(74, 155, 230, 0.35));
  animation: flowHexRun 5s linear infinite;
}

.flow__hex-ring {
  fill: #FFFFFF;
  stroke: #4A9BE6;
  stroke-width: 1.4;
  vector-effect: non-scaling-stroke;
}

.flow__item.is-highlight .flow__hex-shape {
  stroke: rgba(22, 119, 232, 0.28);
}

/* PC：ステップ間の点線の両端に小さな丸いポイント（05 → メモは始点のみ。終点はメモ側の点） */
.flow__connector::before,
.flow__connector::after {
  content: '';
  position: absolute;
  top: calc(50% - 3.5px);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  border: 1.4px solid rgba(74, 155, 230, 0.75);
}

.flow__connector::before {
  left: -2px;
}

.flow__connector::after {
  right: -2px;
}

.flow__connector.is-last::after {
  display: none;
}

/* PC：メモの枠を淡いブルーグレーに */
@media (min-width: 768px) {
  .flow__note-card {
    border-color: rgba(150, 180, 210, 0.3);
  }
}

/* ---------- 1200〜1399px：少し小さく ---------- */
@media (max-width: 1399px) {
  .flow {
    --flow-circle: 92px;
  }

  .flow__note-card {
    padding: 18px 20px 18px 16px;
  }

  .flow__clock {
    width: 38px;
    height: 38px;
  }
}

/* ---------- 1199px以下：メモは下へ ---------- */
@media (max-width: 1199px) {
  .flow__body {
    flex-direction: column;
    align-items: stretch;
  }

  .flow__note {
    align-self: flex-end;
    margin: 32px clamp(0px, 4vw, 40px) 0 0;
  }

  .flow__note-link,
  .flow__connector.is-last {
    display: none;
  }
}

/* ---------- 1023px以下：円を小さく ---------- */
@media (max-width: 1023px) {
  .flow {
    --flow-circle: 80px;
    --flow-box: calc(var(--flow-circle) + 20px);
  }

  .flow__title {
    font-size: 14px;
  }

  .flow__period {
    font-size: 11.5px;
  }
}

/* ---------- SP：縦のタイムライン（左に円・右に番号と名称） ---------- */
@media (max-width: 767px) {
  .flow {
    --flow-circle-shadow:
      0 8px 24px rgba(31, 66, 105, 0.068),
      0 3px 9px rgba(31, 66, 105, 0.042),
      0 14px 26px -8px rgba(54, 137, 210, 0.068),
      inset 0 0 0 1px rgba(255, 255, 255, 0.75);
    --flow-circle: 72px;
    --flow-box: calc(var(--flow-circle) + 18px);
    --flow-step-gap: 52px; /* ジグザグの斜めの線が通るすき間 */
  }

  .flow__body {
    margin-top: 40px;
  }

  .flow__list {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--flow-step-gap);
    max-width: 420px;
    margin-inline: auto;
    width: 100%;
  }

  .flow__item {
    display: grid;
    grid-template-columns: var(--flow-box) minmax(0, 1fr);
    grid-template-rows: auto auto auto;
    column-gap: 20px;
    align-items: center;
    align-content: center;
    text-align: left;
  }

  .flow__visual {
    grid-column: 1;
    grid-row: 1 / 4;
  }

  .flow__number {
    grid-column: 2;
    grid-row: 1;
    align-self: end;
    height: auto;
    margin: 0;
    transform: none;
    font-size: 24px;
  }

  .flow__title {
    grid-column: 2;
    grid-row: 2;
    margin-top: 4px;
    font-size: 16px;
  }

  .flow__period {
    grid-column: 2;
    grid-row: 3;
    align-self: start;
    margin-top: 2px;
    font-size: 12.5px;
  }

  /* ---------- ジグザグ：01・03・05 は左にアイコン、02・04 は右にアイコン（文字は右寄せ） ---------- */
  .flow__body {
    position: relative;
  }

  .flow__list {
    position: relative;
    z-index: 1;
  }

  .flow__item:nth-child(even) {
    grid-template-columns: minmax(0, 1fr) var(--flow-box);
    text-align: right;
  }

  .flow__item:nth-child(even) .flow__visual {
    grid-column: 2;
  }

  .flow__item:nth-child(even) .flow__number,
  .flow__item:nth-child(even) .flow__title,
  .flow__item:nth-child(even) .flow__period {
    grid-column: 1;
  }

  /* ---------- カード：横長の白いカード（左右交互）。六角形はカードの端に少し重なる ---------- */
  .flow__list {
    row-gap: 56px;
  }

  /* カードの幅は文字量に合わせる（最大 90%）。六角形の位置はこれまでと同じ */
  .flow__item {
    width: fit-content;
    max-width: 90%;
    grid-template-columns: var(--flow-box) max-content;
    column-gap: 14px;
    padding: 12px 24px 12px 0;
    justify-self: start;
  }

  .flow__item:nth-child(even) {
    grid-template-columns: max-content var(--flow-box);
    justify-content: end;
    padding: 12px 0 12px 24px;
    justify-self: end;
  }

  /* STEP 05：番号と「内定」をカード内で中央に（コンパクトなカード） */
  .flow__item:nth-child(5) {
    grid-template-columns: var(--flow-box) minmax(64px, max-content);
    padding-right: 14px;
  }

  /* 期間の行がないぶん上に寄るので、「05」「内定」をまとめて少し下げ、カードの上下中央に（間隔はそのまま） */
  .flow__item:nth-child(5) .flow__number,
  .flow__item:nth-child(5) .flow__title {
    justify-self: center;
    text-align: center;
    translate: 0 18px;
  }

  .flow__item::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    left: calc(var(--flow-box) / 2);
    right: 0;
    border-radius: 18px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.97) 0%, rgba(250, 252, 255, 0.95) 100%);
    border: 1px solid rgba(150, 180, 210, 0.18);
    box-shadow:
      0 14px 34px rgba(30, 60, 100, 0.08),
      0 3px 10px rgba(30, 60, 100, 0.04);
    pointer-events: none;
  }

  .flow__item:nth-child(even)::before {
    left: 0;
    right: calc(var(--flow-box) / 2);
  }

  /* 六角形の後ろの淡いブルーグレーの面 */
  .flow__visual::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -12px;
    width: 64%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: rgba(200, 214, 232, 0.4);
    pointer-events: none;
  }

  .flow__item:nth-child(even) .flow__visual::before {
    left: auto;
    right: -12px;
  }

  /* 05 → メモの接続（点線と点）は SP では表示しない */
  .flow__note-link {
    display: none !important;
  }

  /* SPでは各ステップの縦の接続線の代わりに、下のジグザグの線を使う */
  .flow__connector {
    display: none;
  }

  /* ジグザグの点線：アイコン・文字の後ろ（円の外側から始まるので重ならない） */
  .flow__route {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }

  .flow__route path {
    fill: none;
    stroke: var(--flow-line);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 0 6;
  }

  /* 線の途中の小さな丸いポイント（白地＋細いブルーの輪） */
  .flow__route .flow__route-point {
    fill: #FFFFFF;
    stroke: #4A9BE6;
    stroke-width: 1.5;
    stroke-dasharray: none;
  }

  /* 動く点：点線と同じ path の上を 01 → 05 → メモへ進み、少し休んでから最初へ */
  .flow__route-dot {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--flow-blue);
    box-shadow: 0 0 6px rgba(30, 140, 230, 0.35);
    offset-rotate: 0deg;
    offset-distance: 0%;
    opacity: 0;
    pointer-events: none;
    animation: flowRoute 11s linear infinite;
  }

  /* メモは STEP 05 の下（中央より少し右）。ジグザグの線の終点 */
  .flow__note {
    align-self: center;
    margin: 64px 0 0 12%;
  }

  .flow__note-link {
    display: block;
    width: 14px;
    margin-top: 0;
    margin-right: 8px;
    align-self: center;
    background: none;
  }

  .flow__note-card {
    padding: 18px 26px 18px 20px;
  }
}

/* SP のジグザグの線（PC・タブレットでは使わない） */
@media (min-width: 768px) {
  .flow__route,
  .flow__route-dot {
    display: none;
  }
}

@keyframes flowHexRun {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -100; }
}

@keyframes flowRoute {
  0% { offset-distance: 0%; opacity: 0; }
  3% { opacity: 0.9; }
  84% { offset-distance: 100%; opacity: 0.9; }
  88%, 100% { offset-distance: 100%; opacity: 0; }
}

@keyframes flowTravelY {
  0% { transform: translateY(0); }
  20%, 100% { transform: translateY(100%); }
}

/* ---------- 動きを減らす設定：すべて停止（見た目はそのまま） ---------- */
@media (prefers-reduced-motion: reduce) {
  .flow__arc,
  .flow__arc-grow,
  .flow__orbit,
  .flow__connector-travel,
  .flow__connector-light,
  .flow__note-card,
  .flow__clock-hand {
    animation: none !important;
  }

  .flow__connector-light,
  .flow__route-dot {
    display: none;
  }

  .flow__hex-run {
    animation: none !important;
  }

  .flow__orbit {
    transform: rotate(-40deg);
  }
}
</style>
