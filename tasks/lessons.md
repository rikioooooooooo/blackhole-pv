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
