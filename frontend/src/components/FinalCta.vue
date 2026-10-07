<script setup>
// ページ下部のCTA：完成画像をそのまま表示（文字は画像内に含まれる）
defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="contact" class="final-cta">
    <component
      :is="content.link ? 'a' : 'div'"
      :href="content.link || undefined"
      class="final-cta__inner"
    >
      <picture class="final-cta__picture">
        <source media="(max-width: 767px)" :srcset="content.imageSp">
        <img
          :src="content.imagePc"
          :alt="content.alt"
          class="final-cta__image"
          loading="lazy"
        >
      </picture>
    </component>
  </section>
</template>

<style scoped>
.final-cta__inner {
  display: block;
}

.final-cta__image {
  width: 100%;
  max-width: none;
  height: auto;
  display: block;
}
</style>
