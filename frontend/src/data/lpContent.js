// ============================================================
// PREAI 採用LP コンテンツ管理ファイル
// ------------------------------------------------------------
// ページに表示される「文章・画像・ラベル」はすべてこのファイルで管理しています。
// デザイン（レイアウト・色・サイズ）を触らずに内容だけ変更できます。
//
// 【文章を変更したいとき】
//   '…' で囲まれた文字を書き換えて保存してください。
//   ※ ' （シングルクォート）や , （カンマ）は消さないように注意してください。
//
// 【改行したいとき】
//   改行したい場所に \n を入れてください。
//   例：'どんな人が\n働いている？'
//
// 【画像を変更したいとき】
//   いちばん簡単な方法：
//     src/assets/images/ の中の画像を「同じファイル名」で上書きしてください。
//   ファイル名を変えたいとき：
//     下の「画像の読み込み」にある import のパスも合わせて変更してください。
//
// 【項目（カードなど）を増やす・減らすとき】
//   { … } のかたまり1つが1項目です。
//   コピーして貼り付けると増やせます。削除すると減らせます。
// ============================================================


// ============================================================
// 画像の読み込み
// ↓ 画像ファイルの場所はここで指定しています
// ============================================================

// --- ロゴ画像（ヘッダー・フッター共通） ---
import logoImage from '@/assets/images/logo/preai-logo.png'

// --- HERO（ファーストビュー）画像 ---
import heroPc from '@/assets/images/hero/hero-pc.png'
import heroSp from '@/assets/images/hero/hero-sp.png'

// --- 01 働く人 ---
import member01 from '@/assets/images/members/member-01.png'
import member02 from '@/assets/images/members/member-02.png'
import member03 from '@/assets/images/members/member-03.png'

// --- 02 仕事内容 ---
import workWeb from '@/assets/images/work/work-web.png'
import workMobile from '@/assets/images/work/work-mobile.png'
import workAi from '@/assets/images/work/work-ai.png'

// --- 03 成長ステップ ---
import growthMain from '@/assets/images/growth/growth-main.png'

// --- 06 面接について ---
import interviewMain from '@/assets/images/interview/interview-main.png'

// --- FINAL CTA（ページ下部）画像 ---
import finalCtaPc from '@/assets/images/cta/final-cta-pc.png'
import finalCtaSp from '@/assets/images/cta/final-cta-sp.png'


// ========================================
// ロゴ（ヘッダー・フッター共通）
// ↓ ロゴ画像を変えたいときは
//   src/assets/images/logo/preai-logo.png を同じ名前で上書きしてください
//   alt：画像が表示されないときや読み上げ時に使われる文字です
// ========================================
const logo = {
  image: logoImage,
  alt: 'PREAI'
}


