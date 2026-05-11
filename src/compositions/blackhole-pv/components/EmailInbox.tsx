import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS, FONTS } from "../constants";

// =================================================================
//  EmailInbox -- Gmail-style inbox UI components
//  Realistic email list with spam indicators
// =================================================================

// --- Email Row ---
export const EmailRow: React.FC<{
  subject: string;
  from: string;
  preview?: string;
  isSpam?: boolean;
  isUnread?: boolean;
  hasAttachment?: boolean;
  delay?: number;
  index?: number;
  noiseId?: string;
}> = ({
  subject,
  from,
  preview,
  isSpam = true,
  isUnread = true,
  hasAttachment = false,
  delay = 0,
  index = 0,
  noiseId = "email",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceSpr = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.5 },
  });
  const entranceY = interpolate(entranceSpr, [0, 1], [15, 0]);
  const driftX = noise2D(`${noiseId}-${index}-dx`, frame * 0.003, 0) * 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 24px",
        borderBottom: "1px solid #f0f0f0",
        opacity: entranceSpr,
        transform: `translateY(${entranceY}px) translateX(${driftX}px)`,
        background: isUnread ? "rgba(232, 240, 254, 0.3)" : "transparent",
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width: 18,
          height: 18,
          border: "1.5px solid #c4c7c5",
          borderRadius: 2,
          flexShrink: 0,
        }}
      />

      {/* Star toggle */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c4c7c5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>

      {/* Spam indicator */}
      {isSpam && (
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: COLORS.spamRed,
            opacity: 0.8,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONTS.ui,
              fontSize: 11,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            !
          </span>
        </div>
      )}

      {/* Email content */}
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.ui,
              fontSize: 13,
              fontWeight: isUnread ? 700 : 400,
              color: "#1f1f1f",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 600,
            }}
          >
            {subject}
          </span>
          {hasAttachment && (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5f6368"
              strokeWidth="2"
              style={{ flexShrink: 0 }}
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          )}
        </div>
        <div
          style={{
            fontFamily: FONTS.ui,
            fontSize: 11,
            color: "#5f6368",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {from}
          {preview && (
            <span style={{ color: "#999" }}> - {preview}</span>
          )}
        </div>
      </div>

      {/* Time */}
      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 11,
          color: isSpam ? COLORS.spamRed : "#5f6368",
          fontWeight: isUnread ? 600 : 400,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {isSpam ? "Spam" : "12:34"}
      </div>
    </div>
  );
};

// --- Inbox Header ---
export const InboxHeader: React.FC<{
  title?: string;
  count?: number;
  showWarning?: boolean;
}> = ({
  title = "Inbox",
  count,
  showWarning = false,
}) => {
  return (
    <div
      style={{
        padding: "10px 24px 12px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {showWarning && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={COLORS.spamRed}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )}
      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 14,
          fontWeight: 600,
          color: "#333",
        }}
      >
        {title}
        {count !== undefined && (
          <span style={{ color: COLORS.spamRed, marginLeft: 4 }}>
            ({count})
          </span>
        )}
      </div>
    </div>
  );
};

// --- Inbox Toolbar ---
export const InboxToolbar: React.FC = () => {
  return (
    <div
      style={{
        height: 44,
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 8,
      }}
    >
      {/* Select all checkbox */}
      <div
        style={{
          width: 18,
          height: 18,
          border: "1.5px solid #c4c7c5",
          borderRadius: 2,
        }}
      />

      {/* Refresh */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5f6368"
        strokeWidth="2"
        style={{ marginLeft: 12, cursor: "pointer" }}
      >
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>

      {/* More actions */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5f6368"
        strokeWidth="2"
        style={{ marginLeft: 8 }}
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>

      {/* Pagination */}
      <div
        style={{
          marginLeft: "auto",
          fontFamily: FONTS.ui,
          fontSize: 11,
          color: "#5f6368",
        }}
      >
        1-8 of 8
      </div>
    </div>
  );
};

// --- Empty Inbox State ---
export const EmptyInboxState: React.FC<{
  message?: string;
}> = ({
  message = "Inbox zero. No spam.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 60, mass: 0.8 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        height: 400,
        gap: 16,
        opacity: spr,
        transform: `translateY(${interpolate(spr, [0, 1], [10, 0])}px)`,
      }}
    >
      {/* Checkmark circle */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: `2px solid ${COLORS.googleGreen}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={COLORS.googleGreen}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 14,
          color: "#999",
          textAlign: "center",
        }}
      >
        {message}
      </div>
    </div>
  );
};
