<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  content: { type: Object, required: true }
})

const isOpen = ref(false)
const close = () => { isOpen.value = false }

// メニューを開いている間は背面のスクロールを止める
watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

const onKeydown = (e) => { if (e.key === 'Escape') close() }
const onResize = () => { if (window.innerWidth > 1023) close() }

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header" :class="{ 'is-open': isOpen }">
    <div class="header__inner">
      <a href="#top" class="header__logo" @click="close">
        <img :src="content.logo.image" :alt="content.logo.alt" class="header__logo-image">
      </a>

      <nav id="global-nav" class="header__nav">
        <!-- SPメニュー専用の背景装飾（淡い図形＋ゆっくり漂う泡）。PC・タブレットでは非表示 -->
        <span class="header__menu-decor" aria-hidden="true">
          <span v-for="n in 6" :key="n" class="header__bubble" />
        </span>

        <ul class="header__list">
          <li
            v-for="(item, index) in content.navigation"
            :key="item.href"
            :style="{ '--i': index }"
          >
            <a :href="item.href" class="header__link" @click="close">{{ item.label }}</a>
          </li>
        </ul>
        <!-- 右端の見出し：リンクではない装飾テキスト -->
        <span class="header__catch">{{ content.cta.label }}</span>
      </nav>

      <button
        type="button"
        class="header__toggle"
        :aria-expanded="isOpen"
        aria-controls="global-nav"
        :aria-label="isOpen ? content.menuCloseLabel : content.menuOpenLabel"
        @click="isOpen = !isOpen"
      >
        <span class="header__toggle-bar" />
        <span class="header__toggle-bar" />
        <!-- SPのみ表示：アイコン（二本線／×）の下の小さなラベル -->
        <span class="header__toggle-label" aria-hidden="true">MENU</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  /* Footer と同じ「白 → ごく淡いブルー」。Footer より軽く、少しだけ透ける */
  background:
    radial-gradient(ellipse at 10% 0%, rgba(var(--glow-blue), 0.28), transparent 40%),
    radial-gradient(ellipse at 90% 100%, rgba(var(--glow-blue), 0.3), transparent 45%),
    linear-gradient(110deg, rgba(var(--surface-start), 0.96) 0%, rgba(var(--surface-mid), 0.95) 45%, rgba(var(--surface-end), 0.93) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(100, 150, 200, 0.1);
}

.header__inner {
  height: 100%;
  margin-inline: auto;
  padding-inline: var(--gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.header__logo {
  flex-shrink: 0;
  display: block;
}

.header__logo-image {
  display: block;
  width: auto;
  height: 22px;
  object-fit: contain;
}

/* 右側グループ：ナビ＋見出し（ロゴは左のまま） */
.header__nav {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: clamp(40px, 3.2vw, 60px); /* 「選考・面接」〜「まずは話を聞いてみる」 */
}

.header__list {
  display: flex;
  gap: clamp(28px, 2.2vw, 44px); /* ナビ同士 */
}

.header__link {
  position: relative;
  font-size: clamp(13px, 0.9vw, 14px);
  font-weight: 500;
  letter-spacing: 0.1em;
  white-space: nowrap;
  color: #1F2937;
}

/* ナビ：ホバーで細いブルーの線が左→右へ伸びる */
.header__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #7EBCFF, #A9D7FF);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.35s ease;
}

.header__link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* まずは話を聞いてみる：クリックできない小さな見出し
   ・ナビより少し太く・字間広め
   ・下に細いブルーの線＋その上を淡い光がゆっくり流れる
   ・ホバーの反応なし */
.header__catch {
  position: relative;
  display: inline-block;
  padding: 8px 0 10px;
  overflow: hidden;
  color: #172033;
  font-size: clamp(14px, 1vw, 15px);
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1.4;
  white-space: nowrap;
  cursor: default;
}

.header__catch::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 3px;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(80, 145, 205, 0.3), rgba(90, 170, 225, 0.75), rgba(80, 145, 205, 0.3));
}

.header__catch::before {
  content: '';
  position: absolute;
  z-index: 1;
  left: 0;
  bottom: 3px;
  width: 30%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100, 180, 235, 0.95), transparent);
  transform: translateX(-120%);
  animation: headerCatchLine 4s ease-in-out infinite;
}

