<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import AiNetworkBackground from './common/AiNetworkBackground.vue'

const props = defineProps({
  content: { type: Object, required: true }
})

// 「まずは話を聞いてみる」の「話」「聞」だけブルーのグラデーションにするため、文字列を分ける
const catchParts = computed(() =>
  props.content.cta.label.split(/([話聞])/).filter(Boolean).map((text) => ({
    text,
    accent: text === '話' || text === '聞'
  }))
)

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
    <!-- ヘッダー背景のさりげない星座 / AI Network（ロゴ・ナビの後ろは避け、余白だけ。クリックを妨げない） -->
    <AiNetworkBackground variant="header" />
    <div class="header__inner">
      <a href="#top" class="header__logo" @click="close">
        <img :src="content.logo.image" :alt="content.logo.alt" class="header__logo-image">
      </a>

      <nav id="global-nav" class="header__nav">
        <!-- SPメニュー専用の背景装飾：LP 01〜07 と同じ「星座 / AI Network」（右上・左端・下部の余白）。PC・タブレットでは非表示 -->
        <span class="header__menu-decor" aria-hidden="true">
          <AiNetworkBackground variant="menu" />
        </span>

        <ul class="header__list">
          <li
            v-for="(item, index) in content.navigation"
            :key="item.href"
            :style="{ '--i': index }"
          >
            <a :href="item.href" class="header__link" @click="close">
              <!-- 小さな英文字：PC は日本語の上、SP は日本語の右（読み上げは日本語だけ） -->
              <span class="header__link-text">
                <span v-if="item.en" class="header__link-en" aria-hidden="true">{{ item.en }}</span>
                <span class="header__link-ja">{{ item.label }}</span>
              </span>
            </a>
          </li>
        </ul>
        <!-- 右端の見出し：リンクではない装飾テキスト -->
        <span class="header__cta">
          <!-- 2つ重なった吹き出し（後ろ：淡い水色＋白い点／手前：ブルーの線＋青い点）。ゆっくり拡大縮小・点が順に点灯 -->
          <svg class="header__cta-icon" viewBox="0 0 40 34" aria-hidden="true">
            <g class="hc-bubble hc-bubble--back">
              <path class="hc-back" d="M16 21 C16 15.5 21 12 27 12 C33 12 38 15.5 38 21 C38 24.6 35.8 27.4 32.6 28.7 L34.5 33 L29 29.7 C28.4 29.8 27.7 29.8 27 29.8 C21 29.8 16 26.3 16 21 Z" />
              <circle class="hc-dot hc-dot--light" cx="22.5" cy="21" r="1.35" />
              <circle class="hc-dot hc-dot--light" cx="27" cy="21" r="1.35" />
              <circle class="hc-dot hc-dot--light" cx="31.5" cy="21" r="1.35" />
            </g>
            <g class="hc-bubble hc-bubble--front">
              <path class="hc-front" d="M2 12 C2 6.5 7.5 2.5 14 2.5 C20.5 2.5 26 6.5 26 12 C26 17.5 20.5 21.5 14 21.5 C12.6 21.5 11.3 21.3 10 21 L4.5 25 L5.6 19.2 C3.3 17.5 2 15 2 12 Z" />
              <circle class="hc-dot" cx="9.5" cy="12" r="1.45" />
              <circle class="hc-dot" cx="14" cy="12" r="1.45" />
              <circle class="hc-dot" cx="18.5" cy="12" r="1.45" />
            </g>
          </svg>
          <span class="header__cta-body">
            <span v-if="content.cta.en" class="header__link-en header__cta-en" aria-hidden="true">{{ content.cta.en }}</span>
            <!-- 文字＋下線（下線とそのアニメーションは既存のまま） -->
            <span class="header__catch"><template v-for="(part, i) in catchParts" :key="i"><span v-if="part.accent" class="header__catch-accent">{{ part.text }}</span><template v-else>{{ part.text }}</template></template></span>
          </span>
        </span>
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

