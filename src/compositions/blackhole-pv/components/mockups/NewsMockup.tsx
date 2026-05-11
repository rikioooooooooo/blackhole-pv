import React from "react";

interface NewsItem {
  category: "Economy" | "Politics" | "Society" | "Tech" | "Sports" | "World";
  title: string;
  time: string;
}

interface NewsMockupProps {
  theme?: "light" | "dark";
  breakingNewsText: string;
  newsItems: NewsItem[];
}

const categoryTagColors: Record<NewsItem["category"], string> = {
  Economy: "#38A169",
  Politics: "#6B46C1",
  Society: "#3182CE",
  Tech: "#D69E2E",
  Sports: "#E53E3E",
  World: "#319795",
};

export const NewsMockup: React.FC<NewsMockupProps> = ({
  theme = "light",
  breakingNewsText,
  newsItems,
}) => {
  const isDark = theme === "dark";
  const mainBgColor = isDark ? "#1A202C" : "#FFFFFF";
  const textColor = isDark ? "#F7FAFC" : "#1A202C";
  const subTextColor = isDark ? "#CBD5E0" : "#4A5568";
  const borderColor = isDark ? "#4A5568" : "#E2E8F0";
  const headerBgColor = isDark ? "#2D3748" : "#F7FAFC";

  return (
    <div
      style={{
        fontFamily: "Roboto, sans-serif",
        backgroundColor: mainBgColor,
        color: textColor,
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: headerBgColor,
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: "bold", color: textColor }}>
          NEWS DAILY
        </div>
        <nav style={{ display: "flex", gap: 20 }}>
          {["Top", "Economy", "Politics", "Tech", "Sports"].map((item) => (
            <span
              key={item}
              style={{ fontSize: 15, color: subTextColor }}
            >
              {item}
            </span>
          ))}
        </nav>
      </div>

      <div
        style={{
          backgroundColor: "#E53E3E",
          color: "#FFFFFF",
          padding: "10px 20px",
          fontWeight: "bold",
          fontSize: 16,
          textAlign: "center",
        }}
      >
        Urgent -- {breakingNewsText}
      </div>

      <div style={{ padding: 20 }}>
        {newsItems.slice(0, 5).map((item, index) => (
          <React.Fragment key={index}>
            <div
              style={{
                display: "flex",
                flexDirection: "column" as const,
                marginBottom: 15,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    backgroundColor: categoryTagColors[item.category],
                    color: "#FFFFFF",
                    padding: "3px 8px",
                    borderRadius: 3,
                    fontSize: 12,
                    fontWeight: "bold",
                    marginRight: 10,
                    textTransform: "uppercase" as const,
                  }}
                >
                  {item.category}
                </span>
                <span style={{ fontSize: 12, color: subTextColor }}>
                  {item.time}
                </span>
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: textColor,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {item.title}
              </h2>
            </div>
            {index < newsItems.length - 1 && index < 4 && (
              <div
                style={{
                  height: 1,
                  backgroundColor: borderColor,
                  margin: "20px 0",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
