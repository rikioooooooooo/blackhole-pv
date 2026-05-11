# Research: finish BlackHolePV

## Goal

ローカルで Remotion Studio を見ながら、`BlackHolePV` をプレースホルダーなしの完成版まで持っていく。

## Repository state

- Repository: `rikioooooooooo/blackhole-pv`
- Branch: `main`
- Latest commit at clone time: `93b7a17 feat: Black Hole Chrome Extension PV - Remotion project`
- Main composition entry: `src/Root.tsx`
- PV body: `src/compositions/blackhole-pv/Composition.tsx`
- Main composition id: `BlackHolePV`
- Size/fps: `1920x1080`, `30fps`

## Commands run

```bash
npm install
npx tsc --noEmit
npx remotion compositions src/index.ts
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/baseline-frames/frame-0000.png --frame=0
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/baseline-frames/frame-0120.png --frame=120
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/baseline-frames/frame-0480.png --frame=480
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/baseline-frames/frame-0660.png --frame=660
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/baseline-frames/frame-0930.png --frame=930
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/baseline-frames/frame-1200.png --frame=1200
npx remotion still src/index.ts BlackHolePV tasks/finish-blackhole-pv/baseline-frames/frame-1600.png --frame=1600
```

## Baseline results

### Dependency install

`npm install` completed successfully.

New generated file:

- `package-lock.json`

### Typecheck

`npx tsc --noEmit` fails with one baseline error:

```text
src/compositions/blackhole-pv/scenes/S10Mother.tsx(64,13): error TS2774: This condition will always return true since this function is always defined. Did you mean to call it instead?
```

The cause is `if (Img && staticFile)` in `RemotionAssetImports`; both imports are functions and always truthy.

### Remotion composition discovery

`npx remotion compositions src/index.ts` succeeds and lists:

- `TextOverlay`: 1080x1920, 1890 frames
- `KosukumaCard`: 1080x1080, 180 frames
- `GoodsAnnounce`: 1080x1920, 240 frames
- `BlackHolePV`: 1920x1080, 2730 frames

### Still frame rendering

Successful baseline stills:

- `tasks/finish-blackhole-pv/baseline-frames/frame-0000.png`
- `tasks/finish-blackhole-pv/baseline-frames/frame-0120.png`
- `tasks/finish-blackhole-pv/baseline-frames/frame-0480.png`
- `tasks/finish-blackhole-pv/baseline-frames/frame-0660.png`
- `tasks/finish-blackhole-pv/baseline-frames/frame-0930.png`
- `tasks/finish-blackhole-pv/baseline-frames/frame-1200.png`

Rendering frame `1600` fails because `S11Climax` references a missing asset:

```text
public/video/demo-new.mp4 could not be found
```

There is no `public/video` directory and no `.mp4`, `.mov`, or `.webm` file in `public`.

## Current composition timing

`src/Root.tsx` declares `BlackHolePV` as `2730` frames, but `src/compositions/blackhole-pv/Composition.tsx` schedules only `1890` frames:

| Scene | Start | Duration | End |
| --- | ---: | ---: | ---: |
| S01ColdOpen | 0 | 90 | 90 |
| S02Sweep | 90 | 180 | 270 |
| S03Slack | 270 | 180 | 450 |
| S04Google | 450 | 150 | 600 |
| S05BeforeAfter | 600 | 150 | 750 |
| S06Notification | 750 | 120 | 870 |
| S07YouTube | 870 | 150 | 1020 |
| S08News | 1020 | 120 | 1140 |
| S09GameGrowth | 1140 | 180 | 1320 |
| S10Mother | 1320 | 210 | 1530 |
| S11Climax | 1530 | 180 | 1710 |
| S12Outro | 1710 | 180 | 1890 |

This leaves frames `1890..2729` as an unintended blank tail, about 28 seconds at 30fps.

## Scene status

### S01ColdOpen

File: `src/compositions/blackhole-pv/scenes/S01ColdOpen.tsx`

Status: placeholder only.

Visible text says:

- `実機映像：ブラウザ上でBHが...`
- `実機映像を差し替え予定`

Baseline frame `0` is effectively blank because the scene starts faded out.

### S02Sweep

