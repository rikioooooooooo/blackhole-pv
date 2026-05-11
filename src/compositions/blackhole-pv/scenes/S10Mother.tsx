import React from "react";
import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import {BlackHole} from "../components/BlackHole";

export const S10MotherDuration = 210;

const FONTS = {
	japanese: "'Axis Std', sans-serif",
};

const cream = "#F5F0E8";
const ink = "#1D1C1A";
const bhCore = "#0A0508";
const lineGreen = "#06C755";

const jpFont = FONTS.japanese;

const BLACK_HOLE_SIZE = 80;

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);

const bubbleSpring = {
	mass: 0.72,
	damping: 18,
	stiffness: 135,
};

const holeSpring = {
	mass: 0.55,
	damping: 8,
	stiffness: 180,
};

const clamp = (v: number, min: number, max: number) => {
	return Math.max(min, Math.min(max, v));
};

const messages = [
	{
		text: "おつかれさま。ごはん、ちゃんと食べてる？",
		width: 760,
	},
	{
		text: "返信はいつでもいいからね。",
		width: 560,
	},
	{
		text: "無理しすぎてない？",
		width: 430,
	},
	{
		text: "今日もあたたかくして寝てね。",
		width: 620,
	},
	{
		text: "いつでも味方だからね。",
		width: 520,
	},
];

const MessageBubble: React.FC<{
	text: string;
	width: number;
	index: number;
	frame: number;
}> = ({text, width, index, frame}) => {
	const {fps} = useVideoConfig();

	const appear = spring({
		frame: frame - (14 + index * 13),
		fps,
		config: bubbleSpring,
		durationInFrames: 28,
	});

	const opacity = interpolate(appear, [0, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const y = interpolate(appear, [0, 1], [22, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const scale = interpolate(appear, [0, 1], [0.94, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				width,
				maxWidth: "100%",
				marginBottom: 14,
				marginLeft: 0,
				opacity,
				transform: `translateY(${y}px) scale(${scale})`,
				transformOrigin: "left center",
			}}
		>
			<div
				style={{
					display: "inline-block",
					background: lineGreen,
					color: "#FFFFFF",
					borderRadius: 18,
					padding: "14px 22px 16px",
					fontFamily: jpFont,
					fontSize: 27,
					fontWeight: 800,
					lineHeight: 1.35,
					letterSpacing: -0.45,
					whiteSpace: "normal",
					boxShadow: "0 12px 28px rgba(49, 38, 24, 0.12)",
				}}
			>
				{text}
			</div>
		</div>
	);
};

const CursorBlackHole: React.FC<{
	frame: number;
	x: number;
	y: number;
}> = ({frame, x, y}) => {
	const {fps, width} = useVideoConfig();

	const SharedBlackHole = BlackHole as React.ComponentType<{
		size?: number;
		frame?: number;
		coreColor?: string;
	}>;

	const farXForFade = Math.max(1201, width + BLACK_HOLE_SIZE);

	const appear = spring({
		frame: frame - 8,
		fps,
		config: holeSpring,
		durationInFrames: 26,
	});

	const appearOpacity = interpolate(appear, [0, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const proximityOpacity = interpolate(x, [1200, farXForFade], [0.34, 0.98], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const retreatThin = interpolate(frame, [126, 176, 209], [1, 0.62, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const appearScale = interpolate(appear, [0, 1], [0.72, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const proximityScale = interpolate(x, [1200, farXForFade], [0.84, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const opacity = appearOpacity * proximityOpacity * retreatThin;

	if (opacity <= 0.01) {
		return null;
	}

	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: BLACK_HOLE_SIZE,
				height: BLACK_HOLE_SIZE,
				transform: `translate(-50%, -50%) scale(${appearScale * proximityScale})`,
				opacity,
				pointerEvents: "none",
				zIndex: 4,
			}}
		>
			<SharedBlackHole
				size={BLACK_HOLE_SIZE}
				frame={frame}
				coreColor={bhCore}
			/>
		</div>
	);
};

const Caption: React.FC<{
	frame: number;
	pressure: number;
}> = ({frame, pressure}) => {
	const opacity = interpolate(frame, [116, 136, 188, 209], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const y = interpolate(frame, [116, 136], [10, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	if (opacity <= 0.04) {
		return null;
	}

	return (
		<div
			style={{
				position: "absolute",
				left: "50%",
				bottom: 64,
				transform: `translateX(-50%) translateY(${y}px)`,
				opacity,
				fontFamily: jpFont,
				fontSize: 28,
				fontWeight: 800,
				letterSpacing: -0.35,
				color: ink,
				textAlign: "center",
				lineHeight: 1.35,
				whiteSpace: "nowrap",
				textShadow: `0 0 ${10 + pressure * 12}px rgba(246,197,107,${
					0.1 + pressure * 0.16
				})`,
				zIndex: 8,
			}}
		>
			消せない言葉も、ある。
		</div>
	);
};

export const S10Mother: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const f = clamp(frame, 0, S10MotherDuration - 1);

	const pressureIn = interpolate(f, [34, 76, 124], [0, 0.58, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const pressureOut = interpolate(f, [132, 184], [1, 0.24], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInOutSmooth,
	});

	const pressure = Math.min(pressureIn, pressureOut);

	const farX = Math.max(width + BLACK_HOLE_SIZE, 1201);

	const bhXRaw = interpolate(
		f,
		[0, 36, 82, 126, 164, 209],
		[
			farX,
			Math.max(width * 0.86, 1420),
			1280,
			1200,
			1320,
			farX,
		],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		}
	);

	const bhX = Math.max(1200, bhXRaw);

	const bhY = interpolate(
		f,
		[0, 58, 126, 209],
		[height * 0.4, height * 0.45, height * 0.5, height * 0.44],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		}
	);

	const groupWidth = Math.min(820, width * 0.58);

	return (
		<AbsoluteFill
			style={{
				background: cream,
				overflow: "hidden",
				fontFamily: jpFont,
			}}
		>
			<AbsoluteFill
				style={{
					background: `
						radial-gradient(circle at 32% 30%, rgba(255,255,255,0.64) 0%, rgba(255,255,255,0) 38%),
						radial-gradient(circle at 72% 58%, rgba(246,197,107,0.18) 0%, rgba(246,197,107,0) 36%),
						${cream}
					`,
				}}
			/>

			<div
				style={{
					position: "absolute",
					left: width * 0.4,
					top: height * 0.45,
					width: groupWidth,
					transform: "translate(-50%, -50%)",
					zIndex: 6,
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
				}}
			>
				{messages.map((message, index) => {
					return (
						<MessageBubble
							key={message.text}
							text={message.text}
							width={message.width}
							index={index}
							frame={f}
						/>
					);
				})}
			</div>

			<CursorBlackHole frame={f} x={bhX} y={bhY} />

			<Caption frame={f} pressure={pressure} />
		</AbsoluteFill>
	);
};

export default S10Mother;
