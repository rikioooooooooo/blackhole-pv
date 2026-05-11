import React from "react";

interface SearchResultItem {
  thumbnailDuration: string;
  title: string;
  channelName: string;
  views: string;
  uploadDate: string;
}

interface YouTubeMockupProps {
  searchTerm?: string;
  results?: SearchResultItem[];
}

const defaultResults: SearchResultItem[] = [
  {
    thumbnailDuration: "12:34",
    title: "【社畜の日常】残業200時間超えの激務を乗り越えるルーティン",
    channelName: "社畜サラリーマンTARO",
    views: "123万回",
    uploadDate: "1年前",
  },
  {
    thumbnailDuration: "08:15",
    title: "社畜あるある30選 - 共感したらいいね!",
    channelName: "OLの休日CH",
    views: "89万回",
    uploadDate: "6ヶ月前",
  },
  {
    thumbnailDuration: "05:00",
    title: "【衝撃】社畜が年収1000万円になった方法",
    channelName: "FIREへの道",
    views: "230万回",
    uploadDate: "2年前",
  },
];

const PlayButtonIcon: React.FC = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
  >
    <circle cx="20" cy="20" r="20" fill="rgba(0, 0, 0, 0.7)" />
    <path d="M16 12L28 20L16 28V12Z" fill="white" />
  </svg>
);

export const YouTubeMockup: React.FC<YouTubeMockupProps> = ({
  searchTerm = "社畜",
  results = defaultResults,
}) => {
  return (
    <div
      style={{
        fontFamily: "Roboto, Arial, sans-serif",
        backgroundColor: "#F9F9F9",
        color: "#0F0F0F",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 24px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E0E0E0",
          height: 56,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ marginRight: 4 }}
          >
            <rect width="24" height="24" rx="3" fill="#FF0000" />
            <path d="M9.5 7.5L16 12L9.5 16.5V7.5Z" fill="white" />
          </svg>
          <span style={{ fontSize: 20, fontWeight: "bold", letterSpacing: -0.8 }}>
            YouTube
          </span>
          <sup
            style={{
              fontSize: 10,
              fontWeight: "normal",
              marginLeft: 2,
              marginTop: -8,
              color: "#606060",
            }}
          >
            JP
          </sup>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "40%",
            maxWidth: 600,
            border: "1px solid #CCCCCC",
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#F9F9F9",
          }}
        >
          <span
            style={{
              flexGrow: 1,
              padding: "8px 16px",
              fontSize: 16,
              color: "#0F0F0F",
            }}
          >
            {searchTerm}
          </span>
          <div
            style={{
              backgroundColor: "#F0F0F0",
              padding: "8px 16px",
              borderLeft: "1px solid #CCCCCC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="7.5" stroke="#606060" strokeWidth="2" />
              <path
                d="M16 16L21 21"
                stroke="#606060"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div style={{ width: 80 }} />
      </div>

      {/* Results */}
      <div
        style={{
          flexGrow: 1,
          padding: 24,
          backgroundColor: "#F9F9F9",
          overflowY: "auto" as const,
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {results.map((result, index) => (
            <div
              key={index}
              style={{ display: "flex", marginBottom: 24 }}
            >
              <div
                style={{
                  position: "relative",
                  width: 360,
                  height: 202,
                  backgroundColor: "#E0E0E0",
                  borderRadius: 8,
                  overflow: "hidden",
                  flexShrink: 0,
                  marginRight: 16,
                }}
              >
                <PlayButtonIcon />
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    fontSize: 12,
                    padding: "2px 4px",
                    borderRadius: 4,
                  }}
                >
                  {result.thumbnailDuration}
                </div>
              </div>
              <div style={{ flexGrow: 1 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 8,
                    lineHeight: 1.4,
                    color: "#0F0F0F",
                  }}
                >
                  {result.title}
                </div>
                <div style={{ fontSize: 14, color: "#606060", marginBottom: 4 }}>
                  {result.channelName}
                </div>
                <div style={{ fontSize: 14, color: "#606060" }}>
                  {result.views} * {result.uploadDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
