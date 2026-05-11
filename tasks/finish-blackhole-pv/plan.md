# Plan: BlackHolePV 完成まで

## 現在のフェーズ

初回プレビュー実装済み。現在はユーザーフィードバックを反映する調整フェーズ。

方針は以下で確定する。

- 最終的には実機映像をメインに使う。
- ただし実機映像は後で理想のものを撮り直す。
- そのため現段階の S01/S04/S05/S07 は、真っ黒な背景に「どんな実機映像を撮るべきか」を示すテキストを出す。
- CSS/Remotion モックは、S03/S06/S08/S09/S10/S11/S12 のようにモック指定のあるシーンで使う。
- 実機映像シーンを CSS モックで勝手に代替しない。

## コンセプト

- `Black Hole` は Chrome 拡張。
- マウスポインタがブラックホールになる。
- Web 上の文字やオブジェクトを吸い込む。
- 実用性ゼロのおもちゃとして見せる。
- トーンは真面目で洗練させる。
- ただし根っこには遊び心がある。

## 技術仕様

- Composition: `BlackHolePV`
- 解像度: `1920x1080`
- 現在のプレビュー FPS: `30`
- 尺: 約 `63秒`
- 現在の総フレーム数: `1890`
- レビュー用 FPS: `60`
- レビュー用総フレーム数: `3780`
- 最終納品 FPS: `60`
- Remotion: `4.0.457`
- BH コア色: `#0A0508`
- BH 内部: 真っ黒、内部パターンなし
- 背景: warm cream `#F5F0E8`
- 日本語フォント: Axis Std
- 英語タイトル: PlayfairDisplay
- UI: Inter

## 素材方針

将来的に使う想定の素材:

- `public/video/demo-new.mp4`: Google 吸い込み + 復元
- `public/video/demo-long.mp4`: YouTube / Google 長尺
- `public/mockups/slack-boss-avatar.png`: Slack 上司アバター
- `public/mockups/notification-icon-*.png`: 通知アイコン
- `public/mockups/news-header-logo.png`: ニュースロゴ
- `public/mockups/bh-extension-icon.png` または `bh-chrome-icon.png`
- `public/kosukuma/kosukuma-lying.png`

現状:

- `public/video/` はまだない。
- 今回は動画素材を待たない。
- 実機映像シーンは、黒背景の「撮影指示プレースホルダー」として実装する。
- S06/S08 のようなモックシーンは、最終的には gpt-image-2 で作った高品質なベース画像を Remotion 上で動かす。
- ただし現在の Codex セッションでは built-in の `image_gen` ツールが公開されていないため、今回の即時修正では CSS/既存素材で構造を整え、生成プロンプトを `tasks/finish-blackhole-pv/image-prompts.md` に残す。
- CLI フォールバックとして `scripts/generate-pv-mockups.sh` を追加した。
- `OPENAI_API_KEY` を設定して `npm run generate:pv-mockups` を実行すると、gpt-image-2 で S06/S08 のベース画像を生成して `public/mockups/generated/` に保存する。
- `npm run setup:imagegen` で、プロジェクト内の `.venv-imagegen` に画像生成用 Python 環境と `openai` パッケージを準備する。
- `generate:pv-mockups` は `.env.local` / `.env` / 現在の shell / Windows ユーザー環境変数の順に `OPENAI_API_KEY` を拾う。
- `OPENAI_ENV_FILE=/mnt/d/ダウンロード/ディスコード/.env npm run generate:pv-mockups` のように、任意の `.env` ファイルも指定できる。

## FPS 方針

- ユーザー確認用のローカルプレビュー速度は、現状の `30fps / 1890 frames / 63秒` を維持する。
- 単純に `fps=60` へ変更すると、30fps 前提で書かれた各シーン内の frame 値が倍速に見える。
- 最終的に `60fps` が必要な段階で、全シーンの内部 frame 値・duration・still 確認フレームを `2倍` に再スケールする。
- 「速度は今のまま、フレームレートだけ60fps」が完成条件。
- 現在は `BlackHolePV` を30fps版、`BlackHolePV60` を60fpsレビュー版として並べる。
- `BlackHolePV60` は内部のアニメーション時間を30fps基準に変換して、速度を変えずに60fpsで再生する。

## 実機映像プレースホルダーのルール

対象:

- S01
- S04
- S05
- S07

見た目:

- 背景は黒、またはほぼ黒。
- テキストは中央寄せ、白〜オフホワイト。
- フォントは Axis Std。
- マーケティング文ではなく、撮影指示として読む。
- 後でどんな実機映像を撮ればよいかが一目で分かる。

基本フォーマット:

```text
実機映像予定
<ショット名>

撮りたい映像:
<具体的な撮影内容>
```

## 12シーン構成

### S01 ColdOpen, 3秒 / 180 frames

種別: 実機映像予定。現段階では黒背景プレースホルダー。

