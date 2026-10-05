<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: { type: Object, required: true }
})

// 住所データ（mapQuery）から Google マップの検索URLを生成
const googleMapsUrl = computed(() =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.content.address.mapQuery)}`
)

const textLinks = computed(() => [props.content.links.terms, props.content.links.privacy])
</script>

<template>
  <footer class="footer">
    <!-- 背景のやわらかい波（装飾・クリックの邪魔をしない） -->
    <span class="footer__wave footer__wave--left" aria-hidden="true" />
    <span class="footer__wave footer__wave--right" aria-hidden="true" />

    <div class="footer__inner">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="#top" class="footer__logo">
            <img :src="content.logo.image" :alt="content.logo.alt" class="footer__logo-image">
          </a>

          <a
            :href="googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__address"
            aria-label="Google Mapsで会社所在地を見る"
          >
            <svg class="footer__pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 21.5s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            <span class="footer__address-text">
              <span class="footer__address-line">{{ content.address.postalCode }}</span>
              <span class="footer__address-line">
                {{ content.address.line1 }}<span class="footer__address-sub">{{ content.address.line2 }}</span>
              </span>
            </span>
          </a>
        </div>

        <div class="footer__actions">
          <span class="footer__divider" aria-hidden="true" />

          <ul class="footer__links">
            <li v-for="link in textLinks" :key="link.label">
              <a v-if="link.url" :href="link.url" class="footer__link">{{ link.label }}</a>
              <span v-else class="footer__link">{{ link.label }}</span>
            </li>
          </ul>

          <!-- 会社サイトへ（URLは lpContent.js の footer.links.corporate.url で設定） -->
          <a
            :href="content.links.corporate.url || undefined"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__button"
            aria-label="PREAI会社サイトを開く"
          >
            <svg class="footer__button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M19 13.5V19a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19V7a1.5 1.5 0 0 1 1.5-1.5H11" />
              <path d="M15 3.5h5.5V9M20.5 3.5L11 13" />
            </svg>
            <!-- 文字だけが縦方向にループするアニメーション（アイコン・矢印は動かない） -->
            <span class="footer__button-label company-link__text-window">
              <span class="company-link__text company-link__text--current">{{ content.links.corporate.label }}</span>
              <span class="company-link__text company-link__text--next" aria-hidden="true">{{ content.links.corporate.label }}</span>
            </span>
            <svg class="footer__button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>

      <p v-if="content.copyright" class="footer__copyright">{{ content.copyright }}</p>
    </div>
  </footer>
</template>

<style scoped>
/* ========================================
   Footer：白〜淡いブルーのライトデザイン
   ======================================== */
.footer {
  --footer-ink: #1F2A44;          /* 文字（濃いネイビーグレー） */
  --footer-ink-sub: rgba(30, 45, 65, 0.72);
  --footer-accent: #2B4C9B;       /* アイコン（PREAIブルー） */
  --footer-line: rgba(30, 50, 80, 0.16);

  position: relative;
  width: 100%;
  max-width: none;
  overflow: hidden;
  isolation: isolate;
  color: var(--footer-ink);
  /* LP全体と同じ「白＋ごく淡いブルー」。上端の細い線で区切る */
  background:
    radial-gradient(ellipse at 8% 0%, rgba(var(--glow-blue), 0.32), transparent 45%),
    radial-gradient(ellipse at 92% 85%, rgba(var(--glow-blue), 0.38), transparent 52%),
    linear-gradient(135deg, rgb(var(--surface-start)) 0%, rgb(var(--surface-mid)) 42%, rgb(var(--surface-end)) 100%);
  border-top: 1px solid rgba(30, 60, 100, 0.06);
}

/* 下部のやわらかい波（ごく薄いブルー＋白い光のライン） */
.footer__wave {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  pointer-events: none;
}

.footer__wave--left {
  left: -12%;
  bottom: -98%;
  width: 72%;
  height: 130%;
  background: linear-gradient(135deg, rgba(205, 233, 255, 0.32), rgba(240, 249, 255, 0.06));
  border-top: 1px solid rgba(255, 255, 255, 0.85);
  transform: rotate(7deg);
}

.footer__wave--right {
  right: -16%;
  bottom: -90%;
  width: 74%;
  height: 120%;
  background: linear-gradient(135deg, rgba(232, 245, 255, 0.1), rgba(196, 228, 255, 0.3));
  border-top: 1px solid rgba(255, 255, 255, 0.9);
  transform: rotate(-9deg);
}

.footer__inner {
  width: 100%;
  padding-inline: var(--layout-pc-padding);
  padding-block: clamp(34px, 3.5vw, 56px) clamp(24px, 3vw, 42px);
}

/* 上段：ロゴ・住所 ｜ リンク ／ 会社サイト */
.footer__top {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer__brand {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: clamp(340px, 40%, 760px);
  min-width: 0;
}

.footer__logo {
  display: inline-block;
  transition: opacity 0.25s ease;
}

.footer__logo:hover {
  opacity: 0.75;
}

/* ヘッダーと同じロゴ画像。白い下地を背景になじませる */
.footer__logo-image {
  display: block;
  width: clamp(120px, 9vw, 155px);
  height: auto;
  mix-blend-mode: multiply;
}

/* 住所（全体が Google マップへのリンク） */
.footer__address {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: 0.04em;
  color: var(--footer-ink);
  cursor: pointer;
  transition: opacity 0.25s ease;
}

.footer__pin {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  color: var(--footer-accent);
  transition: transform 0.25s ease;
}

.footer__address:hover {
  opacity: 0.75;
}

.footer__address:hover .footer__pin {
  transform: translateY(-2px);
}

.footer__address-line {
  display: block;
}

.footer__address-sub {
  margin-left: 0.3em;
}

/* 右側：細い縦線 ｜ 利用規約・プライバシーポリシー ／ 会社サイトへ */
.footer__actions {
  flex: 1;
  display: flex;
  align-items: center;
  gap: clamp(24px, 3vw, 48px);
  min-width: 0;
}

.footer__divider {
  flex-shrink: 0;
  width: 1px;
  height: 52px;
  background: var(--footer-line);
}

.footer__links {
  display: flex;
  align-items: center;
}

.footer__links li + li {
  margin-left: 22px;
  padding-left: 22px;
  border-left: 1px solid var(--footer-line);
}

.footer__link {
  display: block;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.04em;
  color: #263447;
  white-space: nowrap;
}

a.footer__link {
  transition: opacity 0.25s ease;
}

a.footer__link:hover {
  opacity: 0.65;
}

/* 会社サイトへ：白〜淡いブルーのピル型ボタン（ボタン全体がリンク） */
.footer__button {
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-width: 190px;
  min-height: 52px;
  margin-left: auto;
  padding: 12px 22px;
  border: 1px solid rgba(50, 95, 155, 0.28);
  border-radius: 999px;
  color: #17243D;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 248, 255, 0.92) 50%, rgba(225, 240, 255, 0.82) 100%);
  box-shadow: 0 8px 24px rgba(65, 110, 165, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.06em;
  line-height: 1.4;
  white-space: nowrap;
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease;
}

/* ホバー時に左上→右下へ通る、ごく淡い光 */
.footer__button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 35%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent);
  transform: rotate(18deg) translateX(-200%);
  pointer-events: none;
}

/* アイコン・文字・矢印は光の上に表示 */
.footer__button-icon,
.footer__button-label,
.footer__button-arrow {
  position: relative;
  z-index: 1;
}

a.footer__button[href] {
  cursor: pointer;
}

a.footer__button[href]:hover {
  transform: translateY(-2px);
  border-color: rgba(65, 115, 210, 0.55);
  box-shadow: 0 12px 30px rgba(65, 110, 180, 0.16), 0 0 20px rgba(90, 145, 235, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

a.footer__button[href]:hover::before {
  animation: companyButtonSweep 0.9s ease forwards;
}

a.footer__button:focus-visible {
  outline: 2px solid rgba(55, 105, 200, 0.55);
  outline-offset: 3px;
}

@keyframes companyButtonSweep {
  from {
    transform: rotate(18deg) translateX(-200%);
  }
  to {
    transform: rotate(18deg) translateX(600%);
  }
}

.footer__button-icon,
.footer__button-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.35s ease;
}

.footer__button-icon {
  color: var(--footer-accent);
}

/* ホバー時だけ：矢印は右へ4px、外部リンクアイコンは右上へ1px */
a.footer__button[href]:hover .footer__button-arrow {
  transform: translateX(4px);
}

a.footer__button[href]:hover .footer__button-icon {
  transform: translate(1px, -1px);
}

/* ===== 「会社サイトへ」文字だけの縦ループ =====
   current：表示中 → 下へ消える
   next   ：上から入ってきて中央で止まる
   ループの切り替わり時は、同じ位置・同じ文字が入れ替わるだけなので継ぎ目は見えない */
.company-link__text-window {
  position: relative;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
}

.company-link__text {
  display: block;
  animation-duration: 3.6s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.company-link__text--current {
  animation-name: companyTextCurrent;
}

.company-link__text--next {
  position: absolute;
  top: 0;
  left: 0;
  animation-name: companyTextNext;
}

@keyframes companyTextCurrent {
  0%, 50% {
    transform: translateY(0);
    opacity: 1;
  }
  66%, 100% {
    transform: translateY(110%);
    opacity: 0;
  }
}

@keyframes companyTextNext {
  0%, 57% {
    transform: translateY(-110%);
    opacity: 0;
  }
  75%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 下段：コピーライト（左下） */
.footer__copyright {
  margin-top: clamp(20px, 2vw, 32px);
  font-size: clamp(11px, 0.8vw, 13px);
  letter-spacing: 0.06em;
  color: var(--footer-ink-sub);
}

/* PC（狭め）：住所の建物名を改行 */
@media (max-width: 1359px) {
  .footer__address-sub {
    display: block;
    margin-left: 0;
  }
}

/* Tablet：ロゴ・住所 ／ リンク・会社サイト の2段 */
@media (max-width: 1023px) {
  .footer__top {
    flex-wrap: wrap;
    row-gap: 16px;
  }

  .footer__brand {
    width: 100%;
  }

  .footer__divider {
    display: none;
  }

  .footer__actions {
    flex-basis: 100%;
  }
}

/* SP：縦並び */
@media (max-width: 767px) {
  .footer__wave--left {
    left: -40%;
    bottom: -40%;
    width: 140%;
    height: 60%;
  }

  .footer__wave--right {
    right: -50%;
    bottom: -36%;
    width: 140%;
    height: 55%;
  }

  .footer__inner {
    padding-block: 40px 28px;
  }

  .footer__top {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 20px;
  }

  .footer__logo-image {
    width: 120px;
  }

  .footer__address {
    align-items: flex-start;
    gap: 10px;
    margin-top: 18px;
    font-size: 13.5px;
    line-height: 1.8;
  }

  .footer__pin {
    width: 20px;
    height: 20px;
    margin-top: 2px;
  }

  .footer__actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }

  .footer__links {
    flex-wrap: wrap;
    row-gap: 8px;
  }

  .footer__button {
    min-width: 170px;
    min-height: 48px;
    padding: 11px 18px;
    margin-left: 0;
  }

  .footer__copyright {
    margin-top: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer__address:hover .footer__pin,
  a.footer__button[href]:hover,
  a.footer__button[href]:hover .footer__button-arrow,
  a.footer__button[href]:hover .footer__button-icon {
    transform: none;
  }

  a.footer__button[href]:hover::before {
    animation: none;
  }

  .company-link__text {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }

  .company-link__text--next {
    display: none;
  }
}
</style>
