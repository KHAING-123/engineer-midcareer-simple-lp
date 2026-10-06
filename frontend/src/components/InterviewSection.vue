<script setup>
import SectionHeading from './SectionHeading.vue'
import InterviewTopicIcon from './InterviewTopicIcon.vue'

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
        <!-- タイトル下：薄い線＋左から伸びる青い線（表示時に1回） -->
        <span class="interview__panel-line" aria-hidden="true"><span class="interview__panel-accent" /></span>
        <ul class="interview__topics">
          <li
            v-for="(topic, index) in content.topics"
            :key="topic.title"
            v-reveal
            class="interview__topic"
            :style="{ '--reveal-delay': `${0.2 + index * 0.1}s` }"
          >
            <!-- 上：アイコン＋タイトル（横一列） -->
            <div class="interview__topic-header">
              <InterviewTopicIcon :type="topic.iconType" :index="index" class="interview__icon" />
              <h4 class="interview__topic-title">{{ topic.title }}</h4>
            </div>
            <!-- 下：説明文（カードの幅いっぱい） -->
            <p class="interview__topic-description">{{ topic.description }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 画像を主役に見せるため、前後より少し広めの上下余白 */
.interview {
  padding-block: calc(var(--section-pad) * 1.15);
}

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
    padding-inline: clamp(24px, 2.2vw, 40px); /* 項目カードを横に広く使うため左右の余白を少し詰める */
  }

  /* PC：項目カードを少し横長に（左の列をわずかに広く） */
  .interview__inner {
    grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr);
  }

  .interview__inner .interview__topics {
    column-gap: clamp(24px, 1.8vw, 32px);
    row-gap: clamp(24px, 1.6vw, 28px);
  }

  /* PC：アイコン（白い円＋弧）を約12%小さく */
  .interview__inner .interview__icon {
    --ti-size: clamp(50px, 3.7vw, 72px);
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

/* シンプルで落ち着いたサンセリフ（細め・直立） */
.interview__script-text {
  font-family: var(--font-sans);
  font-style: normal;
  font-weight: 300;
  letter-spacing: 0.02em;
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

/* ---------- 面接でお話しすること：大きな白いパネル ---------- */
.interview__panel {
  width: min(100%, 1040px);
  margin-top: 72px;
  padding: clamp(32px, 3vw, 52px) clamp(26px, 3vw, 52px) clamp(30px, 3vw, 48px);
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(40, 65, 95, 0.08);
  border-radius: clamp(24px, 2.2vw, 32px);
  box-shadow: 0 18px 50px rgba(25, 45, 70, 0.04);
}

.interview__panel-title {
  font-family: var(--font-serif);
  font-size: clamp(20px, 1.7vw, 26px);
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1.5;
  color: #17243A;
}

/* タイトル下の薄い線 */
.interview__panel-line {
  position: relative;
  display: block;
  height: 1px;
  margin-top: clamp(16px, 1.6vw, 24px);
  background: #D8E3ED;
}

/* 左から右へ伸びる青い線（スクロールで表示されたとき1回） */
.interview__panel-accent {
  position: absolute;
  left: 0;
  top: -0.5px;
  width: clamp(120px, 10vw, 150px);
  height: 2px;
  overflow: hidden;
  background: linear-gradient(90deg, #58A9E8, #8CC6F2);
  transform-origin: left center;
  transition: transform 1.3s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
}

.interview__panel.reveal:not(.is-visible) .interview__panel-accent {
  transform: scaleX(0);
}

/* 描き終わったあと、線の上をごく淡い光がゆっくり流れる */
.interview__panel-accent::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0));
  transform: translateX(-120%);
  animation: interviewAccentSweep 6s ease-in-out 1.8s infinite;
}

@keyframes interviewAccentSweep {
  0%, 55% { transform: translateX(-120%); }
  100% { transform: translateX(320%); }
}

.interview__topics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 1.4vw, 20px);
  margin-top: clamp(20px, 2vw, 30px);
}

/* 各項目：白 → ごく淡いブルー → 淡いブルーグレーのやわらかいカード（4枚とも同じ色） */
.interview__topic {
  display: flex;
  flex-direction: column;
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px) clamp(22px, 2.2vw, 32px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.96) 0%, rgba(250, 252, 254, 0.94) 35%, rgba(242, 248, 252, 0.88) 68%, rgba(232, 243, 250, 0.78) 100%);
  border: 1px solid rgba(40, 65, 90, 0.03);
  border-radius: 24px;
  box-shadow: 0 14px 36px rgba(28, 55, 82, 0.025);
}

/* アイコン＋タイトルを横一列（タイトルはアイコンの縦中央） */
.interview__topic-header {
  display: flex;
  align-items: center;
  gap: clamp(14px, 1.4vw, 24px);
}

/* アイコン（白い円＋青い弧）のサイズ */
.interview__icon {
  --ti-size: clamp(56px, 4.2vw, 88px);
  flex-shrink: 0;
  margin-left: 6px;
}

.interview__topic-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.6;
}

/* 説明文：アイコンの下から、カードの幅いっぱいを使う */
.interview__topic-description {
  width: 100%;
  margin: clamp(16px, 1.6vw, 22px) 0 0;
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
    padding: 30px 22px 30px;
  }

  .interview__topics {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .interview__topic {
    padding: 20px 20px 22px;
  }

  .interview__topic-header {
    gap: 18px;
  }

  .interview__icon {
    --ti-size: 60px;
  }

  .interview__topic-description {
    font-size: 12.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .interview__message-inner {
    animation: none;
  }

  .interview__panel-accent,
  .interview__panel-accent::after,
  .interview__script-text,
  .interview__script-line {
    animation: none !important;
    transition: none !important;
  }
}
</style>