理想:

- いきなりブラウザ上で BH が文字を吸い込んでいる。
- 説明なし。
- タイトルなし。
- 体験だけで掴む。

表示するプレースホルダーテキスト:

```text
実機映像予定
Cold Open: いきなり吸い込む

撮りたい映像:
ブラウザ上の文章にBHカーソルを重ね、
説明なしで文字が吸い込まれて消える瞬間から始める。
```

### S02 Sweep, 6秒 / 360 frames

種別: Remotion。

内容:

- クリーム背景。
- 中央にキャッチ:
  `インターネットの文字を、ブラックホールで吸い込みませんか？`
- BH が右から左に疾走し、文字を1文字ずつ吸い込む。

現状メモ:

- 既存実装はかなり近い。
- ベースラインでは左から右に見えるので、仕様どおり右から左か確認して調整する。
- 空の caption `div` は削除または意味のある要素にする。

### S03 Slack, 6秒 / 360 frames

種別: CSS/Remotion モック。

内容:

- Slack 風メッセージ画面。
- 上司からのパワハラメッセージを BH が吸い込む。
- gpt-image-2 のアバター素材を使う。

現状メモ:

- 既存実装は大きく使える。
- 作り直しではなく、磨き込み中心。

### S04 Google, 5秒 / 300 frames

種別: 実機映像予定。現段階では黒背景プレースホルダー。

理想:

- Google 検索結果ページ。
- 検索結果のタイトルやスニペットを BH が吸い込む。

表示するプレースホルダーテキスト:

```text
実機映像予定
Google検索結果を吸い込む

撮りたい映像:
Google検索結果のタイトル・スニペットを、
BHカーソルが横切りながら数行まとめて吸い込む。
```

### S05 BeforeAfter, 5秒 / 300 frames

種別: 実機映像予定。現段階では黒背景プレースホルダー。

理想:

- ページ内の本文、見出し、UI 要素を吸い込み切る。
- 最後にページがほぼ真っ白になる。
- ビフォーアフターが分かる。

表示するプレースホルダーテキスト:

```text
実機映像予定
ページ全体を空白にする

撮りたい映像:
ニュース/記事ページの本文・見出し・UI要素を吸い込み切り、
最後にページがほぼ真っ白になるビフォーアフター。
```

### S06 Notification, 4秒 / 240 frames

種別: CSS/Remotion モック。最終的には gpt-image-2 ベース画像 + Remotion 吸い込み演出。

内容:

- 大量の通知カード。
- BH が通知カードを吸い込む。
- 実際に作業しているブラウザ画面の右上へ通知が重なる。
- 「通知センター」の概念は出さない。
- 通知はブラウザ右上に出るトーストとして見せる。
- gpt-image-2 のアプリアイコン素材を使う。

現状メモ:

- 既存 CSS モックで、作業ブラウザ + 右上通知の構図に寄せた。
- 次の品質改善では `public/mockups/generated/work-browser-notifications.png` を作り、ブラウザ本体の質感を画像化する。

### S07 YouTube, 5秒 / 300 frames

種別: 実機映像予定。現段階では黒背景プレースホルダー。

理想:

- YouTube 画面。
- コメント欄や関連動画サムネの文字を BH が吸い込む。
- 画面のノイズが減っていく。

表示するプレースホルダーテキスト:

```text
実機映像予定
YouTubeコメント・サムネを吸い込む

撮りたい映像:
YouTube画面でコメント欄や関連動画サムネの文字を
BHカーソルが吸い込み、画面のノイズが減っていく。
```

### S08 News, 4秒 / 240 frames

種別: CSS/Remotion モック。最終的には gpt-image-2 ベース画像 + Remotion 吸い込み演出。

内容:

- 固有ブランド名は出さない。
- ニュースサイトと一目で分かるレイアウト。
- ネガティブニュース見出しを BH が吸い込む。

見出し例:

- `大手IT企業、突然の大量解雇`
- `年収1000万でも"貧困"の現実`

現状メモ:

- `NewsPicks` という文字は削除済み。
- 見出しのはみ出しは調整済み。
- 36秒付近はこの S08 News。削除候補ではあるが、まずニュースサイトとして分かる形へ再構成する。
- 次の品質改善では `public/mockups/generated/news-site-negative-headlines.png` を作り、背景 UI の情報密度と質感を画像化する。

### S09 GameGrowth, 6秒 / 360 frames

種別: Remotion。

内容:

- BH がゲームの成長演出のように大きくなる。
- 吸い込む順番:
  `テキスト → 画像 → バナー → 動画 → ページ全体`
- 吸い込むたびに BH が大きくなる。
- キャッチ:
  `画面の情報を、全て吸い込め。`

実装方針:

- 現在のプレースホルダーを置き換える。
- 既存 mockup assets と Remotion 図形を使う。
- ふざけすぎず、遊びとして見える程度にする。

