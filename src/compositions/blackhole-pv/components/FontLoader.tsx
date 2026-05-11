import React from "react";
import { staticFile } from "remotion";

/**
 * FontLoader -- Axis Std @font-face declaration via inline style tag.
 * Mount once at the top of each scene that uses Japanese text.
 */
export const FontLoader: React.FC = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @font-face {
            font-family: 'Axis Std';
            src: url('${staticFile("fonts/axis-std.otf")}') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: block;
          }
        `,
      }}
    />
  );
};

export const AXIS_FONT = "'Axis Std', sans-serif";
