import React from "react";
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import {BlackHole} from "../components/BlackHole";
import {FONTS} from "../constants";

const cream = "#F5F0E8";
const ink = "#171316";
const purple = "#6B3FA0";
const coral = "#E07A5F";
const amber = "#F4A261";

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInFast = Easing.bezier(0.7, 0, 0.84, 0);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);

const steps = [
	{label: "TEXT", start: 28, size: 96, boost: 0},
	{label: "IMAGE", start: 82, size: 122, boost: 0.12},
	{label: "BANNER", start: 138, size: 150, boost: 0.22},
	{label: "VIDEO", start: 196, size: 184, boost: 0.32},
	{label: "PAGE", start: 254, size: 232, boost: 0.46},
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const absorbProgress = (frame: number, start: number) => {
	return interpolate(frame, [start, start + 26], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInFast,
	});
};

const TargetShell: React.FC<{
	children: React.ReactNode;
	left: number;
	top: number;
	width: number;
	height: number;
	progress: number;
	delay: number;
}> = ({children, left, top, width, height, progress, delay}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const appear = spring({
		frame: frame - delay,
		fps,
		config: {mass: 0.8, damping: 20, stiffness: 140},
	});
	const opacity = interpolate(appear, [0, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const y = interpolate(appear, [0, 1], [16, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});
	const pullX = interpolate(progress, [0, 1], [0, 960 - (left + width / 2)], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInFast,
	});
	const pullY = interpolate(progress, [0, 1], [0, 540 - (top + height / 2)], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInFast,
	});
	const scale = interpolate(progress, [0, 1], [1, 0.08], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInFast,
	});

	return (
		<div
			style={{
				position: "absolute",
				left,
				top,
				width,
				height,
				opacity: opacity * (1 - progress),
				transform: `translate(${pullX}px, ${pullY + y}px) scale(${scale}) rotate(${progress * -8}deg)`,
				transformOrigin: "50% 50%",
				willChange: "transform, opacity",
			}}
		>
			{children}
		</div>
	);
};

const PillLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div
		style={{
			display: "inline-flex",
			alignItems: "center",
			height: 30,
			padding: "0 12px",
			borderRadius: 999,
			background: "rgba(107,63,160,0.12)",
			color: purple,
			fontFamily: FONTS.ui,
			fontSize: 12,
			fontWeight: 900,
			letterSpacing: "0.11em",
		}}
	>
		{children}
	</div>
);