/* ---------- 小さな英文字（PC：日本語の上） ---------- */
.header__link-text {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.header__link-en {
  display: block;
  font-family: var(--font-sans);
  font-size: 9.5px;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: 0.18em;
  color: #8A9AB0;
  white-space: nowrap;
}

/* まずは話を聞いてみる：英文字の下に日本語（下線は日本語の部分だけ） */
.header__cta-body {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.header__cta-en {
  margin-bottom: -4px; /* 日本語の上の余白（8px）と合わせて 4px 程度の間隔に */
}

/* まずは話を聞いてみる：テキスト型のCTA（ボタンにはしない）
   ・下にごく薄い線（常時）＋その上を淡いブルーの線が左→右へゆっくり伸びて消える（5.2秒で繰り返し）
   ・PCでマウスを乗せると、文字が2px上がり字間が少し広がり、線が少しはっきりする */
.header__catch {
  --catch-ease: cubic-bezier(0.22, 1, 0.36, 1);

  position: relative;
  display: inline-block;
  padding: 8px 0 10px;
  color: #102A46;
  font-family: var(--font-serif); /* 落ち着いた明朝体 */
  font-size: clamp(14px, 1vw, 16px);
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1.4;
  white-space: nowrap;
  cursor: default;
  transition:
    transform 0.35s var(--catch-ease),
    letter-spacing 0.35s ease,
    margin 0.35s ease,
    color 0.35s ease,
    opacity 0.35s ease;
}

.header__catch::before,
.header__catch::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 3px;
  width: 100%;
  height: 1px;
  pointer-events: none;
}

/* 常に見えている、ごく薄い下線 */
.header__catch::before {
  background: rgba(110, 165, 215, 0.2);
  transition: background-color 0.35s ease;
}

/* 左→右へ伸びる淡いブルーの下線 */
.header__catch::after {
  background: linear-gradient(90deg, transparent, rgba(90, 160, 220, 0.55), rgba(130, 195, 235, 0.9), transparent);
  transform: scaleX(0);
  transform-origin: left center;
  animation: headerCatchReveal 5.2s var(--catch-ease) infinite;
  transition: height 0.35s ease;
}

@keyframes headerCatchReveal {
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  55% {
    transform: scaleX(1);
    opacity: 1;
  }
  80% {
    transform: scaleX(1);
    opacity: 0.7;
  }
  100% {
    transform: scaleX(1);
    opacity: 0;
  }
}

/* PCのホバー：少し上へ・字間を少し広げる（広がった分は左の余白で吸収し、ナビの位置は動かさない） */
@media (hover: hover) {
  .header__catch:hover {
    transform: translateY(-2px);
    letter-spacing: 0.15em;
    margin-left: -0.3em; /* 10文字 × 0.03em */
    color: #0E1A31;
  }

  .header__catch:hover::before {
    background-color: rgba(110, 165, 215, 0.42);
  }

  .header__catch:hover::after {
    height: 1.5px;
  }
}

/* 「話」「聞」：上品なブルーのグラデーション（少しだけ大きく） */
.header__catch-accent {
  font-size: 1.1em;
  background: linear-gradient(180deg, #2E7FE0 0%, #6BB1F0 55%, #2F86E6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* アイコン＋文字（下線は文字の部分だけ） */
.header__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.header__cta-icon {
  flex-shrink: 0;
  width: clamp(28px, 2vw, 32px);
  height: auto;
  margin-bottom: 2px;
  overflow: visible;
}

.header__cta-icon * {
  transform-box: fill-box;
  transform-origin: center;
}

.hc-back {
  fill: #CFE4F8;
}

.hc-front {
  fill: #FFFFFF;
  stroke: #3B8EE8;
  stroke-width: 1.8;
  stroke-linejoin: round;
}

.hc-dot {
  fill: #3B8EE8;
}

.hc-dot--light {
  fill: #FFFFFF;
}

/* A：2つの吹き出しが、少しずつずれてゆっくり拡大・縮小 */
.hc-bubble {
  animation: hcBubble 3.6s ease-in-out infinite;
}

.hc-bubble--back {
  transform-origin: 70% 60%;
  animation-delay: -1.8s;
}

@keyframes hcBubble {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

/* B：3つの点が左から順に、淡く点灯（会話中のように） */
.hc-dot {
  animation: hcDot 1.8s ease-in-out infinite;
}

.hc-bubble .hc-dot:nth-of-type(2) { animation-delay: 0.25s; }
.hc-bubble .hc-dot:nth-of-type(3) { animation-delay: 0.5s; }
.hc-bubble--back .hc-dot { animation-delay: 0.9s; }
.hc-bubble--back .hc-dot:nth-of-type(2) { animation-delay: 1.15s; }
.hc-bubble--back .hc-dot:nth-of-type(3) { animation-delay: 1.4s; }

@keyframes hcDot {
  0%, 60%, 100% { opacity: 0.4; transform: scale(0.85); }
  30% { opacity: 1; transform: scale(1.1); }
}

/* リンクにした場合のキーボード操作用（現在はクリックできない文字のため通常は表示されない） */
.header__catch:focus-visible {
  outline: 1px solid rgba(80, 140, 200, 0.6);
  outline-offset: 5px;
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

/* PC：英文字＋日本語の2段になったナビと「まずは話を聞いてみる」の高さをそろえる（ヘッダーの高さは 60px のまま） */
@media (min-width: 1024px) {
  /* リンクの枠を2段全体に（ホバーの下線が日本語の下に出るように） */
  .header__link {
    display: inline-block;
  }

  .header__list {
    position: relative;
    top: -4px;
  }

  .header__cta {
    position: relative;
    top: 6px;
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

  .header__cta {
    align-self: flex-start;
  }

  .header__catch {
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
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    line-height: 1;
    text-transform: uppercase;
    margin-right: -0.18em; /* 字間分のずれを補正して中央に */
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
    /* 白 → ごく淡いブルー（濃くしない） */
    background: linear-gradient(165deg, #FFFFFF 0%, #F7FBFF 50%, #EEF7FF 100%);
    transform: translateY(-8px);
    transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s;
  }

  .is-open .header__nav {
    transform: translateY(0);
  }

  /* ---------- 背景装飾（星座 / AI Network） ---------- */
  .header__menu-decor {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  /* ---------- ナビ：文字＋右矢印＋細線 ---------- */
  .header__list {
    position: relative;
    z-index: 2;
  }

  /* 区切り線：左から右へごく薄くなる 1px の線 */
  .header__list li {
    border-bottom: 0;
    background: linear-gradient(90deg, rgba(50, 100, 150, 0.16), rgba(50, 100, 150, 0.06)) left bottom / 100% 1px no-repeat;
  }

  /* メニューを開いたとき、上から順にふわっと表示（バウンドなし） */
  .is-open .header__list li {
    animation: mobileNavIn 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(var(--i) * 60ms + 80ms);
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
    font-size: clamp(15px, 4.2vw, 17px);
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.06em;
    color: #102A46;
    transition: color 0.25s ease;
  }

  /* 日本語の右に小さな英文字（矢印とは重ならない） */
  .header__link-text {
    flex-direction: row;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 2px 10px;
    min-width: 0;
  }

  .header__link-ja {
    order: 1;
  }

  .header__link-en {
    order: 2;
    font-size: 10.5px;
    letter-spacing: 0.14em;
    color: #8FA6BF;
  }

  /* 右側の細く小さい「＞」（thin chevron） */
  .header__link::after {
    display: block;
    position: static;
    left: auto;
    bottom: auto;
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    margin-right: 4px;
    margin-top: 1px;
    align-self: center;
    background: none;
    border-top: 1.2px solid #173451;
    border-right: 1.2px solid #173451;
    transform: rotate(45deg);
    transition: transform 0.25s ease, border-color 0.25s ease;
  }

  /* タップ時：文字と矢印が少し青く、矢印が少し右へ */
  .header__link:active,
  .header__link:hover {
    color: #1676D2;
  }

  .header__link:active::after,
  .header__link:hover::after {
    border-color: #1680DC;
    transform: translateX(2px) rotate(45deg);
  }

  /* ---------- 見出し「まずは話を聞いてみる」（クリック不可） ---------- */
  .header__cta {
    position: relative;
    z-index: 2;
    align-self: stretch; /* 横幅いっぱい使い、入る幅なら英文字を同じ行に */
    margin-top: clamp(34px, 8vw, 54px);
    gap: 10px;
  }

  .header__cta-icon {
    width: 26px;
    margin-bottom: 14px; /* 文字の下の余白（下線ぶん）とそろえて、文字の高さの中央に */
  }

  /* まずは話を聞いてみる：日本語の右に英文字（狭い画面では下へ回り込む） */
  .header__cta-body {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: 10px;
    min-width: 0;
  }

  .header__cta-en {
    order: 2;
    margin-bottom: 0;
  }

  .header__catch {
    position: relative;
    z-index: 2;
    padding: 0 0 14px;
    font-size: clamp(15px, 4.2vw, 17px);
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #102A46;
  }

  /* 短い下線：ごく薄い線＋メニューを開いたとき左→右へ伸びるブルーの線（約100px） */
  .header__catch::before,
  .header__catch::after {
    bottom: 0;
    width: 100px;
  }

  .header__catch::after {
    height: 1.5px;
    background: linear-gradient(90deg, #1687DB, rgba(80, 180, 225, 0.35));
    opacity: 1;
    transform: scaleX(0);
    animation: none;
    transition: transform 0s;
  }

  .is-open .header__catch::after {
    transform: scaleX(1);
    transition: transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 420ms;
  }
}

@media (prefers-reduced-motion: reduce) {
  /* 下線は止めて、細い線として表示したまま */
  .header__catch::after {
    animation: none !important;
    transform: scaleX(1);
    opacity: 1;
  }

  .header__catch,
  .header__catch::before,
  .header__catch::after {
    transition: none !important;
  }

  .header__catch:hover {
    transform: none !important;
    letter-spacing: 0.12em !important;
    margin-left: 0 !important;
  }

  .is-open .header__list li,
  .hc-bubble,
  .hc-dot {
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