### S10 Mother, 7秒 / 420 frames

種別: Remotion。

内容:

- 全画面に LINE 風の吹き出しだけ。
- LINE のフル UI は不要。
- 母のメッセージ3つ:
  - `おつかれさま。ごはん、ちゃんと食べてる？`
  - `返信はいつでもいいからね。`
  - `今日もあたたかくして寝てね。`
- BH が近づくが吸い込めない。
- BH が後退する。
- キャッチ:
  `消せない言葉も、ある。`

現状メモ:

- 既存実装は方向性が合っている。
- typecheck エラーを直す。
- 必要なら UI をさらに簡潔にする。

### S11 Climax, 6秒 / 360 frames

種別: Remotion。

内容:

- クリーム背景。
- 静寂。
- 中央に大きく:
  `全てを、吸い込め。`
- 上部に小さな BH が呼吸する。

実装方針:

- 現在の `demo-new.mp4` 依存を削除する。
- ブラウザデモパネルも削除する。
- 静かなテキスト + BH の構成にする。
- ユーザーは「全てを、吸い込め。」のシーンは元の方向が良かったと言っているため、ここは大きく変えない。

### S12 Outro, 6秒 / 360 frames

種別: Remotion。

内容:

- `Black Hole` を PlayfairDisplay で表示。
- `Chrome Web Store で今すぐ追加`
- CTA ボタン。
- `kosukuma-lying.png`
- フェードアウト。

現状メモ:

- 既存実装はかなり近い。
- 60fps / 6秒に合わせて調整する。

## タイミング実装

変更ファイル:

- `src/Root.tsx`
- `src/compositions/blackhole-pv/Composition.tsx`
- 必要なら `src/compositions/blackhole-pv/constants.ts`

方針:

- scene timing を1か所にまとめる。
- `Root.tsx` の `durationInFrames` もそこから合わせる。
- 現在の `2730 frames` 宣言と `1890 frames` 実尺のズレをなくす。
- 現在は `30fps` のまま速度を守る。
- 60fps 化は別フェーズで、全 frame 値を再スケールしてから行う。

最終 60fps 化フェーズの想定:

```tsx
export const BLACK_HOLE_PV_FPS = 60;

const secondsToFrames = (seconds: number) => seconds * BLACK_HOLE_PV_FPS;

const SCENES = [
  { key: "S01", durationInFrames: secondsToFrames(3), component: S01ColdOpen },
  { key: "S02", durationInFrames: secondsToFrames(6), component: S02Sweep },
  { key: "S03", durationInFrames: secondsToFrames(6), component: S03Slack },
  { key: "S04", durationInFrames: secondsToFrames(5), component: S04Google },
  { key: "S05", durationInFrames: secondsToFrames(5), component: S05BeforeAfter },
  { key: "S06", durationInFrames: secondsToFrames(4), component: S06Notification },
  { key: "S07", durationInFrames: secondsToFrames(5), component: S07YouTube },
  { key: "S08", durationInFrames: secondsToFrames(4), component: S08News },
  { key: "S09", durationInFrames: secondsToFrames(6), component: S09GameGrowth },
  { key: "S10", durationInFrames: secondsToFrames(7), component: S10Mother },
  { key: "S11", durationInFrames: secondsToFrames(6), component: S11Climax },
  { key: "S12", durationInFrames: secondsToFrames(6), component: S12Outro },
];
```

合計:

```text
3 + 6 + 6 + 5 + 5 + 4 + 5 + 4 + 6 + 7 + 6 + 6 = 63秒
プレビュー: 63秒 * 30fps = 1890 frames
最終: 63秒 * 60fps = 3780 frames
```

## npm scripts

変更ファイル:

- `package.json`

追加:

```json
"typecheck": "tsc --noEmit",
"studio:pv": "remotion studio src/index.ts",
"render:pv": "remotion render src/index.ts BlackHolePV out/blackhole-pv.mp4"
```

既存 script は不要に消さない。

## ベースライン修正

### typecheck 修正

変更ファイル:

- `src/compositions/blackhole-pv/scenes/S10Mother.tsx`

修正:

- `if (Img && staticFile)` の常に true になる分岐を消す。
- 使っていない `Img` / `staticFile` も不要なら消す。

### 実機映像シーンの扱い

変更ファイル:

- `src/compositions/blackhole-pv/scenes/S01ColdOpen.tsx`
- `src/compositions/blackhole-pv/scenes/S04Google.tsx`
- `src/compositions/blackhole-pv/scenes/S05BeforeAfter.tsx`
- `src/compositions/blackhole-pv/scenes/S07YouTube.tsx`
- `src/compositions/blackhole-pv/scenes/S11Climax.tsx`

ルール:

- S01/S04/S05/S07 は黒背景の撮影指示カードにする。
- S01/S04/S05/S07 を CSS モックで代替しない。
- `demo-new.mp4` / `demo-long.mp4` がなくても typecheck / still / render が通るようにする。
- S11 は動画を使わない。

