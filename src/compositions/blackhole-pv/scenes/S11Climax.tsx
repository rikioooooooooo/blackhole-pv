import React from "react";
import {
	AbsoluteFill,
	Easing,
	OffthreadVideo,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import {BlackHole} from "../components/BlackHole";

const cream = "#F5F0E8";
const ink = "#171316";
const mutedInk = "#3C3335";
const amber = "#FFB45C";

const FONTS = {
	japanese: "'Axis Std', sans-serif",
} as const;

const BLACK_HOLE_SIZE = 116;

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

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);
const easeInFast = Easing.bezier(0.7, 0, 0.84, 0);

const clampVisible = (value: number, threshold = 0.08) => {
	return value > threshold ? value : 0;
};

const guardedRange = (values: number[]) => {
	return values.reduce<number[]>((acc, value, index) => {
		if (index === 0) {
			acc.push(value);
			return acc;
		}

		acc.push(Math.max(acc[index - 1] + 1, value));
		return acc;
	}, []);
};

const DemoPanel: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	const outStart = Math.round(5.32 * fps);
	const outEnd = Math.round(5.78 * fps);

	const panelIn = spring({
		frame,
		fps,
		config: panelSpring,
	});

	const inOpacity = interpolate(panelIn, [0, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const outOpacity = interpolate(frame, guardedRange([outStart, outEnd]), [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInOutSmooth,
	});

	const opacity = clampVisible(inOpacity * outOpacity);

	if (opacity <= 0) {
		return null;
	}

	const y = interpolate(panelIn, [0, 1], [20, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const scale = interpolate(panelIn, [0, 1], [0.96, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const panelW = 1080;
	const panelH = 570;
	const left = width / 2 - panelW / 2;

	return (
		<div
			style={{
				position: "absolute",
				left,
				top: 56,
				width: panelW,
				height: panelH,
				borderRadius: 28,
				overflow: "hidden",
				backgroundColor: "#FFFFFF",
				opacity,
				transform: `translateY(${y}px) scale(${scale})`,
				transformOrigin: "50% 50%",
				boxShadow:
					"0 34px 92px rgba(22, 13, 18, 0.15), 0 10px 30px rgba(22, 13, 18, 0.1)",
				border: "1px solid rgba(23, 19, 22, 0.14)",
				willChange: "transform, opacity",
				zIndex: 2,
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 52,
					backgroundColor: "#FBF8F2",
					borderBottom: "1px solid rgba(23, 19, 22, 0.11)",
					zIndex: 2,
				}}
			>
				<div
					style={{
						position: "absolute",
						left: 24,
						top: 20,
						width: 10,
						height: 10,
						borderRadius: "50%",
						backgroundColor: "#FF6B5F",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: 42,
						top: 20,
						width: 10,
						height: 10,
						borderRadius: "50%",
						backgroundColor: "#FFBE4D",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: 60,
						top: 20,
						width: 10,
						height: 10,
						borderRadius: "50%",
						backgroundColor: "#2ECC71",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: 104,
						right: 28,
						top: 12,
						height: 28,
						borderRadius: 999,
						backgroundColor: "rgba(23, 19, 22, 0.065)",
						fontFamily: FONTS.japanese,
						fontSize: 14,
						fontWeight: 800,
						lineHeight: "28px",
						paddingLeft: 18,
						color: "rgba(23, 19, 22, 0.68)",
						letterSpacing: "0.02em",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					Black Hole — 復元シーン
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 52,
					bottom: 0,
					backgroundColor: "#FBF8F2",
				}}
			>
				<OffthreadVideo
					src={staticFile("video/demo-new.mp4")}
					startFrom={Math.round(27 * fps)}
					endAt={Math.round(36 * fps)}
					muted
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						width: "100%",
						height: "100%",
						objectFit: "contain",
						backgroundColor: "#FBF8F2",
					}}
				/>
			</div>
		</div>
	);
};

const TitleAbsorption: React.FC<{
	cursorX: number;
	cursorY: number;
	titleLeft: number;
	titleTop: number;
	titleWidth: number;
	wipeStart: number;
	wipeEnd: number;
}> = ({cursorX, titleLeft, titleTop, titleWidth}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const textIn = spring({
		frame: frame - 12,
		fps,
		config: textSpring,
	});

	const opacity = interpolate(textIn, [0, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const y = interpolate(textIn, [0, 1], [10, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const scale = interpolate(textIn, [0, 1], [0.985, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const bhRadius = BLACK_HOLE_SIZE / 2;
	const wipeRaw = Math.max(
		0,
		Math.min(titleWidth, cursorX - titleLeft + bhRadius),
	);
	const charW = 64 * 1.0;
	const wipePx =
		wipeRaw >= titleWidth ? titleWidth : Math.floor(wipeRaw / charW) * charW;

	return (
		<div
			style={{
				position: "absolute",
				left: titleLeft,
				top: titleTop,
				width: titleWidth,
				height: 98,
				overflow: "hidden",
				opacity,
				transform: `translateY(${y}px) scale(${scale})`,
				transformOrigin: "50% 50%",
				clipPath: `inset(0 0 0 ${wipePx}px)`,
				willChange: "transform, opacity, clip-path",
				zIndex: 7,
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 0,
					textAlign: "center",
					fontFamily: FONTS.japanese,
					fontSize: 64,
					fontWeight: 900,
					lineHeight: "98px",
					letterSpacing: "-0.02em",
					color: ink,
					whiteSpace: "nowrap",
					textShadow: "0 14px 38px rgba(30, 20, 18, 0.11)",
				}}
			>
				全てを、吸い込め
			</div>
		</div>
	);
};

const Caption: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const inStart = Math.round(3.02 * fps);
	const inEnd = Math.round(3.36 * fps);
	const holdEnd = Math.round(5.18 * fps);
	const outEnd = Math.round(5.74 * fps);

	const captionIn = spring({
		frame: frame - inStart,
		fps,
		config: textSpring,
	});

	const motionOpacity = interpolate(captionIn, [0, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const timeOpacity = interpolate(
		frame,
		guardedRange([inStart, inEnd, holdEnd, outEnd]),
		[0, 1, 1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeOutSoft,
		},
	);

	const opacity = clampVisible(motionOpacity * timeOpacity);

	if (opacity <= 0) {
		return null;
	}

	const y = interpolate(captionIn, [0, 1], [14, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	return (
		<div
			style={{
				position: "absolute",
				left: width / 2 - 500,
				top: Math.min(930, height * 0.86),
				width: 1000,
				textAlign: "center",
				opacity,
				transform: `translateY(${y}px)`,
				fontFamily: FONTS.japanese,
				fontSize: 34,
				fontWeight: 900,
				lineHeight: 1.42,
				letterSpacing: "0.01em",
				color: "#201A1C",
				willChange: "transform, opacity",
				zIndex: 9,
			}}
		>
			見たくない文字だけ、マウスポインタで吸い込む。
		</div>
	);
};

const S11Climax: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const bgOpacity = interpolate(frame, [0, 20], [0.92, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const titleWidth = 720;
	const titleLeft = width / 2 - titleWidth / 2;
	const titleTop = Math.min(798, height * 0.74);
	const cursorY = titleTop + 49;

	const wipeStart = 56;
	const wipeEnd = 118;

	const cursorOutStart = Math.round(5.32 * fps);
	const cursorOutEnd = Math.round(5.78 * fps);

	const cursorReveal = spring({
		frame: frame - 22,
		fps,
		config: holeSpring,
	});

	const cursorIntroOpacity = interpolate(frame, guardedRange([18, 30]), [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const cursorOutOpacity = interpolate(
		frame,
		guardedRange([cursorOutStart, cursorOutEnd]),
		[1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		},
	);

	const cursorOpacity = clampVisible(cursorIntroOpacity * cursorOutOpacity);

	const cursorFrames = guardedRange([
		0,
		24,
		wipeStart,
		wipeEnd,
		Math.round(4.55 * fps),
		Math.round(5.42 * fps),
	]);

	const cursorX = interpolate(
		frame,
		cursorFrames,
		[
			titleLeft - 86,
			titleLeft - 68,
			titleLeft - 50,
			titleLeft + titleWidth + 82,
			width * 0.47,
			width * 0.47,
		],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		},
	);

	const absorbPulse = interpolate(
		frame,
		guardedRange([wipeStart, wipeStart + 8, wipeEnd - 8, wipeEnd + 10]),
		[0, 0.1, 0.1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		},
	);

	const cursorScale = Math.max(0, 0.62 + cursorReveal * 0.38 + absorbPulse);
	const haloOpacity = cursorOpacity * (0.2 + absorbPulse * 2.1);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: cream,
				overflow: "hidden",
			}}
		>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at 50% 34%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.34) 38%, rgba(245,240,232,0) 74%)",
					opacity: bgOpacity,
				}}
			/>

			<AbsoluteFill
				style={{
					pointerEvents: "none",
					opacity: 0.13,
					backgroundImage:
						"radial-gradient(circle at 18% 24%, rgba(23,19,22,0.07) 0 1px, transparent 1px), radial-gradient(circle at 74% 64%, rgba(23,19,22,0.045) 0 1px, transparent 1px)",
					backgroundSize: "18px 18px, 23px 23px",
					mixBlendMode: "multiply",
				}}
			/>

			<DemoPanel />

			<TitleAbsorption
				cursorX={cursorX}
				cursorY={cursorY}
				titleLeft={titleLeft}
				titleTop={titleTop}
				titleWidth={titleWidth}
				wipeStart={wipeStart}
				wipeEnd={wipeEnd}
			/>

			<Caption />

			{cursorOpacity > 0 ? (
				<div
					style={{
						position: "absolute",
						left: cursorX,
						top: cursorY,
						width: BLACK_HOLE_SIZE + 158,
						height: BLACK_HOLE_SIZE + 158,
						borderRadius: "50%",
						background: `radial-gradient(circle, rgba(110,69,255,${
							0.12 + absorbPulse
						}) 0%, rgba(255,180,92,${
							0.15 + absorbPulse
						}) 36%, rgba(245,240,232,0) 70%)`,
						transform: `translate(-50%, -50%) scale(${1 + absorbPulse * 1.4})`,
						opacity: haloOpacity,
						willChange: "transform, opacity",
						zIndex: 5,
					}}
				/>
			) : null}

			{cursorOpacity > 0 ? (
				<div
					style={{
						position: "absolute",
						left: cursorX,
						top: cursorY,
						width: BLACK_HOLE_SIZE,
						height: BLACK_HOLE_SIZE,
						opacity: cursorOpacity,
						transform: `translate(-50%, -50%) scale(${cursorScale})`,
						filter: "drop-shadow(0 18px 38px rgba(22, 12, 36, 0.32))",
						willChange: "transform, opacity",
						zIndex: 10,
					}}
				>
					<BlackHole size={BLACK_HOLE_SIZE} />
				</div>
			) : null}

			<div
				style={{
					position: "absolute",
					left: width / 2 - 360,
					top: Math.min(880, height * 0.815),
					width: 720,
					height: 1,
					background:
						"linear-gradient(90deg, rgba(23,19,22,0), rgba(23,19,22,0.24), rgba(23,19,22,0))",
					opacity: 0.72,
					zIndex: 6,
				}}
			/>

			<div
				style={{
					position: "absolute",
					left: 84,
					right: 84,
					bottom: 48,
					height: 24,
					opacity: 0.72,
					zIndex: 11,
				}}
			>
				<div
					style={{
						position: "absolute",
						right: 0,
						top: 0,
						fontFamily: FONTS.japanese,
						fontSize: 18,
						fontWeight: 900,
						letterSpacing: "0.12em",
						color: mutedInk,
					}}
				>
					BLACK HOLE
				</div>
				<div
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						fontFamily: FONTS.japanese,
						fontSize: 18,
						fontWeight: 900,
						letterSpacing: "0.05em",
						color: mutedInk,
					}}
				>
					右クリックで復元
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: 156,
					background:
						"linear-gradient(180deg, rgba(245,240,232,0), rgba(245,240,232,0.84))",
					pointerEvents: "none",
					zIndex: 4,
				}}
			/>
		</AbsoluteFill>
	);
};

export default S11Climax;
