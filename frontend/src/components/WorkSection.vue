<script setup>
import SectionHeading from './SectionHeading.vue'

defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="work" class="section work">
    <div class="container">
      <SectionHeading
        v-reveal
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
        :side-note="content.sideNote"
      />

      <ul class="work__list">
        <li
          v-for="(item, index) in content.items"
          :key="item.title"
          v-reveal
          class="work__card card-lift"
          :style="{ '--reveal-delay': `${index * 0.1}s` }"
        >
          <div class="work__media img-zoom">
            <img :src="item.image" :alt="item.alt" class="work__image" loading="lazy">
          </div>
          <div class="work__body">
            <h3 class="work__title">{{ item.title }}</h3>
            <p class="work__description">{{ item.description }}</p>
            <ul class="work__tags">
              <li v-for="tag in item.tags" :key="tag" class="work__tag">{{ tag }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.work__list {
  display: grid;
  /* カード1枚：最小260px〜最大800px */
  grid-template-columns: repeat(3, minmax(260px, 800px));
  justify-content: space-between;
  gap: var(--grid-gap);
  margin-top: 40px;
}

.work__card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.work__media {
  aspect-ratio: 3 / 1;
  background: var(--color-border);
}

.work__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 26px;
}

.work__title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.work__description {
  margin-top: 10px;
  font-size: 12.5px;
  color: var(--color-text-light);
  line-height: 1.9;
}

.work__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 20px;
}

.work__tag {
  padding: 3px 12px;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  background: var(--color-bg);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  line-height: 1.6;
}

@media (max-width: 1023px) {
  .work__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .work__list {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 32px;
  }

  .work__media {
    aspect-ratio: 5 / 2;
  }

  .work__body {
    padding: 20px 20px 24px;
  }
}
</style>
