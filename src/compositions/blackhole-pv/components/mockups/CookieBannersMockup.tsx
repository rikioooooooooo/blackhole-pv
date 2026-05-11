import React from "react";

interface CookieBannerCardProps {
  bottom: number;
  offsetX: number;
  zIndex: number;
  rotation: number;
  backgroundColor: string;
  width: string;
  height: string;
  padding: string;
  title?: string;
  message?: string;
  button1Text?: string;
  button2Text?: string;
  titleFontSize?: string;
  messageFontSize?: string;
  buttonFontSize?: string;
  buttonPadding?: string;
  buttonColor?: string;
  buttonBgColor?: string;
  buttonBorderRadius?: string;
  justifyButtons?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  textColor?: string;
}

const CookieBannerCard: React.FC<CookieBannerCardProps> = ({
  bottom,
  offsetX,
  zIndex,
  rotation,
  backgroundColor,
  width,
  height,
  padding,
  title,
  message,
  button1Text,
  button2Text,
  titleFontSize = "18px",
  messageFontSize = "14px",
  buttonFontSize = "16px",
  buttonPadding = "10px 15px",
  buttonColor = "#fff",
  buttonBgColor = "#3b82f6",
  buttonBorderRadius = "8px",
  justifyButtons = "flex-end",
  textColor = "#333",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: `${bottom}px`,
        left: "50%",
        zIndex,
        transform: `translateX(calc(-50% + ${offsetX}px)) rotate(${rotation}deg)`,
        backgroundColor,
        width,
        height,
        padding,
        borderRadius: 15,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "sans-serif",
        color: textColor,
        boxSizing: "border-box",
        textAlign: "left" as const,
      }}
    >
      <h2 style={{ margin: "0 0 10px 0", fontSize: titleFontSize, fontWeight: "bold" }}>
        {title}
      </h2>
      <p style={{ margin: "0 0 15px 0", fontSize: messageFontSize, flexGrow: 1 }}>
        {message}
      </p>
      {(button1Text || button2Text) && (
        <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: justifyButtons }}>
          {button2Text && (
            <button
              style={{
                padding: buttonPadding,
                fontSize: buttonFontSize,
                borderRadius: buttonBorderRadius,
                border: "1px solid #ccc",
                backgroundColor: "#eee",
                color: "#555",
                whiteSpace: "nowrap",
                flexShrink: 0,
                outline: "none",
              }}
            >
              {button2Text}
            </button>
          )}
          {button1Text && (
            <button
              style={{
                padding: buttonPadding,
                fontSize: buttonFontSize,
                borderRadius: buttonBorderRadius,
                border: "none",
                backgroundColor: buttonBgColor,
                color: buttonColor,
                whiteSpace: "nowrap",
                flexShrink: 0,
                outline: "none",
              }}
            >
              {button1Text}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface BannerContent {
  title?: string;
  message?: string;
  button1Text?: string;
  button2Text?: string;
}

interface CookieBannersMockupProps {
  banner1?: Partial<BannerContent>;
  banner2?: Partial<BannerContent>;
  banner3?: Partial<BannerContent>;
  banner4?: Partial<BannerContent>;
  banner5?: Partial<BannerContent>;
}

export const CookieBannersMockup: React.FC<CookieBannersMockupProps> = ({
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
}) => {
  const defaults: BannerContent[] = [
    { title: "We value your privacy", message: "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.", button1Text: "Accept All", button2Text: "Reject All" },
    { title: "We REALLY value your privacy", message: "Seriously, your data is precious to us. We promise to handle it with the utmost care.", button1Text: "Accept All (pretty please)", button2Text: "No, thanks." },
    { title: "Please accept ALL cookies", message: "Our entire business model depends on these cookies. Without them, our data scientists will cry.", button1Text: "Yes, ALL cookies!" },
    { title: "Are you SURE you don't want cookies?", message: "Think about all the personalized content you're missing out on!", button1Text: "Maybe accept some...", button2Text: "Still no cookies" },
    { title: "Last chance for cookies!", message: "This is it. Your final opportunity to join the cookie club.", button1Text: "Okay, fine! Accept all!", button2Text: "No. Never." },
  ];

  const overrides = [banner1, banner2, banner3, banner4, banner5];
  const banners = defaults.map((d, i) => ({ ...d, ...overrides[i] }));

  const configs = [
    { bottom: 20, offsetX: 0, zIndex: 1, rotation: -2, backgroundColor: "#f0f0f0", width: "400px", height: "180px", padding: "20px", justifyButtons: "flex-end" as const },
    { bottom: 70, offsetX: -30, zIndex: 2, rotation: 1, backgroundColor: "#e0f7fa", width: "450px", height: "200px", padding: "25px", justifyButtons: "center" as const, titleFontSize: "22px", messageFontSize: "16px" },
    { bottom: 140, offsetX: 40, zIndex: 3, rotation: -3, backgroundColor: "#ffe0b2", width: "500px", height: "220px", padding: "30px", justifyButtons: "center" as const, titleFontSize: "26px", messageFontSize: "18px", buttonFontSize: "24px", buttonPadding: "15px 30px", buttonBgColor: "#ff6f00" },
    { bottom: 220, offsetX: -15, zIndex: 4, rotation: 2, backgroundColor: "#f8bbd0", width: "480px", height: "200px", padding: "25px", justifyButtons: "space-around" as const, titleFontSize: "20px", messageFontSize: "15px", buttonBgColor: "#d32f2f" },
    { bottom: 300, offsetX: 20, zIndex: 5, rotation: -1, backgroundColor: "#ffcdd2", width: "420px", height: "190px", padding: "20px", justifyButtons: "space-between" as const, titleFontSize: "24px", messageFontSize: "17px", buttonBgColor: "#880e4f" },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {configs.map((cfg, i) => (
        <CookieBannerCard
          key={i}
          {...cfg}
          title={banners[i].title}
          message={banners[i].message}
          button1Text={banners[i].button1Text}
          button2Text={banners[i].button2Text}
        />
      ))}
    </div>
  );
};