## 検証計画

実装開始前:

```bash
npm run typecheck
```

現時点では S10Mother の既知エラーで失敗する。

ベースライン修正後:

```bash
npm run typecheck
npx remotion compositions src/index.ts
```

代表フレーム確認:

```bash
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s01.png --frame=90
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s02.png --frame=300
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s03.png --frame=660
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s04.png --frame=1020
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s05.png --frame=1320
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s06.png --frame=1590
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s07.png --frame=1860
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s08.png --frame=2130
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s09.png --frame=2460
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s10.png --frame=2910
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s11.png --frame=3300
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/verification/s12.png --frame=3630
```

最終確認:

```bash
npm run typecheck
npx remotion compositions src/index.ts
npm run render:pv
```

ローカル再生:

```bash
npm run studio:pv
```

## 変更予定ファイル

- `package.json`
- `package-lock.json`
- `src/Root.tsx`
- `src/compositions/blackhole-pv/Composition.tsx`
- `src/compositions/blackhole-pv/constants.ts`
- `src/compositions/blackhole-pv/scenes/S01ColdOpen.tsx`
- `src/compositions/blackhole-pv/scenes/S02Sweep.tsx`
- `src/compositions/blackhole-pv/scenes/S03Slack.tsx`
- `src/compositions/blackhole-pv/scenes/S04Google.tsx`
- `src/compositions/blackhole-pv/scenes/S05BeforeAfter.tsx`
- `src/compositions/blackhole-pv/scenes/S06Notification.tsx`
- `src/compositions/blackhole-pv/scenes/S07YouTube.tsx`
- `src/compositions/blackhole-pv/scenes/S08News.tsx`
- `src/compositions/blackhole-pv/scenes/S09GameGrowth.tsx`
- `src/compositions/blackhole-pv/scenes/S10Mother.tsx`
- `src/compositions/blackhole-pv/scenes/S11Climax.tsx`
- `src/compositions/blackhole-pv/scenes/S12Outro.tsx`

## Todo フェーズ前の確認

確認したいこと:

1. 現段階のプレースホルダー動画も `60fps` で進めてよいか。
2. 黒背景の撮影指示カードに `S01` などのシーン番号を表示するか、見た目優先で非表示にするか。

推奨:

- `60fps` で進める。
- 撮影指示カードには小さく `S01` などを表示する。
- メインの表示文は日本語だけにする。

## Todo

- [x] `package.json` に `typecheck` / `studio:pv` / `render:pv` を追加する。
- [x] `BlackHolePV` を `60fps` / `3780 frames` / `63秒` に揃える。
- [x] `Composition.tsx` のシーンタイミングを 12 シーン構成に合わせる。
- [x] S01 を黒背景の撮影指示カードにする。
- [x] S04 を黒背景の撮影指示カードにする。
- [x] S05 を黒背景の撮影指示カードにする。
- [x] S07 を黒背景の撮影指示カードにする。
- [x] S02 の空 caption を削除し、右から左の吸い込み仕様を確認・調整する。
- [x] S10Mother の typecheck エラーを直す。
- [x] S11 から `demo-new.mp4` 依存とブラウザデモパネルを外し、静かな Climax にする。
- [x] S09 GameGrowth をプレースホルダーから Remotion 演出に置き換える。
- [x] `npm run typecheck` を通す。
- [x] 代表フレームを書き出して、最低限の見た目とレンダー可否を確認する。
- [x] Remotion Studio を起動してローカル再生 URL を共有する。
- [x] プレビュー速度を元の体感に戻すため `30fps / 1890 frames` に戻す。
- [x] S06 を「作業中ブラウザの右上に通知が来る」構図へ寄せる。
- [x] S08 から `NewsPicks` 表記を消し、見出しのはみ出しを調整する。
- [x] S10 の母メッセージを5件に増やし、位置を揃える。
- [x] gpt-image-2 で S06 の作業ブラウザ + 通知ベース画像を作る。
- [x] gpt-image-2 で S08 のニュースサイトベース画像を作る。
- [x] 生成画像を `public/mockups/generated/` に置き、Remotion で吸い込み演出だけを重ねる。
- [x] `BlackHolePV60` を追加し、速度を維持したまま `60fps / 3780 frames` でレビューできるようにする。
- [x] gpt-image-2 生成用の CLI スクリプト `npm run generate:pv-mockups` を追加する。
- [x] `npm run setup:imagegen` で画像生成CLI依存をローカルにセットアップできるようにする。
- [x] `OPENAI_API_KEY` を設定して実際に gpt-image-2 生成を走らせる。
- [x] 生成済み画像を S06/S08 の背景ベースとして使い、Remotion は BH と文字消失だけを重ねる構成へ切り替える。

## Review

