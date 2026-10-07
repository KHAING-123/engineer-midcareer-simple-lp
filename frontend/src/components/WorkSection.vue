<script setup>
import AiNetworkBackground from './common/AiNetworkBackground.vue'
import SectionHeading from './SectionHeading.vue'

defineProps({
  content: { type: Object, required: true }
})

// 業務自動化の歯車（8枚歯）の輪郭。中心 24,24
const gearPath = (() => {
  const teeth = 8
  const outer = 14
  const inner = 10.8
  const pts = []
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2
    const step = (Math.PI * 2) / teeth
    const at = (r, ang) => `${(24 + r * Math.cos(ang)).toFixed(2)} ${(24 + r * Math.sin(ang)).toFixed(2)}`
    pts.push(at(inner, a - step * 0.32), at(outer, a - step * 0.18), at(outer, a + step * 0.18), at(inner, a + step * 0.32))
  }
  return `M${pts.join(' L')} Z`
})()

// アイコン外周の弧：カードごとに回る速さを少し変える
const ORBIT = [12, 14, 11]
</script>

<template>
  <section id="work" class="section work">
    <!-- 背景：ごく淡いAIネットワーク（コンテンツの後ろ） -->
    <AiNetworkBackground variant="work" />
    <div class="container">
      <SectionHeading
        v-reveal
        class="work__heading"
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
        :side-note="content.sideNote"
      />

      <!-- 3枚のカード：画像 → 境界に重なる丸いアイコン＋タイトル → 本文 → タグ（下端にそろえる） -->
      <ul class="work__list">
        <li
          v-for="(item, index) in content.items"
          :key="item.title"
          v-reveal
          class="work__card"
          :style="{ '--reveal-delay': `${index * 0.1}s` }"
        >
          <div class="work__media img-zoom">
            <img :src="item.image" :alt="item.alt" class="work__image" loading="lazy">
          </div>
          <div class="work__body">
            <div class="work__head">
              <!-- 白い円（固定）＋外周の細い弧と小さな点（ゆっくり回る）＋線画アイコン -->
              <span class="work__icon" :class="`work__icon--${item.iconType}`" aria-hidden="true">
                <svg class="work__orbit" viewBox="0 0 100 100" :style="{ animationDuration: `${ORBIT[index % ORBIT.length]}s` }">
                  <circle class="work__arc" cx="50" cy="50" r="47" pathLength="100" stroke-dasharray="26 74" />
                  <circle class="work__arc work__arc--sub" cx="50" cy="50" r="47" pathLength="100" stroke-dasharray="10 90" stroke-dashoffset="-50" />
                  <circle class="work__orbit-dot" cx="47" cy="96.9" r="2.3" />
                </svg>
                <svg class="work__glyph" viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <!-- PM・PMO：中央の人（固定）＋左右の人とつながりの線（ゆっくり明るくなる） -->
                  <template v-if="item.iconType === 'team'">
                    <path class="wi-cyan wi-link" d="M15 17.5 C18 13.8 30 13.8 33 17.5" />
                    <g class="wi-side wi-side--left">
                      <circle class="wi-blue" cx="11.5" cy="21" r="3.4" />
                      <path class="wi-blue" d="M5 34.5 C5 30.6 7.8 28.3 11.5 28.3 C12.8 28.3 14 28.6 15 29.2" />
                    </g>
                    <g class="wi-side wi-side--right">
                      <circle class="wi-blue" cx="36.5" cy="21" r="3.4" />
                      <path class="wi-blue" d="M43 34.5 C43 30.6 40.2 28.3 36.5 28.3 C35.2 28.3 34 28.6 33 29.2" />
                    </g>
                    <circle class="wi-ink" cx="24" cy="18" r="4.8" />
                    <path class="wi-ink" d="M15 36.5 C15 30.6 19 27 24 27 C29 27 33 30.6 33 36.5" />
                  </template>
                  <!-- AI・DXツール導入支援：AIチップ。中心のコアと端子の先が静かに明滅 -->
                  <template v-else-if="item.iconType === 'ai'">
                    <rect class="wi-ink" x="14" y="14" width="20" height="20" rx="3" />
                    <path class="wi-ink" d="M19.5 9.5 V14 M24 9.5 V14 M28.5 9.5 V14 M19.5 34 V38.5 M24 34 V38.5 M28.5 34 V38.5 M9.5 19.5 H14 M9.5 24 H14 M9.5 28.5 H14 M34 19.5 H38.5 M34 24 H38.5 M34 28.5 H38.5" />
                    <g class="wi-core">
                      <rect class="wi-blue wi-core-fill" x="19.5" y="19.5" width="9" height="9" rx="1.6" />
                    </g>
                    <g class="wi-pins">
                      <circle class="wi-dot" cx="24" cy="7.5" r="1.1" />
                      <circle class="wi-dot" cx="40.5" cy="24" r="1.1" />
                      <circle class="wi-dot" cx="24" cy="40.5" r="1.1" />
                      <circle class="wi-dot" cx="7.5" cy="24" r="1.1" />
                    </g>
                  </template>
                  <!-- 業務自動化：歯車だけがゆっくり回る（中心の軸は固定） -->
                  <template v-else>
                    <g class="wi-gear">
                      <path class="wi-ink" :d="gearPath" />
                    </g>
                    <circle class="wi-blue" cx="24" cy="24" r="4.4" />
                    <path class="wi-cyan" d="M38.5 33.5 A17 17 0 0 1 31 40" />
                  </template>
                </svg>
              </span>
              <h3 class="work__title">
                {{ item.title }}
                <!-- タイトル下の短いライン：表示時に左から伸び、ときどき淡い光が流れる -->
                <span class="work__line" aria-hidden="true"><span class="work__line-sweep" /></span>
              </h3>
            </div>
            <p class="work__description">{{ item.description }}</p>
            <ul class="work__tags">
              <li v-for="(tag, t) in item.tags" :key="tag" class="work__tag" :style="{ '--t': t }">{{ tag }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.work {
  --w-navy: #0B2345;
  --w-blue: #1677E8;
  --w-text: #536273;
  --w-media: clamp(190px, 14.5vw, 230px);  /* 画像の高さ（3枚共通） */
  --w-icon: clamp(64px, 4.8vw, 80px);      /* 丸いアイコン */
  --w-orbit-gap: 7px;                      /* 円と外周の弧のすき間 */
  --w-pad: clamp(26px, 2.3vw, 40px);       /* カード内の左右の余白 */
  --w-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

/* 02 の見出しだけ：番号とタイトルの間に細い縦線・英字ラベルは淡いブルー（共通の見出し部品は変更しない） */
.work__heading :deep(.heading__number) {
  color: #BCC8D6;
}

.work__heading :deep(.heading__body) {
  position: relative;
}

.work__heading :deep(.heading__body)::before {
  content: '';
  position: absolute;
  top: 0.15em;
  left: calc(clamp(24px, 2.2vw, 32px) / -2);
  width: 1px;
  height: clamp(48px, 3.6vw, 60px);
  background: rgba(120, 150, 185, 0.35);
}

.work__heading :deep(.heading__label) {
  color: #8DB1D6;
}

/* ---------- 3枚のカード：同じ幅・同じ高さのグリッド ---------- */
.work__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(24px, 2.4vw, 40px);
  margin-top: clamp(48px, 4vw, 64px);
}

.work__card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(180deg, #FFFFFF 0%, #FBFDFF 60%, #F5FAFF 100%);
  border: 1px solid rgba(150, 180, 205, 0.16);
  border-radius: 5px;
  box-shadow: 0 12px 32px rgba(30, 70, 110, 0.07);
  transition: transform 400ms var(--w-ease), box-shadow 400ms var(--w-ease);
}

/* 画像：カード上部いっぱい・3枚とも同じ高さ（上の角だけカードの角丸に合わせる） */
.work__media {
  height: var(--w-media);
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
  padding: 0 var(--w-pad) clamp(28px, 2.4vw, 40px);
}

/* アイコンは画像の下端に半分重ね、タイトルはその右（画像の下から始める） */
.work__head {
  display: flex;
  align-items: flex-start;
  gap: clamp(16px, 1.4vw, 24px);
  margin-top: calc(var(--w-icon) / -2);
}

.work__icon {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: var(--w-icon);
  height: var(--w-icon);
  border-radius: 50%;
  /* 白〜ごく淡いブルーの円（円そのものは動かさない） */
  background: radial-gradient(circle at 50% 35%, #FFFFFF 55%, #F3F8FD 100%);
  border: 1px solid rgba(80, 150, 220, 0.1);
  box-shadow: 0 10px 30px rgba(25, 70, 120, 0.08);
}

/* 外周：円周の一部だけの細い弧＋弧の端の小さな点。ゆっくり回る */
.work__orbit {
  position: absolute;
  inset: calc(var(--w-orbit-gap) * -1);
  width: calc(100% + var(--w-orbit-gap) * 2);
  height: calc(100% + var(--w-orbit-gap) * 2);
  overflow: visible;
  pointer-events: none;
  animation: workOrbit 12s linear infinite;
}

.work__arc {
  fill: none;
  stroke: rgba(60, 160, 230, 0.42);
  stroke-width: 1.2;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(0 0 2px rgba(60, 160, 230, 0.15));
}

.work__arc--sub {
  stroke: rgba(80, 200, 225, 0.3);
}

.work__orbit-dot {
  fill: #2E9BEA;
  filter: drop-shadow(0 0 3px rgba(50, 160, 230, 0.3));
}

@keyframes workOrbit {
  to { transform: rotate(360deg); }
}

/* ---------- 線画アイコン（3つとも同じ線幅） ---------- */
.work__glyph {
  position: relative;
  width: 54%;
  height: 54%;
  overflow: visible;
}

.work__glyph * {
  transform-box: fill-box;
  transform-origin: center;
}

.wi-ink,
.wi-blue,
.wi-cyan {
  stroke-width: 1.6;
}

.wi-ink {
  stroke: var(--w-navy);
}

.wi-blue {
  stroke: var(--w-blue);
}

.wi-cyan {
  stroke: rgba(54, 190, 225, 0.75);
}

.wi-dot {
  fill: #36BEE1;
  stroke: none;
}

/* PM・PMO：左右の人とつながりの線だけが、ゆっくり明るく・少し大きく（チームがつながる） */
.wi-side {
  animation: wiTeam 5.5s ease-in-out infinite;
}

.wi-side--right {
  animation-delay: -2.75s;
}

.wi-link {
  animation: wiLink 5.5s ease-in-out infinite;
}

@keyframes wiTeam {
  0%, 100% { opacity: 0.55; transform: scale(0.96); }
  50% { opacity: 1; transform: scale(1.03); }
}

@keyframes wiLink {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}

/* AI・DX：中心のコアと端子の先が静かに明滅（AI プロセッサが動作している） */
.wi-core-fill {
  fill: rgba(22, 119, 232, 0.12);
}

.wi-core {
  animation: wiCore 3.6s ease-in-out infinite;
}

.wi-pins .wi-dot {
  animation: wiPin 3.6s ease-in-out infinite;
}

.wi-pins .wi-dot:nth-child(2) { animation-delay: 0.9s; }
.wi-pins .wi-dot:nth-child(3) { animation-delay: 1.8s; }
.wi-pins .wi-dot:nth-child(4) { animation-delay: 2.7s; }

@keyframes wiCore {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}

@keyframes wiPin {
  0%, 100% { opacity: 0.25; }
  30% { opacity: 1; }
  60% { opacity: 0.25; }
}

/* 業務自動化：歯車だけがゆっくり回り続ける（軸は固定） */
.wi-gear {
  animation: wiGear 16s linear infinite;
}

@keyframes wiGear {
  to { transform: rotate(360deg); }
}

.work__title {
  padding-top: calc(var(--w-icon) / 2 + 12px);
  font-size: clamp(17px, 1.3vw, 21px);
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: 0.05em;
  color: var(--w-navy);
}

/* タイトル下のライン：淡いブルー → ブルー。カードが表示されたとき左から伸びる */
.work__line {
  position: relative;
  display: block;
  width: 36px;
  height: 2px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 1px;
  background: linear-gradient(90deg, #9CCDF3, #2F8FE8);
  transform-origin: left center;
  transition: transform 850ms cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--reveal-delay, 0s) + 0.35s);
}

.work__card.reveal:not(.is-visible) .work__line {
  transform: scaleX(0);
  transition: none;
}

/* 表示後、数秒に1回だけ淡い光がラインの上を流れる */
.work__line-sweep {
  position: absolute;
  top: 0;
  left: 0;
  width: 14px;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0));
  transform: translateX(-14px);
  animation: workSweep 6s ease-in-out infinite;
  animation-delay: calc(var(--reveal-delay, 0s) + 1.4s);
}

