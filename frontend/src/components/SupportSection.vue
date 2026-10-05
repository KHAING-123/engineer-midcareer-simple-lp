<script setup>
import SectionHeading from './SectionHeading.vue'

defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="support" class="section support">
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
          <img :src="item.icon" alt="" class="support__icon" width="36" height="36">
          <div>
            <h3 class="support__title">{{ item.title }}</h3>
            <p class="support__description">{{ item.description }}</p>
          </div>
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

.support__item {
  display: grid;
  grid-template-columns: var(--icon-md) 1fr;
  gap: 16px;
  align-items: start;
  padding: 24px 20px;
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.support__icon {
  width: var(--icon-md);
  height: var(--icon-md);
  margin-top: 4px;
}

.support__title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.support__description {
  margin-top: 6px;
  font-size: 11.5px;
  color: var(--color-text-light);
  line-height: 1.85;
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
}
</style>
