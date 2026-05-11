import React from "react";
import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import {noise2D} from "@remotion/noise";
import {BlackHole} from "../components/BlackHole";
import {COLORS, FONTS, VIDEO_HEIGHT, VIDEO_WIDTH} from "../constants";

export const S1_SWEEP_DURATION = 180;

const clamp = (value: number, min: number, max: number) => {
	return Math.min(Math.max(value, min), max);
};

const strictRange = <T extends number[]>(values: T): T => {
	const guarded = values.map((value, index) => {
		if (index === 0) {
			return value;
		}

		return Math.max(values[index - 1] + 1, value);
	});

	return guarded as T;
};

const holeSpring = {
	mass: 0.55,
	damping: 8,
	stiffness: 180,
};

const textSpring = {
	mass: 0.7,
	damping: 18,
	stiffness: 130,
};

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);

const UnifiedBlackHole = BlackHole as React.ComponentType<any>;

const TitleLine: React.FC<{
	children: React.ReactNode;
	fontFamily: string;
	fontSize: number;
	lineHeight: number;
	color: string;
	progress: number;
}> = ({children, fontFamily, fontSize, lineHeight, color, progress}) => {
	const opacity = interpolate(progress, strictRange([0, 1]), [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const y = interpolate(progress, strictRange([0, 1]), [10, 0], {
		easing: easeOutSoft,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const scale = interpolate(progress, strictRange([0, 1]), [0.985, 1], {
		easing: easeOutSoft,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				whiteSpace: "nowrap",
				fontFamily,
				fontSize,
				lineHeight,
				fontWeight: 700,
				letterSpacing: "-0.045em",
				color,
				opacity,
				transform: `translateY(${y}px) scale(${scale})`,
				transformOrigin: "center",
			}}
		>
			{children}
		</div>
	);
};

const S1Sweep: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const W = VIDEO_WIDTH || width;
	const H = VIDEO_HEIGHT || height;

	const palette = {
		background: "#F5F0E8",
		ink: (COLORS as any)?.ink ?? "#1D1B18",
		caption: "#1D1B18",
	};

	const japaneseFont = (FONTS as any)?.japanese ?? "'Axis Std', sans-serif";
	const uiFont =
		(FONTS as any)?.ui ??
		'-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

	const mainText =
		"インターネットの文字を、ブラックホールで吸い込みませんか？";
	const lines = [
		"インターネットの文字を、",
		"ブラックホールで吸い込みませんか？",
	];

	const textWidth = Math.min(1320, W * 0.82);
	const fontSize = 64;
	const lineHeight = 1.28;
	const lineHeightPx = fontSize * lineHeight;
	const titleHeight = lineHeightPx * lines.length;
	const textLeft = W / 2 - textWidth / 2;
	const textTop = H / 2 - titleHeight / 2 - 18;

	const bhSize = 112;
	const bhStartX = Math.min(W - 112, textLeft + textWidth + 116);
	const bhEndX = Math.max(112, textLeft - 116);
	const bhBaseY = H / 2 + 5;

	const sweepStartFrame = 56;
	const sweepEndFrame = Math.max(sweepStartFrame + 1, 124);
	const fadeOutStart = 158;

	const bgOpacity = interpolate(frame, strictRange([0, 20]), [0.86, 1], {
		easing: easeOutSoft,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const bgScale = interpolate(frame, strictRange([0, 160]), [1.012, 1], {
		easing: easeOutSoft,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const lineOneProgress = spring({
		frame: frame - 12,
		fps,
		config: textSpring,
	});

	const lineTwoProgress = spring({
		frame: frame - 18,
		fps,
		config: textSpring,
	});

	const holeAppear = spring({
		frame: frame - 8,
		fps,
		config: holeSpring,
	});

	const bhOpacityRaw = interpolate(
		frame,
		strictRange([6, 16, fadeOutStart, fadeOutStart + 14]),
		[0, 1, 1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const bhOpacity = bhOpacityRaw < 0.04 ? 0 : bhOpacityRaw;

	const travelProgress = interpolate(
		frame,
		strictRange([sweepStartFrame + 4, sweepEndFrame + 4]),
		[0, 1],
		{
			easing: easeInOutSmooth,
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const bhPathX = interpolate(
		travelProgress,
		strictRange([0, 1]),
		[bhStartX, bhEndX],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const bhNoiseX = noise2D("s1-bh-x", frame * 0.016, 0) * 1.6;
	const bhNoiseY = noise2D("s1-bh-y", frame * 0.016, 1) * 1.4;

	const bhX = bhPathX + bhNoiseX;
	const bhY = bhBaseY + Math.sin(frame * 0.075) * 2.4 + bhNoiseY;

	const absorbPulse = interpolate(
		frame,
		strictRange([
			sweepStartFrame,
			sweepStartFrame + 10,
			sweepEndFrame - 16,
			sweepEndFrame - 4,
			sweepEndFrame + 12,
		]),
		[1, 1.055, 1.055, 0.93, 1],
		{
			easing: easeInOutSmooth,
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const bhBreath = 1 + Math.sin(frame * 0.09) * 0.012;
	const bhScale = clamp(holeAppear, 0, 1.08) * absorbPulse * bhBreath;

	const bhRadius = bhSize / 2;
	const wipeInset = clamp(textLeft + textWidth - (bhX - bhRadius), 0, textWidth);

	const charW = fontSize * 1.0;
	const titleClipRight = Math.floor(wipeInset / charW) * charW;

	const captionOpacityRaw = interpolate(
		frame,
		strictRange([126, 138, 166, 176]),
		[0, 1, 1, 0],
		{
			easing: easeOutSoft,
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const captionOpacity = captionOpacityRaw < 0.08 ? 0 : captionOpacityRaw;

	const captionY = interpolate(frame, strictRange([126, 138]), [12, 0], {
		easing: easeOutSoft,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: palette.background,
				overflow: "hidden",
			}}
		>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at 50% 42%, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0.18) 31%, transparent 60%), linear-gradient(135deg, rgba(255,244,224,0.52), rgba(240,232,218,0.3))",
					opacity: bgOpacity,
					transform: `scale(${bgScale})`,
					transformOrigin: "center",
				}}
			/>

			<AbsoluteFill
				style={{
					backgroundImage:
						"linear-gradient(90deg, rgba(31,29,27,0.022) 1px, transparent 1px), linear-gradient(0deg, rgba(31,29,27,0.016) 1px, transparent 1px)",
					backgroundSize: "112px 112px, 86px 86px",
					opacity: 0.19,
				}}
			/>

			<AbsoluteFill
				style={{
					backgroundImage:
						"radial-gradient(circle, rgba(29,27,24,0.12) 0.7px, transparent 0.9px)",
					backgroundSize: "5px 5px",
					opacity: 0.055,
				}}
			/>

			<div
				style={{
					position: "absolute",
					left: textLeft,
					top: textTop,
					width: textWidth,
					height: titleHeight,
					zIndex: 4,
					clipPath: `inset(0 ${titleClipRight}px 0 0)`,
					overflow: "hidden",
				}}
				aria-label={mainText}
			>
				<div
					style={{
						width: textWidth,
						height: titleHeight,
						textAlign: "center",
					}}
				>
					<TitleLine
						fontFamily={japaneseFont}
						fontSize={fontSize}
						lineHeight={lineHeight}
						color={palette.ink}
						progress={lineOneProgress}
					>
						{lines[0]}
					</TitleLine>

					<TitleLine
						fontFamily={japaneseFont}
						fontSize={fontSize}
						lineHeight={lineHeight}
						color={palette.ink}
						progress={lineTwoProgress}
					>
						{lines[1]}
					</TitleLine>
				</div>
			</div>

			{bhOpacity > 0 && (
				<div
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						width: bhSize,
						height: bhSize,
						opacity: bhOpacity,
						transform: `translate(${bhX - bhSize / 2}px, ${
							bhY - bhSize / 2
						}px) scale(${bhScale})`,
						transformOrigin: "center",
						pointerEvents: "none",
						zIndex: 8,
					}}
				>
					<UnifiedBlackHole
						x={bhSize / 2}
						y={bhSize / 2}
						size={bhSize}
						scale={1}
						opacity={1}
						frame={frame}
						coreColor="#0A0508"
					/>
				</div>
			)}

			{captionOpacity > 0 && (
				<div
					style={{
						position: "absolute",
						left: textLeft,
						top: textTop + titleHeight + 62,
						width: textWidth,
						textAlign: "center",
						fontFamily: uiFont,
						fontSize: 34,
						lineHeight: 1.45,
						fontWeight: 800,
						letterSpacing: "0.01em",
						color: palette.caption,
						opacity: captionOpacity,
						transform: `translateY(${captionY}px)`,
						zIndex: 5,
					}}
				>
					見たくない言葉だけ、遊ぶように消していく。
				</div>
			)}

			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at 50% 46%, transparent 0%, transparent 55%, rgba(80,62,42,0.055) 100%)",
					pointerEvents: "none",
				}}
			/>
		</AbsoluteFill>
	);
};

export default S1Sweep;
