import type { ComponentType, CSSProperties } from "react";
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	staticFile,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { BlackHole } from "../components/BlackHole";
import {usePvCurrentFrame as useCurrentFrame, usePvVideoConfig as useVideoConfig} from "../timing";

const CREAM = "#F5F0E8";
const BH_CORE = "#0A0508";
const DEEP_INK = "#11100F";
const WARM_ORANGE = "#E9A15B";
const WARM_PINK = "#E7A7A8";
const WARM_GOLD = "#E8C16B";
const AURORA_VIOLET = "#8E6CE8";

const FONTS = {
	japanese: "'Axis Std', sans-serif",
	ui: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif',
	display: '"Playfair Display", "Times New Roman", serif',
};

const holeSpring = {
	mass: 0.55,
	damping: 8,
	stiffness: 180,
};

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

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);

const dust = [
	{ x: 0.13, y: 0.22, s: 2.2 },
	{ x: 0.23, y: 0.73, s: 1.7 },
	{ x: 0.39, y: 0.16, s: 1.4 },
	{ x: 0.55, y: 0.82, s: 2.1 },
	{ x: 0.68, y: 0.28, s: 1.5 },
	{ x: 0.77, y: 0.64, s: 2.4 },
	{ x: 0.87, y: 0.19, s: 1.8 },
	{ x: 0.91, y: 0.78, s: 1.2 },
];

const safeRange2 = (a: number, b: number): [number, number] => {
	const b2 = Math.max(a + 1, b);
	return [a, b2];
};

const safeRange3 = (a: number, b: number, c: number): [number, number, number] => {
	const b2 = Math.max(a + 1, b);
	const c2 = Math.max(b2 + 1, c);
	return [a, b2, c2];
};

const SharedBlackHole = BlackHole as ComponentType<{
	size: number;
	frame?: number;
	coreColor?: string;
}>;

const ChromeMark = ({ scale }: { scale: number }) => {
	const size = Math.round(34 * scale);

	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: 999,
				position: "relative",
				flex: "0 0 auto",
				background:
					"conic-gradient(from -34deg, #ea4335 0deg 120deg, #fbbc05 120deg 238deg, #34a853 238deg 360deg)",
				boxShadow:
					"0 10px 24px rgba(38, 25, 12, 0.16), inset 0 0 0 1px rgba(255,255,255,0.42)",
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: Math.max(4, Math.round(9 * scale)),
					borderRadius: 999,
					background: "#4285f4",
					boxShadow:
						"inset 0 0 0 2px rgba(255,255,255,0.9), 0 2px 8px rgba(66,133,244,0.28)",
				}}
			/>
		</div>
	);
};

const WarmAurora = ({
	width,
	height,
	introOpacity,
	creamFade,
}: {
	width: number;
	height: number;
	introOpacity: number;
	creamFade: number;
}) => {
	return (
		<AbsoluteFill
			style={{
				background: CREAM,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					width: width * 0.72,
					height: height * 0.52,
					left: width * 0.04,
					top: height * 0.02,
					borderRadius: "50%",
					background: `radial-gradient(circle, ${WARM_GOLD}66 0%, ${WARM_ORANGE}24 42%, transparent 72%)`,
					filter: "blur(62px)",
					opacity: 0.74 * introOpacity * (1 - creamFade * 0.05),
					transform: "rotate(-5deg)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					width: width * 0.64,
					height: height * 0.46,
					right: width * 0.02,
					top: height * 0.1,
					borderRadius: "50%",
					background: `radial-gradient(circle, ${WARM_PINK}55 0%, ${AURORA_VIOLET}1F 46%, transparent 72%)`,
					filter: "blur(70px)",
					opacity: 0.62 * introOpacity * (1 - creamFade * 0.05),
					transform: "rotate(8deg)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					width: width * 0.82,
					height: height * 0.5,
					left: width * 0.1,
					bottom: -height * 0.15,
					borderRadius: "50%",
					background: `radial-gradient(circle, rgba(255,255,255,0.74) 0%, ${WARM_ORANGE}1E 48%, transparent 78%)`,
					filter: "blur(58px)",
					opacity: 0.78 * introOpacity,
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.5) 76%, rgba(255,255,255,0.72))",
					opacity: 0.78,
				}}
			/>
		</AbsoluteFill>
	);
};

const StaticGrain = ({ opacity }: { opacity: number }) => {
	return (
		<AbsoluteFill
			style={{
				pointerEvents: "none",
				opacity,
				mixBlendMode: "multiply",
				backgroundImage:
					"radial-gradient(circle at 18% 24%, rgba(77,55,34,0.18) 0 0.8px, transparent 1.2px), radial-gradient(circle at 76% 62%, rgba(77,55,34,0.12) 0 0.7px, transparent 1.1px)",
				backgroundSize: "42px 42px, 57px 57px",
				zIndex: 20,
			}}
		/>
	);
};

