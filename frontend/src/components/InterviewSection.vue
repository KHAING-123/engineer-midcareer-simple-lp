<script setup>
import SectionHeading from './SectionHeading.vue'

defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="interview" class="section interview">
    <div class="container interview__inner">
      <!-- PC 左上：見出し・説明文 -->
      <SectionHeading
        v-reveal
        class="interview__heading"
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
      />

      <!-- PC 右：大きな面接ビジュアル（飾り文字・メッセージ・淡い装飾つき） -->
      <div class="interview__visual">
        <!-- 飾り文字「Interview ───」（文字と細い線を同じ箱に） -->
        <p v-if="content.scriptLabel" v-reveal class="interview__script" aria-hidden="true">
          <span class="interview__script-text">{{ content.scriptLabel }}</span>
          <span class="interview__script-line" />
        </p>

        <figure v-reveal class="interview__frame">
          <!-- 画像は切り取らず、元の縦横比のまま全体を表示 -->
          <img :src="content.image" :alt="content.alt" class="interview__image" loading="lazy">
        </figure>

        <p
          v-if="content.message"
          v-reveal
          class="interview__message"
          :style="{ '--reveal-delay': '0.3s' }"
        >
          <span class="interview__message-inner pre-line">{{ content.message }}</span>
        </p>
      </div>

      <!-- PC 左下：面接でお話しすること（2×2） -->
      <div v-reveal class="interview__panel">
        <h3 class="interview__panel-title">{{ content.topicsTitle }}</h3>
        <ul class="interview__topics">
          <li v-for="topic in content.topics" :key="topic.title" class="interview__topic">
            <span class="interview__icon-wrap">
              <img :src="topic.icon" alt="" class="interview__icon" width="32" height="32">
            </span>
            <div>
              <h4 class="interview__topic-title">{{ topic.title }}</h4>
              <p class="interview__topic-description">{{ topic.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* SP・タブレット：見出し → ビジュアル → お話しすること の縦並び
   PC（1200px〜）：左＝見出し＋お話しすること ／ 右＝ビジュアル の2カラム（下の @media）
   ※1024〜1199px は2カラムだと窮屈なため縦並び */
.interview__inner {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1200px) {
  .interview__inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    grid-template-areas:
      "head  visual"
      "panel visual";
    grid-template-rows: auto 1fr;
    column-gap: clamp(36px, 4vw, 72px);
    align-items: start;
  }

  .interview__inner .interview__heading {
    grid-area: head;
  }

  .interview__inner .interview__visual {
    grid-area: visual;
    width: 100%;
    margin: clamp(48px, 4.5vw, 80px) 0 0;
  }

  /* 左下のカードは画像の下端あたりにそろえる */
  .interview__inner .interview__panel {
    grid-area: panel;
    align-self: end;
    width: 100%;
    margin-top: clamp(32px, 3vw, 48px);
  }
}

/* 見出しは上に独立して配置（少し上へ詰める） */
.interview__heading {
  margin-top: calc(var(--section-space) * -0.1);
}

/* ---------- メインビジュアル（中央〜やや右寄り） ---------- */
.interview__visual {
  position: relative;
  width: min(92%, 760px);
  margin: 72px auto 0;
}

.interview__frame {
  position: relative;
  margin: 0;
}

/* 画像の後ろに、右上へずらした淡いブルーの面 */
.interview__frame::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: clamp(-36px, -2.6vw, -18px);
  right: clamp(-36px, -2.6vw, -18px);
  width: 78%;
  height: 72%;
  border-radius: clamp(14px, 1.5vw, 26px);
  background: rgba(218, 239, 252, 0.45);
  pointer-events: none;
}

/* 右側の細いL字ライン */
.interview__frame::after {
  content: '';
  position: absolute;
  z-index: -1;
  top: 18%;
  right: clamp(-60px, -4vw, -30px);
  width: clamp(40px, 4vw, 70px);
  height: 36%;
  border-top: 1px solid rgba(80, 150, 200, 0.45);
  border-right: 1px solid rgba(80, 150, 200, 0.45);
  pointer-events: none;
}