File: `src/compositions/blackhole-pv/scenes/S02Sweep.tsx`

Status: implemented.

It renders the main concept line and a black hole sweeping across the text. The baseline frame `120` looks like an actual finished scene. One issue: there is an empty caption `<div>` block, so a planned follow-up caption appears to have been removed or never filled.

### S03Slack

File: `src/compositions/blackhole-pv/scenes/S03Slack.tsx`

Status: substantially implemented.

It builds a Slack-like UI directly in React/CSS and animates black-hole absorption across lines. The export name is `S2Slack`, while the file default export is imported as `S03Slack`; this works but naming is inconsistent.

### S04Google

File: `src/compositions/blackhole-pv/scenes/S04Google.tsx`

Status: placeholder only.

Baseline frame `480` shows a black card with placeholder copy.

There is a reusable `GoogleSearchMockup` component in `src/compositions/blackhole-pv/components/mockups/GoogleSearchMockup.tsx`, and `public/mockups/google-pawahara.png` exists.

### S05BeforeAfter

File: `src/compositions/blackhole-pv/scenes/S05BeforeAfter.tsx`

Status: placeholder only.

Baseline frame `660` shows a black card with placeholder copy.

The repo has components that can support this scene:

- `BrowserWindow`
- `TextAbsorption`
- `SweepingBlackHole`
- `CleanStateTransition`
- `PostAbsorptionGlow`

### S06Notification

File: `src/compositions/blackhole-pv/scenes/S06Notification.tsx`

Status: implemented.

It builds a notification stack and animates absorption. It uses direct CSS and the shared `BlackHole`.

### S07YouTube

File: `src/compositions/blackhole-pv/scenes/S07YouTube.tsx`

Status: placeholder only.

Baseline frame `930` shows placeholder copy.

There is a reusable `YouTubeMockup` component and public assets:

- `public/mockups/youtube-shachiku.png`
- `public/mockups/yt-thumb-1.png`
- `public/mockups/yt-thumb-2.png`
- `public/mockups/yt-thumb-3.png`

### S08News

File: `src/compositions/blackhole-pv/scenes/S08News.tsx`

Status: implemented.

It builds a NewsPicks-like interface and animates headline absorption. It imports `Img`, `staticFile`, and defines `suckEase`, but intentionally voids them, so those imports are unused by design. The scene name export is `S8News`, while the file default export is imported as `S08News`; this works but naming is inconsistent.

### S09GameGrowth

File: `src/compositions/blackhole-pv/scenes/S09GameGrowth.tsx`

Status: placeholder only.

Baseline frame `1200` shows placeholder copy.

Potential implementation can use:

- `BlackHole`
- `ParticleField`
- mockup assets for text, app icons, banners, thumbnails
- existing absorption/physics components

### S10Mother

File: `src/compositions/blackhole-pv/scenes/S10Mother.tsx`

Status: visually implemented, but typecheck blocker exists.

The scene shows LINE-like warm messages and a black hole that refuses to absorb them. The `RemotionAssetImports` helper causes the only current TypeScript error.

### S11Climax

File: `src/compositions/blackhole-pv/scenes/S11Climax.tsx`

Status: implemented in structure, but render-blocked.

It references:

```tsx
<OffthreadVideo src={staticFile("video/demo-new.mp4")} ... />
```

The asset is missing, so rendering any frame that hits this video fails. This must be replaced with a code-native demo panel or a committed video asset before final render.

### S12Outro

File: `src/compositions/blackhole-pv/scenes/S12Outro.tsx`

Status: implemented.

It renders the final brand/CTA screen and uses `public/kosukuma/kosukuma-lying.png`.

## Reusable components and assets

Useful shared components exist under `src/compositions/blackhole-pv/components`:

- `BlackHole`
- `TextAbsorption`
- `SweepingBlackHole`
- `AbsorptionPhysics`
- `BrowserWindow`
- `SceneShell`
- `NotificationPopup`
- `ParticleField`
- `LineUI`
- `EmailInbox`
- `SceneDecorations`

Mockup components exist under `src/compositions/blackhole-pv/components/mockups`:

