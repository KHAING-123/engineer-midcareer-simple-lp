<script setup>
import AiNetworkBackground from './common/AiNetworkBackground.vue'
import SectionHeading from './SectionHeading.vue'
import SupportIcon from './SupportIcon.vue'

defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="support" class="section support">
    <!-- 背景：ごく淡いAIネットワーク（コンテンツの後ろ） -->
    <AiNetworkBackground variant="support" />
    <div class="container">
      <SectionHeading
        v-reveal
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
        :side-note="content.sideNote"
      />

      <ul class="support__list">
        <li
          v-for="(item, index) in content.items"
          :key="item.title"
          v-reveal
          class="support__item card-lift"
          :style="{ '--reveal-delay': `${index * 0.08}s` }"
        >
          <span class="support__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <SupportIcon :type="item.iconType" :index="index" class="support__icon" />
          <h3 class="support__title">{{ item.title }}</h3>
          <p class="support__description">{{ item.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.support__list {
  display: grid;
  /* カード1枚：最小200px〜最大520px */
  grid-template-columns: repeat(4, minmax(200px, 520px));
  justify-content: space-between;
  gap: clamp(16px, 2vw, 40px);
  margin-top: 40px;
}

/* カード：上にイラスト、右上に番号、タイトル（下に短い青線）、本文 */
.support__item {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: clamp(24px, 2vw, 32px) clamp(22px, 2vw, 32px) clamp(28px, 2.2vw, 36px);
  /* 1枚のカードの中で、上はほぼ白 → 下へ行くほど淡いブルーグレーに（境目なし） */
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 28%, #F8FBFE 42%, #EFF6FC 67%, #E2EEF9 100%);
  border: 1px solid rgba(31, 49, 72, 0.08);
  border-radius: var(--radius);
  box-shadow: 0 10px 30px rgba(24, 45, 72, 0.04);
}

.support__number {
  position: absolute;
  top: clamp(14px, 1.4vw, 22px);
  right: clamp(16px, 1.6vw, 26px);
  font-family: "Times New Roman", "Noto Serif JP", serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(24px, 2vw, 32px);
  line-height: 1;
  letter-spacing: -0.02em;
  color: #C5CDD5;
}

.support__icon {
  width: min(100%, 240px);
  height: auto;
  margin: 6px auto 18px;
}

.support__title {
  font-family: var(--font-serif);
  font-size: clamp(17px, 1.3vw, 21px);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.04em;
  color: #17243A;
}

/* タイトル下の短い青い線 */
.support__title::after {
  content: '';
  display: block;
  width: 32px;
  height: 2px;
  margin-top: 14px;
  background: #6FA8DC;
}

.support__description {
  margin-top: 16px;
  font-size: clamp(12.5px, 0.95vw, 14px);
  color: var(--color-text-light);
  line-height: 1.9;
}

@media (max-width: 1023px) {
  .support__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .support__list {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    margin-top: 32px;
  }

  .support__description {
    font-size: 12.5px;
  }

  /* SP はイラストの占める割合が大きいため、色の始まりを少し下げる */
  .support__item {
    background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 38%, #F8FBFE 50%, #EFF6FC 72%, #E2EEF9 100%);
  }
}
</style>
