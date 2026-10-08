<script setup>
import AiNetworkBackground from './common/AiNetworkBackground.vue'
import SectionHeading from './SectionHeading.vue'
import GrowthIcon from './GrowthIcon.vue'

defineProps({
  content: { type: Object, required: true }
})

// アイコン周りの弧の回転（STEPごとに速さ・向きを変える）
const ORBITS = [
  { dur: 14, reverse: false },
  { dur: 17, reverse: true },
  { dur: 13, reverse: false },
  { dur: 16, reverse: true }
]
const orbitStyle = (index) => {
  const o = ORBITS[index % ORBITS.length]
  return { '--orbit': `${o.dur}s`, animationDirection: o.reverse ? 'reverse' : 'normal' }
}
</script>

<template>
  <section id="growth" class="section growth">
    <!-- 背景：ごく淡いAIネットワーク（コンテンツの後ろ） -->
    <AiNetworkBackground variant="growth" />
    <!-- 背景のごく淡い形（装飾） -->
    <span class="growth__wave growth__wave--tr" aria-hidden="true" />
    <span class="growth__wave growth__wave--br" aria-hidden="true" />

    <div class="container growth__inner">
      <!-- 上：見出し・説明文 → 横長のメイン画像（やや右寄せ）＋右上のメモ -->
      <div class="growth__intro">
        <SectionHeading
          v-reveal
          char-reveal
          class="growth__heading"
          :number="content.number"
          :english-title="content.englishTitle"
          :title="content.title"
          :description="content.description"
        />
        <figure v-reveal class="growth__figure" :style="{ '--reveal-delay': '0.15s' }">
          <div class="growth__media img-zoom">
            <img :src="content.image" :alt="content.alt" class="growth__image" loading="lazy">
          </div>
          <figcaption v-if="content.note" class="growth__note">
            <span class="growth__note-inner pre-line">{{ content.note }}</span>
          </figcaption>
        </figure>
      </div>

      <!-- 下：STEP 01〜04 の縦タイムライン（メイン画像と同じ列にそろえる）
           左：白い円＋線画アイコン（周りをゆっくり回る弧と青い点）／円と円をつなぐ線の上を、青い点が STEP 01 → 04 へ流れる
           右：STEP ラベル・期間 → タイトル → 説明文 -->
      <ol class="growth__timeline">
        <li
          v-for="(step, index) in content.steps"
          :key="step.label"
          v-reveal
          class="growth__step"
          :style="{ '--reveal-delay': `${index * 0.1}s`, '--i': index }"
        >
          <span class="growth__visual" aria-hidden="true">
            <!-- 円周の一部だけの細い弧＋弧の上の青い点（一緒に回る） -->
            <svg class="growth__orbit" viewBox="0 0 100 100" :style="orbitStyle(index)">
              <circle class="growth__arc growth__arc--main" cx="50" cy="50" r="47" pathLength="100" stroke-dasharray="28 72" />
              <circle class="growth__arc growth__arc--sub" cx="50" cy="50" r="47" pathLength="100" stroke-dasharray="13 87" stroke-dashoffset="-48" />
              <circle class="growth__orbit-dot" cx="41.2" cy="96.2" r="2.4" />
            </svg>
            <span class="growth__circle">
              <span class="growth__icon">
                <GrowthIcon :type="step.iconType" :index="index" />
              </span>
            </span>
          </span>

          <!-- 次の STEP への線：途中の小さな点＋流れる青い点 -->
          <span v-if="index < content.steps.length - 1" class="growth__flow" aria-hidden="true">
            <span class="growth__flow-node" />
            <span class="growth__flow-travel"><span class="growth__flow-dot" /></span>
          </span>

          <div class="growth__step-body">
            <p class="growth__meta">
              <span class="growth__label">{{ step.label }}</span>
              <span v-if="step.period" class="growth__period">{{ step.period }}</span>
            </p>
            <h3 class="growth__title">{{ step.title }}</h3>
            <p class="growth__description">{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.growth {
  --g-ink: #14213A;
  --g-sub: #66758A;
  --g-text: #5B6A7E;
  --g-navy: #0B2345;
  --g-blue: #168AE8;
  --g-circle: clamp(88px, 6.4vw, 108px);       /* 白い円 */
  --g-box: calc(var(--g-circle) + 24px);       /* 弧を含めた大きさ＝タイムライン列の幅 */
  --g-step-gap: clamp(44px, 3.6vw, 68px);
  --g-flow: 9s;      /* 線の上の青い点：STEP 01 → 04 を流れる1周の長さ */
  --g-orbit-k: 1;    /* 弧の回転の速さ（SPでは少しゆっくり） */
  --g-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

/* ---------- 背景のごく淡い形 ---------- */
.growth__wave {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;
}

.growth__wave--tr {
  top: -18%;
  right: -12%;
  width: 46%;
  aspect-ratio: 1.6;
  background: radial-gradient(ellipse, rgba(218, 239, 252, 0.3), rgba(218, 239, 252, 0) 70%);
}

.growth__wave--br {
  bottom: -20%;
  right: 4%;
  width: 40%;
  aspect-ratio: 1.8;
  background: radial-gradient(ellipse, rgba(226, 242, 252, 0.28), rgba(226, 242, 252, 0) 70%);
}

/* ---------- PC：上に見出し・説明文・メイン画像、下に STEP（画像と同じ列） ---------- */
.growth {
  --g-col: min(72%, 980px);   /* メイン画像・STEP の幅 */
  --g-col-right: 4%;          /* 右側の余白（やや右寄せ） */
}

.growth__inner {
  display: flex;
  flex-direction: column;
  gap: clamp(88px, 7.5vw, 140px);
}

.growth__intro {
  display: flex;
  flex-direction: column;
  gap: clamp(64px, 5.5vw, 100px);
}

/* 03 の見出しだけ：番号とタイトルの間に細い縦線・英字ラベルは淡いブルー（共通の見出し部品は変更しない） */
.growth__heading :deep(.heading__number) {
  color: #BCC8D6;
}

.growth__heading :deep(.heading__body) {
  position: relative;
}

.growth__heading :deep(.heading__body)::before {
  content: '';
  position: absolute;
  top: 0.15em;
  left: calc(clamp(24px, 2.2vw, 32px) / -2);
  width: 1px;
  height: clamp(60px, 5vw, 78px);
  background: rgba(120, 150, 185, 0.35);
}

.growth__heading :deep(.heading__label) {
  color: #8DB1D6;
}

.growth__heading :deep(.heading__description) {
  margin-top: 22px;
}

/* メイン画像：横長・大きめ・やや右寄せ */
.growth__figure {
  position: relative;
  width: var(--g-col);
  margin: 0 var(--g-col-right) 0 auto;
}

/* 画像の左上〜左側の後ろに、ごく淡い水色の長方形（背景の星座とは別レイヤー） */
.growth__figure::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: clamp(-36px, -2.4vw, -20px);
  left: -11%;
  width: 36%;
  height: 72%;
  border-radius: 2px;
  background: rgba(225, 244, 255, 0.65);
  pointer-events: none;
}

.growth__media {
  aspect-ratio: 16 / 8.5;
  border-radius: 3px;
  background: var(--color-border);
  box-shadow: 0 16px 44px rgba(30, 60, 100, 0.06);
}

.growth__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* メモ：画像の右上に少し重ねる。白地＋細いブルーライン（付箋風にはしない） */
.growth__note {
  position: absolute;
  z-index: 2;
  top: clamp(-104px, -6.6vw, -68px);
  right: clamp(-48px, -2.6vw, -16px);
}

.growth__note-inner {
  position: relative;
  display: block;
  padding: 12px 26px 14px 30px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(56, 150, 225, 0.55);
  box-shadow: 0 8px 24px rgba(30, 60, 100, 0.05);
  font-family: var(--font-hand);
  font-size: clamp(14px, 1.05vw, 17px);
  line-height: 1.75;
  letter-spacing: 0.12em;
  color: #22324A;
  transform: rotate(-2deg);
  animation: growthNoteFloat 6.5s ease-in-out infinite;
}

/* 左の斜めの細いライン */
.growth__note-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 8px;
  width: 1px;
  height: 100%;
  background: rgba(56, 150, 225, 0.55);
  transform-origin: top center;
  transform: rotate(20deg);
}