@keyframes headerCatchLine {
  0% {
    transform: translateX(-120%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translateX(330%);
    opacity: 0;
  }
}

.header__toggle {
  display: none;
}

.header__toggle-label {
  display: none;
}

/* Tablet / SP：ハンバーガーメニュー */
/* PC：画面幅いっぱい（左右の余白はセクションと同じ） */
@media (min-width: 1024px) {
  .header__inner {
    width: 100%;
    padding-inline: var(--layout-pc-padding);
  }
}

/* PC：ロゴを小さくしてもナビの位置が動かないよう、ロゴ枠の幅を固定 */
@media (min-width: 1024px) {
  .header__logo {
    width: 149px;
  }
}

@media (max-width: 767px) {
  .header__logo-image {
    height: 18px;
  }
}

@media (max-width: 1023px) {
  .header__toggle {
    position: relative;
    display: block;
    width: 40px;
    height: 40px;
    margin-right: -8px;
    border: 0;
    background: none;
    cursor: pointer;
  }

  .header__toggle-bar {
    position: absolute;
    left: 10px;
    width: 20px;
    border-top: 1px solid var(--color-text);
    transition: transform 0.3s var(--ease);
  }

  .header__toggle-bar:first-child { top: 16px; }
  .header__toggle-bar:nth-child(2) { top: 23px; }

  .is-open .header__toggle-bar:first-child { transform: translateY(3.5px) rotate(30deg); }
  .is-open .header__toggle-bar:nth-child(2) { transform: translateY(-3.5px) rotate(-30deg); }

  .header__nav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    height: calc(100dvh - var(--header-height));
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 40px;
    padding: 32px var(--gutter) 48px;
    background:
      radial-gradient(600px 400px at 0% 0%, rgba(var(--glow-blue), 0.35), transparent 65%),
      linear-gradient(160deg, rgb(var(--surface-start)) 0%, rgb(var(--surface-mid)) 50%, rgb(var(--surface-end)) 100%);
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s var(--ease), visibility 0.3s;
  }

  .is-open .header__nav {
    opacity: 1;
    visibility: visible;
  }

  .header__list {
    flex-direction: column;
    gap: 0;
    margin: 0;
  }

  .header__list li {
    border-bottom: 1px solid var(--color-border);
  }

  .header__link {
    display: block;
    padding: 18px 0;
    font-size: 14px;
  }

  .header__link::after {
    display: none;
  }

  .header__catch {
    align-self: flex-start;
    font-size: 14px;
  }
}

/* SPメニュー用の装飾は、PC・タブレットでは表示しない */
.header__menu-decor {
  display: none;
}

/* ========================================
   SP（767px以下）：全画面メニュー
   白＋ごく淡いブルー／ナビ＋右矢印＋細線／見出し「まずは話を聞いてみる」／漂う泡
   ======================================== */
