# engineer-midcareer-simple-lp

PREAI 未経験者向け採用LP（Simple版）です。Vue 3 + Vite で構築しており、プロジェクト本体は `frontend/` 配下にあります。

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [使用技術](#2-使用技術)
3. [ページ構成](#3-ページ構成)
4. [デザイン・アニメーション](#4-デザインアニメーション)
5. [最新の修正内容（07 FLOW）](#5-最新の修正内容07-flow)
6. [プロジェクト構成](#6-プロジェクト構成)
7. [開発・起動方法](#7-開発起動方法)
8. [更新方法](#8-更新方法)
9. [更新履歴](#9-更新履歴)

---

## 1. プロジェクト概要

| 項目 | 内容 |
| --- | --- |
| 名称 | PREAI 未経験者向け採用LP（Simple版） |
| 想定ターゲット | 20代後半〜30歳前後の社会人経験者（男女） |
| デザインコンセプト | Simple / Professional / Premium |
| ベースカラー | White + Very Pale Blue（アクセント：ブルー / ネイビー） |
| 対応デバイス | PC・タブレット・SP のレスポンシブ対応 |

**ブレイクポイント（共通）**

| 区分 | 画面幅 |
| --- | --- |
| PC | 1024px 以上 |
| タブレット | 768px〜1023px |
| SP | 767px 以下（Hero / Final CTA の画像も SP 用に切り替わる） |

※ セクションによっては 1199px / 1399px など、追加の調整ポイントがあります。

---

## 2. 使用技術

| 種類 | 内容 |
| --- | --- |
| フレームワーク | Vue 3（`vue` ^3.5.43、`<script setup>` / SFC） |
| ビルドツール | Vite（`vite` ^8.3.2）、`@vitejs/plugin-vue` ^6.0.9 |
| 言語 | JavaScript（ES Modules）、HTML、CSS（各コンポーネントの scoped CSS ＋ 共通CSS） |
| フォント | Google Fonts（Noto Sans JP / Noto Serif JP / Cormorant Garamond / Klee One）※ `index.html` で読み込み |
| アニメーション | CSS アニメーション・トランジション、インライン SVG（`animateMotion` / `offset-path` など）、`IntersectionObserver`、`ResizeObserver` |

- 上記以外の外部ライブラリ（UIライブラリ・アニメーションライブラリ等）は使用していません。
- パスエイリアス：`@` → `frontend/src`（`vite.config.js`）

---

## 3. ページ構成

ページの並び順は `frontend/src/App.vue` で定義しています。

| # | セクション | コンポーネント | ページ内ID | 内容 |
| --- | --- | --- | --- | --- |
| — | オープニング | `OpeningAnimation.vue` | — | 初回表示時のオープニング演出 |
| — | Header | `Header.vue` | — | ロゴ・ナビ・「まずは話を聞いてみる」（SP はハンバーガーメニュー） |
| — | First View / Hero | `HeroSection.vue` | `#top` | PC/SP 別の完成画像（キャッチコピーは画像内） |
| 01 | MEMBERS | `MembersSection.vue` | `#members` | どんな人が働いている？（メンバー3名） |
| 02 | OUR WORK | `WorkSection.vue` | `#work` | PREAIでの仕事（PM・PMO / AI・DXツール導入支援 / 業務自動化） |
| 03 | GROWTH STEP | `GrowthSection.vue` | `#growth` | 成長ステップ（STEP 01〜04） |
| 04 | SUPPORT | `SupportSection.vue` | `#support` | AI時代の成長環境（4項目） |
| 05 | CAREER PATH | `CareerSection.vue` | `#career` | キャリアの広がり（5職種） |
| 06 | INTERVIEW | `InterviewSection.vue` | `#interview` | 面接について・面接でお話しすること（4項目） |
| 07 | FLOW | `FlowSection.vue` | `#flow` | 選考の流れ（5ステップ）＋「最短1週間でご連絡！」 |
| — | Final CTA | `FinalCta.vue` | — | PC/SP 別の完成画像（リンク設定可） |
| — | Footer | `Footer.vue` | — | ロゴ・住所（Google マップリンク）・利用規約・プライバシーポリシー・会社サイトへ |

- 各セクションの間には区切り線（`SectionDivider.vue`）が入ります（07 FLOW → Final CTA の間を除く）。
- ヘッダーのナビは MEMBERS / OUR WORK / GROWTH / CAREER / INTERVIEW の5項目です。

---

## 4. デザイン・アニメーション

### 4-1. 全体共通

| 演出 | 内容 | 実装 |
| --- | --- | --- |
| オープニング | PREAI ロゴ＋「YOUR EXPERIENCE. / YOUR NEXT FUTURE.」「AI × CAREER × GROWTH」を表示 → 右下の角が少しめくれ → 紙が左端を軸にめくれて Hero が現れる（約3.3秒） | `OpeningAnimation.vue` |
| オープニングの制御 | 同じタブでは1回のみ（`sessionStorage`）。クリック／タップ／Esc・Enter・Space でスキップ可。再生中は背面のスクロールを停止 | `OpeningAnimation.vue` / `composables/openingState.js` |
| スクロール表示 | 要素が画面に入ったら1回だけふわっと表示（`v-reveal` ディレクティブ） | `directives/reveal.js` / `styles/base.css` |
| 見出しの文字アニメーション | 01〜07 の見出しで「番号 → 英字ラベル → タイトル」を1文字ずつ表示（オープニング終了後に開始） | `SectionHeading.vue`（`char-reveal`） |
| 区切り線 | セクションの境目の細い線が、画面に入ったら左 → 右へ伸びる | `common/SectionDivider.vue` |
| 背景（AI Network） | セクションごとに形の違う淡い「星座 / AI Network」。線に沿って小さな光が進み、点が明滅。セクションをまたいで線がつながって見える配置。画面外では一時停止 | `common/AiNetworkBackground.vue` |
| 背景の光 | ページ上部の淡い光、ゆっくり横切るごく淡い光（約28秒）、セクションごとの淡い光と曲線 | `styles/background.css` |
| 動きを減らす設定 | `prefers-reduced-motion: reduce` の場合、オープニングを表示せず、各アニメーションを停止（見た目はそのまま） | 各コンポーネント |

### 4-2. セクション別

**Header**
- PC：ロゴ＋ナビ（英字ラベル＋日本語の2段）。ホバーで細いブルーの線が左 → 右へ伸びる
- 「まずは話を聞いてみる」はクリック不可の装飾テキスト。2つ重なった吹き出しアイコンがゆっくり拡大縮小し、3つの点が順に点灯。「話」「聞」はブルーのグラデーション
- タブレット / SP：ハンバーガーメニュー（アイコン下に「MENU」ラベル）。開くと全画面メニューが表示され、項目が上から順にふわっと表示。背景に AI Network 装飾

**First View / Hero**
- PC用・SP用の完成画像を `<picture>` で切り替え（767px 以下で SP 画像）

**01 MEMBERS**
- PC：3人を横に並べ、高さを「上 → 下 → 上」にずらして配置。画像横に縦書きの役割ラベル（例：ENGINEER）
- 1199px 以下：2列、SP：1列（役割ラベルは横書き）
- SP：画像が左右交互にスライドして登場（1・3枚目は左から、2枚目は右から）

**02 OUR WORK**
- 3枚のカード（画像 → 境界に重なる丸いアイコン＋タイトル → 本文 → タグ）。タブレットは2列、SP は1列
- アイコン：外周の細い弧と小さな点がゆっくり回転。PM・PMO はつながりの線が明るくなり、AI・DX はチップの中心と端子が明滅、業務自動化は歯車が回転
- タイトル下のラインが表示時に左から伸び、ときどき淡い光が流れる
- SP：タグを1つずつ遅らせて表示

**03 GROWTH STEP**
- メイン画像＋手書き風メモ「未経験から、できるを積み重ねよう。」
- STEP 01〜04 の縦タイムライン。PC（1024px 以上）は左に見出し・画像、右に STEP の2カラム
- アイコン周りの弧と青い点が STEP ごとに違う速さ・向きで回転
- STEP 間の線が表示時に上 → 下へ伸び、青い点が 01 → 04 の順に流れる
- アイコン内部：本のページが開く／`< >` が集まる／3人が寄る／棒グラフが伸びて矢印が右上へ

**04 SUPPORT**
- 4枚のカード（PC 4列 → タブレット 2列 → SP 1列）
- 線画イラスト：パーツが「外へ広がる → 中央へ集まる → 少し止まる → また広がる」（5.5秒周期）。接続線がパーツに合わせて伸び縮みし、青い点が外側 → 中央へ流れる。ホバーでさらに広がる

**05 CAREER PATH**
- 5枚のカード（PC 5列 → タブレット 3列 → SP 2列 → 374px 以下 1列）。カードごとに異なる淡い背景装飾
- 線画アイコン：画面に入ったときに線が1回描かれ、その後「広がる → 集まる」をループ（6.5秒周期）。線の上をごく淡い光が流れる

**06 INTERVIEW**
- PC（1200px 以上）：左に見出し＋「面接でお話しすること」、右に大きな面接ビジュアルの2カラム。1199px 以下は縦並び
- ビジュアル：飾り文字「Interview ───」が左からふわっと表示、右下のメッセージがゆっくり浮遊、淡いブルーの面とL字ライン
- 「面接でお話しすること」（2×2、SP は1列）：タイトル下の青い線が表示時に1回伸び、その後淡い光が流れる
- アイコン：白い円の外周を青い弧が回り（8秒）、人物・かばん・成長・会話それぞれ異なる動き

**07 FLOW**
- 詳細は [5. 最新の修正内容（07 FLOW）](#5-最新の修正内容07-flow) を参照

**Final CTA**
- PC用・SP用の完成画像を切り替え。`lpContent.js` の `finalCta.link` を設定するとクリック可能になる

**Footer**
- ロゴ・住所（全体が Google マップへのリンク）・利用規約・プライバシーポリシー・会社サイトへ（別タブ）
- 「会社サイトへ」ボタン：文字だけが縦方向にループ。ホバーで淡い光が通り、矢印が右へ動く
- 背景にやわらかい波の装飾。タブレットは2段、SP は縦並び・中央寄せ

---

## 5. 最新の修正内容（07 FLOW）

対象：`frontend/src/components/FlowSection.vue` / `FlowIcon.vue`

### 5-1. レイアウト

| | PC（768px 以上） | SP（767px 以下） |
| --- | --- | --- |
| 並び | **横方向の5STEP**（5列グリッド）＋右端にメモ | **左右交互の5STEP**（01・03・05 はアイコン左、02・04 はアイコン右＋文字右寄せ） |
| 各STEP | 番号 → 六角形アイコン → 名称 → 期間 | 横長の白いカード。六角形がカードの端に少し重なる。六角形の後ろに淡いブルーグレーの円 |
| ステップ間 | 点線＋両端の小さな丸＋中央の矢印 | 六角形の外側から次の六角形へ斜めに伸びる点線＋途中の小さな丸 |
| メモ | 05 の右側（点線と丸でつながる） | STEP 05 の下（中央よりやや右）。05 からの点線の終点 |

- 1200〜1399px：六角形を少し小さく
- 1199px 以下：メモを5STEPの下（右寄せ）へ移動し、05 → メモの点線は非表示
- 1023px 以下：六角形・文字をさらに小さく

### 5-2. 六角形アイコンのデザイン（PC・SP 共通）

- 白い六角形＋ごく淡い枠線＋やわらかい影
- 外周にごく淡い六角形のラインと、角の小さなリング（固定）
- STEP 05「内定」は番号・名称・枠線をブルーで強調（`highlight: true`）

### 5-3. アニメーション

| 対象 | 動き |
| --- | --- |
| 六角形の周囲 | 細い光のラインが外周を時計回りに周回（約5秒で1周、STEP ごとに開始位置をずらす） |
| アイコン内部（`FlowIcon.vue`） | 01 書類選考：本文の線が上から順に表示／02 カジュアル面談：吹き出しが交互に拡大縮小し、点が順に点灯／03 面接：人物がわずかに上下／04 条件確認：虫めがねが書類の上を小さく動く（PC は約3秒周期）／05 内定：旗が軽くなびく（竿は固定） |
| STEP間（PC） | 点線の上を小さな青い光が 01 → 02 → 03 → 04 → 05 の順に1つずつ流れる（7.5秒周期） |
| STEP間（SP） | 点線と同じ経路（01 → 05 → メモ）を小さな青い点がゆっくり進む（11秒周期）。経路は実際の要素位置から JS で計算し、画面サイズ変更・フォント読み込み時に再計算 |
| 各STEPの表示 | スクロールで下から順にふわっと表示 |
| メモ | カードがわずかに傾いた状態でゆっくり浮遊。時計アイコンの針が回転 |

### 5-4. SP版の調整

- **白いカードの幅を文字量に合わせて調整**：`width: fit-content`（最大 90%）。六角形の位置は従来どおり
- **STEP 05「05」「内定」をカード中央に配置**：コンパクトなカードにし、期間の行がない分を補正して上下・左右の中央にそろえる

### 5-5. 「最短1週間でご連絡！」note

- `lpContent.js` の `flow.note` で文言を管理（`\n` で改行）
- 時計アイコン＋テキスト。「1週間」だけブルーで少し大きく表示し、下に短い青いラインを表示

---

## 6. プロジェクト構成

```text
engineer-midcareer-simple-lp/
├── README.md
└── frontend/
    ├── index.html               # HTML テンプレート（meta・タイトル・Google Fonts）
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js           # Vite 設定（Vue プラグイン・@ エイリアス）
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── main.js              # アプリ起動・v-reveal 登録・共通CSS読み込み
        ├── App.vue              # ページ全体の構成（セクションの並び順）
        ├── data/
        │   └── lpContent.js     # ★ 文章・画像・リンクなどのコンテンツ管理ファイル
        ├── components/
        │   ├── OpeningAnimation.vue
        │   ├── Header.vue
        │   ├── HeroSection.vue
        │   ├── MembersSection.vue      # 01
        │   ├── WorkSection.vue         # 02
        │   ├── GrowthSection.vue       # 03
        │   ├── GrowthIcon.vue          #   03 の線画アイコン
        │   ├── SupportSection.vue      # 04
        │   ├── SupportIcon.vue         #   04 の線画イラスト
        │   ├── CareerSection.vue       # 05
        │   ├── CareerIcon.vue          #   05 の線画アイコン
        │   ├── InterviewSection.vue    # 06
        │   ├── InterviewTopicIcon.vue  #   06 の線画アイコン
        │   ├── FlowSection.vue         # 07
        │   ├── FlowIcon.vue            #   07 の線画アイコン
        │   ├── FinalCta.vue
        │   ├── Footer.vue
        │   ├── SectionHeading.vue      # 01〜07 共通の見出し
        │   └── common/
        │       ├── AiNetworkBackground.vue  # 背景の AI Network 装飾
        │       └── SectionDivider.vue       # セクション間の区切り線
        ├── composables/
        │   └── openingState.js  # オープニング完了状態の共有
        ├── directives/
        │   └── reveal.js        # スクロール表示（v-reveal）
        ├── styles/
        │   ├── variables.css    # 色・フォント・余白などの共通変数
        │   ├── base.css         # リセット・共通レイアウト・reveal 用スタイル
        │   └── background.css   # ページ・セクション背景（光・曲線）
        └── assets/images/
            ├── logo/            # preai-logo.png
            ├── hero/            # hero-pc.png / hero-sp.png
            ├── members/         # member-01〜03.png
            ├── work/            # work-pm-pmo.png / work-ai-dx-support.png / work-automation.png
            ├── growth/          # growth-main.png
            ├── interview/       # interview-main.png
            ├── cta/             # final-cta-pc.png / final-cta-sp.png
            └── icons/           # 線画SVG（※ 現在のコードからは参照されていません）
```

- 各セクションのアイコン・イラストは `*Icon.vue` 内にインライン SVG で描画しています。`assets/images/icons/` の SVG ファイルは現在使用されていません。
- 各コンポーネントのスタイルは `.vue` ファイル内の `<style scoped>` に記述しています。

---

## 7. 開発・起動方法

### 必要な環境

- Node.js：`^20.19.0` または `>=22.12.0`（Vite 8 の要件）
- npm

### 手順

```bash
cd frontend
npm install       # 依存パッケージのインストール
npm run dev       # 開発サーバー起動（vite）
npm run build     # 本番ビルド（frontend/dist に出力）
npm run preview   # ビルド結果のプレビュー
```

| コマンド | 実行内容 |
| --- | --- |
| `npm run dev` | `vite` |
| `npm run build` | `vite build` |
| `npm run preview` | `vite preview` |

※ `dist/` と `node_modules/` は `.gitignore` 対象です。

---

## 8. 更新方法

| 変更したいもの | 変更するファイル・フォルダ |
| --- | --- |
| 文章・ラベル・リンク・タグ・選考フロー・FLOW のメモ | `frontend/src/data/lpContent.js` |
| 画像（同じファイル名で上書き） | `frontend/src/assets/images/` |
| ファーストビュー画像（PC / SP） | `frontend/src/assets/images/hero/hero-pc.png` / `hero-sp.png` |
| ページ下部CTA画像（PC / SP） | `frontend/src/assets/images/cta/final-cta-pc.png` / `final-cta-sp.png` |
| Final CTA のリンク先 | `lpContent.js` の `finalCta.link` |
| フッターの住所・リンク | `lpContent.js` の `footer` |
| アイコン・イラスト | 各セクションの `*Icon.vue`（`frontend/src/components/`） |
| レイアウト・デザイン | `frontend/src/components/` |
| 色・フォント・余白などの共通設定 | `frontend/src/styles/variables.css` |

- 改行したい箇所には `\n` を入れてください（`lpContent.js` 冒頭に編集ルールのコメントがあります）。
- アイコンの種類は各項目の `iconType` で切り替えます（選べる値は `lpContent.js` のコメントを参照）。
- 07 FLOW で `highlight: true` を指定したステップはブルーで強調表示されます。
- SP画像は画面幅 767px 以下で自動的に切り替わります。
- 現在の画像は参考デザインから切り出した仮画像です。本番用の高解像度画像に差し替えてください。

---

## 9. 更新履歴

| 日付 | 内容 |
| --- | --- |
| 2026-10-14 | README を最新の実装内容に合わせて全面更新（概要・使用技術・ページ構成・アニメーション・プロジェクト構成・起動方法を追記）。07 FLOW の最新仕様（PC 横5STEP / SP 左右交互5STEP、六角形アイコンと周回アニメーション、アイコン内部のアニメーション、STEP 間の点線・小さな丸のアニメーション、SP カード幅の調整、STEP 05 の中央配置、「最短1週間でご連絡！」note）を記載 |