/* 下のラインの端の小さな点 */
.growth__note-inner::after {
  content: '';
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4AA8F5;
  box-shadow: 0 0 5px rgba(74, 168, 245, 0.3);
}

@keyframes growthNoteFloat {
  0%, 100% { transform: rotate(-2deg) translateY(0); }
  50% { transform: rotate(-2deg) translateY(-3px); }
}

/* ---------- 下：縦タイムライン（メイン画像と同じ列） ---------- */
.growth__timeline {
  position: relative;
  width: var(--g-col);
  margin: 0 var(--g-col-right) 0 auto;
}

.growth__step {
  position: relative;
  display: grid;
  grid-template-columns: var(--g-box) minmax(0, 1fr);
  column-gap: clamp(20px, 2vw, 36px);
  padding-bottom: var(--g-step-gap);
}

.growth__step:last-child {
  padding-bottom: 0;
}

/* 円と円をつなぐ縦線（円の下端 → 次の円の上端） */
.growth__step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: calc(var(--g-box) / 2 - 0.5px);
  top: calc(var(--g-box) - 12px);
  bottom: -12px;
  width: 1px;
  background: linear-gradient(to bottom, rgba(75, 170, 235, 0.18), rgba(75, 170, 235, 0.55), rgba(75, 170, 235, 0.18));
  transform-origin: top center;
  transition: transform 1.3s var(--g-ease);
  transition-delay: calc(var(--reveal-delay, 0s) + 0.2s);
}