@keyframes workSweep {
  0% { transform: translateX(-14px); }
  18%, 100% { transform: translateX(40px); }
}

.work__description {
  margin-top: clamp(20px, 1.8vw, 26px);
  font-size: clamp(13px, 0.95vw, 15px);
  line-height: 1.95;
  letter-spacing: 0.03em;
  color: var(--w-text);
}

/* タグ：本文量が違ってもカード下部にそろう */
.work__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
  padding-top: clamp(22px, 2vw, 28px);
}

.work__tag {
  padding: 6px 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 249, 255, 0.92));
  border: 1px solid rgba(80, 130, 180, 0.14);
  border-radius: 5px;
  box-shadow: 0 3px 10px rgba(30, 70, 110, 0.05);
  font-size: clamp(11.5px, 0.85vw, 13px);
  line-height: 1.5;
  letter-spacing: 0.04em;
  color: #40556A;
  transition: transform 280ms ease, box-shadow 280ms ease, border-color 280ms ease;
}

/* ---------- ホバー（PCのみ・控えめ） ---------- */
@media (hover: hover) and (min-width: 1024px) {
  .work__card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(30, 70, 110, 0.1);
  }

  .work__card:hover .work__image {
    transform: scale(1.018);
  }

  .work__tag:hover {
    transform: translateY(-2px);
    border-color: rgba(60, 140, 220, 0.25);
    box-shadow: 0 6px 16px rgba(30, 80, 130, 0.09);
  }
}