@media (max-width: 767px) {
  /* ロゴと×ボタンはメニューの上に表示 */
  .header__logo,
  .header__toggle {
    position: relative;
    z-index: 3;
  }

  /* 右上ボタン：アイコン（二本線／×）＋その下に「MENU」。開閉で同じボタンなので位置は動かない */
  .header__toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 44px;
    padding: 0 0 8px;
  }

  /* × ：細い線の45度クロス */
  .header__toggle-bar {
    left: 9px;
    width: 22px;
    border-top-color: #1F2A44;
  }

  .header__toggle-bar:first-child { top: 12px; }
  .header__toggle-bar:nth-child(2) { top: 19px; }

  .header__toggle-label {
    display: block;
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.16em;
    line-height: 1;
    margin-right: -0.16em; /* 字間分のずれを補正して中央に */
    color: rgba(25, 48, 76, 0.65);
  }

  .is-open .header__toggle-bar:first-child { transform: translateY(3.5px) rotate(45deg); }
  .is-open .header__toggle-bar:nth-child(2) { transform: translateY(-3.5px) rotate(-45deg); }

  .header__nav {
    z-index: 1;
    top: 0;
    height: 100dvh;
    min-height: 100dvh;
    gap: 0;
    padding: calc(var(--header-height) + 28px) clamp(24px, 6.5vw, 28px) 48px;
    overflow-x: hidden;
    background:
      radial-gradient(circle at 85% 5%, rgba(var(--glow-blue), 0.5), transparent 32%),
      radial-gradient(circle at 5% 70%, rgba(var(--glow-blue), 0.45), transparent 38%),
      linear-gradient(135deg, rgb(var(--surface-start)) 0%, rgb(var(--surface-mid)) 45%, rgb(var(--surface-end)) 100%);
    transform: translateY(-8px);
    transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
  }

  .is-open .header__nav {
    transform: translateY(0);
  }

  /* ---------- 背景装飾 ---------- */
  .header__menu-decor {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  /* 大きな淡い曲線（右上・左下） */
  .header__menu-decor::before,
  .header__menu-decor::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .header__menu-decor::before {
    top: -18%;
    right: -45%;
    width: 120%;
    aspect-ratio: 1.3;
    background: radial-gradient(ellipse at 40% 70%, rgba(var(--glow-blue), 0.45), rgba(var(--glow-blue), 0) 70%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.8);
  }

  .header__menu-decor::after {
    bottom: -22%;
    left: -40%;
    width: 130%;
    aspect-ratio: 1.4;
    background: radial-gradient(ellipse at 55% 30%, rgba(var(--glow-blue), 0.4), rgba(var(--glow-blue), 0) 70%);
    border-top: 1px solid rgba(255, 255, 255, 0.85);
  }

  /* 泡：大きさ・位置・速さを少しずつ変えて、ゆっくり漂う */
  .header__bubble {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.75), rgba(185, 225, 250, 0.25) 55%, rgba(155, 205, 240, 0.1) 100%);
    border: 1px solid rgba(150, 205, 240, 0.18);
    box-shadow: 0 8px 30px rgba(120, 180, 220, 0.08);
    opacity: 0.3;
    pointer-events: none;
    animation: bubbleFloat 12s ease-in-out infinite;
    will-change: transform, opacity;
  }

  .header__bubble:nth-child(1) { left: 6%;  bottom: 12%; width: 70px; height: 70px; animation-duration: 14s; }
  .header__bubble:nth-child(2) { right: 18%; top: 9%;   width: 24px; height: 24px; animation-duration: 10s; animation-delay: -3s; animation-direction: reverse; }
  .header__bubble:nth-child(3) { right: 6%;  top: 72%;  width: 50px; height: 50px; animation-duration: 12s; animation-delay: -6s; }
  .header__bubble:nth-child(4) { left: 38%;  top: 76%;  width: 28px; height: 28px; animation-duration: 9s;  animation-delay: -2s; animation-direction: reverse; }
  .header__bubble:nth-child(5) { left: 46%;  bottom: 5%; width: 46px; height: 46px; animation-duration: 13s; animation-delay: -8s; }
  .header__bubble:nth-child(6) { right: 22%; bottom: 18%; width: 36px; height: 36px; animation-duration: 11s; animation-delay: -5s; animation-direction: reverse; }

  @keyframes bubbleFloat {
    0% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 0.28;
    }
    35% {
      transform: translate3d(8px, -16px, 0) scale(1.04);
      opacity: 0.42;
    }
    70% {
      transform: translate3d(-5px, -28px, 0) scale(0.98);
      opacity: 0.32;
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 0.28;
    }
  }

  /* ---------- ナビ：文字＋右矢印＋細線 ---------- */
  .header__list {
    position: relative;
    z-index: 2;
  }

  .header__list li {
    border-bottom: 1px solid rgba(75, 105, 130, 0.16);
  }

  /* メニューを開いたとき、上から順にふわっと表示 */
  .is-open .header__list li {
    animation: mobileNavIn 0.4s ease both;
    animation-delay: calc(var(--i) * 50ms + 80ms);
  }

  @keyframes mobileNavIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: clamp(18px, 5vw, 24px) 0;
    font-size: clamp(17px, 4.6vw, 19px);
    font-weight: 500;
    letter-spacing: 0.08em;
    color: #1A2440;
    transition: color 0.25s ease;
  }

  /* 右側の細い「＞」 */
  .header__link::after {
    display: block;
    position: static;
    left: auto;
    bottom: auto;
    flex-shrink: 0;
    width: 9px;
    height: 9px;
    margin-right: 4px;
    margin-top: 2px;
    align-self: center;
    background: none;
    border-top: 1.5px solid currentColor;
    border-right: 1.5px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.25s ease;
  }

  /* タップ時：文字が少し青く、矢印が少し右へ */
  .header__link:active,
  .header__link:hover {
    color: #2B5FA8;
  }

  .header__link:active::after,
  .header__link:hover::after {
    transform: translateX(4px) rotate(45deg);
  }

  /* ---------- 見出し「まずは話を聞いてみる」（クリック不可） ---------- */
  .header__catch {
    position: relative;
    z-index: 2;
    align-self: flex-start;
    margin-top: clamp(34px, 8vw, 54px);
    padding: 0 0 14px;
    font-size: clamp(18px, 5vw, 24px);
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #173153;
  }

  /* 短いブルーの線（幅55%） */
  .header__catch::after {
    bottom: 0;
    width: 55%;
    background: linear-gradient(90deg, rgba(80, 145, 205, 0.75), rgba(120, 190, 235, 0.4), rgba(120, 190, 235, 0));
  }

  /* 線の上を淡い光が左→右へ流れる */
  .header__catch::before {
    bottom: 0;
    width: 22%;
    background: linear-gradient(90deg, transparent, rgba(80, 160, 220, 0.9), transparent);
    animation: mobileCatchSweep 3.6s ease-in-out infinite;
  }

  @keyframes mobileCatchSweep {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: translateX(250%);
      opacity: 0;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .header__catch::before {
    animation: none !important;
    opacity: 0;
  }

  .header__bubble,
  .is-open .header__list li {
    animation: none !important;
  }

  .header__nav,
  .header__link,
  .header__link::after {
    transition: none !important;
  }

  .header__link::after {
    transition: none;
  }
}
</style>
