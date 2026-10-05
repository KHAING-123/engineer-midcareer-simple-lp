<script setup>
import SectionHeading from './SectionHeading.vue'

defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="career" class="section career">
    <div class="container">
      <SectionHeading
        v-reveal
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
        :side-note="content.sideNote"
      />

      <ul class="career__list">
        <li
          v-for="(item, index) in content.items"
          :key="item.title"
          v-reveal
          class="career__item card-lift"
          :style="{ '--reveal-delay': `${index * 0.08}s` }"
        >
          <img :src="item.icon" alt="" class="career__icon" width="36" height="36">
          <h3 class="career__title">{{ item.title }}</h3>
          <p class="career__description pre-line">{{ item.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.career__list {
  display: grid;
  /* カード1枚：最小160px〜最大420px */
  grid-template-columns: repeat(5, minmax(160px, 420px));
  justify-content: space-between;
  gap: clamp(14px, 1.5vw, 32px);
  margin-top: 40px;
}

.career__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 14px 26px;
  background: var(--color-bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  text-align: center;
}

.career__icon {
  width: var(--icon-md);
  height: var(--icon-md);
}

.career__title {
  margin-top: 16px;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.career__description {
  margin-top: 6px;
  font-size: 11px;
  color: var(--color-text-light);
  line-height: 1.8;
}

@media (max-width: 1023px) {
  .career__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .career__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 32px;
  }

}

@media (max-width: 374px) {
  .career__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
