// オープニングの完了状態（App 全体で共有）
// ・オープニングを再生しない場合（同じタブで再生済み・動きを減らす設定）は、最初から完了扱い
// ・文字アニメーションなど「オープニングの後に見せたい動き」は、これが true になってから始める
import { ref } from 'vue'

export const openingDone = ref(false)

export const markOpeningDone = () => {
  openingDone.value = true
}