export const lpContent = {

  // ========================================
  // HEADER（ページ上部のメニュー）
  // ↓ ロゴ・メニュー名・ボタン文言はここで変更できます
  //   href：クリックしたときに移動する先（#members など＝ページ内の各セクション）
  // ========================================
  header: {
    logo, // ロゴは上の「ロゴ」で設定
    navigation: [
      { label: '働く人', href: '#members' },
      { label: '仕事内容', href: '#work' },
      { label: '成長のサポート', href: '#growth' },
      { label: 'キャリア', href: '#career' },
      { label: '選考・面接', href: '#interview' }
    ],
    // 右端の小さな見出し（クリックできない文字として表示）
    cta: { label: 'まずは話を聞いてみる' },
    // スマホのメニューボタン（読み上げ用の文言）
    menuOpenLabel: 'メニューを開く',
    menuCloseLabel: 'メニューを閉じる'
  },

  // ========================================
  // HERO（ファーストビュー）
  // ↓ PC/SP画像はここで変更できます
  //   キャッチコピー・人物などはすべて画像の中に含まれています。
  //   文字を変えたい場合は画像そのものを作り直してください。
  //   alt：画像が表示されないときや読み上げ時に使われる説明文です
  // ========================================
  hero: {
    imagePc: heroPc, // PC用（768px以上）
    imageSp: heroSp, // スマホ用（767px以下）
    alt: '未経験から、市場価値の高いIT人材へ。AIとともに成長するキャリアをPREAIで始めませんか？'
  },

  // ========================================
  // 01 働く人
  // ↓ 文章・画像・メンバー紹介はここで変更できます
  // ========================================
  members: {
    number: '01',
    englishTitle: 'MEMBERS',
    title: 'どんな人が\n働いている？',
    description: 'PREAIには、さまざまな経験や強みを持ったメンバーが働いています。\nこれまで培ってきた経験を活かしながら、IT・AIという新しいスキルを身につけ、それぞれのキャリアに挑戦しています。\n共通しているのは、新しいことを学び、自分の可能性を広げようとする姿勢です。',
    // メンバー1人 = { … } 1つ
    items: [
      {
        image: member01,
        alt: 'AI開発に挑戦中のメンバー',
        roleLabel: 'CAREER CONSULTANT' // 画像の横に縦書きで表示される役割（英語）        
      },
      {
        image: member02,
        alt: '未経験からエンジニアになったメンバー',
        roleLabel: 'ENGINEER'
      },
      {
        image: member03,
        alt: 'データ分析に挑戦中のメンバー',
        roleLabel: 'ENGINEER'
      }
    ]
  },

  // ========================================
  // 02 仕事内容
  // ↓ カードの文章・画像・タグはここで変更できます
  // ========================================
  work: {
    number: '02',
    englishTitle: 'OUR WORK',
    title: 'PREAIでの仕事',
    description: 'お客様の課題を整理し、AIやITを活用して解決へ導く仕事です。\nまずはPMOやAI導入支援から経験し、将来的には要件定義やプロジェクトマネジメントにも挑戦できます。',
    // 右側の小さな英文（装飾）
    sideNote: 'Create\nReal Value\nwith AI',
    // カード1枚 = { … } 1つ
    items: [
      {
        image: workWeb,
        alt: 'ノートPCでWebアプリを開発している様子',
        title: 'PM・PMO',
        iconType: 'team', // アイコンの種類（team / ai / automation）
        description: '大手企業のDX・ITプロジェクトに参画し、会議運営、進捗・課題管理、関係者との調整などを担当します。経験を積みながら、要件整理や顧客折衝、プロジェクト全体を動かすPM業務へとステップアップしていきます。',
        tags: ['Excel', 'PowerPoint', 'Teams', 'Slack','生成AI'] // 技術タグ
      },
      {
        image: workMobile,
        alt: 'スマートフォンアプリを確認している様子',
        title: 'AI・DXツール導入支援',
        iconType: 'ai',
        description: '大手企業を中心に、生成AIや業務効率化ツールの導入・活用を支援します。お客様の業務や課題を整理し、ツールの選定・導入から、活用方法の検討、現場への定着までサポートします。',
        tags: ['Microsoft Copilot', 'Power Platform（Power Apps等）', 'ChatGPT', 'Claude','Gemini','NotebookLM']
      },
      {
        image: workAi,
        alt: 'データ分析のダッシュボード画面',
        title: '業務自動化',
        iconType: 'automation',
        description: 'n8nやAIを活用し、これまで人が手作業で行っていた業務を自動化します。業務フローを整理し、AIや各種サービスを組み合わせながら、実際に動く仕組みをつくります。',
        tags: ['n8n', 'Claude Code', 'Codex', 'API連携']
      }
    ]
  },

  // ========================================
  // 03 成長ステップ
  // ↓ 説明文・写真・各ステップの内容はここで変更できます
  // ========================================
  growth: {
    number: '03',
    englishTitle: 'GROWTH STEP',
    title: '実践から始める、\nPREAIならではの\n成長ステップ',
    description: '知識を学ぶだけではなく、\nAI・自動化ツールを実際に作るところからスタート。\n実務経験とキャリア支援を通じて、\n自分の強みを伸ばしていきます。',
    image: growthMain,
    alt: 'ノートPCでプログラミングを学ぶ様子',
    // 写真の上に表示される手書き風メッセージ
    note: '未経験から、\nできるを積み重ねよう。',
    // ステップ1つ = { … } 1つ
    // iconType：'book' / 'code' / 'team' / 'growth' から選べます（線画アイコン：GrowthIcon.vue）
    steps: [
      {
        label: 'STEP 01',
        period: '入社〜1ヶ月',
        title: '実践型AI・IT研修',
        description: 'IT・AIの基礎を学びながら、n8nを使った業務自動化に挑戦。\n実際に自分で自動化ツールを作り、AIを「知っている」だけではなく\n「仕事で使える」状態を目指します。',
        iconType: 'book'
      },
      {
        label: 'STEP 02',
        period: '2ヶ月目〜',
        title: 'OJT・プロジェクト参加',
        description: '先輩と一緒に実際のプロジェクトへ参画。\nPMOやAI・DXツールの導入支援など、実務を経験しながら仕事の進め方や\n顧客とのコミュニケーションを身につけます。',
        iconType: 'code'
      },
      {
        label: 'STEP 03',
        // period: '4ヶ月〜',
        title: '定期的なキャリア1on1',
        description: '専属キャリアコンサルとの1on1を実施。\n現在の経験や強み、目指したいキャリアを整理し、\n次に身につけるスキルや挑戦する仕事を一緒に考えます。',
        iconType: 'team'
      },
      {
        label: 'STEP 04',
        // period: '1年目以降',
        title: '継続的なスキルアップ',
        description: 'AI・ITの学習を継続しながら、要件定義やプロジェクトマネジメント、\n AI活用・業務自動化など、目指すキャリアに必要な専門性を伸ばしていきます。',
        iconType: 'growth'
      }
    ]
  },

  // ========================================
  // 04 キャリアサポート
  // ↓ サポート制度の名前・説明はここで変更できます
  // ========================================
  support: {
    number: '04',
    englishTitle: 'SUPPORT',
    title: 'AI時代の成長環境',
    description: 'PREAIでは、AIを研修だけで終わらせません。\n日々の業務から実際のプロジェクトまで、AIを使い、つくり、活かす環境を整えています。',
    sideNote: 'Support\nyour career',
    // iconType：'tools' / 'daily' / 'build' / 'dx' から選べます（カード右上の番号は 01〜 自動）
    items: [
      {
        title: 'AIツール費用を会社負担',
        description: '必要なAIツールを、会社負担で利用できます。ChatGPTやClaude、Codexなど、\n業務や本人のスキルに合わせて必要なAIツール・プランを会社が負担。新しいツールも積極的に取り入れています。',
        iconType: 'tools' // 線画イラストの種類（SupportIcon.vue）
      },
      {
        title: 'AIを日常業務で活用',
        description: 'AIは、特別なものではなく日々の仕事の一部です。情報収集や資料作成、アイデア整理、議事録、分析など、さまざまな業務でAIを活用。実務を通じて、AIを使いこなす力を身につけます。',
        iconType: 'daily' // 線画イラストの種類（SupportIcon.vue）
      },
      {
        title: 'AIで実際につくる',
        description: '使うだけでなく、AIを活用して仕組みをつくります。n8nやClaude Code、Codexなどを活用し、業務自動化やツール開発に挑戦。自分で考え、実際に動くものをつくる経験を積めます。',
        iconType: 'build' // 線画イラストの種類（SupportIcon.vue）
      },
      {
        title: 'AI・DX案件を経験',
        description: '学んだスキルを、実際のプロジェクトで活かします。大手企業を中心としたAI・DXプロジェクトに参画。Microsoft CopilotやPower Platformなどの導入・活用支援を通じて、AIをビジネスの現場で活かす経験を積みます。',
        iconType: 'dx' // 線画イラストの種類（SupportIcon.vue）
      }
    ]
  },

  // ========================================
  // 05 キャリアの広がり
  // ↓ キャリア例の名前・説明はここで変更できます
  // ========================================
  career: {
    number: '05',
    englishTitle: 'CAREER PATH',
    title: 'キャリアの広がり',
    description: '経験を積んだ先には、さまざまなキャリアの選択肢があります。',
    sideNote: 'More career\npossibilities',
    // iconType：'pm' / 'consultant' / 'dx' / 'automation' / 'ai-consultant' から選べます
    items: [
      {
        title: 'PM・プロジェクトマネージャー',
        description: '顧客やチームと連携\nしながら、プロジェクト\n全体を推進する。',
        iconType: 'pm' // 線画アイコンの種類（CareerIcon.vue）
      },
      {
        title: 'ITコンサルタント',
        description: 'お客様の課題を整理し、\nITを活用した解決策を \n企画・提案する。',
        iconType: 'consultant' // 線画アイコンの種類（CareerIcon.vue）
      },
      {
        title: 'AI・DXプロジェクトリーダー',
        description: 'AI・DX導入プロジェクトの\n中心となり、顧客・エンジニアを巻き込みながら導入を推進する。',
        iconType: 'dx' // 線画アイコンの種類（CareerIcon.vue）
      },
      {
        title: 'AI・自動化エンジニア',
        description: 'n8nやClaude Codeなどを活用し、\nAIを組み込んだ業務自動化や仕組みをつくる。',
        iconType: 'automation' // 線画アイコンの種類（CareerIcon.vue）
      },
      {
        title: 'AIコンサルタント',
        description: '業務課題を分析し、\n生成AIやAIツールを活用した業務改善を提案する。',
        iconType: 'ai-consultant' // 線画アイコンの種類（CareerIcon.vue）
      }
    ]
  },

  // ========================================
  // 06 面接について
  // ↓ 説明文・写真・面接でお話しすることはここで変更できます
  // ========================================
  interview: {
    number: '06',
    englishTitle: 'INTERVIEW',
    title: '面接について',
    description: '面接は応募を強く促すCTAではなく、\n『まずは面接で、仕事内容や会社について詳しく話を聞いてみてください』というクローズドLP向けのトーンにする。',
    image: interviewMain,
    alt: '面接を担当する代表取締役のイラスト',
    // 画像左上の大きな飾り文字
    scriptLabel: 'Interview',
    // 画像右下に重なる小さなメッセージ（\n で改行）
    message: 'あなたの\nこれからの可能性を\n一緒に考えたい',
    topicsTitle: '面接でお話しすること',
    // iconType：'person' / 'briefcase' / 'growth' / 'chat' から選べます
    topics: [
      {
        title: 'あなた自身について',
        description: '社会人経験者向けに\n『これまでの経験・強み』\nについて話す内容へ。',
        iconType: 'person' // アイコンの種類（InterviewTopicIcon.vue）
      },
      {
        title: 'これまでの経験について',
        description: '『これまでどんな仕事・\n役割を経験してきたか』など、\n社会人経験を確認する内容へ。',
        iconType: 'briefcase' // アイコンの種類（InterviewTopicIcon.vue）
      },
      {
        title: '仕事への向き合い方について',
        description: '『今後どんなキャリアを\n築きたいか／IT・AI領域で\n何をやってみたいか』を話す\n内容へ。',
        iconType: 'growth' // アイコンの種類（InterviewTopicIcon.vue）
      },
      {
        title: '気になること・聞いてみたいこと',
        description: '仕事内容・働き方・案件・\nキャリアなど、応募者側から\n自由に質問できる内容は残す。',
        iconType: 'chat' // アイコンの種類（InterviewTopicIcon.vue）
      }
    ]
  },

  // ========================================
  // 07 選考の流れ
  // ↓ 選考ステップ・期間・右側のメモはここで変更できます
  //   highlight: true にしたステップはアクセントカラー（青）になります
  //   iconType：アイコンの種類（FlowIcon.vue：document / chat / person / search / flag）
  // ========================================
  flow: {
    number: '07',
    englishTitle: 'FLOW',
    title: '選考の流れ',
    description: 'シンプルでスピーディーに、できるだけ早く結果をご連絡します。',
    note: '最短1週間で\nご連絡！', // 右側の小さなメモ
    items: [
      { number: '01', title: '書類選考', period: '（1日）', iconType: 'document' },
      { number: '02', title: 'カジュアル面談', period: '（オンライン/1回）', iconType: 'chat' },
      { number: '03', title: '面接', period: '（1回）', iconType: 'person' },
      { number: '04', title: '条件確認', period: '（1日）', iconType: 'search' },
      { number: '05', title: '内定', period: '', iconType: 'flag', highlight: true }
    ]
  },

  // ========================================
  // FINAL CTA（ページ下部の大きな画像）
  // ↓ PC/SP画像はここで変更できます
  //   キャッチコピー・人物などはすべて画像の中に含まれています。
  //   link：画像をクリックしたときの移動先（応募フォームURLなど）。
  //         '' のままならクリックできない画像になります。
  // ========================================
  finalCta: {
    imagePc: finalCtaPc, // PC用（768px以上）
    imageSp: finalCtaSp, // スマホ用（767px以下）
    alt: 'ここから、新しいキャリアを一緒に。PREAIは、あなたの挑戦を応援します。',
    link: ''
  },

  // ========================================
  // FOOTER（ページ最下部）
  // ↓ 住所・リンク先・コピーライトはここで変更できます
  // ========================================
  footer: {
    logo, // ロゴは上の「ロゴ」で設定

    // --- 会社住所 ---
    // postalCode / line1 / line2：画面に表示される住所
    // mapQuery：Google マップで検索する住所（住所を変えたらここも同じ内容に変更）
    address: {
      postalCode: '〒464-0807',
      line1: '愛知県名古屋市千種区東山通2-4-1',
      line2: 'HARVEY MOTOYAMA 3F',
      mapQuery: '愛知県名古屋市千種区東山通2-4-1 HARVEY MOTOYAMA 3F'
    },

    // --- リンク ---
    // url：リンク先のURL（例：'https://example.com/privacy'）
    //      '' のままだとクリックできない文字として表示されます
    links: {
      terms: {
        label: '利用規約',
        url: ''
      },
      privacy: {
        label: 'プライバシーポリシー',
        url: ''
      },
      corporate: {
        label: '会社サイトへ', // 右側の丸いボタン（別タブで開きます）
        url: 'https://www.preai.co.jp/company/'
      }
    },

    copyright: '© 株式会社PREAI. All Rights Reserved.'
  }
}