export const S09GameGrowth: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const titleIn = spring({
		frame: frame - 216,
		fps,
		config: {mass: 0.72, damping: 18, stiffness: 130},
	});

	const totalGrowth = steps.reduce((sum, step) => {
		return sum + absorbProgress(frame, step.start) * step.boost;
	}, 0);

	const activePulse = steps.some(
		(step) => frame >= step.start && frame <= step.start + 28,
	)
		? 0.08
		: 0;
	const breath = 1 + Math.sin(frame * 0.07) * 0.018;
	const holeSize = 102 + totalGrowth * 190;
	const holeScale = breath + activePulse;

	const cameraScale = interpolate(frame, [0, 180, 330], [0.99, 1.015, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeInOutSmooth,
	});

	const titleOpacity = interpolate(frame, [220, 258], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});
	const titleY = interpolate(titleIn, [0, 1], [14, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
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
						"radial-gradient(circle at 50% 46%, rgba(255,255,255,0.68), rgba(255,255,255,0.2) 34%, transparent 68%), radial-gradient(circle at 16% 20%, rgba(224,122,95,0.12), transparent 28%), radial-gradient(circle at 84% 76%, rgba(107,63,160,0.12), transparent 30%)",
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
				<TargetShell
					left={250}
					top={238}
					width={390}
					height={118}
					progress={absorbProgress(frame, steps[0].start)}
					delay={0}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 22,
							background: "#FFFFFF",
							boxShadow: "0 22px 54px rgba(36,26,18,0.12)",
							padding: "22px 26px",
							boxSizing: "border-box",
							color: ink,
						}}
					>
						<PillLabel>TEXT</PillLabel>
						<div style={{marginTop: 12, fontSize: 26, fontWeight: 900}}>
							見たくない言葉
						</div>
					</div>
				</TargetShell>

				<TargetShell
					left={1210}
					top={206}
					width={260}
					height={190}
					progress={absorbProgress(frame, steps[1].start)}
					delay={34}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 24,
							background: "#FFFFFF",
							boxShadow: "0 24px 60px rgba(36,26,18,0.14)",
							overflow: "hidden",
						}}
					>
						<Img
							src={staticFile("mockups/app-icon-social.png")}
							style={{width: "100%", height: 126, objectFit: "cover"}}
						/>
						<div style={{padding: 16}}>
							<PillLabel>IMAGE</PillLabel>
						</div>
					</div>
				</TargetShell>

				<TargetShell
					left={218}
					top={620}
					width={540}
					height={112}
					progress={absorbProgress(frame, steps[2].start)}
					delay={72}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 24,
							background: `linear-gradient(135deg, ${purple}, ${coral})`,
							boxShadow: "0 26px 70px rgba(107,63,160,0.2)",
							color: "#FFFFFF",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "0 28px",
							boxSizing: "border-box",
						}}
					>
						<div>
							<PillLabel>BANNER</PillLabel>
							<div style={{marginTop: 10, fontSize: 24, fontWeight: 900}}>
								情報量の多いバナー
							</div>
						</div>
						<div
							style={{
								width: 76,
								height: 76,
								borderRadius: 22,
								background: "rgba(255,255,255,0.22)",
							}}
						/>
					</div>
				</TargetShell>

				<TargetShell
					left={1160}
					top={610}
					width={410}
					height={230}
					progress={absorbProgress(frame, steps[3].start)}
					delay={112}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 26,
							background: "#171316",
							boxShadow: "0 28px 78px rgba(23,19,22,0.2)",
							overflow: "hidden",
							position: "relative",
						}}
					>
						<Img
							src={staticFile("mockups/yt-thumb-2.png")}
							style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.74}}
						/>
						<div
							style={{
								position: "absolute",
								left: 20,
								bottom: 18,
								color: "#FFFFFF",
							}}
						>
							<PillLabel>VIDEO</PillLabel>
							<div style={{marginTop: 10, fontSize: 24, fontWeight: 900}}>
								次々流れる動画
							</div>
						</div>
					</div>
				</TargetShell>

				<TargetShell
					left={586}
					top={136}
					width={748}
					height={640}
					progress={absorbProgress(frame, steps[4].start)}
					delay={150}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 32,
							background: "rgba(255,255,255,0.92)",
							boxShadow: "0 34px 100px rgba(36,26,18,0.16)",
							border: "1px solid rgba(23,19,22,0.08)",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								height: 54,
								background: "#FBF8F2",
								borderBottom: "1px solid rgba(23,19,22,0.1)",
							}}
						/>
						<div style={{padding: 34}}>
							<PillLabel>PAGE</PillLabel>
							<div style={{marginTop: 22, fontSize: 42, fontWeight: 900, color: ink}}>
								ページ全体
							</div>
							{[0, 1, 2, 3].map((line) => (
								<div
									key={line}
									style={{
										marginTop: 22,
										width: `${82 - line * 9}%`,
										height: 18,
										borderRadius: 999,
										background:
											line % 2 === 0
												? "rgba(23,19,22,0.14)"
												: "rgba(107,63,160,0.16)",
									}}
								/>
							))}
						</div>
					</div>
				</TargetShell>
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
					filter: `drop-shadow(0 ${28 + totalGrowth * 22}px ${52 + totalGrowth * 52}px rgba(65,36,104,0.34))`,
					zIndex: 20,
				}}
			>
				<BlackHole size={holeSize} />
			</div>

			{steps.map((step, index) => {
				const progress = clamp01(absorbProgress(frame, step.start));
				const opacity = interpolate(progress, [0, 0.45, 1], [0, 1, 0], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				return (
					<div
						key={step.label}
						style={{
							position: "absolute",
							left: width / 2 - step.size / 2,
							top: height / 2 - step.size / 2,
							width: step.size,
							height: step.size,
							borderRadius: "50%",
							border: `2px solid ${index % 2 === 0 ? amber : coral}`,
							transform: `scale(${1 + progress * 1.8})`,
							opacity: opacity * 0.6,
							zIndex: 18,
						}}
					/>
				);
			})}

			<div
				style={{
					position: "absolute",
					left: "50%",
					bottom: 82,
					width: 920,
					transform: `translateX(-50%) translateY(${titleY}px)`,
					opacity: titleOpacity,
					textAlign: "center",
					fontSize: 50,
					fontWeight: 900,
					lineHeight: 1.2,
					color: ink,
					textShadow: "0 18px 40px rgba(45,30,20,0.1)",
					zIndex: 30,
				}}
			>
				画面の情報を、全て吸い込め。
			</div>
		</AbsoluteFill>
	);
};

export default S09GameGrowth;
