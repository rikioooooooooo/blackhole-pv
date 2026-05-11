import React from "react";
import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
} from "remotion";
import {BlackHole} from "../components/BlackHole";
import {COLORS, FONTS, SPRING, VIDEO_HEIGHT, VIDEO_WIDTH} from "../constants";
import {usePvCurrentFrame as useCurrentFrame, usePvVideoConfig as useVideoConfig} from "../timing";

const DURATION = 180;

const palette = COLORS as unknown as Record<string, string>;
const fonts = FONTS as unknown as Record<string, string>;
const springPreset =
	((SPRING as unknown as Record<string, unknown>).soft as Record<
		string,
		number
	>) ??
	((SPRING as unknown as Record<string, unknown>).default as Record<
		string,
		number
	>) ??
	{};

const bg = "#F5F0E8";
const ink = palette.ink ?? palette.black ?? "#171717";
const purple = palette.purple ?? "#4A154B";
const orange = palette.orange ?? "#FFB86B";

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);
const suckEase = Easing.bezier(0.7, 0, 0.84, 0);

const panelSpring = {
	mass: 1,
	damping: 22,
	stiffness: 120,
};

const textSpring = {
	mass: 0.7,
	damping: 18,
	stiffness: 130,
};

const holeSpring = {
	mass: 0.55,
	damping: 8,
	stiffness: 180,
};

const makeRange = (values: number[]): number[] => {
	const guarded: number[] = [];
	for (let i = 0; i < values.length; i++) {
		guarded.push(i === 0 ? values[i] : Math.max(guarded[i - 1] + 1, values[i]));
	}
	return guarded;
};

type Point = {
	x: number;
	y: number;
};

type AbsorbLineProps = {
	text: string;
	frame: number;
	start: number;
	end: number;
	absX: number;
	absY: number;
	width: number;
	fontSize: number;
	bh: Point;
	fontFamily: string;
	letterSpacing?: number;
	s: number;
};

const getBlackHolePosition = (
	frame: number,
	lineX: number,
	line1Y: number,
	line2Y: number,
	line3Y: number,
	line1W: number,
	line2W: number,
	line3W: number,
	s: number
): Point => {
	const t = makeRange([0, 18, 28, 42, 78, 88, 100, 125, 134, 142, 157, 168, DURATION]);

	const x = interpolate(
		frame,
		t,
		[
			lineX - 62 * s,
			lineX - 62 * s,
			lineX - 44 * s,
			lineX - 28 * s,
			lineX + line1W + 42 * s,
			lineX - 38 * s,
			lineX - 28 * s,
			lineX + line2W + 42 * s,
			lineX - 38 * s,
			lineX - 28 * s,
			lineX + line3W + 42 * s,
			lineX + line3W + 42 * s,
			lineX + line3W + 42 * s,
		],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		}
	);

	const y = interpolate(
		frame,
		t,
		[
			line1Y + 22 * s,
			line1Y + 22 * s,
			line1Y + 22 * s,
			line1Y + 22 * s,
			line1Y + 22 * s,
			line2Y + 22 * s,
			line2Y + 22 * s,
			line2Y + 22 * s,
			line3Y + 22 * s,
			line3Y + 22 * s,
			line3Y + 22 * s,
			line3Y + 22 * s,
			line3Y + 22 * s,
		],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		}
	);

	return {x, y};
};

const AbsorbLine: React.FC<AbsorbLineProps> = ({
	text,
	frame,
	start,
	end,
	absX,
	absY,
	width,
	fontSize,
	bh,
	fontFamily,
	letterSpacing = 0,
	s,
}) => {
	const lineHeight = fontSize * 1.45;

	const baseStyle: React.CSSProperties = {
		position: "relative",
		width,
		height: lineHeight,
		fontFamily,
		fontSize,
		lineHeight: `${lineHeight}px`,
		letterSpacing,
		color: ink,
		whiteSpace: "pre",
		overflow: "hidden",
	};

	const bhRadius = 43 * s;
	const wipeFromBh = Math.max(0, Math.min(width, bh.x - absX + bhRadius));
	const wipeRaw = frame < start ? 0 : frame >= end ? width : wipeFromBh;
	const charW = fontSize * 1.0;
	const wipe = wipeRaw >= width ? width : Math.floor(wipeRaw / charW) * charW;

	return (
		<div style={baseStyle}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					clipPath: `inset(0 0 0 ${wipe}px)`,
					willChange: "clip-path",
				}}
			>
				{text}
			</div>
		</div>
	);
};

