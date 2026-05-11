import React from "react";

interface SearchResult {
  url: string;
  title: string;
  description: string;
}

interface GoogleSearchMockupProps {
  query: string;
  results: SearchResult[];
  resultStatsText: string;
}

export const GoogleSearchMockup: React.FC<GoogleSearchMockupProps> = ({
  query,
  results,
  resultStatsText,
}) => {
  const primaryBlue = "#4285f4";
  const primaryRed = "#ea4335";
  const primaryYellow = "#fbbc05";
  const primaryGreen = "#34a853";
  const linkBlue = "#1a0dab";
  const urlGreen = "#006a12";
  const descriptionGray = "#4d5156";
  const statsGray = "#70757a";
  const borderColor = "#dadce0";

  return (
    <div
      style={{
        fontFamily: "arial, sans-serif",
        fontSize: 14,
        color: "#202124",
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 16px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: "normal",
                lineHeight: 1,
                marginRight: 30,
                minWidth: 92,
              }}
            >
              <span style={{ color: primaryBlue }}>G</span>
              <span style={{ color: primaryRed }}>o</span>
              <span style={{ color: primaryYellow }}>o</span>
              <span style={{ color: primaryBlue }}>g</span>
              <span style={{ color: primaryGreen }}>l</span>
              <span style={{ color: primaryRed }}>e</span>
            </div>
            <div
              style={{
                flexGrow: 1,
                maxWidth: 580,
                height: 44,
                borderRadius: 24,
                border: `1px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                padding: "0 15px",
              }}
            >
              <span
                style={{
                  flexGrow: 1,
                  fontSize: 16,
                  color: "#202124",
                }}
              >
                {query}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              paddingLeft: 122,
            }}
          >
            {["All", "Images", "News", "Videos"].map((item) => (
              <div
                key={item}
                style={{
                  marginRight: 30,
                  padding: "8px 0",
                  borderBottom:
                    item === "All" ? `3px solid ${primaryBlue}` : "none",
                  marginTop: -1,
                }}
              >
                <span
                  style={{
                    color: item === "All" ? primaryBlue : statsGray,
                    fontWeight: item === "All" ? "bold" : "normal",
                    fontSize: 13,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px 0" }}>
        <div
          style={{
            fontSize: 14,
            color: statsGray,
            marginBottom: 25,
            paddingLeft: 16,
          }}
        >
          {resultStatsText}
        </div>
        <div>
          {results.map((result, index) => (
            <div
              key={index}
              style={{
                marginBottom: 25,
                maxWidth: 600,
                paddingLeft: 16,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: urlGreen,
                  marginBottom: 3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {result.url}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: linkBlue,
                  marginBottom: 5,
                  lineHeight: 1.3,
                }}
              >
                {result.title}
              </div>
              <div
                style={{ fontSize: 14, color: descriptionGray, lineHeight: 1.5 }}
              >
                {result.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
