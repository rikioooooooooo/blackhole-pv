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
import {FONTS} from "../constants";

const cream = "#F5F0E8";
const ink = "#171316";

const textSpring = {
	mass: 0.72,
	damping: 20,
	stiffness: 120,
};

const holeSpring = {
	mass: 0.55,
	damping: 10,
	stiffness: 150,
};

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);

export const S11Climax: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const titleIn = spring({
		frame: frame - 42,
		fps,
		config: textSpring,
	});

	const holeIn = spring({
		frame: frame - 8,
		fps,
		config: holeSpring,
	});

	const titleOpacity = interpolate(frame, [34, 72], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const titleY = interpolate(titleIn, [0, 1], [14, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const lineOpacity = interpolate(frame, [100, 142], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const breath = 1 + Math.sin(frame * 0.045) * 0.045;
	const driftY = Math.sin(frame * 0.025) * 5;
	const holeScale = Math.max(0, holeIn) * breath;

	const fadeToOutro = interpolate(frame, [318, 359], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInOutSmooth,
	});

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
						"radial-gradient(circle at 50% 22%, rgba(255,255,255,0.74), rgba(255,255,255,0.22) 34%, rgba(245,240,232,0) 68%)",
				}}
			/>

			<div
				style={{
					position: "absolute",
					left: width / 2 - 52,
					top: height * 0.2 - 52 + driftY,
					width: 104,
					height: 104,
					transform: `scale(${holeScale})`,
					transformOrigin: "50% 50%",
					opacity: interpolate(frame, [0, 34, 318, 350], [0, 1, 1, 0], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: easeOutSoft,
					}),
					filter: "drop-shadow(0 22px 44px rgba(35, 20, 48, 0.24))",
				}}
			>
				<BlackHole size={104} />
			</div>

			<div
				style={{
					position: "absolute",
					left: "50%",
					top: "52%",
					width: 980,
					transform: `translate(-50%, -50%) translateY(${titleY}px)`,
					opacity: titleOpacity,
					textAlign: "center",
					color: ink,
					fontSize: 76,
					fontWeight: 900,
					letterSpacing: "0.01em",
					lineHeight: 1.18,
					textShadow: "0 18px 48px rgba(45, 30, 20, 0.12)",
				}}
			>
				全てを、吸い込め。
			</div>

			<div
				style={{
					position: "absolute",
					left: width / 2 - 260,
					top: height * 0.62,
					width: 520,
					height: 1,
					opacity: lineOpacity,
					background:
						"linear-gradient(90deg, rgba(23,19,22,0), rgba(23,19,22,0.24), rgba(23,19,22,0))",
				}}
			/>

			<AbsoluteFill
				style={{
					background: cream,
					opacity: fadeToOutro,
				}}
			/>
		</AbsoluteFill>
	);
};

export default S11Climax;