const AnimatedBlackHole: React.FC<{
	frame: number;
	fps: number;
	bh: Point;
	s: number;
}> = ({frame, fps, bh, s}) => {
	const size = 86 * s;

	const opacity = interpolate(
		frame,
		makeRange([18, 30, 166, 176]),
		[0, 1, 1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeOutSoft,
		}
	);

	const entrance = spring({
		frame: frame - 18,
		fps,
		config: holeSpring,
	});

	const entranceScale = interpolate(entrance, makeRange([0, 1]), [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const pulse1 = interpolate(frame, makeRange([42, 52, 80]), [0, 0.075, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});
	const pulse2 = interpolate(frame, makeRange([100, 108, 126]), [0, 0.07, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});
	const pulse3 = interpolate(frame, makeRange([142, 149, 158]), [0, 0.065, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const settle = 1 + Math.max(pulse1, pulse2, pulse3);
	const scale = entranceScale * settle;

	if (opacity <= 0.03) {
		return null;
	}

	return (
		<div
			style={{
				position: "absolute",
				left: bh.x - size / 2,
				top: bh.y - size / 2,
				width: size,
				height: size,
				opacity,
				transform: `scale(${scale})`,
				transformOrigin: "50% 50%",
				zIndex: 80,
				pointerEvents: "none",
				willChange: "transform, opacity",
			}}
		>
			{React.createElement(BlackHole as React.ComponentType<any>, {
				size,
				coreColor: "#0A0508",
				coreFill: "#0A0508",
				style: {
					width: "100%",
					height: "100%",
				},
			})}
		</div>
	);
};

export const S2Slack: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const designW = Number(VIDEO_WIDTH) || 1920;
	const designH = Number(VIDEO_HEIGHT) || 1080;
	const s = Math.min(width / designW, height / designH);

	const displayFont = fonts.display ?? "Inter, Arial, sans-serif";
	const uiFont = fonts.ui ?? "Inter, Arial, sans-serif";
	const japaneseFont = "'Axis Std', sans-serif";

	const panelProgress = spring({
		frame,
		fps,
		config: {
			...panelSpring,
			...springPreset,
		},
	});

	const sidebarProgress = spring({
		frame: frame - 8,
		fps,
		config: panelSpring,
	});

	const message1Progress = spring({
		frame: frame - 14,
		fps,
		config: textSpring,
	});

	const message2Progress = spring({
		frame: frame - 22,
		fps,
		config: textSpring,
	});

	const cardW = 1380 * s;
	const cardH = 820 * s;
	const cardX = (width - cardW) / 2;
	const cardY = 126 * s;

	const chatX = 318 * s;
	const lineX = cardX + chatX + 142 * s;
	const line1Y = cardY + 263 * s;
	const line2Y = cardY + 311 * s;
	const line3Y = cardY + 479 * s;

	const line1W = 585 * s;
	const line2W = 690 * s;
	const line3W = 660 * s;

	const bh = getBlackHolePosition(
		frame,
		lineX,
		line1Y,
		line2Y,
		line3Y,
		line1W,
		line2W,
		line3W,
		s
	);

	const cardTranslateY = interpolate(
		panelProgress,
		makeRange([0, 1]),
		[20 * s, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const cardScale = interpolate(panelProgress, makeRange([0, 1]), [0.96, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const cardOpacity = interpolate(panelProgress, makeRange([0, 1]), [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const rotateY = interpolate(panelProgress, makeRange([0, 1]), [-1.8, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const rotateX = interpolate(panelProgress, makeRange([0, 1]), [0.9, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const sidebarTranslateX = interpolate(
		sidebarProgress,
		makeRange([0, 1]),
		[-24 * s, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);
	const sidebarOpacity = interpolate(
		sidebarProgress,
		makeRange([0, 1]),
		[0, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const message1Opacity = interpolate(
		message1Progress,
		makeRange([0, 1]),
		[0, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);
	const message1Y = interpolate(
		message1Progress,
		makeRange([0, 1]),
		[14 * s, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);
	const message1Scale = interpolate(
		message1Progress,
		makeRange([0, 1]),
		[0.985, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const message2Opacity = interpolate(
		message2Progress,
		makeRange([0, 1]),
		[0, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);
	const message2Y = interpolate(
		message2Progress,
		makeRange([0, 1]),
		[14 * s, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);
	const message2Scale = interpolate(
		message2Progress,
		makeRange([0, 1]),
		[0.985, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const statusProgress = spring({
		frame: frame - 166,
		fps,
		config: textSpring,
	});

	const statusOpacity = interpolate(statusProgress, makeRange([0, 1]), [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const statusY = interpolate(statusProgress, makeRange([0, 1]), [8 * s, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const messageFontSize = 29 * s;

	const rootStyle: React.CSSProperties = {
		background: bg,
		overflow: "hidden",
		fontFamily: uiFont,
		color: ink,
	};

	return (
		<AbsoluteFill style={rootStyle}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage:
						"radial-gradient(circle at 18% 18%, rgba(255,255,255,0.64), rgba(255,255,255,0) 34%), radial-gradient(circle at 82% 24%, rgba(138,92,255,0.08), rgba(138,92,255,0) 28%), radial-gradient(circle at 64% 78%, rgba(255,184,107,0.12), rgba(255,184,107,0) 30%)",
				}}
			/>

			<div
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0.16,
					backgroundImage:
						"linear-gradient(rgba(23,23,23,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,0.026) 1px, transparent 1px)",
					backgroundSize: `${22 * s}px ${22 * s}px`,
					mixBlendMode: "multiply",
				}}
			/>

			<div
				style={{
					position: "absolute",
					inset: 0,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						position: "absolute",
						left: cardX,
						top: cardY,
						width: cardW,
						height: cardH,
						borderRadius: 34 * s,
						overflow: "hidden",
						opacity: cardOpacity,
						background: "rgba(255,255,255,0.96)",
						boxShadow:
							"0 50px 120px rgba(38,24,54,0.2), 0 18px 42px rgba(38,24,54,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
						border: `${1 * s}px solid rgba(255,255,255,0.78)`,
						transform: `perspective(${1700 * s}px) translateY(${cardTranslateY}px) scale(${cardScale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
						transformOrigin: "50% 54%",
						willChange: "transform, opacity",
					}}
				>
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249,247,244,0.92))",
						}}
					/>

					<div
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							bottom: 0,
							width: 318 * s,
							opacity: sidebarOpacity,
							transform: `translateX(${sidebarTranslateX}px)`,
							willChange: "transform, opacity",
						}}
					>
						<div
							style={{
								position: "absolute",
								left: 0,
								top: 0,
								bottom: 0,
								width: 92 * s,
								background: "#3F0E40",
							}}
						>
							{["BH", "DM", "AI", "+"].map((label, i) => (
								<div
									key={label}
									style={{
										position: "absolute",
										left: 18 * s,
										top: (32 + i * 74) * s,
										width: 54 * s,
										height: 54 * s,
										borderRadius: 15 * s,
										background:
											i === 0
												? "rgba(255,255,255,0.96)"
												: "rgba(255,255,255,0.13)",
										color: i === 0 ? "#3F0E40" : "rgba(255,255,255,0.88)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontFamily: displayFont,
										fontSize: 15 * s,
										fontWeight: 800,
									}}
								>
									{label}
								</div>
							))}
						</div>

						<div
							style={{
								position: "absolute",
								left: 92 * s,
								top: 0,
								bottom: 0,
								width: 226 * s,
								background: purple,
								color: "rgba(255,255,255,0.96)",
								borderRight: `${1 * s}px solid rgba(0,0,0,0.12)`,
							}}
						>
							<div
								style={{
									position: "absolute",
									left: 24 * s,
									top: 28 * s,
									fontFamily: displayFont,
									fontWeight: 800,
									fontSize: 23 * s,
									letterSpacing: -0.3 * s,
									whiteSpace: "nowrap",
								}}
							>
								Black Hole Inc.
							</div>

							<div
								style={{
									position: "absolute",
									left: 24 * s,
									top: 92 * s,
									fontSize: 13 * s,
									textTransform: "uppercase",
									letterSpacing: 1.3 * s,
									opacity: 0.78,
									fontWeight: 700,
									whiteSpace: "nowrap",
								}}
							>
								Direct messages
							</div>

							{["@tanaka", "@mori", "@sato"].map((name, i) => (
								<div
									key={name}
									style={{
										position: "absolute",
										left: 14 * s,
										right: 14 * s,
										top: (126 + i * 52) * s,
										height: 40 * s,
										borderRadius: 11 * s,
										background:
											i === 0
												? "rgba(255,255,255,0.18)"
												: "rgba(255,255,255,0)",
										display: "flex",
										alignItems: "center",
										paddingLeft: 14 * s,
										fontSize: 17 * s,
										fontWeight: i === 0 ? 700 : 500,
										opacity: i === 0 ? 1 : 0.82,
									}}
								>
									<span
										style={{
											width: 9 * s,
											height: 9 * s,
											borderRadius: "50%",
											background:
												i === 0 ? "#2BAC76" : "rgba(255,255,255,0.46)",
											marginRight: 10 * s,
										}}
									/>
									{name}
								</div>
							))}
						</div>
					</div>

					<div
						style={{
							position: "absolute",
							left: chatX,
							right: 0,
							top: 0,
							bottom: 0,
							background: "rgba(255,255,255,0.92)",
						}}
					>
						<div
							style={{
								position: "absolute",
								left: 0,
								right: 0,
								top: 0,
								height: 86 * s,
								borderBottom: `${1 * s}px solid rgba(23,23,23,0.08)`,
								background: "rgba(255,255,255,0.98)",
							}}
						>
							<div
								style={{
									position: "absolute",
									left: 38 * s,
									top: 22 * s,
									fontFamily: displayFont,
									fontSize: 28 * s,
									fontWeight: 800,
									letterSpacing: -0.7 * s,
									whiteSpace: "nowrap",
								}}
							>
								@tanaka
							</div>
							<div
								style={{
									position: "absolute",
									left: 40 * s,
									top: 56 * s,
									fontSize: 15 * s,
									color: "rgba(23,23,23,0.68)",
									fontWeight: 650,
									whiteSpace: "nowrap",
								}}
							>
								Direct message
							</div>

							{frame >= 166 && statusOpacity > 0.04 ? (
								<div
									style={{
										position: "absolute",
										right: 42 * s,
										top: 20 * s,
										height: 46 * s,
										padding: `0 ${22 * s}px`,
										borderRadius: 999,
										background: "rgba(10,5,8,0.94)",
										color: "white",
										display: "flex",
										alignItems: "center",
										gap: 10 * s,
										fontFamily: japaneseFont,
										fontSize: 17 * s,
										fontWeight: 800,
										opacity: statusOpacity,
										transform: `translateY(${statusY}px)`,
										boxShadow:
											"0 14px 34px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.16)",
										willChange: "opacity, transform",
										whiteSpace: "nowrap",
										zIndex: 90,
									}}
								>
									<span
										style={{
											width: 9 * s,
											height: 9 * s,
											borderRadius: "50%",
											background: orange,
											boxShadow: `0 0 ${14 * s}px ${orange}`,
											flexShrink: 0,
										}}
									/>
									3件のメッセージを吸い込みました
								</div>
							) : null}
						</div>

						<div
							style={{
								position: "absolute",
								left: 0,
								right: 0,
								top: 86 * s,
								bottom: 92 * s,
								background:
									"linear-gradient(180deg, rgba(255,255,255,0.72), rgba(249,247,244,0.86))",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									position: "absolute",
									left: 36 * s,
									right: 42 * s,
									top: 118 * s,
									height: 176 * s,
									overflow: "hidden",
									opacity: message1Opacity,
									transform: `translateY(${message1Y}px) scale(${message1Scale})`,
									transformOrigin: "12% 20%",
									willChange: "transform, opacity",
								}}
							>
								<div
									style={{
										position: "absolute",
										left: 0,
										top: 4 * s,
										width: 54 * s,
										height: 54 * s,
										borderRadius: 16 * s,
										background:
											"linear-gradient(135deg, #FFD7A8, #C691FF 58%, #6A3B91)",
										boxShadow: "0 10px 20px rgba(74,21,75,0.16)",
									}}
								/>
								<div
									style={{
										position: "absolute",
										left: 78 * s,
										top: 0,
										fontFamily: displayFont,
										fontSize: 18 * s,
										fontWeight: 800,
										whiteSpace: "nowrap",
									}}
								>
									tanaka
									<span
										style={{
											marginLeft: 10 * s,
											fontFamily: uiFont,
											fontSize: 13 * s,
											fontWeight: 650,
											color: "rgba(23,23,23,0.58)",
										}}
									>
										10:24 AM
									</span>
								</div>
								<div
									style={{
										position: "absolute",
										left: 78 * s,
										top: 40 * s,
										width: 730 * s,
										height: 118 * s,
										borderRadius: 21 * s,
										background: "rgba(255,255,255,0.94)",
										border: `${1 * s}px solid rgba(23,23,23,0.09)`,
										boxShadow:
											"0 16px 30px rgba(74,21,75,0.07), inset 0 1px 0 rgba(255,255,255,0.82)",
										overflow: "hidden",
									}}
								/>
								<div
									style={{
										position: "absolute",
										left: 106 * s,
										top: 58 * s,
									}}
								>
									<AbsorbLine
										text="これ今日中って言いましたよね？"
										frame={frame}
										start={42}
										end={80}
										absX={lineX}
										absY={line1Y}
										width={line1W}
										fontSize={messageFontSize}
										bh={bh}
										fontFamily={japaneseFont}
										letterSpacing={0.05 * s}
										s={s}
									/>
								</div>
								<div
									style={{
										position: "absolute",
										left: 106 * s,
										top: 106 * s,
									}}
								>
									<AbsorbLine
										text="なんでまだ終わってないんですか？"
										frame={frame}
										start={100}
										end={126}
										absX={lineX}
										absY={line2Y}
										width={line2W}
										fontSize={messageFontSize}
										bh={bh}
										fontFamily={japaneseFont}
										letterSpacing={0.05 * s}
										s={s}
									/>
								</div>
							</div>

							<div
								style={{
									position: "absolute",
									left: 36 * s,
									right: 42 * s,
									top: 335 * s,
									height: 160 * s,
									overflow: "hidden",
									opacity: message2Opacity,
									transform: `translateY(${message2Y}px) scale(${message2Scale})`,
									transformOrigin: "12% 20%",
									willChange: "transform, opacity",
								}}
							>
								<div
									style={{
										position: "absolute",
										left: 0,
										top: 4 * s,
										width: 54 * s,
										height: 54 * s,
										borderRadius: 16 * s,
										background:
											"linear-gradient(135deg, #FFD7A8, #C691FF 58%, #6A3B91)",
										boxShadow: "0 10px 20px rgba(74,21,75,0.16)",
									}}
								/>
								<div
									style={{
										position: "absolute",
										left: 78 * s,
										top: 0,
										fontFamily: displayFont,
										fontSize: 18 * s,
										fontWeight: 800,
										whiteSpace: "nowrap",
									}}
								>
									tanaka
									<span
										style={{
											marginLeft: 10 * s,
											fontFamily: uiFont,
											fontSize: 13 * s,
											fontWeight: 650,
											color: "rgba(23,23,23,0.58)",
										}}
									>
										10:25 AM
									</span>
								</div>
								<div
									style={{
										position: "absolute",
										left: 78 * s,
										top: 40 * s,
										width: 730 * s,
										height: 76 * s,
										borderRadius: 21 * s,
										background: "rgba(255,255,255,0.94)",
										border: `${1 * s}px solid rgba(23,23,23,0.09)`,
										boxShadow:
											"0 16px 30px rgba(74,21,75,0.07), inset 0 1px 0 rgba(255,255,255,0.82)",
										overflow: "hidden",
									}}
								/>
								<div
									style={{
										position: "absolute",
										left: 106 * s,
										top: 58 * s,
									}}
								>
									<AbsorbLine
										text="もう少し責任感を持ってください。"
										frame={frame}
										start={142}
										end={158}
										absX={lineX}
										absY={line3Y}
										width={line3W}
										fontSize={messageFontSize}
										bh={bh}
										fontFamily={japaneseFont}
										letterSpacing={0.05 * s}
										s={s}
									/>
								</div>
							</div>

							<div
								style={{
									position: "absolute",
									left: 38 * s,
									right: 38 * s,
									bottom: 24 * s,
									height: 58 * s,
									borderRadius: 18 * s,
									border: `${1 * s}px solid rgba(23,23,23,0.13)`,
									background: "rgba(255,255,255,0.9)",
									display: "flex",
									alignItems: "center",
									paddingLeft: 24 * s,
									fontSize: 18 * s,
									fontWeight: 650,
									color: "rgba(23,23,23,0.62)",
									whiteSpace: "nowrap",
								}}
							>
								Message @tanaka
							</div>
						</div>
					</div>
				</div>

				<AnimatedBlackHole frame={frame} fps={fps} bh={bh} s={s} />
			</div>

			<div
				style={{
					position: "absolute",
					left: 60 * s,
					bottom: 48 * s,
					fontFamily: displayFont,
					fontSize: 18 * s,
					fontWeight: 850,
					letterSpacing: 1.35 * s,
					color: "#171717",
					textTransform: "uppercase",
					whiteSpace: "nowrap",
				}}
			>
				Black Hole for Chrome
			</div>

			<div
				style={{
					position: "absolute",
					right: 60 * s,
					bottom: 48 * s,
					fontFamily: japaneseFont,
					fontSize: 21 * s,
					fontWeight: 800,
					color: "#171717",
					whiteSpace: "nowrap",
				}}
			>
				見たくない文字だけ、マウスポインタで吸い込む。
			</div>
		</AbsoluteFill>
	);
};

export default S2Slack;
