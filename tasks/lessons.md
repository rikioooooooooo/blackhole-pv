# Lessons

- When a PV plan includes explicit footage direction, do not replace real-footage scenes with code-native mockups unless the user explicitly approves that fallback. Treat missing footage as an asset blocker or placeholder requirement, not as permission to redesign the scene.
- When the user says footage will be re-shot later, implement real-footage sections as shot-direction placeholders that explain the ideal footage. Do not block on absent assets and do not create mock footage substitutes.
- 計画書や注釈対象のドキュメントは、ユーザーが読める言語で書く。ユーザーが日本語で進めている場合、plan.md / todo.md は日本語を基本にする。
- このリポジトリでは、一区切りの変更が完了したら GitHub に commit / push する。push できない場合は認証などの理由を明示する。
- 30fps 前提で組まれた Remotion シーンを単純に 60fps 化すると、内部アニメーションが倍速に見える。見た目の速度を維持したい場合は fps を戻すか、全シーンの内部フレーム値を再スケールする。
- ユーザーが「速度はいいが30FPS」と指摘した場合、プレビュー速度は維持し、最終 60fps 化は全シーンの内部 frame 値を再スケールする別タスクとして扱う。
- Remotion の CSS モックだけで質感が足りないシーンは、gpt-image-2 のベース画像 + Remotion の動的オーバーレイに分けると品質を上げやすい。
- built-in の画像生成ツールがない場合でも、ユーザーが gpt-image-2 での生成を求めたら imagegen skill の CLI フォールバックを使う。ただし `OPENAI_API_KEY` が未設定なら、実生成はそこで止まり、キーが必要だと明示する。
- 画質の指摘が出たときは fps だけで判断しない。出力サイズ・ビットレート・CRF を先に確認し、Studioレビューと高品質書き出しを分けて扱う。
- 生成画像モックに読ませたい日本語を焼き込むと、フォント不一致や文字崩れが起きやすい。プロダクト動画でフォント統一が重要な場合、生成画像は背景/構図に留め、読ませる文字は Remotion overlay で描く。
- ユーザーが「どこを吸いたいか」を指摘したシーンは、画面内で最も目立つ情報の位置に吸収演出を合わせる。背景モックの都合より、視線誘導を優先する。
- Remotion のシーン番号はユーザーの体感上の番号とコード上のファイル名がずれることがある。通知など内容で特定できる場合は、コード上の実体を明示してから直す。
- シーン尺内に吸収完了フレームが収まっているか必ず計算する。特に30fps基準の内部frameと60fpsレビューのglobal frameを混同しない。
- ユーザーが「画像を活かしたまま」「文字を溶け込ませる」と言った場合、生成画像を捨ててCSSで作り直す前に、既存画像の余白・レーン・質感へoverlay文字を合わせる。貼り紙状の下地は最小化する。
- S09のような成長演出では、全画面ノイズを不透明に出すと「崩壊」に見えやすい。終盤はノイズ幕ではなくBH自体の拡大で画面を覆う。
- 「画像とテキストの関係が悪い」と指摘されたら、overlay位置だけで粘らず、画像側を“テキストを受けるための構図”として再生成する。S08なら空の見出しレーン、S09なら吸収対象そのものを画像素材化する。
