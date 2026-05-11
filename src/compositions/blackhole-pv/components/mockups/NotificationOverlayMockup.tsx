import React from "react";

interface NotificationData {
  id: string;
  icon: string;
  title: string;
  body: string;
  position: {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    transform?: string;
    opacity?: number;
  };
  width?: number;
  height?: number;
}

interface NotificationOverlayMockupProps {
  notifications?: NotificationData[];
  containerWidth?: number;
  containerHeight?: number;
}

const NotificationCard: React.FC<{
  icon: string;
  title: string;
  body: string;
  style?: React.CSSProperties;
}> = ({ icon, title, body, style }) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: 320,
        minHeight: 80,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{icon}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 4,
            color: "#333",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#555",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
};

const defaultNotifications: NotificationData[] = [
  { id: "1", icon: "\u2764\uFE0F", title: "Instagram", body: "\u3042\u306A\u305F\u306E\u6295\u7A3F\u306B150\u4EF6\u306E\u300C\u3044\u3044\u306D\uFF01\u300D\u304C\u4ED8\u304D\u307E\u3057\u305F\u3002", position: { top: 50, left: 100 } },
  { id: "2", icon: "\uD83D\uDCAC", title: "X (\u65E7Twitter)", body: "\u65B0\u3057\u3044\u30B3\u30E1\u30F3\u30C8\u304C\u5C4A\u3044\u3066\u3044\u307E\u3059", position: { top: 120, right: 80 } },
  { id: "3", icon: "\uD83D\uDC64", title: "LinkedIn", body: "\u5C71\u7530\u592A\u90CE\u3055\u3093\u304C\u30D5\u30A9\u30ED\u30FC\u3057\u307E\u3057\u305F", position: { bottom: 50, left: 50 } },
  { id: "4", icon: "\uD83D\uDCE7", title: "Gmail", body: "\u65B0\u3057\u3044\u30E1\u30FC\u30EB: \u300C\u5B9A\u4F8B\u4F1A\u8B70\u306E\u3054\u6848\u5185\u300D", position: { top: 30, left: 500 } },
  { id: "5", icon: "\uD83D\uDE80", title: "App Store", body: "\u65B0\u3057\u3044\u30D0\u30FC\u30B8\u30E7\u30F3\u304C\u5229\u7528\u53EF\u80FD\u3067\u3059", position: { top: 200, right: 300 } },
  { id: "6", icon: "\uD83D\uDECD\uFE0F", title: "Amazon", body: "\u30BF\u30A4\u30E0\u30BB\u30FC\u30EB\uFF01\u6700\u592750%OFF\uFF01", position: { bottom: 150, right: 100 } },
  { id: "7", icon: "\u26A0\uFE0F", title: "\u30B9\u30C8\u30EC\u30FC\u30B8", body: "\u5BB9\u91CF\u304C\u6B8B\u308A10%\u3067\u3059", position: { top: 400, left: 150 } },
  { id: "8", icon: "\uD83D\uDCB3", title: "\u9280\u884C", body: "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u306E\u3054\u5229\u7528\u901A\u77E5", position: { bottom: 250, left: 400 } },
];

export const NotificationOverlayMockup: React.FC<NotificationOverlayMockupProps> = ({
  notifications = defaultNotifications,
  containerWidth = 1920,
  containerHeight = 1080,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: containerWidth,
        height: containerHeight,
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          icon={notification.icon}
          title={notification.title}
          body={notification.body}
          style={{
            position: "absolute",
            top: notification.position.top,
            left: notification.position.left,
            right: notification.position.right,
            bottom: notification.position.bottom,
            transform: notification.position.transform,
            opacity: notification.position.opacity,
            width: notification.width,
            height: notification.height,
          }}
        />
      ))}
    </div>
  );
};