- `npm run typecheck` 成功。
- `npx remotion compositions src/index.ts` 成功。`BlackHolePV` は現在 `30fps` / `1890 frames` / `63.00 sec`。
- `BlackHolePV60` は `60fps` / `3780 frames` / `63.00 sec`。
- 代表フレーム出力成功: `s01.png`, `s02.png`, `s04.png`, `s09.png`, `s11.png`, `s12.png`。
- 最新フィードバック確認用に `s06-notification-updated.png` / `s08-news-updated.png` を追加出力済み。
- 60fpsレビュー確認用に `s06-notification-60fps.png` を追加出力済み。
- `npm run setup:imagegen` 成功。`.venv-imagegen` に `openai` パッケージ導入済み。
- `npm run generate:pv-mockups` は `OPENAI_API_KEY` 未設定のため、画像生成前に停止することを確認済み。
- Windows ユーザー環境変数にも `OPENAI_API_KEY` は未設定。
- `D:\ダウンロード\ディスコード\.env` の `OPENAI_API_KEY` を使って gpt-image-2 生成成功。
- 生成画像: `public/mockups/generated/work-browser-notifications.png`, `public/mockups/generated/news-site-negative-headlines.png`。
- `BlackHolePV60` の S06/S08 代表フレームを `s06-generated-60fps.png` / `s08-generated-60fps.png` に出力済み。
- S06/S08 は生成画像を背景ベースに使い、Remotion 側でBHと吸い込みテキストを重ねる構成へ切り替え済み。
- S06 は再生成で背景側の通知カードを消し、右側を Remotion 通知用の余白にした。
- S08 は再生成で暗めのニュースサイトにし、左ランキング欄を Remotion 見出し用の空行にした。
- S08 の吸い込み前寄り確認用に `s08-generated-start-60fps.png` を追加出力済み。
- Remotion Studio 起動成功: `http://localhost:3001`。
- フルレンダーは未実施。今回は「一回見てみたい」ため Studio 起動までを優先。

## 最新フィードバック反映メモ

- 速度は現在の体感でよい。
- ただしプレビューが `30fps` なので、最終的には速度を変えずに `60fps` 化する。
- S06 はブラウザ作業中に右上通知が来る表現へ寄せる。
- S08 はニュースサイトとしての分かりやすさを優先し、必要なら画像生成ベースで作り直す。
- 36秒付近は S08 News。削除ではなく、まず再構成で分かりやすくする。
- S11「全てを、吸い込め。」は大きく変えない。
- 参考 X 動画はこの環境から直接確認できていないため、厳密に寄せるには動画ファイルかスクリーンショットが必要。

## 2026-05-11 追加調整計画: 画質 / フォント / S08 / S09

### 方針

- 書き出し前に Remotion Studio のブラウザレビューで確認する。
- 画質問題は fps ではなく圧縮設定として扱う。通常レビューは Studio、最終 MP4 は高品質書き出しコマンドを使う。
- 動画内で読ませる日本語は Axis Std に統一する。
- gpt-image-2 のモック画像には読ませたい日本語テキストを極力入れず、見出し・コピーは Remotion overlay で載せる。
- S08 は右側の目立つニュース見出しを吸う。
- S09 は吸う対象数を増やし、BH が段階的に大きくなって最後は画面全体を覆う。

### 変更予定ファイル

- `scripts/generate-pv-mockups.sh`
  - S08 用プロンプトを右側 feature headline lane 中心に更新する。
  - ベース画像側は日本語の可読見出しを避け、Remotion overlay 用の余白を明示する。
- `src/compositions/blackhole-pv/scenes/S08News.tsx`
  - 左ランキング吸収から、右側の headline stack 吸収へ変更する。
  - 右側に Axis Std の見出しを overlay し、BH が右から左または斜めに近づいて見出しを消す。
  - 背景は gpt-image-2 生成画像を維持しつつ、読みテキストは Remotion 側に寄せる。
- `src/compositions/blackhole-pv/scenes/S09GameGrowth.tsx`
  - target を増やす: text, chip, image, notification, banner, comment, video, card, page, full screen noise。
  - 各 target が中央 BH に吸い込まれる動線を作る。
  - 終盤で BH サイズを 1920x1080 を覆う規模まで拡大する。
  - 指定コピー `画面に映ってる情報を全て吸い込んでブラックホールをどんどん大きくしよう！` を Axis Std で入れる。
- `package.json`
  - 最終確認用に高品質 MP4 書き出し script を追加する。通常レビューは Studio のまま。
- `tasks/finish-blackhole-pv/image-prompts.md`
  - 最新の画像生成方針を追記する。
- `tasks/lessons.md`
  - 今回の修正パターンを追記する。

### Todo

- [x] S08/S09 の実装を更新する。
- [x] S08 用 gpt-image-2 プロンプトを更新し、ベース画像を再生成する。
- [x] 高品質レンダー用 script を追加する。
- [x] typecheck を通す。
- [x] S08/S09 の still を 60fps composition から出して確認する。
- [x] Remotion Studio を localhost で起動し、ブラウザレビューできる状態にする。
- [x] 変更を commit / push する。

