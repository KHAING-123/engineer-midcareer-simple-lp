<script setup>
// オープニング：PREAI ロゴ＋英語メッセージ → 右下の角が少しめくれ → アイボリーの紙が左端を軸にめくれて（1.2秒）Hero が現れる
// ・同じタブでは1回だけ（sessionStorage）。新しいタブでは再生
// ・クリック／タップ／キー操作でスキップ
// ・動きを減らす設定では表示しない（すぐに LP）
// ・終わったら openingDone を true に（01 の文字アニメーションはその後に開始）
// ・JS が途中で止まっても、CSS の最後のキーフレームで非表示になり LP は操作できる
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AiNetworkBackground from './common/AiNetworkBackground.vue'
import { markOpeningDone } from '../composables/openingState'

defineProps({
  logo: { type: Object, required: true } // { image, alt }（ヘッダーと同じロゴ）
})

const STORAGE_KEY = 'preai-opening-played'
const DURATION = 3300 // 通常（ms）。CSS の openingEnd（3.25s）と合わせる

const played = (() => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false // 保存できない環境では毎回再生（終了後は通常どおり LP を表示）
  }
})()

const reduceMotion = (() => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
})()

const visible = ref(!played && !reduceMotion)
// 再生しない場合は、最初から「オープニング完了」
if (!visible.value) markOpeningDone()
const skipping = ref(false)
let timer
let skipTimer

const unlockScroll = () => {
  document.documentElement.style.overflow = ''
}

const finish = () => {
  clearTimeout(timer)
  clearTimeout(skipTimer)
  window.removeEventListener('keydown', onKey)
  unlockScroll()
  visible.value = false // オーバーレイを DOM から完全に削除
  markOpeningDone()
}

const skip = () => {
  if (skipping.value || !visible.value) return
  skipping.value = true
  skipTimer = setTimeout(finish, 380)
}

function onKey(e) {
  if (['Escape', 'Enter', ' ', 'Spacebar'].includes(e.key)) skip()
}

onMounted(() => {
  if (!visible.value) return
  try {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* 保存できなくても再生は続ける */
    }
    document.documentElement.style.overflow = 'hidden' // 再生中だけ背面のスクロールを止める
    window.addEventListener('keydown', onKey)
    timer = setTimeout(finish, DURATION)
  } catch {
    finish()
  }
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(skipTimer)
  window.removeEventListener('keydown', onKey)
  unlockScroll()
  markOpeningDone()
})
</script>

<template>
  <div
    v-if="visible"
    class="opening"
    :class="{ 'is-skipping': skipping }"
    aria-hidden="true"
    @click="skip"
    @touchstart.passive="skip"
  >
    <!-- めくれた紙が下の Hero に落とす、やわらかい影 -->
    <span class="opening__cast" />

    <!-- 紙（1枚）：白〜ごく淡いブルー＋星座 / AI Network。左端を軸にめくれる -->
    <div class="opening__page">
      <AiNetworkBackground variant="opening" />

      <div class="opening__content">
        <img :src="logo.image" :alt="logo.alt" class="opening__logo">
        <p class="opening__message">
          <span>YOUR EXPERIENCE.</span>
          <span>YOUR NEXT FUTURE.</span>
        </p>
        <span class="opening__rule" />
        <p class="opening__sub">AI × CAREER × GROWTH</p>
      </div>

      <!-- めくれるときに紙に入る陰影 -->
      <span class="opening__shade" />
      <!-- 右下の角：めくれ始めの小さな折り返し -->
      <span class="opening__curl" />
    </div>
  </div>
</template>

<style scoped>
.opening {
  --curl: clamp(70px, 8vw, 120px);          /* 角の折り返しの大きさ */
  --turn-start: 2s;                          /* めくり始め */
  --turn-dur: 1.2s;                          /* めくる長さ */
  --turn-ease: cubic-bezier(0.55, 0.06, 0.3, 1);

  position: fixed;
  inset: 0;
  z-index: 1000;
  overflow: hidden;
  perspective: 2400px;
  perspective-origin: 0% 50%;
  cursor: pointer;
  /* JS が止まっても、最後は必ず非表示＆操作を妨げない */
  animation: openingEnd 0.01s linear 3.25s forwards;
}

/* ---------- 紙 ---------- */
.opening__page {
  position: absolute;
  inset: 0;
  z-index: 1;
  isolation: isolate;
  overflow: hidden;
  /* ごく淡いアイボリー → LP の白〜淡いブルーへ（紙の質感） */
  background: linear-gradient(160deg, #FFFEFA 0%, #FBF9F3 45%, #F3F7FA 100%);
  transform-origin: left center;
  backface-visibility: hidden;
  will-change: transform;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%);
  animation:
    openingCurlCut 0.5s cubic-bezier(0.33, 1, 0.68, 1) calc(var(--turn-start) - 0.35s) forwards,
    openingTurn var(--turn-dur) var(--turn-ease) var(--turn-start) forwards;
}