/* ---------- アイコン：白い円＋周りを回る弧と青い点 ---------- */
.growth__visual {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: var(--g-box);
  height: var(--g-box);
}

.growth__circle {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--g-circle);
  height: var(--g-circle);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(95, 170, 230, 0.18);
  box-shadow:
    0 12px 32px rgba(40, 90, 140, 0.08),
    0 0 22px rgba(70, 170, 245, 0.07);
}

/* 青い点が STEP に届いたとき、円の周りの光がほんの少しだけ明るくなる */
.growth__circle::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  box-shadow: 0 0 26px rgba(70, 170, 245, 0.2);
  opacity: 0;
  pointer-events: none;
  animation: growthPulse var(--g-flow) ease-in-out infinite;
  animation-delay: calc(var(--i) * var(--g-flow) * 0.2667 - 0.4s);
}

.growth__icon {
  display: block;
  width: 54%;
  height: 54%;
}

/* 円周の一部だけの弧（約40%）。STEPごとに違う速さ・向きでゆっくり回る */
.growth__orbit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  animation: growthOrbit calc(var(--orbit) * var(--g-orbit-k)) linear infinite;
}

.growth__arc {
  fill: none;
  stroke-width: 1.3;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.growth__arc--main {
  stroke: rgba(44, 169, 245, 0.34);
}

.growth__arc--sub {
  stroke: rgba(81, 194, 239, 0.24);
}

/* 弧の端の青い点（弧と一緒に回る） */
.growth__orbit-dot {
  fill: #38A9F5;
  filter: drop-shadow(0 0 3.5px rgba(56, 169, 245, 0.4));
}

/* ---------- 線の上：途中の小さな点＋流れる青い点（データが次の STEP へ） ---------- */
.growth__flow {
  position: absolute;
  z-index: 1;
  left: calc(var(--g-box) / 2 - 6px);
  top: calc(var(--g-box) - 12px);
  bottom: -12px;
  width: 12px;
  pointer-events: none;
}

.growth__flow-node {
  position: absolute;
  top: calc(50% - 4.5px);
  left: calc(50% - 4.5px);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #4AA8F5;
  border: 2px solid #fff;
  box-shadow: 0 0 6px rgba(74, 168, 245, 0.3);
  transition: opacity 0.5s ease, transform 0.5s var(--g-ease);
  transition-delay: calc(var(--reveal-delay, 0s) + 0.9s);
}

/* 線の高さいっぱいを transform だけで移動。01→02 → 02→03 → 03→04 の順に1つずつ流れる */
.growth__flow-travel {
  position: absolute;
  inset: 0;
  animation: growthTravel var(--g-flow) linear infinite;
  animation-delay: calc(var(--i) * var(--g-flow) * 0.2667);
}

.growth__flow-dot {
  position: absolute;
  top: -3px;
  left: calc(50% - 3px);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4AA8F5;
  box-shadow: 0 0 7px rgba(56, 169, 245, 0.35);
  opacity: 0;
  animation: growthFlowLight var(--g-flow) linear infinite;
  animation-delay: calc(var(--i) * var(--g-flow) * 0.2667);
}

@keyframes growthOrbit {
  to { transform: rotate(360deg); }
}

@keyframes growthTravel {
  0% { transform: translateY(0); }
  26.67%, 100% { transform: translateY(100%); }
}

@keyframes growthFlowLight {
  0% { opacity: 0; }
  4%, 22% { opacity: 0.95; }
  26.67%, 100% { opacity: 0; }
}

@keyframes growthPulse {
  0%, 18%, 100% { opacity: 0; }
  7% { opacity: 1; }
}

/* ---------- 右側のテキスト：STEP ラベル・期間 → タイトル → 説明文 ---------- */
.growth__step-body {
  max-width: clamp(440px, 34vw, 600px); /* 読みやすい行の長さ（右端の背景装飾にもかからない） */
  padding-top: clamp(10px, 1vw, 16px);
}

.growth__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
}

/* 小さなタグ（ボタンに見えないよう、枠なし・ごく薄い背景） */
.growth__label {
  display: inline-block;
  padding: 5px 12px 4px;
  border-radius: 999px;
  background: rgba(230, 244, 255, 0.7);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.12em;
  color: var(--g-blue);
}

