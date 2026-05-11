import React from "react";
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	staticFile,
} from "remotion";
import {BlackHole} from "../components/BlackHole";
import {FONTS} from "../constants";
import {usePvCurrentFrame as useCurrentFrame, usePvVideoConfig as useVideoConfig} from "../timing";

const cream = "#F5F0E8";
const ink = "#171316";
const purple = "#6B3FA0";
const coral = "#E07A5F";
const amber = "#F4A261";
const blue = "#2F65D9";

const clamp = {
	extrapolateLeft: "clamp" as const,
	extrapolateRight: "clamp" as const,
};

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInFast = Easing.bezier(0.7, 0, 0.84, 0);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);

type TargetKind =
	| "generated"
	| "text"
	| "chip"
	| "image"
	| "notification"
	| "banner"
	| "comment"
	| "video"
	| "stat"
	| "page"
	| "noise";

type Target = {
	kind: TargetKind;
	label: string;
	start: number;
	left: number;
	top: number;
	width: number;
	height: number;
	rotate?: number;
	boost: number;
	src?: string;
};

const targets: Target[] = [
	{kind: "generated", label: "テキスト断片", src: "mockups/generated/s09-objects/text-lines.png", start: 6, left: 146, top: 118, width: 308, height: 196, rotate: -5, boost: 0.034},
	{kind: "generated", label: "写真サムネ", src: "mockups/generated/s09-objects/photo-thumb.png", start: 12, left: 544, top: 78, width: 236, height: 242, rotate: 4, boost: 0.04},
	{kind: "generated", label: "通知", src: "mockups/generated/s09-objects/notification-toast.png", start: 18, left: 830, top: 92, width: 278, height: 126, rotate: -2, boost: 0.034},
	{kind: "generated", label: "コメント", src: "mockups/generated/s09-objects/comment-row.png", start: 24, left: 1268, top: 112, width: 294, height: 132, rotate: 3, boost: 0.034},
	{kind: "generated", label: "バナー", src: "mockups/generated/s09-objects/banner-ad.png", start: 30, left: 1514, top: 246, width: 304, height: 178, rotate: -4, boost: 0.042},
	{kind: "generated", label: "動画", src: "mockups/generated/s09-objects/video-card.png", start: 36, left: 108, top: 392, width: 308, height: 232, rotate: 3, boost: 0.046},
	{kind: "generated", label: "チャート", src: "mockups/generated/s09-objects/chart-widget.png", start: 42, left: 470, top: 348, width: 312, height: 178, rotate: -3, boost: 0.04},
	{kind: "generated", label: "ポップアップ", src: "mockups/generated/s09-objects/popup-modal.png", start: 48, left: 1282, top: 404, width: 236, height: 274, rotate: -2, boost: 0.045},
	{kind: "generated", label: "検索結果", src: "mockups/generated/s09-objects/search-result.png", start: 54, left: 1546, top: 534, width: 316, height: 142, rotate: 4, boost: 0.034},
	{kind: "generated", label: "画像グリッド", src: "mockups/generated/s09-objects/image-grid-piece.png", start: 62, left: 164, top: 704, width: 232, height: 232, rotate: -3, boost: 0.038},
	{kind: "generated", label: "吹き出し", src: "mockups/generated/s09-objects/message-bubble.png", start: 70, left: 484, top: 678, width: 312, height: 150, rotate: 5, boost: 0.034},
	{kind: "generated", label: "価格カード", src: "mockups/generated/s09-objects/price-card.png", start: 78, left: 1112, top: 704, width: 214, height: 284, rotate: -5, boost: 0.042},
	{kind: "generated", label: "通知2", src: "mockups/generated/s09-objects/notification-toast.png", start: 86, left: 1456, top: 754, width: 286, height: 130, rotate: 3, boost: 0.032},
	{kind: "generated", label: "テキスト2", src: "mockups/generated/s09-objects/text-lines.png", start: 94, left: 870, top: 246, width: 250, height: 162, rotate: 3, boost: 0.032},
	{kind: "generated", label: "写真2", src: "mockups/generated/s09-objects/photo-thumb.png", start: 102, left: 742, top: 514, width: 214, height: 220, rotate: -5, boost: 0.036},
	{kind: "generated", label: "コメント2", src: "mockups/generated/s09-objects/comment-row.png", start: 110, left: 1016, top: 494, width: 260, height: 118, rotate: 4, boost: 0.032},
	{kind: "generated", label: "バナー2", src: "mockups/generated/s09-objects/banner-ad.png", start: 124, left: 738, top: 292, width: 424, height: 246, rotate: 0, boost: 0.09},
	{kind: "noise", label: "画面のノイズ全部", start: 158, left: 0, top: 0, width: 1920, height: 1080, rotate: 0, boost: 0.24},
];

