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

const ink = "#15120f";
const FEATURE_LEFT = 926;
const FEATURE_TOP = 268;
const FEATURE_WIDTH = 820;
const FEATURE_ROW_GAP = 216;

const clamp = {
	extrapolateLeft: "clamp" as const,
	extrapolateRight: "clamp" as const,
};

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);
const easeInFast = Easing.bezier(0.7, 0, 0.84, 0);

const headlines = [
	{title: "大手IT企業、突然の大量解雇", start: 18},
	{title: '年収1000万でも"貧困"の現実', start: 40},
	{title: 'Z世代が"静かに辞める"本当の理由', start: 62},
	{title: "AIに奪われる仕事ランキング最新版", start: 84},
];

const safeRange = (values: number[]) => {
	const out: number[] = [];
	values.forEach((value, index) => {
		out.push(index === 0 ? value : Math.max(out[index - 1] + 1, value));
	});
	return out;
};

const getBhPosition = (frame: number) => {
	const left = FEATURE_LEFT - 14;
	const right = FEATURE_LEFT + FEATURE_WIDTH + 62;
	const rows = headlines.map((item, index) => ({
		start: item.start,
		end: item.start + 16,
		y: FEATURE_TOP + 44 + index * FEATURE_ROW_GAP,
	}));

	if (frame < rows[0].start) {
		const x = interpolate(frame, safeRange([0, rows[0].start]), [right + 72, right], {
			...clamp,
			easing: easeOutSoft,
		});
		return {x, y: rows[0].y};
	}

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		if (frame <= row.end) {
			const x = interpolate(frame, safeRange([row.start, row.end]), [right, left], {
				...clamp,
				easing: easeInFast,
			});
			return {x, y: row.y};
		}

		const next = rows[i + 1];
		if (next && frame < next.start) {
			const x = interpolate(frame, safeRange([row.end, next.start]), [left, right], {
				...clamp,
				easing: easeInOutSmooth,
			});
			const y = interpolate(frame, safeRange([row.end, next.start]), [row.y, next.y], {
				...clamp,
				easing: easeInOutSmooth,
			});
			return {x, y};
		}
	}

	const last = rows[rows.length - 1];
	const x = interpolate(frame, safeRange([last.end, 118]), [left, 900], {
		...clamp,
		easing: easeInOutSmooth,
	});
	return {x, y: last.y};
};

const AbsorbingHeadline: React.FC<{
	title: string;
	frame: number;
	start: number;
}> = ({title, frame, start}) => {
	const end = start + 16;
	const wipe = interpolate(frame, safeRange([start, end]), [0, FEATURE_WIDTH], {
		...clamp,
		easing: easeInFast,
	});
	const edgeOpacity = interpolate(frame, safeRange([start, end]), [0.7, 0], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});

	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				top: 0,
				width: FEATURE_WIDTH,
				height: 54,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					left: -8,
					top: 2,
					width: FEATURE_WIDTH + 16,
					height: 42,
					borderRadius: 6,
					background:
						"linear-gradient(90deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08) 76%, rgba(255,255,255,0))",
					filter: "blur(1.4px)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					clipPath: `inset(0 ${wipe}px 0 0)`,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: FEATURE_WIDTH,
						fontFamily: FONTS.japanese,
						fontSize: 34,
						fontWeight: 900,
						lineHeight: "46px",
						letterSpacing: 0,
						color: ink,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						mixBlendMode: "multiply",
						textShadow:
							"0 1px 0 rgba(255,255,255,0.42), 0 5px 14px rgba(21,18,15,0.06)",
					}}
				>
					{title}
				</div>
			</div>
			{frame >= start && frame <= end ? (
				<div
					style={{
						position: "absolute",
						right: wipe - 5,
						top: 0,
						width: 10,
						height: 54,
						borderRadius: 999,
						background:
							"linear-gradient(180deg, rgba(107,63,160,0), rgba(107,63,160,0.38), rgba(224,122,95,0.3), rgba(107,63,160,0))",
						opacity: edgeOpacity,
					}}
				/>
			) : null}
		</div>
	);
};

export const S8News: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const bh = getBhPosition(frame);
	const bhIn = spring({
		frame: frame - 8,
		fps,
		config: {mass: 0.55, damping: 8, stiffness: 180},
	});
	const bhOpacity = interpolate(frame, safeRange([8, 16, 112, 119]), [0, 1, 1, 0], {
		...clamp,
		easing: easeOutSoft,
	});
	const activeBoost = headlines.some((item) => frame >= item.start && frame <= item.start + 16)
		? 0.07
		: 0;
	const bhScale = Math.max(0, bhIn) * (1 + activeBoost + Math.sin(frame * 0.1) * 0.012);

	return (
		<AbsoluteFill style={{background: "#F5F0E8", overflow: "hidden"}}>
			<Img
				src={staticFile("mockups/generated/news-site-headline-lanes.png")}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
				}}
			/>
			{headlines.map((item, index) => (
				<div
					key={item.title}
					style={{
						position: "absolute",
						left: FEATURE_LEFT,
						top: FEATURE_TOP + index * FEATURE_ROW_GAP,
						width: FEATURE_WIDTH,
						height: 78,
						zIndex: 18,
					}}
				>
					<AbsorbingHeadline title={item.title} frame={frame} start={item.start} />
				</div>
			))}

			{bhOpacity > 0.02 ? (
				<div
					style={{
						position: "absolute",
						left: bh.x,
						top: bh.y,
						width: 116,
						height: 116,
						transform: `translate(-50%, -50%) scale(${bhScale})`,
						opacity: bhOpacity,
						zIndex: 40,
						pointerEvents: "none",
					}}
				>
					<BlackHole size={116} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

export default S8News;
