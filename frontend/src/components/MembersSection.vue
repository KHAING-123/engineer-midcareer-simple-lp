<script setup>
import SectionHeading from './SectionHeading.vue'

defineProps({
  content: { type: Object, required: true }
})
</script>

<template>
  <section id="members" class="section members">
    <div class="container members__inner">
      <SectionHeading
        v-reveal
        class="members__heading"
        :number="content.number"
        :english-title="content.englishTitle"
        :title="content.title"
        :description="content.description"
      />

      <!-- PC：3人を横に並べ、高さを 上 → 下 → 上 にずらす -->
      <ul class="members__list">
        <li
          v-for="(member, index) in content.items"
          :key="index"
          v-reveal
          class="members__item"
          :style="{ '--reveal-delay': `${index * 0.1}s` }"
        >
          <!-- 役割ラベル（縦書き＋細い線） -->
          <p v-if="member.roleLabel" class="members__role">
            <span class="members__role-text">{{ member.roleLabel }}</span>
          </p>

          <figure class="members__figure">
            <!-- 画像は切り取らず、元の縦横比のまま全体を表示 -->
            <img :src="member.image" :alt="member.alt" class="members__image" loading="lazy">
            <figcaption class="members__info">
              <span>{{ member.background }}</span>
              <span>{{ member.current }}</span>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.members {
  padding-block: calc(var(--section-pad) * 1.1); /* 人物画像が主役になるよう少し広め */
}

/* 上：見出し ／ 下：3人のビジュアル */
.members__inner {
  display: flex;
  flex-direction: column;
}

/* ---------- 見出し：タイトルの右に説明文（文字のスタイルは共通見出しのまま） ---------- */
.members__heading {
  position: relative;
  padding-top: 8px;
}


@media (min-width: 1024px) {
  .members__heading :deep(.heading__body) {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    grid-template-areas:
      "label label"
      "title desc";
    column-gap: clamp(70px, 8vw, 150px);
    align-items: center;
  }

  .members__heading :deep(.heading__label) {
    grid-area: label;
  }

  /* タイトルは英字ラベルのすぐ下（他のセクションと同じ間隔） */
  .members__heading :deep(.heading__title) {
    grid-area: title;
    align-self: start;
  }

  /* 説明文だけ20px下へ（下側を同じだけマイナスにして、行の高さ＝タイトル位置は変えない） */
  .members__heading :deep(.heading__description) {
    grid-area: desc;
    margin-top: 20px;
    margin-bottom: -20px;
  }

  /* 3人の画像グループ全体を24px下へ */
  .members__inner .members__list {
    margin-top: calc(clamp(50px, 6vw, 100px) + 24px);
  }
}

/* ---------- 3人のビジュアル ---------- */
.members__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(38px, 4vw, 80px);
  align-items: start;
  margin-top: clamp(50px, 6vw, 100px);
  padding-bottom: clamp(16px, 2vw, 40px);
}

/* 1人分：左に役割ラベル、右に画像 */
.members__item {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: clamp(14px, 1.4vw, 24px);
  align-items: center;
}

/* 高さのずらし：上 → 下 → 上 */
.members__item:nth-child(2) {
  margin-top: clamp(70px, 6vw, 120px);
}

.members__item:nth-child(3) {
  margin-top: clamp(10px, 1.5vw, 30px);
}

/* 役割ラベル：縦書き＋上下に細い線 */
.members__role {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  align-self: center;
  margin-bottom: 30px; /* キャプション分、画像の中央に合わせる */
}

.members__role::before,
.members__role::after {
  content: '';
  width: 1px;
  height: clamp(40px, 4vw, 72px);
  background: rgba(65, 110, 145, 0.45);
}

.members__role-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: clamp(11px, 0.85vw, 15px);
  letter-spacing: 0.16em;
  line-height: 1;
  white-space: nowrap;
  color: rgba(35, 75, 105, 0.82);
}

/* 画像＋キャプション */
.members__figure {
  position: relative;
  width: 100%;
  max-width: clamp(380px, 28vw, 540px);
  margin: 0;
  transition: transform 0.5s ease;
}

.members__figure:hover {
  transform: translateY(-5px);
}

/* 画像の後ろから少し見える、淡い四角 */
.members__figure::before {
  content: '';
  position: absolute;
  z-index: -1;
  pointer-events: none;
}

.members__item:nth-child(1) .members__figure::before {
  top: clamp(-24px, -1.6vw, -12px);
  left: -4%;
  width: 42%;
  height: 26%;
  background: rgba(249, 240, 208, 0.45);
}

.members__item:nth-child(2) .members__figure::before {
  top: clamp(-30px, -2vw, -14px);
  left: -6%;
  width: 46%;
  height: 34%;
  background: rgba(220, 239, 252, 0.65);
}

.members__item:nth-child(3) .members__figure::before {
  top: clamp(-30px, -2vw, -14px);
  right: -6%;
  width: 70%;
  height: 22%;
  background: rgba(220, 239, 252, 0.65);
}

/* 元画像を切り取らずに全体表示（縦横比は画像そのまま） */
.members__image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
  border-radius: clamp(4px, 0.5vw, 8px);
  box-shadow: 0 14px 40px rgba(30, 50, 70, 0.07);
  transition: box-shadow 0.5s ease;
}

.members__figure:hover .members__image {
  box-shadow: 0 18px 44px rgba(30, 50, 70, 0.1);
}

/* 画像の下に小さく：前職 ／ 今 */
.members__info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  margin-top: 14px;
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: 0.06em;
  color: var(--color-text-light);
}

.members__info span:first-child {
  padding-right: 12px;
  border-right: 1px solid var(--color-border);
  color: var(--color-text);
}

/* ---------- 3列が窮屈な幅：2列（01・02 ／ 03） ---------- */
@media (max-width: 1199px) {
  .members__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: clamp(40px, 5vw, 64px);
  }

  .members__item:nth-child(3) {
    grid-column: 1 / -1;
    justify-self: center;
    width: calc(50% - clamp(19px, 2vw, 40px));
    margin-top: 0;
  }

  .members__item:nth-child(2) {
    margin-top: clamp(40px, 5vw, 70px);
  }

  .members__role-text {
    font-size: 11px;
  }
}

/* ---------- SP：縦1列、役割は横書き ---------- */
@media (max-width: 767px) {

  .members__list {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 40px;
    margin-top: 40px;
  }

  .members__item:nth-child(n) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 12px;
    width: 100%;
    margin-top: 0;
  }

  .members__role {
    flex-direction: row;
    justify-content: flex-start;
    gap: 10px;
    margin-bottom: 0;
  }

  .members__role::before {
    display: none;
  }

  .members__role::after {
    width: 40px;
    height: 1px;
  }

  .members__role-text {
    writing-mode: horizontal-tb;
  }

  .members__figure {
    max-width: none;
  }

  .members__figure::before {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .members__figure:hover {
    transform: none;
  }
}
</style>