## 2026-05-11 追加修正計画: シーン指摘反映

### 方針

- 書き出しは行わず、Remotion Studio のブラウザレビュー用に整える。
- S11 は `SCENES` から削除し、不要 import も削除する。
- 通知シーンは現在コード上の `S06Notification` を対象にする。5件すべてが消えるようにシーン尺を伸ばす。
- S08 は still を撮って確認し、生成画像の既存UIと Remotion overlay が喧嘩しない配置へ修正する。

### Todo

- [x] S02 の補助コピーを削除する。
- [x] S03 の完了トーストを削除する。
- [x] 通知シーンの尺を伸ばし、5件すべてが消えるようにする。
- [x] S08 の画像/テキスト関係を still 確認しながら修正する。
- [x] S09 の吸収対象を増やす。
- [x] S10 のコピーを `消したくない言葉も、ある。` に変更する。
- [x] S11 をタイムラインから削除する。
- [x] S12 のコピー変更と全体拡大を行う。
- [x] typecheck と still 確認を行う。
- [x] Studio を localhost:3001 でレビュー可能にする。
- [x] commit / push する。

## 2026-05-11 S08/S09 崩壊修正計画

### 方針

- S08 は生成画像を活かしたまま、右側ランキング見出しの位置だけを調整する。
- S08 の文字は Axis Std の Remotion overlay で描くが、白い下地を弱めて画像に溶け込む見え方にする。
- S09 は吸収対象を多く維持するが、下部コピー領域を安全地帯として確保する。
- S09 の吸収対象は小型カード中心に再配置し、中央BHへ吸い込む動線を揃える。
- S08/S09 それぞれ複数フレームの contact sheet を作って確認する。

### Todo

- [x] S08 の画像ベースを維持し、見出し文字が背景に馴染むように調整する。
- [x] S09 のオブジェクト配置とコピー安全領域を作り直す。
- [x] typecheck を通す。
- [x] S08/S09 の密なフレーム確認用 still/contact sheet を作る。
- [x] Studio を再起動する。
- [x] commit / push する。

### Review

- `npm run typecheck` 成功。
- S08 は `tasks/finish-blackhole-pv/frame-review/current2/s08-contact.png` で、生成画像の右側ランキング見出しレーン上に Axis Std の見出しが収まることを確認した。
- S09 は `tasks/finish-blackhole-pv/frame-review/current2/s09-contact.png` で、下部コピーが1行化され、終盤のグレー幕が消え、BH が画面全体へ広がることを確認した。
- Remotion Studio を `http://localhost:3001` で再起動した。

## 2026-05-11 S08/S09 生成画像ベース再修正

### 方針

- S08 は画像とテキストの関係を改善するため、右側に空の見出しレーンがあるニュース背景を gpt-image-2 で再生成する。
- S08 の日本語見出しは Remotion/Axis Std のまま、生成画像側の薄いプレースホルダー線に重ねる。
- S09 は吸収対象をCSSカードではなく gpt-image-2 生成画像に置き換える。
- S09 は11枚の生成画像素材を複数配置し、素材そのものがBHへ吸い込まれる構図にする。

### Todo

- [x] S08用ニュース背景を gpt-image-2 で再生成する。
- [x] S09用吸収ターゲット画像を gpt-image-2 で大量生成する。
- [x] S08 が新背景を使うように差し替える。
- [x] S09 が生成画像ターゲットを吸う構成に差し替える。
- [x] `npm run typecheck` を通す。
- [x] S08/S09 のスクショ contact sheet を作って確認する。
- [x] Studio を再起動する。
- [x] commit / push する。

### Review

- gpt-image-2 生成素材一覧: `tasks/finish-blackhole-pv/generated-prompts/s09-assets-contact.png`。
- S08確認シート: `tasks/finish-blackhole-pv/frame-review/latest/s08-contact.png`。
- S09確認シート: `tasks/finish-blackhole-pv/frame-review/latest/s09-contact.png`。
- Remotion Studio を `http://localhost:3001` で再起動した。

## 2026-05-11 S08画像 / S09オブジェクト単位修正

### 方針

- S08 はニュース画像が見える行構成にする。右側の主ニュース行にサムネイル画像を入れ、その横に Remotion の見出しを乗せる。
- S09 は Webページやカード全体ではなく、テキスト片・画像・通知・コメント・バナーなどの単体オブジェクトを吸う。
- S09 の単体オブジェクトは gpt-image-2 でクロマキー背景つき生成後、透過PNG化して使う。
- 生成素材の透明余白が大きい場合はトリミングし、画面上で素材が小さく見えないようにする。

### Todo