/* ---------- タブレット：2列 ---------- */
@media (max-width: 1023px) {
  .work__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ---------- SP：縦並び・横幅いっぱい ---------- */
@media (max-width: 767px) {
  .work {
    --w-media: clamp(180px, 52vw, 220px);
    --w-icon: 56px;
    --w-orbit-gap: 5px;
    --w-pad: 22px;
  }

  .work__list {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    margin-top: 36px;
  }

  .work__body {
    padding-bottom: 28px;
  }

  .work__title {
    font-size: 17px;
  }

  .work__description {
    margin-top: 20px;
    font-size: 13.5px;
  }

  .work__tag {
    padding: 5px 12px;
    font-size: 12px;
    transition: opacity 450ms ease, transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: calc(var(--reveal-delay, 0s) + 0.4s + var(--t) * 50ms);
  }

  /* SP：カードが表示されたとき、タグを1つずつ少しだけ遅らせてふわっと表示 */
  .work__card.reveal:not(.is-visible) .work__tag {
    opacity: 0;
    transform: translateY(6px);
    transition: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .work__card,
  .work__image,
  .work__line,
  .work__tag {
    transition: none;
  }

  .work__orbit,
  .work__glyph *,
  .work__line-sweep {
    animation: none;
  }

  .work__line-sweep {
    display: none;
  }

  .wi-side,
  .wi-core {
    opacity: 1;
  }

  .work__card:hover,
  .work__card:hover .work__image {
    transform: none;
  }
}
</style>
