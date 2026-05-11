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
import {FONTS, VIDEO_HEIGHT, VIDEO_WIDTH} from "../constants";
import {usePvCurrentFrame as useCurrentFrame, usePvVideoConfig as useVideoConfig} from "../timing";

const cream = "#F5F0E8";
const ink = "#15120f";
const red = "#D83A34";
const blue = "#1D5FD1";

const clamp = {
	extrapolateLeft: "clamp" as const,
	extrapolateRight: "clamp" as const,
};

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);
const easeInFast = Easing.bezier(0.7, 0, 0.84, 0);

const headlines = [
	{
		category: "BUSINESS",
		title: "大手IT企業、突然の大量解雇",
		meta: "3分前 / 経済",
		start: 20,
	},
	{
		category: "MONEY",
		title: '年収1000万でも"貧困"の現実',
		meta: "12分前 / 生活",
		start: 42,
	},
	{
		category: "WORK",
		title: 'Z世代が"静かに辞める"本当の理由',
		meta: "28分前 / 働き方",
		start: 64,
	},
	{
		category: "AI",
		title: "AIに奪われる仕事ランキング最新版",
		meta: "43分前 / テクノロジー",
		start: 86,
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
	const left = 352;
	const right = 900;
	const rows = headlines.map((item, index) => ({
		start: item.start,
		end: item.start + 16,
		y: 274 + index * 116,
	}));

	if (frame < rows[0].start) {
		const x = interpolate(frame, safeRange([0, rows[0].start]), [left - 80, left], {
			...clamp,
			easing: easeOutSoft,
		});
		return {x, y: rows[0].y};
	}

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		if (frame <= row.end) {
			const x = interpolate(frame, safeRange([row.start, row.end]), [left, right], {
				...clamp,
				easing: easeInFast,
			});
			return {x, y: row.y};
		}

		const next = rows[i + 1];
		if (next && frame < next.start) {
			const x = interpolate(frame, safeRange([row.end, next.start]), [right, left], {
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
	const x = interpolate(frame, safeRange([last.end, 118]), [right, 1220], {
		...clamp,
		easing: easeInOutSmooth,
	});
	return {x, y: last.y};
};

const AbsorbingHeadline: React.FC<{
	title: string;
	frame: number;
	start: number;
	x: number;
	y: number;
	width: number;
}> = ({title, frame, start, x, y, width}) => {
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
				left: x,
				top: y,
				width,
				height: 64,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 0,
					clipPath: `inset(0 0 0 ${wipe}px)`,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width,
						fontFamily: FONTS.japanese,
						fontSize: 26,
						fontWeight: 900,
						lineHeight: 1.22,
						letterSpacing: -0.75,
						color: ink,
						whiteSpace: "normal",
						overflowWrap: "break-word",
					}}
				>
					{title}
				</div>
			</div>
			{frame >= start && frame <= end ? (
				<div
					style={{
						position: "absolute",
						left: wipe - 5,
						top: 2,
						width: 10,
						height: 56,
						borderRadius: 999,
						background:
							"linear-gradient(180deg, rgba(107,63,160,0), rgba(107,63,160,0.36), rgba(224,122,95,0.28), rgba(107,63,160,0))",
						opacity: edgeOpacity,
					}}
				/>
			) : null}
		</div>
	);
};

const NewsCard: React.FC<{
	item: (typeof headlines)[number];
	index: number;
	frame: number;
}> = ({item, index, frame}) => {
	const {fps} = useVideoConfig();
	const appear = spring({
		frame: frame - index * 5,
		fps,
		config: {mass: 0.85, damping: 22, stiffness: 120},
	});
	const opacity = interpolate(appear, [0, 1], [0, 1], clamp);
	const y = interpolate(appear, [0, 1], [12, 0], clamp);
	const top = 214 + index * 116;

	return (
		<div
			style={{
				position: "absolute",
				left: 64,
				top,
				width: 850,
				height: 96,
				borderRadius: 22,
				background: "#FFFFFF",
				boxShadow:
					index === 0
						? "0 16px 42px rgba(24, 31, 38, 0.12), inset 0 0 0 1px rgba(15,31,52,0.08)"
						: "inset 0 0 0 1px rgba(15,31,52,0.075)",
				opacity,
				transform: `translateY(${y}px)`,
				overflow: "hidden",
				zIndex: 10,
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 24,
					top: 20,
					width: 46,
					height: 46,
					borderRadius: 14,
					background: index === 0 ? red : "rgba(29,95,209,0.12)",
					color: index === 0 ? "#FFFFFF" : blue,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: FONTS.ui,
					fontSize: 18,
					fontWeight: 900,
				}}
			>
				{index + 1}
			</div>
			<div
				style={{
					position: "absolute",
					left: 88,
					top: 18,
					fontFamily: FONTS.ui,
					fontSize: 12,
					fontWeight: 900,
					letterSpacing: 1,
					color: index === 0 ? red : blue,
				}}
			>
				{item.category}
			</div>
			<div
				style={{
					position: "absolute",
					left: 88,
					bottom: 16,
					fontFamily: FONTS.ui,
					fontSize: 12,
					fontWeight: 760,
					color: "rgba(21,18,15,0.44)",
				}}
			>
				{item.meta}
			</div>
			<AbsorbingHeadline
				title={item.title}
				frame={frame}
				start={item.start}
				x={88}
				y={38}
				width={540}
			/>
			<div
				style={{
					position: "absolute",
					right: 24,
					top: 28,
					height: 34,
					padding: "0 13px",
					borderRadius: 999,
					background: index === 0 ? "rgba(216,58,52,0.1)" : "rgba(29,95,209,0.1)",
					fontFamily: FONTS.ui,
					fontSize: 12,
					fontWeight: 900,
					color: index === 0 ? red : blue,
					lineHeight: "34px",
				}}
			>
				{120 - index * 18} comments
			</div>
		</div>
	);
};

export const S8News: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const bh = getBhPosition(frame);
	const entrance = spring({
		frame,
		fps,
		config: {mass: 1, damping: 22, stiffness: 120},
	});
	const panelOpacity = interpolate(entrance, [0, 1], [0, 1], clamp);
	const panelY = interpolate(entrance, [0, 1], [18, 0], clamp);
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
		<AbsoluteFill
			style={{
				background: cream,
				overflow: "hidden",
				fontFamily: FONTS.ui,
			}}
		>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at 80% 20%, rgba(216,58,52,0.12), transparent 26%), radial-gradient(circle at 16% 82%, rgba(29,95,209,0.1), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.52), rgba(245,240,232,0))",
				}}
			/>

			<div
				style={{
					position: "absolute",
					left: VIDEO_WIDTH / 2 - 720,
					top: VIDEO_HEIGHT / 2 - 384 + panelY,
					width: 1440,
					height: 768,
					borderRadius: 34,
					background: "#F8FAFC",
					boxShadow:
						"0 42px 120px rgba(22,34,48,0.16), 0 18px 44px rgba(22,34,48,0.11), inset 0 0 0 1px rgba(20,30,40,0.09)",
					opacity: panelOpacity,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: 0,
						height: 88,
						background: "#FFFFFF",
						boxShadow: "inset 0 -1px 0 rgba(20,30,40,0.1)",
					}}
				>
					<Img
						src={staticFile("mockups/news-header-logo.png")}
						style={{
							position: "absolute",
							left: 52,
							top: 18,
							width: 52,
							height: 52,
							objectFit: "contain",
							borderRadius: 14,
						}}
					/>
					<div
						style={{
							position: "absolute",
							left: 122,
							top: 20,
							fontSize: 30,
							fontWeight: 900,
							letterSpacing: -0.7,
							color: "#101820",
						}}
					>
							NEWS PORTAL
					</div>
					<div
						style={{
							position: "absolute",
							left: 122,
							top: 54,
							fontSize: 12,
							fontWeight: 900,
							letterSpacing: 1.4,
							color: "rgba(16,24,32,0.42)",
						}}
					>
						TOP STORIES / BUSINESS / TECH / LIFE
					</div>
					<div
						style={{
							position: "absolute",
							right: 52,
							top: 27,
							height: 34,
							padding: "0 18px",
							borderRadius: 999,
							background: "rgba(216,58,52,0.1)",
							color: red,
							fontSize: 13,
							fontWeight: 900,
							letterSpacing: 1.1,
							lineHeight: "34px",
						}}
					>
						BREAKING
					</div>
				</div>

				<div
					style={{
						position: "absolute",
						left: 64,
						top: 118,
						fontFamily: FONTS.japanese,
						fontSize: 22,
						fontWeight: 900,
						letterSpacing: -0.45,
						color: "#101820",
					}}
				>
					今日の注目ニュース
				</div>

				{headlines.map((item, index) => (
					<NewsCard key={item.title} item={item} index={index} frame={frame} />
				))}

				<div
					style={{
						position: "absolute",
						right: 64,
						top: 132,
						width: 336,
						height: 506,
						borderRadius: 28,
						background: "#FFFFFF",
						boxShadow:
							"0 18px 54px rgba(17,35,58,0.1), inset 0 0 0 1px rgba(15,31,52,0.08)",
						overflow: "hidden",
					}}
				>
					<Img
						src={staticFile("mockups/news-stock-crash.png")}
						style={{
							width: "100%",
							height: 178,
							objectFit: "cover",
						}}
					/>
					<div style={{padding: 24}}>
						<div
							style={{
								display: "inline-flex",
								height: 28,
								padding: "0 11px",
								borderRadius: 999,
								background: "rgba(216,58,52,0.1)",
								alignItems: "center",
								fontSize: 12,
								fontWeight: 900,
								color: red,
								letterSpacing: 0.8,
							}}
						>
							MARKET
						</div>
						<div
							style={{
								marginTop: 18,
								fontFamily: FONTS.japanese,
								fontSize: 24,
								fontWeight: 900,
								lineHeight: 1.32,
								letterSpacing: -0.65,
								color: ink,
							}}
						>
							刺激的な見出しほど、画面に残り続ける。
						</div>
						<div
							style={{
								marginTop: 18,
								fontFamily: FONTS.japanese,
								fontSize: 15,
								fontWeight: 760,
								lineHeight: 1.65,
								color: "rgba(21,18,15,0.58)",
							}}
						>
							触れたテキストだけが吸い込まれ、記事カードの形は静かに残る。
						</div>
					</div>
				</div>

				{frame >= 108 ? (
					<div
						style={{
							position: "absolute",
							right: 58,
							top: 100,
							padding: "13px 20px",
							borderRadius: 999,
							background: "#FFFFFF",
							boxShadow:
								"0 14px 36px rgba(20,30,40,0.15), inset 0 0 0 1px rgba(20,30,40,0.1)",
							fontFamily: FONTS.japanese,
							fontSize: 16,
							fontWeight: 900,
							color: "#101820",
						}}
					>
						4本の見出しを吸い込みました
					</div>
				) : null}
			</div>

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
