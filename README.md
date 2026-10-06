# engineer-midcareer-simple-lp

PREAI 採用LP（Vue 3 + Vite）。プロジェクトは `frontend/` 配下にあります。

## 起動・ビルド

```bash
cd frontend
npm install
npm run dev     # 開発サーバー
npm run build   # 本番ビルド（frontend/dist に出力）
```

## 更新方法

| 変更したいもの | 変更するファイル・フォルダ |
| --- | --- |
| 文章・ラベル・リンク・タグ・選考フロー | `frontend/src/data/lpContent.js` |
| 画像（同じファイル名で上書き） | `frontend/src/assets/images/` |
| ファーストビュー画像（PC / SP） | `frontend/src/assets/images/hero/hero-pc.png` / `hero-sp.png` |
| ページ下部CTA画像（PC / SP） | `frontend/src/assets/images/cta/final-cta-pc.png` / `final-cta-sp.png` |
| アイコン（線画SVG） | `frontend/src/assets/images/icons/` |
| レイアウト・デザイン | `frontend/src/components/` |
| 色・フォント・余白などの共通設定 | `frontend/src/styles/variables.css` |

- SP画像は画面幅 767px 以下で自動的に切り替わります。
- 現在の画像は参考デザインから切り出した仮画像です。本番用の高解像度画像に差し替えてください。
