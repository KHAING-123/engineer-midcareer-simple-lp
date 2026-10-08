<script setup>
// 各セクション共通の見出し（大きい番号・英語ラベル・タイトル・説明文・右側の英文メモ）
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { openingDone } from '../composables/openingState'

const props = defineProps({
  number: { type: String, required: true },
  englishTitle: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  sideNote: { type: String, default: '' },
  // true のとき「番号・ラベル・タイトル・説明」を横一列に並べる（07 FLOW 用）
  inline: { type: Boolean, default: false },
  // true のとき、画面に入ったら「番号 → 英字ラベル → タイトル」を1文字ずつ表示（01 MEMBERS 用・初回のみ）
  charReveal: { type: Boolean, default: false }
})

// ---------- 1文字ずつの表示 ----------
const STAGGER = 0.055 // 文字と文字の間隔（秒）
const GROUP_GAP = 0.12 // 番号 → ラベル → タイトルの間の小さな間（秒）

const toChars = (text) => [...text].map((c) => (c === ' ' ? '\u00a0' : c))
const numberChars = computed(() => toChars(props.number))
const labelChars = computed(() => toChars(props.englishTitle))
const titleLines = computed(() => props.title.split('\n').map(toChars))

const labelStart = computed(() => numberChars.value.length * STAGGER + GROUP_GAP)
const titleStart = computed(() => labelStart.value + labelChars.value.length * STAGGER + GROUP_GAP)
// タイトルは改行をまたいで通し番号で遅らせる
const titleOffsets = computed(() => {
  let n = 0
  return titleLines.value.map((line) => {
    const start = n
    n += line.length
    return start
  })
})
const delay = (start, i) => ({ '--hc-delay': `${(start + i * STAGGER).toFixed(3)}s` })

const root = ref(null)
const charsIn = ref(false)
let observer
let stopWatch
let fallbackTimer

const showChars = () => {
  charsIn.value = true
  observer?.disconnect() // 1回だけ
  clearTimeout(fallbackTimer)
}

// オープニングが終わってから監視を始める（オープニングの後ろで先に動いて見えなくなるのを防ぐ）
// すでに画面内にあれば、監視開始の直後に1回目の判定ですぐ再生される
const startObserving = async () => {
  await nextTick()
  if (!root.value || charsIn.value) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) showChars()
  }, { threshold: 0.2 })
  observer.observe(root.value)
}

onMounted(() => {
  if (!props.charReveal) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    charsIn.value = true
    return
  }
  if (openingDone.value) {
    startObserving()
    return
  }
  stopWatch = watch(openingDone, (done) => {
    if (!done) return
    stopWatch?.()
    startObserving()
  })
  // 念のため：オープニングが何らかの理由で完了を知らせなくても、文字が消えたままにならないように
  fallbackTimer = setTimeout(() => {
    if (!observer && !charsIn.value) startObserving()
  }, 6000)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  stopWatch?.()
  clearTimeout(fallbackTimer)
})
</script>

<template>
  <header
    ref="root"
    class="heading"
    :class="{ 'heading--inline': inline, 'heading--chars': charReveal, 'is-chars-in': charsIn }"
  >
    <!-- 1文字ずつ表示する場合：読み上げ用の文字は1つだけ（visually-hidden）、見た目の文字は aria-hidden -->
    <span v-if="charReveal" class="heading__number"><span class="visually-hidden">{{ number }}</span><span aria-hidden="true"><span v-for="(c, i) in numberChars" :key="i" class="heading__char" :style="delay(0, i)">{{ c }}</span></span></span>
    <span v-else class="heading__number">{{ number }}</span>
    <div class="heading__body">
      <p v-if="englishTitle && charReveal" class="heading__label"><span class="visually-hidden">{{ englishTitle }}</span><span aria-hidden="true"><span v-for="(c, i) in labelChars" :key="i" class="heading__char" :style="delay(labelStart, i)">{{ c }}</span></span></p>
      <p v-else-if="englishTitle" class="heading__label">{{ englishTitle }}</p>
      <h2 v-if="charReveal" class="heading__title"><span class="visually-hidden">{{ title }}</span><span aria-hidden="true"><template v-for="(line, l) in titleLines" :key="l"><br v-if="l > 0"><span v-for="(c, i) in line" :key="i" class="heading__char" :style="delay(titleStart + titleOffsets[l] * STAGGER, i)">{{ c }}</span></template></span></h2>
      <h2 v-else class="heading__title pre-line">{{ title }}</h2>
      <p v-if="description" class="heading__description pre-line">{{ description }}</p>
    </div>
    <p v-if="sideNote" class="heading__note pre-line" aria-hidden="true">{{ sideNote }}</p>
  </header>
</template>

<style scoped>
/* ---------- 1文字ずつの表示（charReveal のときだけ） ----------
   左から順に：透明 → 表示／12px 下 → 元の位置／ぼかし 3px → なし（レイアウトは動かない） */
.heading__char {
  display: inline-block;
  opacity: 0;
  transform: translateY(12px);
  filter: blur(3px);
  transition:
    opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--hc-delay, 0s),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--hc-delay, 0s),
    filter 0.5s ease-out var(--hc-delay, 0s);
}

.heading--chars.is-chars-in .heading__char {
  opacity: 1;
  transform: none;
  filter: none;
}

/* 01〜07 共通の見出し：[大きな番号] [英字ラベル／日本語タイトル] */
.heading {
  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: clamp(24px, 2.2vw, 32px);
  align-items: start;
}

/* 番号：細いセリフ体の斜体・ごく薄いグレー（主張しすぎない） */
.heading__number {
  margin-top: -0.12em; /* 数字の上端を英字ラベルの高さにそろえる */
  font-family: "Times New Roman", "Noto Serif JP", serif;
  font-size: clamp(52px, 5vw, 78px);
  font-style: italic;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.03em;
  color: #C5CDD5;
}

.heading__body {
  min-width: 0;
}

/* 英字ラベル：小さく・字間広め・薄いグレー */
.heading__label {
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  line-height: 1.2;
  color: #8D98A5;
}

/* 日本語タイトル：濃いネイビー・太すぎない */
.heading__title {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(24px, 2.1vw, 32px);
  line-height: 1.4;
  letter-spacing: 0.06em;
  color: #17243A;
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
    font-size: clamp(42px, 12vw, 50px);
  }

  .heading__label {
    margin-bottom: 8px;
    font-size: 10px;
  }

  .heading__title {
    font-size: clamp(21px, 5.8vw, 24px);
  }

}

@media (prefers-reduced-motion: reduce) {
  .heading__char {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
</style>