.growth__period {
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--g-sub);
}

.growth__title {
  margin-top: 12px;
  font-size: clamp(20px, 1.45vw, 26px);
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.05em;
  color: var(--g-navy);
}

.growth__description {
  margin-top: 10px;
  font-size: clamp(13px, 0.92vw, 15px);
  line-height: 1.9;
  color: var(--g-text);
}

/* ---------- スクロール表示（初回のみ・既存の v-reveal を利用） ---------- */
.growth__step.reveal,
.growth__figure.reveal {
  transition-duration: 0.7s;
  transition-timing-function: var(--g-ease);
}

.growth__step.reveal {
  transform: translateY(14px);
}

.growth__figure.reveal {
  transform: translateY(16px) scale(0.99);
}

.growth__step.reveal.is-visible,
.growth__figure.reveal.is-visible {
  transform: none;
}

/* 表示前：線は長さ0、点は非表示。表示されると線が上→下へ伸び、点がふわっと現れる */
.growth__step.reveal:not(.is-visible)::before {
  transform: scaleY(0);
}

.growth__step.reveal:not(.is-visible) .growth__flow-node {
  opacity: 0;
  transform: scale(0.8);
}

/* ---------- PC（1024px以上）：左に見出し・説明文・画像＋メモ／右に STEP 01〜04 の2カラム ---------- */
@media (min-width: 1024px) {
  .growth__inner {
    display: grid;
    grid-template-columns: minmax(0, 44fr) minmax(0, 52fr);
    column-gap: clamp(60px, 6vw, 110px);
    align-items: start;
  }

  /* 見出しの上端を右の STEP 01 の上端にそろえ、画像は左カラムの下側へ */
  .growth__intro {
    align-self: stretch;
    padding-top: clamp(10px, 1vw, 16px); /* STEP 01 のラベル位置（本文の上余白）と同じ */
    gap: clamp(64px, 5vw, 88px);
  }

  .growth__intro .growth__figure {
    margin-top: auto;
  }

  /* 画像：左カラムに収まる少し横長の長方形（約 1.4 : 1）。手元と PC が中央に入るよう少し左寄りを切り出す */
  .growth__figure {
    width: 100%;
    max-width: 560px;
    margin: 0;
  }

  .growth__media {
    aspect-ratio: 1.4 / 1;
  }

  .growth__image {
    object-position: 45% center;
  }

  /* メモは画像の右上に少し重ねる（デザインはそのまま・位置だけ） */
  .growth__note {
    top: clamp(-56px, -3.4vw, -40px);
    right: clamp(-40px, -2.4vw, -20px);
  }

  .growth__timeline {
    width: auto;
    margin: 0;
  }
}

/* ---------- 1023px以下：画像・STEP を広めに ---------- */
@media (max-width: 1023px) {
  .growth {
    --g-col: 88%;
    --g-col-right: 0%;
  }

  .growth__inner {
    gap: 72px;
  }
}

/* ---------- SP ---------- */
@media (max-width: 767px) {
  .growth {
    --g-circle: 64px;
    --g-box: 78px;
    --g-step-gap: 40px;
    --g-flow: 11s;
    --g-orbit-k: 1.25;
  }

  /* SP：見出し → 説明文 → 画像（幅いっぱい）→ メモ（画像の右下）→ STEP の縦並び */
  .growth {
    --g-col: 100%;
  }

  .growth__inner {
    gap: 56px;
  }

  .growth__intro {
    gap: 44px;
  }

  .growth__figure::before {
    top: -14px;
    left: -12px;
    width: 40%;
  }

  .growth__note {
    position: static;
    display: flex;
    justify-content: flex-end;
    margin-top: -14px;
    padding-right: 4px;
  }

  .growth__note-inner {
    font-size: 13px;
    padding: 9px 18px 10px 22px;
  }

  .growth__step {
    column-gap: 14px;
  }

  .growth__step-body {
    padding-top: 6px;
  }

  .growth__meta {
    gap: 6px 10px;
  }

  .growth__label {
    padding: 4px 10px 3px;
    font-size: 12px;
  }

  .growth__period {
    font-size: 12px;
  }

  .growth__title {
    margin-top: 8px;
    font-size: 18px;
  }

  .growth__description {
    font-size: 13px;
  }

  .growth__orbit-dot {
    r: 3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .growth__note-inner,
  .growth__step::before,
  .growth__flow-node,
  .growth__orbit,
  .growth__flow-travel,
  .growth__circle::after {
    animation: none !important;
    transition: none !important;
  }

  .growth__flow-dot {
    display: none;
  }
}
</style>
