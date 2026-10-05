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

// --- アイコン（線画） ---
import iconBook from '@/assets/images/icons/book.svg'
import iconCode from '@/assets/images/icons/code.svg'
import iconTeam from '@/assets/images/icons/team.svg'
import iconGrowth from '@/assets/images/icons/growth.svg'
import iconMentor from '@/assets/images/icons/mentor.svg'
import iconStudy from '@/assets/images/icons/study.svg'
import iconConsult from '@/assets/images/icons/consult.svg'
import iconCertificate from '@/assets/images/icons/certificate.svg'
import iconDeveloper from '@/assets/images/icons/developer.svg'
import iconDatabase from '@/assets/images/icons/database.svg'
import iconAi from '@/assets/images/icons/ai.svg'
import iconLeader from '@/assets/images/icons/leader.svg'
import iconManager from '@/assets/images/icons/manager.svg'
import iconPerson from '@/assets/images/icons/person.svg'
import iconHistory from '@/assets/images/icons/history.svg'
import iconIdea from '@/assets/images/icons/idea.svg'
import iconQuestion from '@/assets/images/icons/question.svg'
import iconDocument from '@/assets/images/icons/document.svg'
import iconChat from '@/assets/images/icons/chat.svg'
import iconContract from '@/assets/images/icons/contract.svg'
import iconFlag from '@/assets/images/icons/flag.svg'


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
        description: '大手企業のDX・ITプロジェクトに参画し、会議運営、進捗・課題管理、関係者との調整などを担当します。経験を積みながら、要件整理や顧客折衝、プロジェクト全体を動かすPM業務へとステップアップしていきます。',
        tags: ['Excel', 'PowerPoint', 'Teams', 'Slack','生成AI'] // 技術タグ
      },
      {
        image: workMobile,
        alt: 'スマートフォンアプリを確認している様子',
        title: 'AI・DXツール導入支援',
        description: '大手企業を中心に、生成AIや業務効率化ツールの導入・活用を支援します。お客様の業務や課題を整理し、ツールの選定・導入から、活用方法の検討、現場への定着までサポートします。',
        tags: ['Microsoft Copilot', 'Power Platform（Power Apps等）', 'ChatGPT', 'Claude','Gemini','NotebookLM']
      },
      {
        image: workAi,
        alt: 'データ分析のダッシュボード画面',
        title: '業務自動化',
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
    title: '未経験でも安心の\n成長ステップ',
    description: '基礎から実践まで、段階的にスキルを\n身につけられる環境があります。',
    image: growthMain,
    alt: 'ノートPCでプログラミングを学ぶ様子',
    // 写真の上に表示される手書き風メッセージ
    note: '未経験から、\nできるを積み重ねよう。',
    // ステップ1つ = { … } 1つ
    steps: [
      {
        label: 'STEP 01',
        period: '入社〜1ヶ月',
        title: '基礎学習',
        description: 'ITの基礎知識、プログラミングの基本を研修で学びます。PCの使い方からでも大丈夫です。',
        icon: iconBook
      },
      {
        label: 'STEP 02',
        period: '2〜3ヶ月',
        title: '実践課題',
        description: '簡単なアプリを実際に作りながら、チーム開発の流れやGitの使い方を身につけます。',
        icon: iconCode
      },
      {
        label: 'STEP 03',
        period: '4ヶ月〜',
        title: 'OJT・プロジェクト参加',
        description: '先輩と一緒に実際のプロジェクトへ参加。わからないことはすぐに相談できる環境です。',
        icon: iconTeam
      },
      {
        label: 'STEP 04',
        period: '1年目以降',
        title: '継続的なスキルアップ',
        description: '新しい技術の勉強会や資格取得を通じて、得意分野をどんどん伸ばしていきます。',
        icon: iconGrowth
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
    title: 'キャリアサポート',
    description: 'ひとりで悩まない。成長を支える仕組みがあります。',
    sideNote: 'Support\nyour career',
    items: [
      {
        title: 'メンター制度',
        description: '年の近い先輩がメンターとしてつき、仕事の進め方から日々の悩みまで相談にのります。',
        icon: iconMentor
      },
      {
        title: '研修・学習環境',
        description: 'オンライン教材や書籍購入を会社がサポート。業務時間内の学習時間も確保しています。',
        icon: iconStudy
      },
      {
        title: 'キャリア相談',
        description: '定期的な1on1面談で、目指したい方向や次のステップを一緒に考えます。',
        icon: iconConsult
      },
      {
        title: '資格取得支援',
        description: '基本情報技術者試験などの受験費用を会社が負担。合格時にはお祝い金もあります。',
        icon: iconCertificate
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
    items: [
      {
        title: '開発エンジニア',
        description: 'Web・モバイルの設計から\n実装まで幅広く担当',
        icon: iconDeveloper
      },
      {
        title: 'データエンジニア',
        description: 'データ基盤を整え、\n活用できる形に整備',
        icon: iconDatabase
      },
      {
        title: 'AIエンジニア',
        description: '機械学習・生成AIを使った\n仕組みを開発',
        icon: iconAi
      },
      {
        title: 'プロジェクトリーダー',
        description: 'チームをまとめ、\n開発をリード',
        icon: iconLeader
      },
      {
        title: 'PM・上流工程',
        description: 'お客様と要件を決め、\nプロジェクトを成功へ導く',
        icon: iconManager
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
    description: '面接は「見極める場」ではなく「お互いを知る場」です。\n緊張せず、ありのままのあなたを教えてください。',
    image: interviewMain,
    alt: '面接を担当する代表取締役のイラスト',
    // 画像左上の大きな飾り文字
    scriptLabel: 'Interview',
    // 画像右下に重なる小さなメッセージ（\n で改行）
    message: 'あなたの\nこれからの可能性を\n一緒に考えたい',
    topicsTitle: '面接でお話しすること',
    topics: [
      {
        title: 'あなた自身について',
        description: '得意なことや大切にしていることを教えてください。',
        icon: iconPerson
      },
      {
        title: 'これまでの経験について',
        description: '前職や学生時代に取り組んだことを、ありのままお聞かせください。',
        icon: iconHistory
      },
      {
        title: '仕事への向き合い方について',
        description: '仕事をするうえで大切にしたいことを教えてください。',
        icon: iconIdea
      },
      {
        title: '気になること・聞いてみたいこと',
        description: '仕事内容や働き方など、何でも質問してください。',
        icon: iconQuestion
      }
    ]
  },

  // ========================================
  // 07 選考の流れ
  // ↓ 選考ステップ・期間・右側のメモはここで変更できます
  //   highlight: true にしたステップはアクセントカラー（赤茶色）になります
  // ========================================
  flow: {
    number: '07',
    englishTitle: 'FLOW',
    title: '選考の流れ',
    description: 'シンプルでスピーディーに、できるだけ早く結果をご連絡します。',
    note: '最短1週間で\nご連絡！', // 右側の小さなメモ
    items: [
      { number: '01', title: '書類選考', period: '（1〜2日）', icon: iconDocument },
      { number: '02', title: 'カジュアル面談', period: '（オンライン/1回）', icon: iconChat },
      { number: '03', title: '面接', period: '（1回）', icon: iconPerson },
      { number: '04', title: '条件確認', period: '（1〜2日）', icon: iconContract },
      { number: '05', title: '内定', period: '', icon: iconFlag, highlight: true }
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
