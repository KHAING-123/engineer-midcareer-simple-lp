<script setup>
import { computed } from 'vue'
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
</script>

<template>
  <section id="flow" class="section flow">
    <!-- 背景：01〜06 と共通のごく淡いAIネットワーク（コンテンツの後ろ） -->
    <AiNetworkBackground variant="flow" />

    <div class="container">
      <SectionHeading
        v-reveal
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
      />

      <div class="flow__body">
        <!-- 5ステップ：番号 → アイコン（白い円＋回る弧＋点） → 名称 → 期間。ステップ間は点線＋矢印 -->
        <ol class="flow__list">
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
          <span class="flow__note-link" aria-hidden="true" />
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
    --flow-step-gap: 34px;
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

  /* 接続：ステップの下端から次のステップまで、縦の点線＋下向き矢印 */
  .flow__connector {
    top: auto;
    bottom: calc(var(--flow-step-gap) * -1);
    left: calc(var(--flow-box) / 2 - 6px);
    width: 12px;
    height: var(--flow-step-gap);
    transform: none;
    background: radial-gradient(circle, var(--flow-line) 1px, transparent 1.4px) center / 4px 5px repeat-y;
  }

  .flow__connector-arrow {
    top: calc(50% - 7px);
    left: -1px;
    width: 14px;
    height: 14px;
    padding: 1px;
    transform: rotate(90deg);
    background: radial-gradient(circle, #fbfdff 55%, transparent 72%);
  }

  .flow__connector-light {
    top: -2.5px;
    left: calc(50% - 2.5px);
  }

  .flow__connector-travel {
    animation-name: flowTravelY;
  }

  /* メモは中央のまま、左に点線（05 の円の列から下へ → 横へメモ左の点まで）。右側は同じ幅のすき間で中央をそろえる */
  .flow__note {
    --flow-note-x: calc(max(0px, (100% - 420px) / 2) + var(--flow-box) / 2);
    align-self: stretch;
    margin: 44px 0 0;
  }

  .flow__note::after {
    content: '';
    flex: 1;
    margin-left: calc(var(--flow-note-x) + 4px);
  }

  .flow__note-link {
    display: block;
    flex: 1;
    align-self: stretch;
    width: auto;
    height: auto;
    margin: 0 4px 0 var(--flow-note-x);
  }

  /* 縦の点線：05 の円の下端からメモの高さの中央まで（各ステップ間の縦線と同じ点） */
  .flow__note-link::before {
    content: '';
    position: absolute;
    left: -6px;
    top: calc(-44px - (var(--flow-box) - var(--flow-circle)) / 2);
    width: 12px;
    height: calc(50% + 44px + (var(--flow-box) - var(--flow-circle)) / 2);
    background: radial-gradient(circle, var(--flow-line) 1px, transparent 1.4px) center / 4px 5px repeat-y;
  }

  .flow__note-link::after {
    top: calc(50% - 4px);
  }

  .flow__note-card {
    padding: 18px 26px 18px 20px;
  }
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

  .flow__connector-light {
    display: none;
  }

  .flow__orbit {
    transform: rotate(-40deg);
  }
}
</style>