const absorbProgress = (frame: number, start: number, duration = 14) => {
	return interpolate(frame, [start, start + duration], [0, 1], {
		...clamp,
		easing: easeInFast,
	});
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const PillLabel: React.FC<{children: React.ReactNode; tone?: "light" | "dark"}> = ({
	children,
	tone = "light",
}) => (
	<div
		style={{
			display: "inline-flex",
			alignItems: "center",
			height: 28,
			padding: "0 12px",
			borderRadius: 999,
			background: tone === "light" ? "rgba(107,63,160,0.12)" : "rgba(255,255,255,0.2)",
			color: tone === "light" ? purple : "#FFFFFF",
			fontFamily: FONTS.ui,
			fontSize: 11,
			fontWeight: 900,
			letterSpacing: "0.1em",
		}}
	>
		{children}
	</div>
);

const TargetContent: React.FC<{target: Target}> = ({target}) => {
	if (target.src) {
		return (
			<Img
				src={staticFile(target.src)}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "contain",
					display: "block",
					filter: "drop-shadow(0 24px 44px rgba(36,26,18,0.16))",
				}}
			/>
		);
	}

	if (target.kind === "text") {
		return (
			<div style={cardStyle}>
				<PillLabel>TEXT</PillLabel>
				<div style={{marginTop: 13, fontSize: 28, fontWeight: 900, color: ink}}>
					{target.label}
				</div>
			</div>
		);
	}

	if (target.kind === "chip") {
		return (
			<div
				style={{
					...cardStyle,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 12,
					padding: 0,
				}}
			>
				<div style={{width: 16, height: 16, borderRadius: 999, background: redDot}} />
				<div style={{fontSize: 25, fontWeight: 900, color: ink}}>{target.label}</div>
			</div>
		);
	}

	if (target.kind === "image") {
		return (
			<div style={{...cardStyle, padding: 0, overflow: "hidden"}}>
				<Img
					src={staticFile("mockups/app-icon-social.png")}
					style={{width: "100%", height: 148, objectFit: "cover"}}
				/>
				<div style={{padding: 16}}>
					<PillLabel>IMAGE</PillLabel>
				</div>
			</div>
		);
	}

	if (target.kind === "notification") {
		return (
			<div style={{...cardStyle, display: "flex", alignItems: "center", gap: 18}}>
				<div style={{width: 48, height: 48, borderRadius: 14, background: blue}} />
				<div>
					<PillLabel>NOTICE</PillLabel>
					<div style={{marginTop: 9, fontSize: 22, fontWeight: 900, color: ink}}>
						作業中の通知
					</div>
				</div>
			</div>
		);
	}

	if (target.kind === "banner") {
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					borderRadius: 22,
					background: `linear-gradient(135deg, ${purple}, ${coral})`,
					boxShadow: "0 26px 70px rgba(107,63,160,0.22)",
					color: "#FFFFFF",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 28px",
					boxSizing: "border-box",
				}}
			>
				<div>
					<PillLabel tone="dark">BANNER</PillLabel>
					<div style={{marginTop: 10, fontSize: 25, fontWeight: 900}}>
						{target.label}
					</div>
				</div>
				<div style={{width: 80, height: 80, borderRadius: 20, background: "rgba(255,255,255,0.22)"}} />
			</div>
		);
	}

	if (target.kind === "comment") {
		return (
			<div style={{...cardStyle, display: "flex", alignItems: "center", gap: 16}}>
				<div style={{width: 56, height: 56, borderRadius: 999, background: amber}} />
				<div style={{flex: 1}}>
					<div style={{width: "74%", height: 16, borderRadius: 999, background: "rgba(23,19,22,0.2)"}} />
					<div style={{width: "92%", height: 13, marginTop: 12, borderRadius: 999, background: "rgba(107,63,160,0.16)"}} />
				</div>
			</div>
		);
	}

	if (target.kind === "video") {
		return (
			<div style={{...cardStyle, padding: 0, overflow: "hidden", background: "#171316"}}>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"linear-gradient(135deg, rgba(23,19,22,1), rgba(59,42,88,1) 48%, rgba(224,122,95,0.7))",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: "50%",
						top: "50%",
						width: 72,
						height: 72,
						borderRadius: 999,
						background: "rgba(255,255,255,0.2)",
						transform: "translate(-50%, -50%)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: "50%",
						top: "50%",
						width: 0,
						height: 0,
						borderTop: "16px solid transparent",
						borderBottom: "16px solid transparent",
						borderLeft: "24px solid rgba(255,255,255,0.9)",
						transform: "translate(-38%, -50%)",
					}}
				/>
				<div style={{position: "absolute", left: 20, bottom: 18}}>
					<PillLabel tone="dark">VIDEO</PillLabel>
				</div>
			</div>
		);
	}

	if (target.kind === "stat") {
		return (
			<div style={{...cardStyle, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12}}>
				{["99+", "12", "404"].map((num, index) => (
					<div key={num} style={{textAlign: "center"}}>
						<div style={{fontFamily: FONTS.ui, fontSize: 25, fontWeight: 900, color: index === 0 ? redDot : purple}}>
							{num}
						</div>
						<div style={{height: 9, marginTop: 10, borderRadius: 999, background: "rgba(23,19,22,0.14)"}} />
					</div>
				))}
			</div>
		);
	}

	if (target.kind === "page") {
		return (
			<div style={{...cardStyle, padding: 0, overflow: "hidden"}}>
				<div style={{height: 54, background: "#FBF8F2", borderBottom: "1px solid rgba(23,19,22,0.1)"}} />
				<div style={{padding: 34}}>
					<PillLabel>PAGE</PillLabel>
					<div style={{marginTop: 20, fontSize: 40, fontWeight: 900, color: ink}}>
						{target.label}
					</div>
					{[0, 1, 2, 3].map((line) => (
						<div
							key={line}
							style={{
								marginTop: 22,
								width: `${86 - line * 10}%`,
								height: 18,
								borderRadius: 999,
								background: line % 2 === 0 ? "rgba(23,19,22,0.14)" : "rgba(107,63,160,0.16)",
							}}
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background:
					"radial-gradient(circle at 50% 50%, rgba(10,5,8,0.02), rgba(10,5,8,0.18)), repeating-linear-gradient(90deg, rgba(23,19,22,0.025) 0 1px, transparent 1px 46px)",
				opacity: 0.28,
			}}
		/>
	);
};

const redDot = "#E3483E";

const cardStyle: React.CSSProperties = {
	width: "100%",
	height: "100%",
	borderRadius: 22,
	background: "rgba(255,255,255,0.94)",
	boxShadow: "0 24px 70px rgba(36,26,18,0.14)",
	border: "1px solid rgba(23,19,22,0.07)",
	padding: "22px 24px",
	boxSizing: "border-box",
	position: "relative",
	overflow: "hidden",
};

const AbsorbingTarget: React.FC<{target: Target}> = ({target}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const appear = spring({
		frame: frame - Math.max(0, target.start - 48),
		fps,
		config: {mass: 0.8, damping: 20, stiffness: 140},
	});
	const progress = absorbProgress(frame, target.start, target.kind === "noise" ? 24 : 14);
	const opacity =
		interpolate(appear, [0, 1], [0, 1], clamp) *
		(1 - clamp01(progress)) *
		(target.kind === "noise" ? 0.16 : 1);
	const y = interpolate(appear, [0, 1], [18, 0], {...clamp, easing: easeOutSoft});
	const centerX = target.left + target.width / 2;
	const centerY = target.top + target.height / 2;
	const pullX = interpolate(progress, [0, 1], [0, 960 - centerX], {...clamp, easing: easeInFast});
	const pullY = interpolate(progress, [0, 1], [0, 540 - centerY], {...clamp, easing: easeInFast});
	const scale = interpolate(progress, [0, 0.72, 1], [1, 0.34, 0.02], {...clamp, easing: easeInFast});
	const blur = interpolate(progress, [0, 1], [0, 8], clamp);

	return (
		<div
			style={{
				position: "absolute",
				left: target.left,
				top: target.top,
				width: target.width,
				height: target.height,
				opacity,
				transform: `translate(${pullX}px, ${pullY + y}px) scale(${scale}) rotate(${(target.rotate ?? 0) + progress * -12}deg)`,
				transformOrigin: "50% 50%",
				filter: `blur(${blur}px)`,
				willChange: "transform, opacity, filter",
				zIndex: target.kind === "noise" ? 3 : 12,
			}}
		>
			<TargetContent target={target} />
		</div>
	);
};

export const S09GameGrowth: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const copyIn = spring({
		frame: frame - 28,
		fps,
		config: {mass: 0.72, damping: 18, stiffness: 130},
	});

	const totalGrowth = targets.reduce((sum, target) => {
		return sum + absorbProgress(frame, target.start, target.kind === "noise" ? 24 : 14) * target.boost;
	}, 0);
	const finalBloom = interpolate(frame, [156, 172, 180], [0, 0.44, 1], {
		...clamp,
		easing: easeInOutSmooth,
	});
	const activePulse = targets.some((target) => frame >= target.start && frame <= target.start + 28)
		? 0.08
		: 0;
	const breath = 1 + Math.sin(frame * 0.07) * 0.018;
	const holeSize = 104 + totalGrowth * 340 + finalBloom * 2260;
	const holeScale = breath + activePulse;
	const cameraScale = interpolate(frame, [0, 190, 330], [0.99, 1.018, 1.04], {
		...clamp,
		easing: easeInOutSmooth,
	});
	const copyOpacity = interpolate(frame, [14, 34, 132, 158], [0, 1, 1, 0], {
		...clamp,
		easing: easeOutSoft,
	});
	const copyY = interpolate(copyIn, [0, 1], [16, 0], clamp);
	const blackout = interpolate(frame, [172, 180], [0, 0.9], {...clamp, easing: easeInOutSmooth});

	return (
		<AbsoluteFill
			style={{
				background: cream,
				overflow: "hidden",
				fontFamily: FONTS.japanese,
			}}
		>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at 50% 46%, rgba(255,255,255,0.68), rgba(255,255,255,0.22) 34%, transparent 68%), radial-gradient(circle at 16% 20%, rgba(224,122,95,0.12), transparent 28%), radial-gradient(circle at 84% 76%, rgba(47,101,217,0.1), transparent 28%)",
				}}
			/>

			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `scale(${cameraScale})`,
					transformOrigin: "50% 50%",
				}}
			>
				{targets.map((target) => (
					<AbsorbingTarget key={`${target.kind}-${target.start}`} target={target} />
				))}
			</div>

			<div
				style={{
					position: "absolute",
					left: width / 2 - holeSize / 2,
					top: height / 2 - holeSize / 2,
					width: holeSize,
					height: holeSize,
					transform: `scale(${holeScale})`,
					transformOrigin: "50% 50%",
					filter: `drop-shadow(0 ${28 + totalGrowth * 28}px ${52 + totalGrowth * 72}px rgba(65,36,104,0.38))`,
					zIndex: 20,
				}}
			>
				<BlackHole size={holeSize} />
			</div>

			{targets.map((target, index) => {
				const progress = clamp01(absorbProgress(frame, target.start, target.kind === "noise" ? 24 : 14));
				const opacity = interpolate(progress, [0, 0.45, 1], [0, 1, 0], clamp);
				const size = 86 + target.boost * 420;
				return (
					<div
						key={`${target.kind}-ring`}
						style={{
							position: "absolute",
							left: width / 2 - size / 2,
							top: height / 2 - size / 2,
							width: size,
							height: size,
							borderRadius: "50%",
							border: `2px solid ${index % 3 === 0 ? amber : index % 3 === 1 ? coral : blue}`,
							transform: `scale(${1 + progress * 2.2})`,
							opacity: opacity * 0.56,
							zIndex: 18,
						}}
					/>
				);
			})}

			<div
				style={{
					position: "absolute",
					left: "50%",
					bottom: 48,
					width: 1680,
					transform: `translateX(-50%) translateY(${copyY}px)`,
					opacity: copyOpacity,
					textAlign: "center",
					fontSize: 30,
					fontWeight: 900,
					lineHeight: 1.22,
					letterSpacing: 0,
					color: ink,
					padding: "19px 34px",
					borderRadius: 18,
					background: "rgba(245,240,232,0.9)",
					boxShadow: "0 16px 48px rgba(45,30,20,0.08)",
					zIndex: 31,
					whiteSpace: "nowrap",
				}}
			>
				画面に映ってる情報を全て吸い込んでブラックホールをどんどん大きくしよう！
			</div>

			<AbsoluteFill
				style={{
					background: "#0A0508",
					opacity: blackout,
					zIndex: 35,
				}}
			/>
		</AbsoluteFill>
	);
};

export default S09GameGrowth;
