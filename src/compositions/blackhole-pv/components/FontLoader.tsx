import React from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";

loadInter("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

loadPlayfairDisplay("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

/**
 * FontLoader -- Axis Std @font-face declaration via inline style tag.
 * Mount once at the top of each scene that uses Japanese text.
 */
export const FontLoader: React.FC = () => {
  const axisFontUrl = staticFile("fonts/axis-std.otf");
  const [handle] = React.useState(() => delayRender("Loading Axis Std"));

  React.useEffect(() => {
    let active = true;

    if (typeof document === "undefined" || typeof FontFace === "undefined") {
      continueRender(handle);
      return;
    }

    const fontFace = new FontFace(
      "Axis Std",
      `url("${axisFontUrl}") format("opentype")`,
      {
        style: "normal",
        weight: "100 900",
      },
    );

    fontFace
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        return document.fonts.ready;
      })
      .then(() => {
        if (active) {
          continueRender(handle);
        }
      })
      .catch((error) => {
        if (active) {
          cancelRender(error);
        }
      });

    return () => {
      active = false;
    };
  }, [axisFontUrl, handle]);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @font-face {
            font-family: 'Axis Std';
            src: url('${axisFontUrl}') format('opentype');
            font-weight: 100 900;
            font-style: normal;
            font-display: block;
          }
        `,
      }}
    />
  );
};

export const AXIS_FONT = "'Axis Std', sans-serif";
