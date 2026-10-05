// スクロールして要素が画面に入ったら、ふわっと表示する（v-reveal）
// 動きを減らす設定（prefers-reduced-motion）の場合はアニメーションなしで表示

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          el.classList.add('is-visible')
          observer.unobserve(el)
          // 表示が終わったらクラスを外し、ホバーの動きに遅延が残らないようにする
          const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0
          setTimeout(() => el.classList.remove('reveal', 'is-visible'), (delay + 0.8) * 1000)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    )
  }
  return observer
}

export const reveal = {
  mounted(el) {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return
    el.classList.add('reveal')
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  }
}