- [x] S08 のニュース背景を、右側行に画像がある構成で再生成する。
- [x] S08 の見出し位置を画像横のテキストレーンに合わせる。
- [x] S09 の単体オブジェクト素材を gpt-image-2 で生成する。
- [x] S09 の単体オブジェクト素材を透過PNG化し、余白をトリミングする。
- [x] S09 のターゲットを `s09-objects` 参照に差し替える。
- [x] 旧 `s09-targets` のWebページ/カード系素材を削除する。
- [x] `npm run typecheck` を通す。
- [x] S08/S09 の contact sheet を再作成して確認する。
- [x] Studio を再起動する。
- [x] commit / push する。

### Review

- S08 は `tasks/finish-blackhole-pv/frame-review/latest/s08-contact.png` で、ニュース画像つきの行と見出しの関係を確認した。
- S09 は `tasks/finish-blackhole-pv/frame-review/latest/s09-contact.png` で、単体オブジェクトが複数吸われる構成を確認した。
- S09 生成素材一覧は `tasks/finish-blackhole-pv/generated-prompts/s09-object-assets-contact.png`。
- Remotion Studio を `http://localhost:3001` で再起動した。

## 2026-05-11 S06ズーム / S08帯 / S09大量オブジェクト修正

### 方針

- S06 はコード上の通知シーン。BHを大きく見せ、カメラがBHを追いながら通知を消している見え方にする。
- S08 はユーザー提供スクショの通り、文字の後ろの帯が文字幅より右へ伸びる問題を直す。
- S09 は既存12素材に36素材を追加し、合計48個の単体オブジェクトを最後まで吸い込みながらBHが大きくなる構成にする。
- S09の追加画像生成は `generate-batch --concurrency 4` で並列実行する。

### Todo

- [x] S05を触りかけた変更を戻し、対象をS06へ修正する。
- [x] S06へカメラズーム/追従レイヤーを追加する。
- [x] S08の帯を文字幅に合わせ、右側の余った生成画像プレースホルダー線を白で消す。
- [x] S09追加36素材のgpt-image-2生成プロンプトを作る。
- [x] S09追加36素材を並列生成する。
- [x] S09追加36素材を透過PNG化し、透明余白をトリミングする。
- [x] S09を合計48個の単体オブジェクト配置へ差し替える。
- [x] `npm run typecheck` を通す。
- [x] S06/S08/S09 の contact sheet を作って確認する。
- [x] Studio を再起動する。
- [x] commit / push する。

### Review

- S06確認シート: `tasks/finish-blackhole-pv/frame-review/latest/s06-contact.png`。
- S08確認シート: `tasks/finish-blackhole-pv/frame-review/latest/s08-contact.png`。
- S09確認シート: `tasks/finish-blackhole-pv/frame-review/latest/s09-contact.png`。
- S09生成素材一覧: `tasks/finish-blackhole-pv/generated-prompts/s09-object-assets-contact.png`。
- Remotion Studio を `http://localhost:3001` で再起動した。

## 2026-05-11 S06/S08追加修正

### 方針

- S06は通知3件までは通常カメラ、4件目からズーム追従にする。
- S06の追従はBHへ完全ロックせず、滑らかな補間軌道を主に使い、BHの実座標を少量だけ混ぜる。
- S08は固定幅の帯をやめ、テキスト要素自身に背景帯を持たせる。文字と帯を同じレイアウト幅にしてズレをなくす。
- S08は文字幅外と右端の生成画像プレースホルダー線が見えないように、見出しレーンの白マスクを広げる。

### Todo

- [x] S06のズーム開始を4件目の通知直前へ後ろ倒しする。
- [x] S06のズーム到達時間を伸ばし、慣性のある追従にする。
- [x] S08の固定幅帯を、テキスト幅に追従する inline 背景へ変更する。
- [x] S08の見出しレーンマスクを広げ、右端の背景帯を隠す。
- [x] `npm run typecheck` を通す。
- [x] S06/S08 の contact sheet を再作成して確認する。
- [x] Studio を再起動する。
- [x] commit / push する。

### Review

- S06確認シート: `tasks/finish-blackhole-pv/frame-review/latest/s06-contact.png`。
- S08確認シート: `tasks/finish-blackhole-pv/frame-review/latest/s08-contact.png`。
- S06は4件目からズームし、滑らかな補間軌道でBHを追う形にした。
- S08は見出し帯がテキスト自身の背景になり、右端の生成画像プレースホルダー線もマスクで隠した。
- Remotion Studio を `http://localhost:3001` で再起動した。

## 2026-05-11 超高画質書き出し

### 方針

- レビュー速度を維持した60fps版 `BlackHolePV60` を使う。
- 高画質MP4として `CRF 8` で書き出す。
- 生成MP4は `.gitignore` 対象のためGitHubには含めず、再現用scriptを `package.json` に追加する。

### Todo

