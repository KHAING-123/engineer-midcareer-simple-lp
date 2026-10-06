<script setup>
import SectionHeading from './SectionHeading.vue'
import CareerIcon from './CareerIcon.vue'

defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="career" class="section career">
    <div class="container">
      <SectionHeading
        v-reveal
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
        :side-note="content.sideNote"
      />

      <ul class="career__list">
        <li
          v-for="(item, index) in content.items"
          :key="item.title"
          v-reveal
          class="career__item"
          :style="{ '--reveal-delay': `${index * 0.08}s` }"
        >
          <!-- 背景のごく薄い装飾（カードごとに形だけ違う） -->
          <span class="career__decor" aria-hidden="true" />
          <span class="career__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <CareerIcon :type="item.iconType" :index="index" class="career__icon" />
          <h3 class="career__title">{{ item.title }}</h3>
          <p class="career__description pre-line">{{ item.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.career__list {
  display: grid;
  /* カード1枚：最小160px〜最大420px */
  grid-template-columns: repeat(5, minmax(160px, 420px));
  justify-content: space-between;
  gap: clamp(14px, 1.5vw, 32px);
  margin-top: 40px;
}

/* カード：白・細い枠線・ごく弱い影（中身は 背景装飾 → アイコン・文字 の順に重なる） */
.career__item {
  --deco: #F4F7FA;
  --deco-2: #EEF3F7;
  --deco-line: rgba(35, 55, 80, 0.05);
  --deco-dot: rgba(36, 54, 77, 0.12);

  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: clamp(26px, 2.2vw, 34px) clamp(20px, 1.8vw, 30px) clamp(28px, 2.4vw, 36px);
  background: #FFFFFF;
  border: 1px solid #E1E7ED;
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(20, 38, 60, 0.045);
  text-align: left;
  transition: transform 0.6s ease, box-shadow 0.6s ease;
}

@media (hover: hover) {
  .career__item:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 38px rgba(20, 38, 60, 0.065);
  }
}

/* ---------- 背景装飾（カードの枠内に収める・クリックの邪魔をしない） ---------- */
.career__decor {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}

.career__decor::before,
.career__decor::after {
  content: '';
  position: absolute;
}

/* 小さなドットの並び（共通の作り方） */
.career__item:nth-child(1) .career__decor::after,
.career__item:nth-child(3) .career__decor::after {
  background-image: radial-gradient(circle, var(--deco-dot) 1px, transparent 1.4px);
  background-size: 9px 9px;
}

/* 01：下から右へ流れる波＋左上のドット */
.career__item:nth-child(1) .career__decor::before {
  right: -45%;
  bottom: -30%;
  width: 150%;
  height: 46%;
  border-radius: 50% 50% 0 0 / 70% 70% 0 0;
  background: linear-gradient(100deg, rgba(244, 247, 250, 0) 10%, var(--deco) 60%, var(--deco-2) 100%);
  transform: rotate(-6deg);
}

.career__item:nth-child(1) .career__decor::after {
  top: 18px;
  left: 18px;
  width: 54px;
  height: 45px;
}

/* 02：右下に細い斜め線 */
.career__item:nth-child(2) .career__decor::before {
  right: 0;
  bottom: 0;
  width: 52%;
  height: 32%;
  background: repeating-linear-gradient(135deg, var(--deco-line) 0 1px, transparent 1px 11px);
  -webkit-mask-image: linear-gradient(315deg, #000 30%, transparent 90%);
  mask-image: linear-gradient(315deg, #000 30%, transparent 90%);
}

/* 03：左下に大きな円の一部＋右にドット */
.career__item:nth-child(3) .career__decor::before {
  left: -34%;
  bottom: -30%;
  width: 78%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--deco);
}

.career__item:nth-child(3) .career__decor::after {
  top: 30%;
  right: 14px;
  width: 54px;
  height: 45px;
}

/* 04：左上〜中央の多角形＋右下の三角形 */
.career__item:nth-child(4) .career__decor::before {
  top: 9%;
  left: 6%;
  width: 70%;
  height: 34%;
  background: var(--deco);
  clip-path: polygon(0 50%, 34% 0, 100% 12%, 82% 100%, 22% 92%);
  opacity: 0.8;
}

.career__item:nth-child(4) .career__decor::after {
  right: 0;
  bottom: 0;
  width: 46%;
  height: 34%;
  background: var(--deco-2);
  opacity: 0.7;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

/* 05：アイコンの後ろの淡い円（2つ）＋右のドット＋下の波 */
.career__item:nth-child(5) .career__decor {
  background:
    radial-gradient(circle clamp(38px, 3vw, 54px) at 44% 22%, var(--deco) 98%, transparent 100%),
    radial-gradient(circle clamp(18px, 1.5vw, 26px) at 66% 15%, var(--deco-2) 98%, transparent 100%);
}

.career__item:nth-child(5) .career__decor::before {
  top: 28%;
  right: 12px;
  width: 45px;
  height: 36px;
  background-image: radial-gradient(circle, var(--deco-dot) 1px, transparent 1.4px);
  background-size: 9px 9px;
}

.career__item:nth-child(5) .career__decor::after {
  left: -20%;
  bottom: -26%;
  width: 150%;
  height: 42%;
  border-radius: 50% 50% 0 0 / 80% 80% 0 0;
  background: linear-gradient(80deg, var(--deco) 0%, rgba(244, 247, 250, 0) 80%);
}

/* ---------- 右上の番号（装飾） ---------- */
.career__number {
  position: absolute;
  top: clamp(14px, 1.3vw, 20px);
  right: clamp(14px, 1.4vw, 22px);
  font-family: "Times New Roman", "Noto Serif JP", serif;
  font-size: clamp(30px, 2.4vw, 40px);
  font-style: italic;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.02em;
  color: rgba(30, 48, 70, 0.2);
  pointer-events: none;
}

/* 線画アイコン（PC 70〜86px／SP 64px）：カード上部の中央 */
.career__icon {
  align-self: center;
  width: clamp(70px, 5vw, 86px);
  height: clamp(70px, 5vw, 86px);
  margin: clamp(10px, 1vw, 16px) 0 clamp(18px, 1.6vw, 26px);
}

@media (max-width: 767px) {
  .career__icon {
    width: 64px;
    height: 64px;
  }
}

/* タイトル＋下の短い紺色の線 */
.career__title {
  font-size: clamp(13.5px, 1vw, 16px);
  font-weight: 700;
  line-height: 1.6;
  letter-spacing: 0.06em;
  color: #17243A;
}

.career__title::after {
  content: '';
  display: block;
  width: 30px;
  height: 1px;
  margin-top: 12px;
  background: #24364D;
}

.career__description {
  margin-top: 16px;
  font-size: clamp(11.5px, 0.85vw, 13px);
  color: #626B77;
  line-height: 1.85;
}

@media (max-width: 1023px) {
  .career__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (max-width: 767px) {
  .career__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 32px;
  }

  .career__item {
    padding: 24px 18px 26px;
  }

  .career__number {
    font-size: 26px;
  }

}

@media (max-width: 374px) {
  .career__list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
