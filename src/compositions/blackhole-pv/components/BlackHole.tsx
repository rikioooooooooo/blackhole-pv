import React from "react";
import {
	interpolate,
	spring,
} from "remotion";
import {noise2D} from "@remotion/noise";
import {COLORS} from "../constants";
import {usePvCurrentFrame as useCurrentFrame, usePvVideoConfig as useVideoConfig} from "../timing";

export type BlackHoleProps = {
	size?: number;
	x?: number;
	y?: number;
	scale?: number;
	dimmed?: boolean;
	showBurst?: boolean;
	breathe?: boolean;
	delay?: number;
	noisePrefix?: string;
};

const CORE_COLOR = "#0A0508";
const LENSING_COLOR = "#E8D5FF";

const DISK_DARK_PURPLE = "#2D1B4E";
const DISK_PURPLE = "#6B3FA0";
const DISK_CORAL = "#E07A5F";
const DISK_ORANGE = "#F4A261";

const clamp = (value: number, min: number, max: number): number => {
	return Math.min(max, Math.max(min, value));
};

const colorFromConstants = (key: string, fallback: string): string => {
	const palette = COLORS as Record<string, string | undefined>;
	return palette[key] ?? fallback;
};

const hexToRgba = (hex: string, alpha: number): string => {
	const trimmed = hex.trim();
	const match = /^#?([a-f\d]{3}|[a-f\d]{6})$/i.exec(trimmed);

	if (!match) {
		return `rgba(107, 63, 160, ${clamp(alpha, 0, 1)})`;
	}

	let value = match[1];

	if (value.length === 3) {
		value = value
			.split("")
			.map((char) => `${char}${char}`)
			.join("");
	}

	const int = parseInt(value, 16);
	const r = (int >> 16) & 255;
	const g = (int >> 8) & 255;
	const b = int & 255;

	return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

export const BlackHole: React.FC<BlackHoleProps> = ({
	size = 200,
	x,
	y,
	scale = 1,
	dimmed = false,
	showBurst = false,
	breathe = true,
	delay = 0,
	noisePrefix = "bh",
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const safeFps = Math.max(1, fps);
	const localFrame = frame - delay;
	const activeFrame = Math.max(0, localFrame);

	const entrance = localFrame < 0
		? 0
		: spring({
				frame: activeFrame,
				fps: safeFps,
				config: {
					damping: 16,
					stiffness: 72,
					mass: 0.55,
				},
			});

	const entranceOpacity = clamp(entrance, 0, 1);
	const entranceScale = interpolate(entrance, [0, 1], [0.42, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const entranceBlur = interpolate(entrance, [0, 1], [18, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const breathNoise = breathe
		? noise2D(`${noisePrefix}-breathe`, activeFrame * 0.018, 0)
		: 0;

	const breathScale = breathe ? 1 + breathNoise * 0.026 : 1;
	const breathGlow = breathe ? 1 + breathNoise * 0.18 : 1;

	const burstSpring = showBurst
		? spring({
				frame: activeFrame,
				fps: safeFps,
				config: {
					damping: 9,
					stiffness: 185,
					mass: 0.32,
				},
			})
		: 0;

	const burstScale = showBurst
		? interpolate(burstSpring, [0, 0.42, 1], [1, 1.075, 1.015], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			})
		: 1;

	const burstRingScale = interpolate(burstSpring, [0, 1], [0.62, 1.55], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const burstRingOpacity = showBurst
		? interpolate(burstSpring, [0, 0.22, 1], [0, 0.72, 0], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			})
		: 0;

	const diskRotation = (activeFrame / safeFps) * (360 / 8);
	const lensingRotation = -(activeFrame / safeFps) * (360 / 5);

	const dimFactor = dimmed ? 0.38 : 1;
	const totalScale = scale * entranceScale * breathScale * burstScale;

	const radius = size / 2;
	const positioned = x !== undefined || y !== undefined;

	const glowPurple = colorFromConstants("blackHoleGlow", DISK_PURPLE);
	const glowViolet = colorFromConstants("purple", DISK_DARK_PURPLE);

	const diskGradient = `conic-gradient(from 0deg, ${DISK_DARK_PURPLE} 0deg, ${DISK_PURPLE} 92deg, ${DISK_CORAL} 188deg, ${DISK_ORANGE} 276deg, ${DISK_DARK_PURPLE} 360deg)`;

	return (
		<div
			style={{
				position: positioned ? "absolute" : "relative",
				left: x !== undefined ? x - radius : undefined,
				top: y !== undefined ? y - radius : undefined,
				width: size,
				height: size,
				opacity: entranceOpacity,
				transform: `scale(${totalScale})`,
				transformOrigin: "50% 50%",
				filter: entranceBlur > 0.05 ? `blur(${entranceBlur}px)` : undefined,
				pointerEvents: "none",
				overflow: "visible",
				isolation: "isolate",
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: -size * 0.46,
					borderRadius: "50%",
					background: `radial-gradient(circle, ${hexToRgba(
						glowPurple,
						0.5 * breathGlow * dimFactor,
					)} 0%, ${hexToRgba(
						glowViolet,
						0.28 * breathGlow * dimFactor,
					)} 34%, ${hexToRgba(
						DISK_DARK_PURPLE,
						0.11 * breathGlow * dimFactor,
					)} 58%, transparent 76%)`,
					filter: `blur(${size * 0.1}px)`,
					zIndex: 0,
				}}
			/>

			<div
				style={{
					position: "absolute",
					inset: size * 0.03,
					borderRadius: "50%",
					background: `radial-gradient(circle, transparent 42%, ${hexToRgba(
						DISK_PURPLE,
						0.2 * breathGlow * dimFactor,
					)} 51%, ${hexToRgba(
						LENSING_COLOR,
						0.2 * dimFactor,
					)} 54%, transparent 66%)`,
					filter: `blur(${size * 0.018}px)`,
					zIndex: 1,
				}}
			/>

			<div
				style={{
					position: "absolute",
					inset: size * 0.045,
					borderRadius: "50%",
					overflow: "hidden",
					transform: "rotate(-10deg) scaleY(0.34)",
					transformOrigin: "50% 50%",
					filter: `blur(${size * 0.01}px)`,
					opacity: 0.96 * dimFactor,
					zIndex: 2,
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: -size * 0.08,
						borderRadius: "50%",
						background: diskGradient,
						transform: `rotate(${diskRotation}deg)`,
						transformOrigin: "50% 50%",
						WebkitMaskImage:
							"radial-gradient(circle, transparent 0%, transparent 22%, black 31%, black 48%, transparent 59%, transparent 100%)",
						maskImage:
							"radial-gradient(circle, transparent 0%, transparent 22%, black 31%, black 48%, transparent 59%, transparent 100%)",
					}}
				/>
			</div>

			<div
				style={{
					position: "absolute",
					inset: size * 0.11,
					borderRadius: "50%",
					background: `conic-gradient(from 0deg, transparent 0deg, ${hexToRgba(
						LENSING_COLOR,
						0.18 * dimFactor,
					)} 34deg, ${LENSING_COLOR} 70deg, ${hexToRgba(
						DISK_ORANGE,
						0.55 * dimFactor,
					)} 118deg, transparent 168deg, transparent 195deg, ${hexToRgba(
						LENSING_COLOR,
						0.88 * dimFactor,
					)} 236deg, ${hexToRgba(
						DISK_PURPLE,
						0.45 * dimFactor,
					)} 292deg, transparent 360deg)`,
					transform: `rotate(${lensingRotation}deg)`,
					transformOrigin: "50% 50%",
					WebkitMaskImage:
						"radial-gradient(circle, transparent 0%, transparent 46.5%, black 48.4%, black 50.2%, transparent 52.2%, transparent 100%)",
					maskImage:
						"radial-gradient(circle, transparent 0%, transparent 46.5%, black 48.4%, black 50.2%, transparent 52.2%, transparent 100%)",
					filter: `drop-shadow(0 0 ${size * 0.018}px ${hexToRgba(
						LENSING_COLOR,
						0.75 * dimFactor,
					)})`,
					zIndex: 3,
				}}
			/>

			<div
				style={{
					position: "absolute",
					inset: size * 0.17,
					borderRadius: "50%",
					border: `${Math.max(1, size * 0.006)}px solid ${hexToRgba(
						LENSING_COLOR,
						0.72 * dimFactor,
					)}`,
					boxShadow: `0 0 ${size * 0.022}px ${hexToRgba(
						LENSING_COLOR,
						0.48 * dimFactor,
					)}, 0 0 ${size * 0.05}px ${hexToRgba(
						DISK_PURPLE,
						0.22 * dimFactor,
					)}`,
					opacity: 0.9,
					zIndex: 4,
				}}
			/>

			{showBurst ? (
				<div
					style={{
						position: "absolute",
						inset: size * 0.08,
						borderRadius: "50%",
						border: `${Math.max(1, size * 0.008)}px solid ${hexToRgba(
							LENSING_COLOR,
							burstRingOpacity * dimFactor,
						)}`,
						boxShadow: `0 0 ${size * 0.08}px ${hexToRgba(
							DISK_ORANGE,
							burstRingOpacity * 0.8 * dimFactor,
						)}, 0 0 ${size * 0.16}px ${hexToRgba(
							DISK_PURPLE,
							burstRingOpacity * 0.65 * dimFactor,
						)}`,
						transform: `scale(${burstRingScale})`,
						transformOrigin: "50% 50%",
						opacity: burstRingOpacity,
						zIndex: 5,
					}}
				/>
			) : null}

			<div
				style={{
					position: "absolute",
					left: "50%",
					top: "50%",
					width: size * 0.56,
					height: size * 0.56,
					borderRadius: "50%",
					background: CORE_COLOR,
					transform: "translate(-50%, -50%)",
					boxShadow: `0 0 0 ${Math.max(1, size * 0.006)}px ${hexToRgba(
						CORE_COLOR,
						0.96,
					)}, 0 0 ${size * 0.055}px ${hexToRgba(CORE_COLOR, 0.92)}`,
					zIndex: 6,
				}}
			/>

			<div
				style={{
					position: "absolute",
					inset: size * 0.145,
					borderRadius: "50%",
					background: `conic-gradient(from 0deg, transparent 0deg, transparent 34deg, ${LENSING_COLOR} 58deg, ${hexToRgba(
						LENSING_COLOR,
						0.38 * dimFactor,
					)} 80deg, transparent 116deg, transparent 214deg, ${hexToRgba(
						LENSING_COLOR,
						0.72 * dimFactor,
					)} 248deg, transparent 286deg, transparent 360deg)`,
					transform: `rotate(${lensingRotation}deg)`,
					transformOrigin: "50% 50%",
					WebkitMaskImage:
						"radial-gradient(circle, transparent 0%, transparent 45.2%, black 47.4%, black 49.2%, transparent 51.1%, transparent 100%)",
					maskImage:
						"radial-gradient(circle, transparent 0%, transparent 45.2%, black 47.4%, black 49.2%, transparent 51.1%, transparent 100%)",
					filter: `drop-shadow(0 0 ${size * 0.012}px ${hexToRgba(
						LENSING_COLOR,
						0.72 * dimFactor,
					)})`,
					zIndex: 7,
				}}
			/>
		</div>
	);
};