- [x] Studioを停止してレンダー負荷を下げる。
- [x] `out/blackhole-pv-60fps-ultra.mp4` を書き出す。
- [x] `render:pv60:ultra` scriptを追加する。
- [x] 変更を commit / push する。

### Review

- 出力: `out/blackhole-pv-60fps-ultra.mp4`。
- サイズ: 約32MB。
- 設定: `BlackHolePV60`, `1920x1080`, `60fps`, `h264`, `CRF 8`。

## 2026-05-11 書き出しフォント修正

### 方針

- Studioと書き出しで同じフォントを使うため、OSインストール済みフォントには依存しない。
- PV全体のrootで `FontLoader` を必ずマウントする。
- Axis Std は同梱OTFを読み込み完了まで待ってからレンダーする。
- 英字用の Inter / Playfair Display もレンダー前に読み込む。

### Todo

- [x] `FontLoader` を `BlackHolePV` rootへ追加する。
- [x] `FontLoader` に Axis Std の読み込み待ちを追加する。
- [x] Inter / Playfair Display の loader を追加する。
- [x] `FONTS.display` を `"Playfair Display"` に修正する。
- [x] `npm run typecheck` を通す。
- [x] 代表stillでS02/S12のフォントを確認する。
- [x] 超高画質MP4を再書き出しする。
- [x] commit / push する。

### Review

- 確認still: `tasks/finish-blackhole-pv/font-check/s02-axis.png`。
- 確認still: `tasks/finish-blackhole-pv/font-check/s12-outro.png`。
- 再出力: `out/blackhole-pv-60fps-ultra.mp4`。

## 2026-05-11 axis-std.otf 直接使用の再修正

### 方針

- `axis-std.otf` の内部PostScript名 `AxisStd-Regular` をそのまま使う。
- 同梱OTFはRegular単体なので、`font-weight: 100 900` の要求すべてを同じファイルへ割り当てる。
- `font-synthesis: none` で合成太字を止め、書き出しとレビューのフォント差をなくす。
- 全動画を書き出す前に、Remotionのstill書き出しで代表シーンのフォントを確認する。

### Todo

- [x] `FontLoader` の Axis family を `AxisStd-Regular` に固定する。
- [x] 日本語フォント参照を `AxisStd-Regular` に寄せる。
- [x] Axis OTFを全ウェイト要求に割り当て、合成太字を無効化する。
- [x] `npm run typecheck` を通す。
- [x] S02/S08/S12 の render-path still を再作成して確認する。
- [x] フォント確認後に超高画質MP4を書き出す。
- [x] commit / push する。

### Review

- 確認still: `tasks/finish-blackhole-pv/font-check-axis-direct/s02-axis-direct.png`。
- 確認still: `tasks/finish-blackhole-pv/font-check-axis-direct/s08-axis-direct.png`。
- 確認still: `tasks/finish-blackhole-pv/font-check-axis-direct/s12-axis-direct.png`。
- 再出力: `out/blackhole-pv-60fps-ultra.mp4`。
- Composition確認: `BlackHolePV60`, `60fps`, `1920x1080`, `3540 frames`, `59.00 sec`。
- 出力サイズ: 約32MB。

## 2026-05-11 レビュー基準フォント完全一致の再修正

### 方針

- 比較対象はユーザー提供のレビュー画面スクショに固定する。
- WSL Chromium書き出しではなく、レビューと同じWindows Chrome経路でstillとMP4を書き出す。
- Axisは `Axis Std` familyのまま参照し、WOFF2化した同梱フォントを `font-weight: normal` として登録する。
- Regular単体フォントを `font-synthesis: none` で細く固定せず、レビューと同じ既存 `fontWeight: 700` の見た目を再現する。

### Todo

- [x] レビュー基準スクショを `OneDrive/画像/Screenshots` から特定する。
- [x] WOFF2 + `font-synthesis: none` のstillがレビューより細すぎることを比較で確認する。
- [x] `FontLoader` を `Axis Std` + WOFF2 normal weight に変更する。
- [x] Windows Chrome指定でS02のstillを書き出し、レビュー基準と比較する。
- [x] `npm run typecheck` を通す。
- [x] Windows Chrome経路で超高画質MP4を書き出す。
- [x] 書き出し後の代表フレームをレビュー基準と再比較する。
- [x] commit / push する。

### Review

- レビュー基準: `C:/Users/すのはら/OneDrive/画像/Screenshots/スクリーンショット 2026-05-11 231543.png`。
- WSLよりWindows Chrome renderの方がレビュー基準に近い。最終MP4もこの経路で書き出す。
- 再出力: `out/blackhole-pv-60fps-ultra.mp4`。
- 動画から抜いたS02代表フレーム比較: `tasks/finish-blackhole-pv/font-review-compare/review-vs-export-frame270-text-aligned.png`。
- 出力確認: `1920x1080`, `60fps`, `3540 frames`, `59.00 sec`, 約34.8MB。
