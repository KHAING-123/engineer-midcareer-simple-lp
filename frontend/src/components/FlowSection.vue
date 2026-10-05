<script setup>
import SectionHeading from './SectionHeading.vue'

defineProps({
  content: { type: Object, required: true }
})

// アイコン画像をCSSのマスクとして使う（色をCSSで変えられるようにするため）
const iconStyle = (icon) => ({ '--icon': `url("${icon}")` })
</script>

<template>
  <section id="flow" class="section flow">
    <!-- 背景のやわらかい波・細い曲線（装飾） -->
    <span class="flow__wave flow__wave--top" aria-hidden="true" />
    <span class="flow__wave flow__wave--bottom" aria-hidden="true" />
    <span class="flow__curve flow__curve--tr" aria-hidden="true" />
    <span class="flow__curve flow__curve--bl" aria-hidden="true" />

    <div class="container">
      <SectionHeading
        v-reveal
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
      />

      <div class="flow__body">
        <!-- 5ステップ：番号 → 線画アイコン → 名称 → 期間。ステップ間に細い矢印 -->
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
            <span class="flow__icon" aria-hidden="true">
              <span class="flow__icon-mark" :style="iconStyle(item.icon)" />
            </span>
            <h3 class="flow__title">{{ item.title }}</h3>
            <p v-if="item.period" class="flow__period">{{ item.period }}</p>
            <span v-if="index < content.items.length - 1" class="flow__arrow" aria-hidden="true" />
          </li>
        </ol>

        <!-- 右端のメモ（少し傾けた紙のデザイン） -->
        <div v-if="content.note" v-reveal class="flow__note" :style="{ '--reveal-delay': '0.35s' }">
          <p class="flow__note-paper">
            <span class="flow__note-text pre-line">{{ content.note }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.flow {
  --flow-ink: #182235;
  --flow-number: #60656B;
  --flow-sub: #737982;
  --flow-accent: #A34A45;          /* 05 内定だけのくすんだ赤 */
  --flow-icon: clamp(42px, 3.2vw, 58px);
  --flow-number-h: clamp(26px, 2vw, 34px); /* 番号の高さ（矢印の位置計算に使う） */
  --flow-number-gap: clamp(16px, 1.4vw, 24px);
}

/* ---------- 背景装飾（ごく淡い波・細い曲線） ---------- */
.flow__wave,
.flow__curve {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;
}

.flow__wave--top {
  top: -30%;
  right: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(ellipse at 50% 60%, rgba(218, 239, 252, 0.22), rgba(218, 239, 252, 0) 70%);
  transform: rotate(-8deg);
}

.flow__wave--bottom {
  bottom: -40%;
  left: -12%;
  width: 84%;
  height: 72%;
  background: radial-gradient(ellipse at 50% 40%, rgba(218, 239, 252, 0.32), rgba(218, 239, 252, 0) 70%);
  border-top: 1px solid rgba(255, 255, 255, 0.85);
  transform: rotate(5deg);
}

.flow__curve {
  border: 1px solid rgba(170, 205, 235, 0.26);
}

.flow__curve--tr {
  top: -55%;
  right: -12%;
  width: 34%;
  aspect-ratio: 1;
}

.flow__curve--bl {
  bottom: -70%;
  left: -16%;
  width: 30%;
  aspect-ratio: 1;
}

/* ---------- レイアウト：5ステップ ＋ メモ ---------- */
.flow__body {
  display: flex;
  align-items: flex-start;
  gap: clamp(16px, 2vw, 40px);
  width: min(100%, 1600px);
  margin-top: clamp(40px, 4vw, 64px);
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

/* 表示アニメーション：01→05 の順に、少しだけ下からふわっと */
.flow__item.reveal {
  transform: translateY(12px);
  transition-duration: 0.65s;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

.flow__item.reveal.is-visible {
  transform: translateY(0);
}

.flow__number {
  height: var(--flow-number-h);
  margin-bottom: var(--flow-number-gap);
  font-family: var(--font-en);
  font-size: var(--flow-number-h);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.04em;
  color: var(--flow-number);
}

/* 線画アイコン（背景・丸なし）。アイコン画像を形として使い、色はCSSで指定 */
.flow__icon {
  display: block;
  width: var(--flow-icon);
  height: var(--flow-icon);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.flow__icon-mark {
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--flow-ink);
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
  animation: flowIconFloat 6s ease-in-out infinite;
  animation-delay: calc(var(--i) * -1.2s);
}

/* 見た目の大きさをそろえる微調整（会話・旗はやや小さく見えるため） */
.flow__item:nth-child(2) .flow__icon-mark,
.flow__item:nth-child(5) .flow__icon-mark {
  transform-origin: center;
  scale: 1.06;
}

@keyframes flowIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.flow__title {
  margin-top: clamp(16px, 1.4vw, 24px);
  font-size: clamp(14px, 1vw, 17px);
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--flow-ink);
  transition: color 0.3s ease;
}

.flow__period {
  margin-top: 4px;
  font-size: clamp(11.5px, 0.8vw, 13px);
  font-weight: 400;
  line-height: 1.6;
  color: var(--flow-sub);
}

/* ホバー：アイコンが少し上がり、名称が少し濃くなるだけ */
.flow__item:hover .flow__icon {
  transform: translateY(-4px);
}

.flow__item:hover .flow__title {
  color: #0B1220;
}

/* 05 内定だけアクセントカラー */
.flow__item.is-highlight .flow__number,
.flow__item.is-highlight .flow__title,
.flow__item.is-highlight:hover .flow__title {
  color: var(--flow-accent);
}

.flow__item.is-highlight .flow__icon-mark {
  background-color: var(--flow-accent);
}

/* ステップ間の細い矢印（アイコンの縦中央にそろえる） */
.flow__arrow {
  position: absolute;
  top: calc(var(--flow-number-h) + var(--flow-number-gap) + var(--flow-icon) / 2);
  right: 0;
  width: clamp(22px, 2vw, 34px);
  height: 9px;
  transform: translate(50%, -50%);
  color: rgba(30, 40, 50, 0.55);
  animation: flowArrowPulse 3.6s ease-in-out infinite;
}

.flow__arrow::before {
  content: '';
  position: absolute;
  left: 0;
  right: 1px;
  top: 50%;
  border-top: 1px solid currentColor;
}

.flow__arrow::after {
  content: '';
  position: absolute;
  right: 1px;
  top: 50%;
  width: 6px;
  height: 6px;
  border-top: 1px solid currentColor;
  border-right: 1px solid currentColor;
  transform: translateY(-50%) rotate(45deg);
}

@keyframes flowArrowPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* ---------- メモ：最短1週間でご連絡！ ---------- */
.flow__note {
  flex-shrink: 0;
  margin-top: calc(var(--flow-number-h) * 0.4);
}

.flow__note-paper {
  position: relative;
  padding: clamp(20px, 1.8vw, 28px) clamp(26px, 2.4vw, 40px) clamp(18px, 1.6vw, 24px);
  background: linear-gradient(135deg, #FFFDF8 0%, #FFF5E8 100%);
  border: 1px solid rgba(210, 180, 140, 0.18);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(100, 80, 50, 0.05);
  transform: rotate(-5deg);
  animation: flowNoteFloat 6.5s ease-in-out infinite;
}

/* 左上の短いアクセント線（2本） */
.flow__note-paper::before,
.flow__note-paper::after {
  content: '';
  position: absolute;
  height: 1.5px;
  background: #C9864A;
  border-radius: 1px;
  pointer-events: none;
}

.flow__note-paper::before {
  top: -10px;
  left: -16px;
  width: 22px;
  transform: rotate(32deg);
}

.flow__note-paper::after {
  top: -22px;
  left: 2px;
  width: 18px;
  transform: rotate(62deg);
}

@keyframes flowNoteFloat {
  0%, 100% { transform: rotate(-5deg) translateY(0); }
  50% { transform: rotate(-5deg) translateY(-3px); }
}

.flow__note-text {
  display: block;
  font-family: var(--font-hand);
  font-size: clamp(15px, 1.15vw, 19px);
  font-weight: 600;
  line-height: 1.7;
  letter-spacing: 0.06em;
  text-align: center;
  color: var(--color-text);
}

/* 1行目「最短1週間で」を少しだけ強調 */
.flow__note-text::first-line {
  font-size: 1.06em;
}

/* メモ内の下側の短いアクセント線 */
.flow__note-text::after {
  content: '';
  display: block;
  width: 40px;
  height: 1.5px;
  margin: 10px auto 0;
  background: #C9864A;
  opacity: 0.7;
  pointer-events: none;
}

/* ---------- 1024〜1279px：アイコン・余白を少し小さく ---------- */
@media (max-width: 1279px) {
  .flow {
    --flow-icon: 42px;
    --flow-number-gap: 14px;
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
    margin: 16px clamp(0px, 4vw, 40px) 0 0;
  }
}

/* ---------- SP：縦のフロー ---------- */
@media (max-width: 767px) {
  .flow {
    --flow-icon: 46px;
  }

  .flow__list {
    grid-template-columns: minmax(0, 1fr);
  }

  .flow__title {
    font-size: 15px;
  }

  .flow__period {
    font-size: 12px;
  }

  /* 矢印は下向きにして、ステップの下に置く */
  .flow__arrow {
    position: relative;
    top: auto;
    right: auto;
    width: 32px;
    margin: 28px 0 30px; /* 回転後の高さ分の余白を確保 */
    transform: rotate(90deg);
  }

  .flow__note {
    align-self: center;
    margin: 36px 0 0;
  }

  .flow__curve--tr {
    width: 70%;
    top: -12%;
    right: -40%;
  }

  .flow__curve--bl {
    width: 70%;
    bottom: -10%;
    left: -40%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow__item,
  .flow__icon,
  .flow__icon-mark,
  .flow__arrow,
  .flow__note-paper {
    animation: none !important;
    transition: none !important;
  }

  .flow__item:hover .flow__icon {
    transform: none;
  }
}
</style>
