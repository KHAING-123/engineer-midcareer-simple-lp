<script setup>
// ファーストビュー：完成画像をそのまま表示（文字は画像内に含まれる）
defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="top" class="hero">
    <h1 class="visually-hidden">{{ content.alt }}</h1>
    <picture class="hero__picture">
      <source media="(max-width: 767px)" :srcset="content.imageSp">
      <img
        :src="content.imagePc"
        :alt="content.alt"
        class="hero__image"
        fetchpriority="high"
      >
    </picture>
  </section>
</template>

<style scoped>
.hero {
  width: 100%;
}

.hero__picture {
  display: block;
}

.hero__image {
  width: 100%;
  max-width: none;
  height: auto;
  display: block;
}
</style>