/* 左下の細いL字ライン */
.interview__visual::after {
  content: '';
  position: absolute;
  z-index: -1;
  left: clamp(-40px, -2.6vw, -20px);
  bottom: clamp(-34px, -2.4vw, -18px);
  width: 18%;
  height: 22%;
  border-left: 1px solid rgba(80, 150, 200, 0.45);
  border-bottom: 1px solid rgba(80, 150, 200, 0.45);
  pointer-events: none;
}

/* 元画像を切り取らずに全体表示 */
.interview__image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: clamp(12px, 1.3vw, 22px);
  box-shadow: 0 18px 50px rgba(40, 80, 110, 0.1);
}

/* 「Interview ───」飾り文字（見出しではない装飾）
   細い斜体のセリフ体＋右に細い線。文字はゆっくり濃淡、線はゆっくり伸び縮み（5.5秒） */
.interview__script {
  position: absolute;
  z-index: 2;
  top: -0.74em; /* 文字の下端が画像の上端に少しかかる位置 */
  left: clamp(-56px, -3vw, -20px);
  display: flex;
  align-items: center;
  gap: 0.16em;
  margin: 0;
  font-family: var(--font-en);
  font-size: clamp(72px, 6.6vw, 130px);
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
  transition-duration: 0.95s;
}

/* 細く強弱のあるセリフ体の斜体（Mac/iPhone は Bodoni 72・Didot、
   それ以外の環境は読み込み済みの Cormorant Garamond 斜体で表示） */
.interview__script-text {
  font-family: "Bodoni 72", "Didot", "Cormorant Garamond", "Times New Roman", serif;
  font-style: italic;
  font-weight: 400;
  font-synthesis: none; /* 太字・斜体を機械的に作らない（本物の斜体だけを使う） */
  letter-spacing: -0.01em;
  line-height: 1;
  color: rgba(105, 150, 210, 0.72);
  animation: interviewSoftPulse 5.5s ease-in-out infinite;
}

