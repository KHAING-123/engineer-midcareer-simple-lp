<script setup>
import AiNetworkBackground from './common/AiNetworkBackground.vue'
import SectionHeading from './SectionHeading.vue'
import InterviewTopicIcon from './InterviewTopicIcon.vue'

defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="interview" class="section interview">
    <!-- 背景：ごく淡いAIネットワーク（コンテンツの後ろ） -->
    <AiNetworkBackground variant="interview" />
    <div class="container interview__inner">
      <!-- PC 左上：見出し・説明文 -->
      <SectionHeading
        v-reveal
        char-reveal
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
  border-radius: 3px;
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

/* 右下のメッセージ：画像の下端にまたがるように配置（画像の右下に少し重なり、下へ少しはみ出す） */
.interview__message {
  position: absolute;
  z-index: 2;
  right: clamp(-20px, -1.5vw, -8px);
  bottom: clamp(-52px, -3.4vw, -30px);
}

/* 白に近いブルーホワイト・細いブルーグレーの線・ごく柔らかい影・明朝体（浮遊アニメーションは既存のまま） */
.interview__message-inner {
  position: relative;
  display: block;
  padding: clamp(18px, 1.7vw, 26px) clamp(22px, 2vw, 32px) clamp(18px, 1.7vw, 26px) clamp(26px, 2.3vw, 36px);
  background: #FCFDFF;
  border: 1px solid rgba(120, 150, 185, 0.22);
  border-radius: 3px;
  box-shadow:
    0 14px 34px rgba(23, 43, 77, 0.08),
    0 2px 8px rgba(23, 43, 77, 0.04);
  font-family: var(--font-serif);
  font-size: clamp(13.5px, 1vw, 15.5px);
  font-weight: 500;
  line-height: 1.85;
  letter-spacing: 0.08em;
  color: #172B4D;
  animation: interviewFloat 6s ease-in-out infinite;
}

/* 左側の細い淡いブルーのアクセントライン（1本だけ） */
.interview__message-inner::before {
  content: '';
  position: absolute;
  top: clamp(18px, 1.7vw, 26px);
  bottom: clamp(18px, 1.7vw, 26px);
  left: clamp(12px, 1.1vw, 16px);
  width: 1.5px;
  background: linear-gradient(180deg, #6EB6EE, rgba(158, 210, 245, 0.35));
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
  /* 白ベース → ごく淡いブルー */
  background: linear-gradient(170deg, rgba(255, 255, 255, 0.96) 0%, rgba(251, 253, 255, 0.95) 55%, rgba(243, 249, 255, 0.94) 100%);
  border: 1px solid rgba(40, 65, 95, 0.08);
  border-radius: 4px;
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
  --tp-curve: rgba(205, 230, 252, 0.6);   /* 下の曲線 */
  --tp-shape: rgba(226, 241, 255, 0.75);  /* 円・多角形 */
  --tp-dot: rgba(120, 180, 235, 0.35);    /* ドット */
  --tp-line: rgba(130, 185, 235, 0.22);   /* 斜線 */

  position: relative;
  isolation: isolate; /* 装飾をカードの中（文字・アイコンの後ろ）に閉じ込める */
  display: flex;
  flex-direction: column;
  padding: clamp(20px, 2vw, 30px) clamp(20px, 2vw, 30px) clamp(22px, 2.2vw, 32px);
  /* 上はほぼ白 → 下へ淡いブルー。枠線はごく薄く、影もごく柔らかく（背景になじませる） */
  background: linear-gradient(155deg, #FFFFFF 0%, #FBFDFF 45%, #F0F8FF 100%);
  border: 1px solid rgba(150, 190, 225, 0.1);
  border-radius: 4px;
  box-shadow: 0 8px 28px rgba(40, 90, 145, 0.035);
}

/* 背景装飾：カードの枠内だけに描く（はみ出さない・クリックを妨げない） */
.interview__topic::before,
.interview__topic::after {
  content: '';
  position: absolute;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
}

.interview__topic::before {
  inset: 0;
}

/* 1：アイコン左上の小さな円＋右下の曲線 */
.interview__topic:nth-child(1)::before {
  background:
    radial-gradient(circle 22px at 16% 22%, var(--tp-shape) 96%, transparent 100%),
    radial-gradient(120% 60% at 100% 118%, var(--tp-curve) 0%, rgba(205, 230, 252, 0.25) 55%, transparent 72%);
}

/* 2：右上の淡い多角形＋ドット、右下の斜めの面 */
.interview__topic:nth-child(2)::before {
  background:
    linear-gradient(135deg, transparent 62%, rgba(205, 230, 252, 0.55) 100%),
    linear-gradient(200deg, var(--tp-shape) 0%, rgba(226, 241, 255, 0) 45%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.interview__topic:nth-child(2)::after {
  top: 10px;
  right: 10px;
  width: 45px;
  height: 27px;
  background-image: radial-gradient(circle, var(--tp-dot) 1px, transparent 1.5px);
  background-size: 9px 9px;
}

/* 3：左上のドット＋左下の大きな円＋右下の斜線 */
.interview__topic:nth-child(3)::before {
  background:
    radial-gradient(ellipse 48% 62% at 0% 112%, var(--tp-curve) 0%, rgba(205, 230, 252, 0.35) 70%, transparent 100%),
    repeating-linear-gradient(135deg, var(--tp-line) 0 1px, transparent 1px 11px) right bottom / 38% 40% no-repeat;
}

.interview__topic:nth-child(3)::after {
  top: 18px;
  left: 18px;
  width: 54px;
  height: 45px;
  background-image: radial-gradient(circle, var(--tp-dot) 1px, transparent 1.5px);
  background-size: 9px 9px;
}

/* 4：右上の重なった円＋下のゆるやかな曲線 */
.interview__topic:nth-child(4)::before {
  background:
    radial-gradient(circle 30px at 84% 0%, var(--tp-shape) 96%, transparent 100%),
    radial-gradient(circle 40px at 100% 8%, rgba(214, 236, 255, 0.5) 96%, transparent 100%),
    radial-gradient(140% 55% at 60% 125%, var(--tp-curve) 0%, rgba(205, 230, 252, 0.2) 60%, transparent 75%);
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
    bottom: -36px;
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

  /* SP：画像の下に、右寄せで（画像には重ねない） */
  .interview__message {
    position: static;
    align-self: flex-end;
    margin: 16px 0 0 auto;
  }

  .interview__message-inner {
    font-size: 14px;
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