- `GoogleSearchMockup`
- `YouTubeMockup`
- `SlackMockup`
- `NewsMockup`
- `LineMockup`
- `NotificationOverlayMockup`
- `CookieBannersMockup`
- `SpamInboxMockup`
- `TosMockup`

Public visual assets exist under:

- `public/fonts/axis-std.otf`
- `public/kosukuma`
- `public/mockups`

No video assets exist.

## Main blockers

1. `npx tsc --noEmit` fails on `S10Mother.tsx`.
2. `S11Climax` cannot render because `public/video/demo-new.mp4` is missing.
3. `BlackHolePV` duration is 2730 frames while scheduled scenes end at 1890.
4. Four scenes are still placeholders: `S01ColdOpen`, `S04Google`, `S05BeforeAfter`, `S07YouTube`, `S09GameGrowth`.
5. There is no `typecheck` npm script, despite typecheck being required repeatedly during implementation.
6. Rendering stills is slow because each command bundles/copies the project; final verification should use focused representative stills plus a final render, not excessive full-render loops.

## Quality bar for completion

The finished state should satisfy:

- `npx tsc --noEmit` exits `0`.
- `npx remotion compositions src/index.ts` lists `BlackHolePV`.
- No visible `実機映像を差し替え予定` or placeholder text remains in `BlackHolePV`.
- `BlackHolePV` duration equals the actual scheduled scene duration, unless an intentional new tail is added.
- Representative stills from every scene render without missing asset errors.
- A final render command for `BlackHolePV` completes successfully.
- Remotion Studio can be opened locally for playback.

## 2026-05-11 feedback research: quality, fonts, S08, S09

ユーザー指摘:

- 前回の MP4 は画質が悪い。fps が原因か確認したい。
- フォントは変えないでほしい。
- gpt-image-2 で作るモック側のフォントも動画に合わせたい。
- S08 News は右側の目立つ見出しを吸って消す構図にしたい。
- S09 GameGrowth は色々なものを吸って BH がどんどん大きくなり、最後は画面全体に広がる形にしたい。
- S09 に `画面に映ってる情報を全て吸い込んでブラックホールをどんどん大きくしよう！` を入れたい。
- 書き出し前にブラウザレビューでよい。

調査結果:

- `out/blackhole-pv-60fps.mp4` は約 8.2MB。1920x1080 / 60fps / 63秒としては小さいため、画質問題は fps よりエンコード圧縮の影響が大きい可能性が高い。
- `BlackHolePV60` は `src/compositions/blackhole-pv/timing.tsx` により 30fps 基準の内部 frame 値へ変換しており、速度維持の方針は継続できる。
- フォント指定は `FONTS.japanese = 'Axis Std'`。動画内の日本語テキストは Remotion 側で Axis Std を使うのが最も制御しやすい。
- gpt-image-2 のベース画像内に読ませたい日本語テキストを入れるとフォント不一致や文字崩れが起きやすい。ベース画像は「文字欄・カード・写真・UI密度」に留め、読ませたい見出しやコピーは Remotion で Axis Std overlay にするのが安全。
- S08 現状は左カラムのランキング行を吸っている。ユーザーの指摘どおり、生成ベース画像の右側 feature/headline 領域の方が目立つため、右側 headline stack を Remotion overlay にして BH がそこを吸う構図へ変える。
- S09 現状は TEXT/IMAGE/BANNER/VIDEO/PAGE の 5 target。最後の BH サイズは画面全体には届かず、吸う対象の種類も少ない。小さなUI片を増やし、後半で背景ごと飲み込むスケールへ変更する。

## 2026-05-11 feedback research: scene cleanup pass

ユーザー指摘:

- S02 の `見たくない言葉だけ、遊ぶように消していく。` を削除。
- S03 の最後の右上 `3件のメッセージを吸い込みました` を削除。
- S05 として指摘された通知シーンは、現在コード上では S06Notification。5個の通知を全部消したい。尺を伸ばしてよい。
- S08 は画像とテキストの関係が崩壊しているため、スクショ/Still でレビューして修正する。
- S09 はもっとたくさんのものを吸い込む。
- S10 のコピーを `消したくない言葉も、ある。` に変更。
- S11 はシーンそのものを削除。
- S12 のコピーを `嫌なこと、全部吸いこんじゃおう。` に変更し、全体をもう少し大きく画面いっぱいにする。