export const S12Outro = () => {
	const frame = useCurrentFrame();
	const { fps, width, height, durationInFrames } = useVideoConfig();

	const sec = (seconds: number) => seconds * fps;
	const duration = Math.max(2, durationInFrames);

	const fadeStart = Math.max(1, duration - sec(0.5));
	const fadeEnd = Math.max(fadeStart + 1, duration - 1);

	const bgIntro = interpolate(frame, safeRange2(0, sec(0.66)), [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const endFade = interpolate(frame, safeRange2(fadeStart, fadeEnd), [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInOutSmooth,
	});

	const contentExitOpacity = interpolate(
		frame,
		safeRange2(fadeStart, fadeEnd),
		[1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		},
	);

	const layoutScale = Math.min(width / 1920, height / 1080);
	const safeScale = Math.max(0.52, layoutScale);
	const holeSize = Math.round(132 * safeScale);
	const framePadding = Math.max(32, Math.round(60 * safeScale));
	const contentWidth = Math.min(900, Math.max(300, width - framePadding * 2));
	const contentHeight = Math.max(360, height - framePadding * 2);
	const mascotWidth = 120;
	const verticalGap = Math.max(14, Math.round(30 * safeScale));

	const cameraY = interpolate(
		frame,
		safeRange3(0, sec(2.8), fadeStart),
		[8, 0, -4],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		},
	);

	const titleIn = spring({
		frame: frame - sec(0.4),
		fps,
		config: textSpring,
	});

	const subtitleIn = spring({
		frame: frame - sec(0.6),
		fps,
		config: textSpring,
	});

	const ctaIn = spring({
		frame: frame - sec(1.55),
		fps,
		config: panelSpring,
	});

	const footerIn = spring({
		frame: frame - sec(2.8),
		fps,
		config: {
			...textSpring,
			damping: 22,
			stiffness: 105,
		},
	});

	const bhIn = spring({
		frame: frame - sec(0.26),
		fps,
		config: holeSpring,
	});

	const titleOpacity =
		interpolate(frame, safeRange2(sec(0.38), sec(0.95)), [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeOutSoft,
		}) * contentExitOpacity;

	const subtitleOpacity =
		interpolate(frame, safeRange2(sec(0.6), sec(1.2)), [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeOutSoft,
		}) * contentExitOpacity;

	const ctaOpacity =
		interpolate(frame, safeRange2(sec(1.48), sec(2.12)), [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeOutSoft,
		}) * contentExitOpacity;

	const footerOpacity =
		interpolate(frame, safeRange2(sec(2.75), sec(3.45)), [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeOutSoft,
		}) * contentExitOpacity;

	const bhOpacity =
		interpolate(frame, safeRange2(sec(0.18), sec(0.8)), [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeOutSoft,
		}) * contentExitOpacity;

	const bhDriftX =
		interpolate(frame, safeRange3(0, sec(2.6), sec(5.4)), [-14, 0, 5], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		}) + noise2D("s12-bh-x", frame * 0.01, 0) * 1.7;

	const bhDriftY =
		interpolate(frame, safeRange3(0, sec(2.6), sec(5.4)), [-5, 0, -3], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		}) + noise2D("s12-bh-y", 0, frame * 0.01) * 1.4;

	const titleY = interpolate(titleIn, [0, 1], [10, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const titleScale = interpolate(titleIn, [0, 1], [0.985, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const subtitleY = interpolate(subtitleIn, [0, 1], [10, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const subtitleScale = interpolate(subtitleIn, [0, 1], [0.99, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const ctaY = interpolate(ctaIn, [0, 1], [20, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const ctaScale = interpolate(ctaIn, [0, 1], [0.96, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const footerY = interpolate(footerIn, [0, 1], [8, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const bhScale = Math.max(0, 0.08 + bhIn * 0.92);

	const titleStyle: CSSProperties = {
		fontFamily: FONTS.display,
		fontSize: Math.round(92 * safeScale),
		lineHeight: 1,
		fontWeight: 500,
		letterSpacing: "-0.052em",
		color: DEEP_INK,
		opacity: titleOpacity,
		transform: `translateY(${titleY}px) scale(${titleScale})`,
		textShadow: "0 22px 60px rgba(66, 43, 24, 0.12)",
		textAlign: "center",
		whiteSpace: "nowrap",
	};

	const buttonWidth = Math.min(
		contentWidth,
		Math.min(
			Math.max(360, contentWidth - 40),
			Math.max(430, 620 * safeScale),
		),
	);

	return (
		<AbsoluteFill style={{ background: CREAM, overflow: "hidden" }}>
			<WarmAurora
				width={width}
				height={height}
				introOpacity={bgIntro}
				creamFade={endFade}
			/>

			<AbsoluteFill style={{ pointerEvents: "none" }}>
				{dust.map((p, i) => {
					return (
						<div
							key={i}
							style={{
								position: "absolute",
								left: p.x * width,
								top: p.y * height,
								width: p.s,
								height: p.s,
								borderRadius: 999,
								background: "rgba(95, 69, 39, 0.42)",
								opacity: 0.32 * bgIntro,
								filter: "blur(0.25px)",
							}}
						/>
					);
				})}
			</AbsoluteFill>

			<AbsoluteFill>
				<div
					style={{
						position: "absolute",
						left: "50%",
						top: "50%",
						width: contentWidth,
						height: contentHeight,
						transform: `translate(-50%, calc(-50% + ${cameraY}px))`,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: verticalGap,
					}}
				>
					<div
						style={{
							position: "relative",
							width: holeSize,
							height: holeSize,
							transform: `translate(${bhDriftX}px, ${bhDriftY}px) scale(${bhScale})`,
							opacity: bhOpacity,
							zIndex: 3,
							transformOrigin: "50% 50%",
							flex: "0 0 auto",
						}}
					>
						<SharedBlackHole
							size={holeSize}
							frame={frame}
							coreColor={BH_CORE}
						/>
					</div>

					<div
						style={{
							position: "relative",
							width: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: verticalGap,
							zIndex: 4,
							flex: "0 0 auto",
						}}
					>
						<div style={titleStyle}>Black Hole</div>

						<div
							style={{
								fontFamily: FONTS.japanese,
								fontSize: Math.round(29 * safeScale),
								fontWeight: 700,
								letterSpacing: "0.005em",
								lineHeight: 1.5,
								color: "rgba(17,16,15,0.94)",
								opacity: subtitleOpacity,
								transform: `translateY(${subtitleY}px) scale(${subtitleScale})`,
								textAlign: "center",
								textShadow: "0 10px 34px rgba(255,255,255,0.6)",
								width: "100%",
							}}
						>
							<div style={{ whiteSpace: "nowrap" }}>
								インターネットの文字を、
							</div>
							<div style={{ whiteSpace: "nowrap" }}>
								ブラックホールで吸い込みませんか？
							</div>
						</div>
					</div>

					<div
						style={{
							position: "relative",
							opacity: ctaOpacity,
							transform: `translateY(${ctaY}px) scale(${ctaScale})`,
							transformOrigin: "50% 50%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: verticalGap,
							zIndex: 4,
							flex: "0 0 auto",
						}}
					>
						<div
							style={{
								minHeight: Math.round(78 * safeScale),
								width: buttonWidth,
								boxSizing: "border-box",
								borderRadius: 999,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: Math.round(17 * safeScale),
								padding: `${Math.round(14 * safeScale)}px ${Math.round(
									28 * safeScale,
								)}px`,
								background:
									"linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.68))",
								border: "1px solid rgba(85, 60, 35, 0.22)",
								boxShadow:
									"0 24px 72px rgba(86, 54, 24, 0.16), inset 0 1px 0 rgba(255,255,255,0.92)",
							}}
						>
							<ChromeMark scale={safeScale} />
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "flex-start",
									justifyContent: "center",
									minWidth: 0,
								}}
							>
								<div
									style={{
										fontFamily: FONTS.ui,
										fontSize: Math.round(13 * safeScale),
										fontWeight: 800,
										letterSpacing: "0.12em",
										textTransform: "uppercase",
										color: "rgba(17,16,15,0.64)",
										lineHeight: 1.15,
										whiteSpace: "nowrap",
									}}
								>
									Chrome Web Store
								</div>
								<div
									style={{
										marginTop: Math.round(5 * safeScale),
										fontFamily: FONTS.japanese,
										fontSize: Math.round(22 * safeScale),
										fontWeight: 800,
										letterSpacing: "-0.02em",
										color: DEEP_INK,
										lineHeight: 1.18,
										whiteSpace: "nowrap",
									}}
								>
									Chrome Web Store で今すぐ追加
								</div>
							</div>
						</div>

						<Img
							src={staticFile("kosukuma/kosukuma-lying.png")}
							style={{
								width: mascotWidth,
								height: "auto",
								objectFit: "contain",
								filter: "drop-shadow(0 14px 22px rgba(86, 54, 24, 0.18))",
								flex: "0 0 auto",
							}}
						/>
					</div>

					<div
						style={{
							position: "relative",
							transform: `translateY(${footerY}px)`,
							fontFamily: FONTS.ui,
							fontSize: Math.round(16 * safeScale),
							fontWeight: 800,
							letterSpacing: "0.075em",
							textTransform: "uppercase",
							color: "rgba(17,16,15,0.62)",
							opacity: footerOpacity,
							whiteSpace: "nowrap",
							textAlign: "center",
							flex: "0 0 auto",
						}}
					>
						A Chrome extension for a quieter internet
					</div>
				</div>
			</AbsoluteFill>

			<StaticGrain opacity={0.12 * bgIntro} />

			<AbsoluteFill
				style={{
					background: CREAM,
					opacity: endFade,
					zIndex: 30,
				}}
			/>
		</AbsoluteFill>
	);
};

export default S12Outro;
