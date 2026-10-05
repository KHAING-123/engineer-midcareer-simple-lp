<script setup>
import SectionHeading from './SectionHeading.vue'

defineProps({
  content: { type: Object, required: true }
})

// アイコン画像をCSSのマスクとして使う（色をCSSで統一するため）
const iconStyle = (icon) => ({ '--icon': `url("${icon}")` })
</script>

<template>
  <section id="growth" class="section growth">
    <!-- 背景のごく淡い形（装飾） -->
    <span class="growth__wave growth__wave--tr" aria-hidden="true" />
    <span class="growth__wave growth__wave--br" aria-hidden="true" />

    <div class="container growth__inner">
      <!-- 左：見出し・説明文 → 画像（＋手書き風メモ） -->
      <div class="growth__intro">
        <SectionHeading
          v-reveal
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

      <!-- 右：STEP 01〜04 の縦タイムライン（白い丸＋線画アイコン／細い線＋小さな点） -->
      <ol class="growth__timeline">
        <li
          v-for="(step, index) in content.steps"
          :key="step.label"
          v-reveal
          class="growth__step"
          :style="{ '--reveal-delay': `${index * 0.1}s`, '--i': index }"
        >
          <span class="growth__icon" aria-hidden="true">
            <span class="growth__icon-mark" :style="iconStyle(step.icon)" />
          </span>
          <div class="growth__step-body">
            <p class="growth__meta">
              <span class="growth__label">{{ step.label }}</span>
              <span class="growth__period">{{ step.period }}</span>
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
  --g-sub: #697386;
  --g-text: #5F6673;
  --g-line: rgba(130, 185, 220, 0.35);
  --g-dot: rgba(120, 185, 225, 0.65);
  --g-icon: clamp(64px, 4.2vw, 80px);
  --g-step-gap: clamp(36px, 3vw, 56px);
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

/* ---------- PC：左 約46% ／ 右 約54% ---------- */
.growth__inner {
  display: grid;
  grid-template-columns: minmax(0, 46fr) minmax(0, 54fr);
  gap: clamp(48px, 5vw, 110px);
  align-items: stretch;
}

/* 左：見出しは上、画像は下（右のSTEP 04と下端をそろえる） */
.growth__intro {
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 4vw, 72px);
}

.growth__figure {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin-top: auto;
  margin-bottom: 0;
}

/* 画像の後ろの淡いブルーの四角（左上・右下に少しずらす） */
.growth__figure::before,
.growth__figure::after {
  content: '';
  position: absolute;
  z-index: -1;
  border-radius: 6px;
  background: rgba(220, 239, 250, 0.45);
  pointer-events: none;
}

.growth__figure::before {
  top: -26px;
  left: -36px;
  width: 30%;
  height: 72%;
}

.growth__figure::after {
  right: -28px;
  top: -40px;
  width: 22%;
  height: 46%;
  background: rgba(226, 242, 252, 0.4);
}

.growth__media {
  aspect-ratio: 16 / 8.5;
  border-radius: 8px;
  background: var(--color-border);
  box-shadow: 0 14px 40px rgba(30, 50, 70, 0.06);
}

.growth__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 手書き風メモ：画像の右上に少し重ねる */
.growth__note {
  position: absolute;
  z-index: 2;
  top: clamp(-52px, -3.2vw, -36px);
  right: clamp(-24px, -1.2vw, -8px);
}

.growth__note-inner {
  display: block;
  padding: 8px 16px 10px;
  background: rgba(255, 255, 255, 0.82);
  font-family: var(--font-hand);
  font-size: clamp(14px, 1.05vw, 17px);
  line-height: 1.7;
  letter-spacing: 0.12em;
  color: var(--color-text);
  transform: rotate(-5deg);
  animation: growthNoteFloat 6.5s ease-in-out infinite;
}

