/**
 * Remotion レンダリング API
 * Bot や CLI から呼び出してMP4/GIF/PNG を生成する
 */
import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, renderStill } from "@remotion/renderer";

const ENTRY_POINT = path.resolve(__dirname, "../index.ts");
const OUTPUT_DIR = path.resolve(__dirname, "../../output");

type RenderOptions = {
  compositionId: string;
  inputProps?: Record<string, unknown>;
  outputFileName?: string;
  codec?: "h264" | "h265" | "vp8" | "vp9" | "gif";
  width?: number;
  height?: number;
  fps?: number;
  durationInFrames?: number;
  concurrency?: number;
};

type StillOptions = {
  compositionId: string;
  inputProps?: Record<string, unknown>;
  outputFileName?: string;
  frame?: number;
};

let bundleCache: string | null = null;

async function getBundled(): Promise<string> {
  if (bundleCache) return bundleCache;
  console.log("[remotion] Bundling...");
  bundleCache = await bundle({
    entryPoint: ENTRY_POINT,
  });
  console.log("[remotion] Bundle ready");
  return bundleCache;
}

export async function renderVideo(opts: RenderOptions): Promise<string> {
  const serveUrl = await getBundled();
  const outputPath = path.join(
    OUTPUT_DIR,
    opts.outputFileName ?? `${opts.compositionId}-${Date.now()}.mp4`
  );

  const composition = await selectComposition({
    serveUrl,
    id: opts.compositionId,
    inputProps: opts.inputProps ?? {},
  });

  // オーバーライド
  if (opts.width) composition.width = opts.width;
  if (opts.height) composition.height = opts.height;
  if (opts.fps) composition.fps = opts.fps;
  if (opts.durationInFrames) composition.durationInFrames = opts.durationInFrames;

  console.log(`[remotion] Rendering ${opts.compositionId} → ${outputPath}`);
  await renderMedia({
    composition,
    serveUrl,
    codec: opts.codec ?? "h264",
    outputLocation: outputPath,
    concurrency: opts.concurrency ?? 8,
  });

  console.log(`[remotion] Done: ${outputPath}`);
  return outputPath;
}

export async function renderImage(opts: StillOptions): Promise<string> {
  const serveUrl = await getBundled();
  const outputPath = path.join(
    OUTPUT_DIR,
    opts.outputFileName ?? `${opts.compositionId}-${Date.now()}.png`
  );

  const composition = await selectComposition({
    serveUrl,
    id: opts.compositionId,
    inputProps: opts.inputProps ?? {},
  });

  console.log(`[remotion] Still ${opts.compositionId} frame=${opts.frame ?? 0} → ${outputPath}`);
  await renderStill({
    composition,
    serveUrl,
    output: outputPath,
    frame: opts.frame ?? 0,
  });

  console.log(`[remotion] Done: ${outputPath}`);
  return outputPath;
}

// CLI モード: node render.ts <compositionId> [outputFile]
if (require.main === module) {
  const [,, compositionId, outputFile] = process.argv;
  if (!compositionId) {
    console.error("Usage: tsx src/lib/render.ts <compositionId> [outputFile]");
    process.exit(1);
  }

  // stdinからJSON propsを読む（パイプ入力がある場合）
  let inputProps: Record<string, unknown> = {};
  if (!process.stdin.isTTY) {
    const chunks: Uint8Array[] = [];
    process.stdin.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    process.stdin.on("end", async () => {
      try {
        inputProps = JSON.parse(Buffer.concat(chunks).toString());
      } catch {
        // stdin が空 or 非JSONなら空propsで続行
      }
      const result = await renderVideo({
        compositionId,
        inputProps,
        outputFileName: outputFile,
      });
      console.log(result);
    });
  } else {
    renderVideo({
      compositionId,
      inputProps,
      outputFileName: outputFile,
    }).then(console.log).catch((e) => {
      console.error(e);
      process.exit(1);
    });
  }
}