/* 右下の角を少し切り取る（めくれた部分の下から Hero がのぞく） */
@keyframes openingCurlCut {
  from { clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%); }
  to { clip-path: polygon(0 0, 100% 0, 100% calc(100% - var(--curl)), calc(100% - var(--curl)) 100%, 0 100%); }
}

/* 左端を軸に、右側が手前へ起き上がりながら左へめくれる */
@keyframes openingTurn {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(-100deg); }
}

/* 角の折り返し（紙の裏側）：切り取った三角形を対角線で折り返した形 */
.opening__curl {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 3;
  width: var(--curl);
  height: var(--curl);
  background: linear-gradient(135deg, #E4EEF8 0%, #F7FAFD 34%, #FFFFFF 47%, transparent 50%);
  filter: drop-shadow(-3px -3px 6px rgba(20, 55, 95, 0.1));
  transform: scale(0);
  transform-origin: right bottom;
  animation: openingCurl 0.5s cubic-bezier(0.33, 1, 0.68, 1) calc(var(--turn-start) - 0.35s) forwards;
}

@keyframes openingCurl {
  to { transform: scale(1); }
}

/* めくれるにつれて、紙の右側にやわらかい陰影 */
.opening__shade {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(90deg, rgba(20, 55, 95, 0) 35%, rgba(20, 55, 95, 0.12) 100%);
  opacity: 0;
  pointer-events: none;
  animation: openingShade var(--turn-dur) var(--turn-ease) var(--turn-start) forwards;
}

@keyframes openingShade {
  to { opacity: 1; }
}

/* 下の Hero に落ちる影（めくれている間だけ） */
.opening__cast {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(90deg, rgba(14, 40, 72, 0.16) 0%, rgba(14, 40, 72, 0.05) 30%, rgba(14, 40, 72, 0) 60%);
  opacity: 0;
  pointer-events: none;
  animation: openingCast var(--turn-dur) var(--turn-ease) var(--turn-start) forwards;
}

@keyframes openingCast {
  0% { opacity: 0; }
  40% { opacity: 1; }
  100% { opacity: 0; }
}

/* ---------- 中央：ロゴ → メッセージ → 細い線 → 補足 ---------- */
.opening__content {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.opening__logo {
  display: block;
  width: auto;
  height: clamp(30px, 3.4vw, 46px);
  mix-blend-mode: multiply; /* ロゴ画像の白い地を背景になじませる（ロゴの色・形はそのまま） */
  opacity: 0;
  transform: translateY(6px);
  animation: openingIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
}

.opening__message {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.6em;
  margin-top: clamp(26px, 2.6vw, 36px);
  padding-left: 0.28em; /* 字間のぶん右にずれるのを補正 */
  font-family: var(--font-en);
  font-size: clamp(15px, 1.9vw, 24px);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.28em;
  color: #102A46;
  opacity: 0;
  transform: translateY(6px);
  animation: openingIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards;
}

.opening__message span {
  white-space: nowrap;
}

.opening__rule {
  display: block;
  width: 40px;
  height: 1px;
  margin-top: clamp(18px, 1.8vw, 24px);
  background: linear-gradient(90deg, rgba(22, 135, 219, 0.2), #1687DB, rgba(22, 135, 219, 0.2));
  transform: scaleX(0);
  animation: openingRule 0.8s cubic-bezier(0.22, 1, 0.36, 1) 1.1s forwards;
}

.opening__sub {
  margin-top: clamp(14px, 1.4vw, 18px);
  padding-left: 0.42em;
  font-size: clamp(9.5px, 0.9vw, 11.5px);
  font-weight: 500;
  letter-spacing: 0.42em;
  color: #6C86A3;
  opacity: 0;
  animation: openingIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) 1.25s forwards;
}

@keyframes openingIn {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes openingRule {
  to { transform: scaleX(1); }
}

@keyframes openingEnd {
  to { visibility: hidden; pointer-events: none; }
}

/* ---------- スキップ：すぐにやわらかく消える ---------- */
.opening.is-skipping {
  animation: openingSkip 0.35s ease forwards;
}

@keyframes openingSkip {
  to { opacity: 0; visibility: hidden; pointer-events: none; }
}

/* ---------- SP：遠近感を少し強め（画面幅が狭くても立体的に見えるように） ---------- */
@media (max-width: 767px) {
  .opening {
    perspective: 1300px;
  }

  .opening__message {
    flex-direction: column;
    letter-spacing: 0.22em;
    padding-left: 0.22em;
  }
}

/* ---------- 動きを減らす設定：めくりなし。表示して短くフェードアウト ---------- */
@media (prefers-reduced-motion: reduce) {
  .opening {
    animation: openingSkip 0.5s ease 1.35s forwards;
  }

  .opening__page,
  .opening__curl,
  .opening__shade,
  .opening__cast {
    animation: none !important;
  }

  .opening__logo,
  .opening__message,
  .opening__sub {
    opacity: 1;
    transform: none;
    animation: none !important;
  }

  .opening__rule {
    transform: none;
    animation: none !important;
  }
}
</style>
