<script>
// 全ての区切り線で1つの IntersectionObserver を共有（スクロールイベントは使わない）
let observer

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target) // 一度表示したらそのまま
        })
      },
      // 画面の下端から15%ほど入ったところで開始
      { threshold: 0.2, rootMargin: '0px 0px -15% 0px' }
    )
  }
  return observer
}
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// offset：線を置く位置（境目から下へ、セクション余白に対する割合）。Hero→01 の余白の中央に置くために使う
const props = defineProps({
  offset: { type: Number, default: 0 }
})

const line = ref(null)

onMounted(() => {
  const el = line.value
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    el.classList.add('is-visible')
    return
  }
  getObserver().observe(el)
})

onBeforeUnmount(() => {
  if (line.value) observer?.unobserve(line.value)
})
</script>

<template>
  <!-- 高さ0の箱：レイアウトを一切動かさず、線だけを境目に重ねる -->
  <div class="section-divider" aria-hidden="true" :style="{ '--divider-offset': props.offset }">
    <span ref="line" class="section-divider__line" />
  </div>
</template>

<style scoped>
.section-divider {
  position: relative;
  z-index: 1;
  height: 0;
  pointer-events: none;
}

.section-divider__line {
  position: absolute;
  left: var(--layout-pc-padding);
  right: var(--layout-pc-padding);
  top: calc(var(--section-space) * var(--divider-offset));
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(105, 145, 175, 0.3) 0%,
    rgba(145, 180, 205, 0.2) 70%,
    rgba(145, 180, 205, 0.05) 100%
  );
  transform: scaleX(0);
  transform-origin: left center;
  opacity: 0;
  transition:
    transform 1.1s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.5s ease;
}

/* 画面に入ったら左→右へ伸びる */
.section-divider__line.is-visible {
  transform: scaleX(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .section-divider__line {
    transform: scaleX(1) !important;
    opacity: 1 !important;
    transition: none !important;
    animation: none !important;
  }
}
</style>