@keyframes growthNoteFloat {
  0%, 100% { transform: rotate(-5deg) translateY(0); }
  50% { transform: rotate(-5deg) translateY(-3px); }
}

/* ---------- 右：縦タイムライン ---------- */
.growth__timeline {
  position: relative;
  align-self: center;
}

.growth__step {
  position: relative;
  display: grid;
  grid-template-columns: var(--g-icon) minmax(0, 1fr);
  column-gap: clamp(24px, 2.4vw, 44px);
  padding-bottom: var(--g-step-gap);
}

.growth__step:last-child {
  padding-bottom: 0;
}

/* 丸と丸をつなぐ細い線（次の丸の上端まで） */
.growth__step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: calc(var(--g-icon) / 2 - 0.5px);
  top: var(--g-icon);
  bottom: 0;
  width: 1px;
  background: var(--g-line);
  transform-origin: top center;
  transition: transform 1.3s var(--g-ease);
  transition-delay: calc(var(--reveal-delay, 0s) + 0.2s);
}

/* 線の途中の小さな点 */
.growth__step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: calc(var(--g-icon) / 2 - 3.5px);
  top: calc((var(--g-icon) + 100%) / 2 - 3.5px);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--g-dot);
  transition: opacity 0.5s ease, transform 0.5s var(--g-ease);
  transition-delay: calc(var(--reveal-delay, 0s) + 0.9s);
}

/* 白い丸＋線画アイコン（全ステップ同じ色） */
.growth__icon {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: var(--g-icon);
  height: var(--g-icon);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 30px rgba(40, 70, 100, 0.04), 0 0 0 1px rgba(20, 33, 58, 0.04);
  animation: growthIconFloat 7s ease-in-out infinite;
  animation-delay: calc(var(--i) * -1.6s);
}

.growth__icon-mark {
  width: 40%;
  aspect-ratio: 1;
  background-color: var(--g-ink);
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
}

@keyframes growthIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.growth__step-body {
  max-width: 640px;
  padding-top: clamp(4px, 0.6vw, 10px);
}

.growth__meta {
  display: flex;
  align-items: baseline;
  gap: 18px;
  color: var(--g-sub);
}

.growth__label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.growth__period {
  font-size: 13px;
  letter-spacing: 0.06em;
}

.growth__title {
  margin-top: 6px;
  font-size: clamp(19px, 1.3vw, 24px);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.06em;
  color: var(--g-ink);
}

.growth__description {
  margin-top: 8px;
  font-size: clamp(13px, 0.9vw, 15px);
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

.growth__step.reveal:not(.is-visible)::after {
  opacity: 0;
  transform: scale(0.8);
}

/* ---------- 1023px以下：1カラム（見出し → 画像 → タイムライン） ---------- */
@media (max-width: 1023px) {
  .growth__inner {
    grid-template-columns: minmax(0, 1fr);
    gap: 56px;
  }

  .growth__figure {
    max-width: 640px;
    margin-top: 24px;
  }

  .growth__timeline {
    align-self: stretch;
  }
}

/* ---------- SP ---------- */
@media (max-width: 767px) {
  .growth {
    --g-icon: 58px;
    --g-step-gap: 32px;
  }

  .growth__intro {
    gap: 40px;
  }

  .growth__figure {
    max-width: none;
    margin-top: 16px;
  }

  .growth__figure::before {
    top: -14px;
    left: -12px;
  }

  .growth__figure::after {
    display: none;
  }

  .growth__note {
    top: -30px;
    right: 6px;
  }

  .growth__note-inner {
    font-size: 13px;
    padding: 6px 12px 8px;
  }

  .growth__step {
    column-gap: 16px;
  }

  .growth__step-body {
    padding-top: 2px;
  }

  .growth__meta {
    gap: 12px;
  }

  .growth__title {
    font-size: 19px;
  }

  .growth__description {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .growth__icon,
  .growth__note-inner,
  .growth__step::before,
  .growth__step::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>
