<script setup>
// 各セクション共通の見出し（大きい番号・英語ラベル・タイトル・説明文・右側の英文メモ）
defineProps({
  number: { type: String, required: true },
  englishTitle: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  sideNote: { type: String, default: '' },
  // true のとき「番号・ラベル・タイトル・説明」を横一列に並べる（07 FLOW 用）
  inline: { type: Boolean, default: false }
})
</script>

<template>
  <header class="heading" :class="{ 'heading--inline': inline }">
    <span class="heading__number">{{ number }}</span>
    <div class="heading__body">
      <p v-if="englishTitle" class="heading__label">{{ englishTitle }}</p>
      <h2 class="heading__title pre-line">{{ title }}</h2>
      <p v-if="description" class="heading__description pre-line">{{ description }}</p>
    </div>
    <p v-if="sideNote" class="heading__note pre-line" aria-hidden="true">{{ sideNote }}</p>
  </header>
</template>

<style scoped>
.heading {
  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: 32px;
  align-items: start;
}

.heading__number {
  font-family: var(--font-en);
  font-size: 44px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.02em;
}

.heading__body {
  min-width: 0;
}

.heading__label {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--color-text-light);
  line-height: 1;
  margin-bottom: 18px;
}

.heading__title {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(24px, 2.4vw, 30px);
  line-height: 1.55;
  letter-spacing: 0.08em;
}

.heading__description {
  max-width: var(--text-readable);
  margin-top: 16px;
  font-size: 13px;
  color: var(--color-text-light);
  line-height: 2;
}

.heading__note {
  position: relative;
  align-self: center;
  padding-left: 120px;
  font-family: var(--font-en);
  font-size: 17px;
  line-height: 1.35;
  color: #9c9a94;
  text-align: right;
}

.heading__note::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100px;
  border-top: 1px solid var(--color-border);
}

/* 横一列タイプ（FLOW） */
.heading--inline {
  grid-template-columns: auto auto auto 1fr;
  align-items: baseline;
}

.heading--inline .heading__body {
  display: contents;
}

.heading--inline .heading__label {
  margin: 0;
}

.heading--inline .heading__description {
  margin: 0;
}

@media (max-width: 1023px) {
  .heading__note {
    display: none;
  }

  .heading {
    grid-template-columns: auto 1fr;
  }

  .heading--inline {
    grid-template-columns: auto 1fr;
    row-gap: 12px;
  }

  .heading--inline .heading__body {
    display: block;
  }

  .heading--inline .heading__label {
    margin-bottom: 14px;
  }

  .heading--inline .heading__description {
    margin-top: 12px;
  }
}

@media (max-width: 767px) {
  .heading {
    column-gap: 18px;
  }

  .heading__number {
    font-size: 36px;
  }

  .heading__label {
    margin-bottom: 14px;
  }

  .heading__title {
    font-size: 23px;
  }

}
</style>