/* 文字の下寄り（xハイトの中ほど）にそろえる細い線 */
.interview__script-line {
  flex-shrink: 0;
  width: clamp(80px, 8vw, 150px);
  height: 1px;
  margin-top: 0.22em;
  background: rgba(90, 130, 185, 0.65);
  transform-origin: left center;
  animation: interviewLineMotion 5.5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

@keyframes interviewSoftPulse {
  0%, 100% { opacity: 0.78; }
  50% { opacity: 0.38; }
}

@keyframes interviewLineMotion {
  0%, 100% {
    transform: scaleX(0.72);
    opacity: 0.35;
  }
  50% {
    transform: scaleX(1);
    opacity: 0.75;
  }
}

/* 飾り文字は左からふわっと表示 */
.interview__script.reveal {
  transform: translateX(-15px);
}

.interview__script.reveal.is-visible {
  transform: translateX(0);
}

/* 右下のメッセージカード（画像から少しはみ出す） */
.interview__message {
  position: absolute;
  z-index: 2;
  right: clamp(-20px, -1.5vw, -8px);
  bottom: clamp(24px, 3vw, 50px);
}

.interview__message-inner {
  display: block;
  padding: clamp(18px, 1.8vw, 28px) clamp(20px, 2vw, 32px) clamp(20px, 2vw, 30px);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(210, 225, 235, 0.35);
  border-radius: 10px;
  box-shadow: 0 10px 35px rgba(50, 80, 110, 0.07);
  font-size: clamp(13px, 1vw, 15px);
  line-height: 1.9;
  letter-spacing: 0.06em;
  color: var(--color-text);
  animation: interviewFloat 6s ease-in-out infinite;
}

/* カード下部の短いライトブルーの線 */
.interview__message-inner::after {
  content: '';
  display: block;
  width: 40px;
  height: 2px;
  margin-top: 12px;
  background: linear-gradient(90deg, #6EBDF2, #9EDCFF);
}

@keyframes interviewFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* ---------- 面接でお話しすること（ビジュアルの下・控えめ） ---------- */
.interview__panel {
  width: min(100%, 1040px);
  margin-top: 72px;
  padding: clamp(28px, 2.4vw, 40px) clamp(24px, 2.4vw, 40px) clamp(28px, 2.4vw, 40px);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(205, 220, 232, 0.42);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(50, 80, 110, 0.06);
}

/* 見出し：下に薄い線＋左端に短いライトブルーの線 */
.interview__panel-title {
  position: relative;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(205, 220, 232, 0.7);
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.interview__panel-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 64px;
  height: 2px;
  background: linear-gradient(90deg, #6EBDF2, #9EDCFF);
}

.interview__topics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.interview__topic {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  padding: 24px 12px 24px 0;
}

/* 2×2の区切り線 */
.interview__topic:nth-child(even) {
  padding-left: 20px;
  padding-right: 0;
  border-left: 1px solid var(--color-border);
}

.interview__topic:nth-child(n + 3) {
  border-top: 1px solid var(--color-border);
}

.interview__topic:nth-last-child(-n + 2) {
  padding-bottom: 0;
}

/* アイコンの後ろの淡い丸（項目ごとに色を変える） */
.interview__icon-wrap {
  display: grid;
  place-items: center;
  width: calc(var(--icon-sm) + 20px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: rgba(214, 236, 255, 0.6);
}

.interview__topic:nth-child(2) .interview__icon-wrap { background: rgba(214, 240, 222, 0.6); }
.interview__topic:nth-child(3) .interview__icon-wrap { background: rgba(255, 236, 204, 0.6); }
.interview__topic:nth-child(4) .interview__icon-wrap { background: rgba(255, 222, 228, 0.6); }

.interview__icon {
  width: calc(var(--icon-sm) * 0.8);
  height: calc(var(--icon-sm) * 0.8);
}

.interview__topic-title {
  margin-top: 2px;
}

.interview__topic-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.6;
}

.interview__topic-description {
  margin-top: 6px;
  font-size: 11.5px;
  color: var(--color-text-light);
  line-height: 1.85;
}

/* ---------- 縦並び（1199px以下） ---------- */
@media (max-width: 1199px) {
  .interview__script {
    left: -12px;
  }

  .interview__frame::after {
    right: -18px;
  }

  .interview__message {
    right: 16px;
    bottom: 20px;
  }
}

/* ---------- SP：縦並び（重なりは最小限） ---------- */
@media (max-width: 767px) {
  .interview__heading {
    margin-top: 0;
  }

  .interview__visual {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 40px;
  }

  .interview__script {
    position: static;
    order: -1;
    margin-bottom: 4px;
    font-size: clamp(48px, 15vw, 72px);
  }

  .interview__script-line {
    width: clamp(40px, 14vw, 72px);
  }

  .interview__frame::before {
    top: -12px;
    right: -12px;
  }

  .interview__frame::after,
  .interview__visual::after {
    display: none;
  }

  .interview__message {
    position: static;
    align-self: flex-end;
    margin: -25px 16px 0 auto;
  }

  .interview__panel {
    margin-top: 48px;
    padding: 24px 20px 28px;
  }

  .interview__topics {
    grid-template-columns: 1fr;
  }

  .interview__topic,
  .interview__topic:nth-child(even),
  .interview__topic:nth-last-child(-n + 2) {
    padding: 20px 0;
    border-left: 0;
  }

  .interview__topic + .interview__topic {
    border-top: 1px solid var(--color-border);
  }

  .interview__topic:last-child {
    padding-bottom: 0;
  }

  .interview__topic-description {
    font-size: 12.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .interview__message-inner {
    animation: none;
  }

  .interview__script-text,
  .interview__script-line {
    animation: none !important;
    transition: none !important;
  }
}
</style>
