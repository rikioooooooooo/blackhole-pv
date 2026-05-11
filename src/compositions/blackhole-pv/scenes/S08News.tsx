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
const red = "#D83A34";
const blue = "#1D5FD1";
const FEATURE_LEFT = 1014;
const FEATURE_TOP = 238;
const FEATURE_WIDTH = 780;
const FEATURE_ROW_GAP = 112;

const clamp = {
	extrapolateLeft: "clamp" as const,
	extrapolateRight: "clamp" as const,
};

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);
const easeInFast = Easing.bezier(0.7, 0, 0.84, 0);

const headlines = [
	{
		category: "ECONOMY",
		title: "大手IT企業、突然の大量解雇",
		start: 18,
	},
	{
		category: "CAREER",
		title: '年収1000万でも"貧困"の現実',
		start: 40,
	},
	{
		category: "SOCIETY",
		title: 'Z世代が"静かに辞める"本当の理由',
		start: 62,
	},
	{
		category: "AI",
		title: "AIに奪われる仕事ランキング最新版",
		start: 84,
	},
];

const safeRange = (values: number[]) => {
	const out: number[] = [];
	values.forEach((value, index) => {
		out.push(index === 0 ? value : Math.max(out[index - 1] + 1, value));
	});
	return out;
};

const getBhPosition = (frame: number) => {
	const left = FEATURE_LEFT + 88;
	const right = FEATURE_LEFT + FEATURE_WIDTH - 18;
	const rows = headlines.map((item, index) => ({
		start: item.start,
		end: item.start + 16,
		y: FEATURE_TOP + 54 + index * FEATURE_ROW_GAP,
	}));

	if (frame < rows[0].start) {
		const x = interpolate(frame, safeRange([0, rows[0].start]), [right + 80, right], {
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
	width: number;
}> = ({title, frame, start, width}) => {
	const end = start + 16;
	const wipe = interpolate(frame, [start, end], [0, width], {
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
				top: 19,
				width,
				height: 44,
				overflow: "hidden",
			}}
		>
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
						width,
						fontFamily: FONTS.japanese,
						fontSize: 32,
						fontWeight: 900,
						lineHeight: 1.16,
						letterSpacing: 0,
						color: ink,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
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
						height: 44,
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
	const bhOpacity = interpolate(frame, [8, 16, 112, 119], [0, 1, 1, 0], {
		...clamp,
		easing: easeOutSoft,
	});
	const activeBoost = headlines.some(
		(item) => frame >= item.start && frame <= item.start + 16,
	)
		? 0.07
		: 0;
	const bhScale = Math.max(0, bhIn) * (1 + activeBoost + Math.sin(frame * 0.1) * 0.012);

	return (
		<AbsoluteFill style={{background: "#F5F0E8", overflow: "hidden"}}>
			<Img
				src={staticFile("mockups/generated/news-site-negative-headlines.png")}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: FEATURE_LEFT - 22,
					top: FEATURE_TOP - 18,
					width: FEATURE_WIDTH + 28,
					height: 470,
					borderRadius: 18,
					background: "rgba(250,248,243,0.72)",
					boxShadow: "0 18px 54px rgba(18,22,32,0.08)",
					border: "1px solid rgba(21,18,15,0.05)",
					zIndex: 12,
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: FEATURE_LEFT,
					top: FEATURE_TOP + 6,
					zIndex: 18,
					fontFamily: FONTS.ui,
					fontSize: 13,
					fontWeight: 900,
					letterSpacing: 1.7,
					color: red,
				}}
			>
				BREAKING TREND
			</div>
			{headlines.map((item, index) => (
				<div
					key={item.title}
					style={{
						position: "absolute",
						left: FEATURE_LEFT,
						top: FEATURE_TOP + 26 + index * FEATURE_ROW_GAP,
						width: FEATURE_WIDTH,
						height: 82,
						zIndex: 18,
						borderRadius: 14,
						background: "rgba(255,255,255,0.52)",
						paddingLeft: 0,
						borderTop:
							index === 0 ? "none" : "1px solid rgba(21,18,15,0.12)",
					}}
				>
					<div
						style={{
							position: "absolute",
							left: 0,
							top: 13,
							fontSize: 12,
							fontWeight: 900,
							letterSpacing: 1.1,
							color: index === 0 ? red : blue,
							fontFamily: FONTS.ui,
						}}
					>
						{item.category}
					</div>
					<AbsorbingHeadline
						title={item.title}
						frame={frame}
						start={item.start}
						width={FEATURE_WIDTH}
					/>
				</div>
			))}

			{bhOpacity > 0.02 ? (
				<div
					style={{
						position: "absolute",
						left: bh.x,
						top: bh.y,
						width: 132,
						height: 132,
						transform: `translate(-50%, -50%) scale(${bhScale})`,
						opacity: bhOpacity,
						zIndex: 40,
						pointerEvents: "none",
					}}
				>
					<BlackHole size={132} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

export default S8News;
