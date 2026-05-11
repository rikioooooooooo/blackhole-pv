# gpt-image-2 生成プロンプト案

## S06 作業ブラウザ + 右上通知

保存先予定:

- `public/mockups/generated/work-browser-notifications.png`

用途:

- Remotion の S06 で背景ベースとして使う。
- 通知カードと BH の吸い込みは Remotion 側で重ねる。
- 画像側にはブラックホール本体を入れない。

プロンプト:

```text
Create a polished 16:9 desktop browser mockup for a product video scene.
Resolution 1920x1080.

Scene:
A realistic but brand-neutral web browser window is open on a warm cream background.
Inside the browser, a person is clearly doing focused work: a document editor or project planning page with a left document area, subtle toolbar, tabs, and a small focus/timer panel.
Several browser-style notification toasts appear from the top-right corner of the browser window, overlapping the page like real web notifications.

Style:
Premium software product video, calm, editorial, stylish, high detail, clean spacing, subtle shadows, realistic UI density, warm off-white background, black and charcoal text, restrained accent colors.
Not cartoonish, not playful UI, not a landing page.

Important constraints:
No real brand logos.
No Chrome logo, no Google logo, no Slack logo.
No readable long text except small generic UI fragments.
Do not include a black hole.
Do not include a cursor.
Keep the top-right notification area clear enough for Remotion overlays.
```

## S08 ニュースサイト

保存先予定:

- `public/mockups/generated/news-site-negative-headlines.png`

用途:

- Remotion の S08 で背景ベースとして使う。
- 見出しの吸い込み、BH、消えるテキストは Remotion 側で重ねる。
- 画像側の見出しテキストはできるだけ短く、後から上書きしやすい構図にする。

プロンプト:

```text
Create a polished 16:9 desktop news website mockup for a product video scene.
Resolution 1920x1080.

Scene:
A brand-neutral Japanese-style online news portal is shown inside a large browser-like panel.
The page has a clear news-site structure: header navigation, breaking-news label, ranked story list on the left, feature story card with an image on the right, small metadata rows, comment counts, and topic chips.
The main story area should leave clean horizontal rows where Remotion can overlay Japanese headline text.

Style:
Premium editorial technology brand video, stylish, calm, high information density, modern news UI, white cards, warm cream environment, restrained red and blue accents, crisp typography, subtle shadows.
It should feel more like a real news product than a simple card mockup.

Important constraints:
No NewsPicks text.
No real publication logos.
No real company logos.
No black hole.
No cursor.
Avoid text overflowing outside cards.
Keep the left ranked headline rows clean and readable for animation overlays.
```

## 2026-05-11 update: font-safe mockups

### Shared rule

gpt-image-2 mockups should provide layout, materials, photos, cards, shadows, and information density. Do not rely on generated images for readable Japanese copy. Any Japanese text that the viewer must read should be rendered in Remotion with `FONTS.japanese` / Axis Std.

### S08 News updated prompt intent

- Make the right side the dominant news feature area.
- Keep four right-side headline lanes visually prominent but blank enough for Remotion overlay.
- Avoid readable fake Japanese in the prominent lanes.
- Remotion overlays the actual negative headlines in Axis Std, then the BH absorbs those right-side headlines.

### Render quality note

The previous 60fps MP4 was only around 8MB for 63 seconds at 1920x1080, so visual softness is likely compression-related rather than fps-related. Use Studio for review and `npm run render:pv60:high` for the next high-quality MP4 export.
