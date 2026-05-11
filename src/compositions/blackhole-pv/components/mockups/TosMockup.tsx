import React from "react";

interface TosMockupProps {
  headerText?: string;
  bodyParagraphs?: string[];
}

const defaultBodyParagraphs = [
  "第1条（目的）\n本規約は、株式会社〇〇が提供するサービスの利用に関する条件を定めるものです。ユーザーは本規約に同意したものとみなされます。",
  "第2条（本規約の適用）\n本規約は、本サービスの利用に関する当社とユーザーとの間のあらゆる関係に適用されます。",
  "第3条（会員登録）\n本サービスの利用を希望する者は、本規約に同意の上、当社の定める方法により会員登録の申込みを行うものとします。",
  "第4条（ユーザーIDおよびパスワードの管理）\n会員は、自己の責任においてユーザーIDおよびパスワードを管理するものとします。",
  "第5条（サービスの利用）\n会員は、本規約および当社が別途定める方法に従い、本サービスを利用するものとします。",
  "第6条（禁止事項）\nユーザーは、法令に違反する行為、他のユーザーに不快感を与える行為、当社の著作権を侵害する行為を行ってはなりません。",
  "第7条（個人情報の取り扱い）\n当社は、ユーザーから取得した個人情報を適切に取り扱うものとします。",
  "第8条（免責事項）\n当社は、本サービスに事実上または法律上の瑕疵がないことを保証するものではありません。",
  "第9条（本規約の変更）\n当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更できるものとします。",
  "第10条（準拠法および管轄裁判所）\n本規約の解釈にあたっては日本法を準拠法とします。",
];

export const TosMockup: React.FC<TosMockupProps> = ({
  headerText = "利用規約・プライバシーポリシー",
  bodyParagraphs = defaultBodyParagraphs,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        border: "1px solid #e0e0e0",
        borderRadius: 4,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column" as const,
        padding: 25,
        fontFamily: "sans-serif",
        color: "#333",
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          color: "#222",
        }}
      >
        {headerText}
      </h2>
      <div
        style={{
          flexGrow: 1,
          overflowY: "scroll" as const,
          paddingRight: 15,
          boxSizing: "border-box",
        }}
      >
        {bodyParagraphs.map((paragraph, index) => (
          <p
            key={index}
            style={{
              fontSize: 11,
              lineHeight: 1.4,
              marginBottom: 15,
              whiteSpace: "pre-wrap" as const,
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};