調査結果:

- 現在のタイムラインは S01-S12 で合計 63秒。S11 は `Composition.tsx` の `SCENES` 配列から外すのが最小影響。
- 通知シーンは `S06Notification.tsx`。5件目の吸収完了は `142 + 22 = 164` frame で、現状4秒/120frameのシーン尺に収まっていない。通知を全部消すには、このシーンを最低6秒程度に伸ばす必要がある。
- S08 は生成画像側にも右側ランキングがあり、その上に大きな白い overlay カードを被せているため、画像内の既存UIとRemotion見出しの関係が崩れて見える。overlayを背景のカードと整合する位置/サイズに寄せ、見出しは右側の既存ランキング行に沿わせる。

## 2026-05-11 feedback research: S08/S09 full-frame review

ユーザー指摘:

- S08 と S09 の崩壊がひどい。
- 全フレームを見て修正する。

対応方針:

- 書き出し前に S08/S09 の該当区間を60fps基準で密に確認する。
- S08 はユーザーの追加指示により、生成画像を活かしたまま右側見出しレーンへ文字を馴染ませる方針に変更した。白い貼り紙状のoverlayを弱め、Axis Std の見出しを画像内の既存ニュースUIに溶け込ませる。
- S09 は対象物を増やした結果、コピーとの重なり・視線散漫・オブジェクト配置の破綻が出ているため、画面をグリッド化して、全オブジェクトがコピーを邪魔しない配置にする。
- S09 は終盤の full-screen noise がグレーの幕に見えるため、ノイズ層は薄くし、BH の拡大で画面全体を覆う見え方を優先する。

追加指摘:

- S08/S09 ともに画像とテキストの関係がまだ弱い。
- S09 はもっと多くのものを吸いたい。
- S09 も gpt-image-2 で生成した画像素材を大量に用意し、その画像を吸う構成にする。

対応結果:

- S08 背景を `public/mockups/generated/news-site-headline-lanes.png` として再生成した。右側は4本の空見出しレーンがあり、Remotion の Axis Std 見出しを置きやすい構造。
- S09 用に `public/mockups/generated/s09-targets/s09-*.png` の吸収ターゲット画像を11枚生成した。
- S09 はCSSカード中心ではなく、生成画像素材を複数配置して中央BHへ吸い込ませる構成に変更した。

追加レビュー:

- S08 はニュース画像がないように見えるという指摘があった。原因は右側の主見出しレーンが文字プレースホルダー中心で、ニュース記事の画像と見出しの関係が弱かったこと。
- S08 背景を再生成し、右側の各ニュース行にサムネイル画像を入れた。Remotion 見出しはその画像の右側へ重ねる位置に変更した。
- S09 は「Webページを1枚単位で吸う」見え方が残っていた。`s09-targets` のページ/カード画像を削除し、`s09-objects` としてテキスト片、写真サムネ、通知、コメント、バナー、動画カード、チャート、ポップアップ、検索結果、画像グリッド、吹き出し、価格カードの単体オブジェクトを生成した。
- `s09-objects` は gpt-image-2 でクロマキー背景として生成後、`remove_chroma_key.py` で透過PNG化し、ImageMagick の `-trim` で透明余白を詰めた。

## 2026-05-11 feedback research: S06 zoom, S08 band, S09 more objects

ユーザー指摘:

- S06は消しているブラックホールに大きくズームし、カメラがBHを追いながら通知を消しているような演出にしたい。
- S08は文字の後ろの帯が文字サイズとズレている。生成画像側の薄い帯が文字より右へ伸びている。
- S09は最後まで色々なものを吸収しながら大きくなってほしい。ステッカー、文字、画像などインターネット上にありそうなものを4倍量ぐらい生成したい。
- 「並列」は画像生成を並列で行うという意味。

対応:

- S06は背景・通知・BHを同一カメラレイヤーに入れ、BH位置を画面中央へ寄せる `cameraScale` / `cameraX` / `cameraY` を追加した。
- S08は各見出しに `bandWidth` を持たせ、文字幅以降の長いプレースホルダー線を白いマスクで消す構成にした。
- S09は36素材を追加生成し、既存12素材と合わせて48素材にした。全素材を透過PNG化し、最後まで順次吸い込まれるよう `objectAssets` からターゲットを生成する実装にした。

