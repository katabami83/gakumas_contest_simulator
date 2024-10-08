
## 構成
<pre>
├── score_dataset # コンテスト編成とそのスコアのデータセット
│   ├── convert.py
│   └── data
│       ├── dataset.csv
│       ├── dataset.js
│       └── dataset.json
│
├── scripts # メインスクリプト
│   ├── scripts.js # 過去の遺産
│   ├── simulator # シミュレーターの本体
│   │   ├── class
│   │   │   ├── AutoContest.js
│   │   │   ├── Calculator.js # 効果量と評価値の計算クラス
│   │   │   ├── ConditionChecker.js # 発動条件チェッククラス
│   │   │   ├── Contest.js
│   │   │   ├── Deck.js # デッキ. ドロー処理など
│   │   │   ├── PIdol.js # メインロジック
│   │   │   ├── PIdolLog.js
│   │   │   ├── PIdolStatus.js # ステータス効果
│   │   │   ├── PItemManager.js
│   │   │   └── TurnType.js 
│   │   ├── data
│   │   │   ├── contestData.js # コンテストデータ
│   │   │   ├── pIdolData.js # Pアイドルデータ
│   │   │   ├── pItemData.js # Pアイテムデータ
│   │   │   └── skillCardData.js # スキルカードデータ
│   │   └── run.js
│   ├── util
│   │   └── utility.js
│   └── worker.js # 
│
└── src # GithubPages用
</pre>
---

## メモ（備忘録）

### ごまかしてる項目
* ターンタイプ（Vo/Da/Vi）のターン数と生成アルゴリズム
  * 多分ターン数と審査基準比でターン数が決まる
  * ターンごとの配色アルゴリズムもちょっと特殊なことをしていて、それで1Tの属性が確定するか決まってると思う
* オートの挙動
  * わからん
  * 編成とスコアのデータセットを作って合わせに行きたい
  * 未来視とどう付き合うか
* ステータス効果
  * モノによって、ターンが蓄積するもの(好調)、効果量が蓄積するもの(集中)、効果が独立して蓄積するもの（パラメータ上昇量・次のカードを発動）があって、ちゃんと定義したい。
* 名称
  * 元気をとりあえず'block'としているが、元気の方がいい?
* 実行時間
  * 作り直したときに実行時間が4倍ぐらいになり、2000回実行も1並列だと6秒ぐらいかかるようになってしまった。(3秒ぐらいが限度)
    * とりあえずWebWorkerで並列させることで無理やり解決

### 未実装項目
* 応援/トラブルの実装
* メモリーアビリティの実装
* デバフ系のステータス効果
* アイドルの道にある特殊効果（廃棄札を山札にinなど）

### 放置してるバグ
* ティーパーティで手札強化したときにティーパーティ自体も強化してる
  * 現状関係ないので放置
* ターン開始時に手札に入るが6枚以上あるとき6枚目以降は山札のトップに置かれる
  * 現状関係ないので放置