追加対応:

- S06はズーム開始を4件目の通知直前へ後ろ倒しした。3件目までは通常カメラで消し、4件目以降だけカメラがBHを追う。
- 追加レビューでS06の追従がBHに張り付きすぎて見える問題が残ったため、カメラはBH実座標を直接追わず、滑らかな補間軌道を主成分にして実BH座標を少量だけ混ぜる構成へ変更した。
- S06のズーム到達時間を伸ばし、4件目から5件目へゆっくり視線を運ぶ Apple PV 的な慣性追従へ寄せた。
- S08は固定pxの `bandWidth` を廃止し、見出しテキスト要素自身に背景帯を持たせた。これで文字と帯が同じレイアウト幅になり、固定値ズレを避けられる。
- S08は右端の生成画像プレースホルダー線が残らないよう、見出しレーンのマスク幅を広げた。

## 2026-05-11 render research: ultra MP4

ユーザー指示:

- 超高画質で書き出す。

対応:

- `BlackHolePV60` を `out/blackhole-pv-60fps-ultra.mp4` に書き出した。
- コマンドは `npx remotion render src/index.ts BlackHolePV60 out/blackhole-pv-60fps-ultra.mp4 --crf=8 --concurrency=4`。
- 出力は約32MB。`.gitignore` で `*.mp4` が除外されているため、GitHubには動画本体ではなく再現用の `render:pv60:ultra` scriptを追加する。

## 2026-05-11 render research: font mismatch

問題:

- 書き出したMP4でフォントがStudio確認時と変わって見えた。

原因:

- `public/fonts/axis-std.otf` は存在していたが、PV全体のComposition rootで `FontLoader` が常時マウントされていなかった。
- そのため一部シーンは `font-family: 'Axis Std'` を指定していても、書き出しChromium側でフォントが解決できず `sans-serif` fallback になっていた。
- Studioは環境によってOS側のフォントやキャッシュが効くため、書き出しとの差が出る。

対応:

- `FontLoader` を `BlackHolePV` のrootにマウントした。
- `Axis Std` は同梱OTFを `@font-face` と `FontFace` API の両方で登録し、`delayRender` / `continueRender` で読み込み完了まで待つ。
- `Inter` と `Playfair Display` は `@remotion/google-fonts` のloaderで読み込み、英字UI/タイトルも書き出し時に固定されるようにした。
- `FONTS.display` を実際のfont family名である `"Playfair Display"` に修正した。

## 2026-05-11 render research: axis-std.otf direct use

追加問題:

- 再書き出し後もフォントが違って見える。
- ユーザーは `axis-std.otf` をそのまま使うことを要求している。

調査:

- `public/fonts/axis-std.otf` の内部名は family `AXIS Std`、subfamily `R`、full name `AXIS Std R`、PostScript `AxisStd-Regular`。
- OTF内のウェイトは Regular 相当で、太字ファイルは同梱されていない。
- `font-family: 'Axis Std'` や 400 のみの `@font-face` だと、`font-weight: 700/900` を指定した日本語テキストが書き出しChromiumで別フォントへ逃げる可能性がある。

対応方針:

- 同梱OTFを `AxisStd-Regular` として直接登録する。
- `font-weight: 100 900` の全範囲を同じ `axis-std.otf` に割り当て、太字指定でも別フォントへ逃げないようにする。
- `font-synthesis: none` を全体に指定し、Chromiumの合成太字ではなくOTFそのもののアウトラインで描かせる。
- MP4全体を書き出す前に、Remotion render path の still で S02/S08/S12 を確認する。

対応結果:

- S02/S08/S12 の still を `tasks/finish-blackhole-pv/font-check-axis-direct/` に書き出し、MP4と同じRemotion render pathで確認した。
- `BlackHolePV60` を `out/blackhole-pv-60fps-ultra.mp4` に再書き出しした。
- Compositionは `60fps`, `1920x1080`, `3540 frames`, `59.00 sec`。
