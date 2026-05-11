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
import {noise2D} from "@remotion/noise";
import {FONTS, VIDEO_HEIGHT, VIDEO_WIDTH} from "../constants";
import {BlackHole} from "../components/BlackHole";

type NotificationItem = {
	app: string;
	title: string;
	body: string;
	tone: string;
	icon: string;
	x: number;
	y: number;
	start: number;
	absorb: number;
};

type CursorPoint = {
	x: number;
	y: number;
};

const font = (key: string, fallback: string) => {
	const value = (FONTS as unknown as Record<string, unknown>)[key];
	return typeof value === "string" ? value : fallback;
};

const JAPANESE_FONT = font("japanese", "'Axis Std', sans-serif");
const BH_CORE = "#0A0508";
const WARM_CREAM = "#F5F0E8";

const UnifiedBlackHole = BlackHole as React.ComponentType<{
	size?: number;
	frame?: number;
	opacity?: number;
	core?: string;
	coreColor?: string;
}>;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const frameRange = (...values: number[]) => {
	const safe: number[] = [];
	values.forEach((value, index) => {
		if (index === 0) {
			safe.push(value);
			return;
		}
		safe.push(Math.max(safe[index - 1] + 1, value));
	});
	return safe;
};

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);
const easeInFast = Easing.bezier(0.7, 0, 0.84, 0);

const holeSpring = {
	mass: 0.55,
	damping: 8,
	stiffness: 180,
};

const cardSpring = {
	mass: 0.8,
	damping: 20,
	stiffness: 140,
};

const SWEEP_FRAMES = 22;
const BH_SIZE = 72;
const BODY_TEXT_WIDTH = 248;

const notifications: NotificationItem[] = [
	{
		app: "Slack",
		title: "チームチャット",
		body: "お前のせいで全部止まってる",
		tone: "#6E56CF",
		icon: "mockups/slack-channel-icon.png",
		x: 0.666,
		y: 0.118,
		start: 8,
		absorb: 34,
	},
	{
		app: "Mail",
		title: "上司からのメール",
		body: "使えない。もう来なくていい",
		tone: "#FF7A3D",
		icon: "mockups/notification-icon-mail.png",
		x: 0.666,
		y: 0.256,
		start: 14,
		absorb: 63,
	},
	{
		app: "News",
		title: "刺激の強い見出し",
		body: "あなた一人のせいで大損害",
		tone: "#E54888",
		icon: "mockups/notification-icon-alert.png",
		x: 0.666,
		y: 0.394,
		start: 23,
		absorb: 91,
	},
	{
		app: "Workplace",
		title: "人事通知",
		body: "クビにしてやる、覚悟しろ",
		tone: "#0091FF",
		icon: "mockups/app-icon-mail.png",
		x: 0.666,
		y: 0.532,
		start: 33,
		absorb: 116,
	},
	{
		app: "SNS",
		title: "コメント通知",
		body: "見てて恥ずかしい。時間の無駄",
		tone: "#30A46C",
		icon: "mockups/notification-icon-sns.png",
		x: 0.666,
		y: 0.67,
		start: 44,
		absorb: 142,
	},
];

const AbsorbingBodyText: React.FC<{
	text: string;
	frame: number;
	itemAbsorb: number;
	bhX: number;
	textLeftGlobal: number;
}> = ({text, frame, itemAbsorb, bhX, textLeftGlobal}) => {
	const wipeEnd = itemAbsorb + SWEEP_FRAMES;
	const bhRadius = BH_SIZE / 2;
	const wipeByBh = Math.max(
		0,
		Math.min(BODY_TEXT_WIDTH, bhX - textLeftGlobal + bhRadius),
	);
	const wipeRaw =
		frame < itemAbsorb
			? 0
			: frame > wipeEnd
				? BODY_TEXT_WIDTH
				: wipeByBh;
	const charW = 13.5 * 1.0;
	const wipePx = Math.floor(wipeRaw / charW) * charW;

	return (
		<div
			style={{
				position: "relative",
				width: BODY_TEXT_WIDTH,
				height: 22,
				overflow: "hidden",
				fontFamily: JAPANESE_FONT,
				fontSize: 13.5,
				fontWeight: 760,
				lineHeight: "20px",
				color: "rgba(31,27,24,0.9)",
				letterSpacing: -0.05,
				whiteSpace: "nowrap",
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					width: BODY_TEXT_WIDTH,
					height: 22,
					overflow: "hidden",
					whiteSpace: "nowrap",
					textOverflow: "clip",
					clipPath: `inset(0 0 0 ${wipePx}px)`,
				}}
			>
				{text}
			</div>
		</div>
	);
};

const NotificationCard: React.FC<{
	item: NotificationItem;
	index: number;
	frame: number;
	fps: number;
	bhX: number;
	bhY: number;
	cardW: number;
	cardH: number;
}> = ({item, index, frame, fps, bhX, bhY, cardW, cardH}) => {
	const appearRaw = spring({
		frame: frame - item.start,
		fps,
		config: cardSpring,
		durationInFrames: 16,
	});
	const appear = clamp01(appearRaw);

	const x = item.x * VIDEO_WIDTH;
	const y = item.y * VIDEO_HEIGHT;

	const textLeft = 72;
	const bodyTop = 57;
	const bodyCenterX = x + textLeft + BODY_TEXT_WIDTH / 2;
	const bodyCenterY = y + bodyTop + 10;
	const distanceToBody = Math.sqrt(
		(bhX - bodyCenterX) * (bhX - bodyCenterX) +
			(bhY - bodyCenterY) * (bhY - bodyCenterY),
	);

	const contact = interpolate(distanceToBody, [0, 132], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.quad),
	});

	const preAbsorbPulse = interpolate(
		frame,
		frameRange(item.absorb - 8, item.absorb, item.absorb + SWEEP_FRAMES),
		[0, 1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.inOut(Easing.cubic),
		},
	);

	const entryX = interpolate(appear, [0, 1], [34, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const entryY = interpolate(appear, [0, 1], [-8, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const scale = interpolate(appear, [0, 1], [0.96, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const completeFrame = item.absorb + SWEEP_FRAMES;
	const settleOpacity = interpolate(
		frame,
		frameRange(completeFrame + 4, completeFrame + 18),
		[1, 0.55],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.quad),
		},
	);

	const wobble = noise2D("s5-card-wobble", index * 0.37, frame * 0.012) * 0.28;
	const roll = noise2D("s5-card-roll", index * 0.21 + 4, frame * 0.01) * 0.08;
	const opacity = clamp01(appear * settleOpacity);

	if (opacity <= 0.03) {
		return null;
	}

	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: cardW,
				height: cardH,
				borderRadius: 20,
				opacity,
				transform: `translate(${entryX}px, ${
					entryY + wobble
				}px) rotate(${roll}deg) scale(${scale})`,
				transformOrigin: "50% 50%",
				background: `linear-gradient(180deg, rgba(255,253,248,0.99), rgba(250,246,238,0.98)), radial-gradient(circle at 78% 70%, rgba(10,5,8,${
					0.035 + contact * 0.14
				}) 0 13%, transparent 32%), radial-gradient(circle at 8% 50%, ${
					item.tone
				}26, transparent 45%)`,
				boxShadow: `0 ${15 + preAbsorbPulse * 8 + contact * 5}px ${
					30 + preAbsorbPulse * 10 + contact * 8
				}px rgba(34, 28, 22, ${0.14 + preAbsorbPulse * 0.08})`,
				border: `1.2px solid rgba(10,5,8,${
					0.1 + preAbsorbPulse * 0.08 + contact * 0.05
				})`,
				overflow: "hidden",
				zIndex: 34 + index,
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 16,
					top: 15,
					width: 40,
					height: 40,
					borderRadius: 12,
					background: "#FFFFFF",
					boxShadow: `0 9px 18px ${item.tone}36`,
					overflow: "hidden",
				}}
			>
				<Img
					src={staticFile(item.icon)}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
				/>
			</div>
			<div
				style={{
					position: "absolute",
					left: textLeft,
					top: 12,
					right: 16,
					fontFamily: font("ui", "Inter, system-ui, sans-serif"),
					color: "#1D1D1F",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "baseline",
						gap: 14,
						fontSize: 15,
						fontWeight: 780,
						letterSpacing: -0.18,
						lineHeight: 1.15,
					}}
				>
					<span
						style={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{item.app}
					</span>
					<span
						style={{
							flex: "0 0 auto",
							fontSize: 12,
							fontWeight: 760,
							color: "rgba(29,29,31,0.72)",
						}}
					>
						今
					</span>
				</div>
				<div
					style={{
						marginTop: 5,
						fontFamily: JAPANESE_FONT,
						fontSize: 15,
						fontWeight: 760,
						lineHeight: 1.18,
						letterSpacing: -0.1,
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						color: "#171412",
					}}
				>
					{item.title}
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					left: textLeft,
					top: bodyTop,
					width: BODY_TEXT_WIDTH,
					height: 22,
					overflow: "hidden",
				}}
			>
				<AbsorbingBodyText
					text={item.body}
					frame={frame}
					itemAbsorb={item.absorb}
					bhX={bhX}
					textLeftGlobal={x + textLeft}
				/>
			</div>

			<div
				style={{
					position: "absolute",
					right: 18,
					top: 61,
					width: 30 + contact * 18,
					height: 2,
					borderRadius: 999,
					background: `rgba(10,5,8,${0.07 + contact * 0.24})`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					bottom: 0,
					width: 5,
					background: item.tone,
					opacity: 0.86,
				}}
			/>
		</div>
	);
};

const BlackHoleCursor: React.FC<{
	x: number;
	y: number;
	scale: number;
	opacity: number;
	frame: number;
}> = ({x, y, scale, opacity, frame}) => {
	if (opacity <= 0.02) {
		return null;
	}

	return (
		<div
			style={{
				position: "absolute",
				left: x - BH_SIZE / 2,
				top: y - BH_SIZE / 2,
				width: BH_SIZE,
				height: BH_SIZE,
				opacity,
				zIndex: 88,
				transform: `scale(${scale})`,
				transformOrigin: "50% 50%",
				filter: "drop-shadow(0 18px 34px rgba(52, 28, 112, 0.38))",
				pointerEvents: "none",
			}}
		>
			<UnifiedBlackHole
				size={BH_SIZE}
				frame={frame}
				opacity={1}
				core={BH_CORE}
				coreColor={BH_CORE}
			/>
		</div>
	);
};

const WorkBrowserMock: React.FC<{frame: number}> = ({frame}) => {
	const activeLine = Math.floor(frame / 34) % 4;
	const caretOpacity = interpolate(frame % 24, [0, 12, 23], [1, 0.15, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				position: "absolute",
				left: 154,
				top: 118,
				width: 1130,
				height: 748,
				borderRadius: 34,
				background: "rgba(255,255,255,0.96)",
				boxShadow:
					"0 38px 110px rgba(42, 34, 24, 0.18), inset 0 0 0 1px rgba(10,5,8,0.08)",
				overflow: "hidden",
				zIndex: 5,
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 58,
					background: "#FBF8F2",
					borderBottom: "1px solid rgba(10,5,8,0.08)",
				}}
			>
				<div style={{position: "absolute", left: 24, top: 23, display: "flex", gap: 8}}>
					{["#FF5F56", "#FFBD2E", "#27C93F"].map((color) => (
						<div key={color} style={{width: 12, height: 12, borderRadius: "50%", background: color}} />
					))}
				</div>
				<div
					style={{
						position: "absolute",
						left: 104,
						right: 32,
						top: 15,
						height: 30,
						borderRadius: 10,
						background: "rgba(10,5,8,0.055)",
						fontFamily: font("ui", "Inter, system-ui, sans-serif"),
						fontSize: 13,
						fontWeight: 760,
						color: "rgba(29,25,20,0.52)",
						lineHeight: "30px",
						paddingLeft: 18,
					}}
				>
					docs.google.com / project-plan
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					left: 58,
					top: 102,
					width: 610,
					fontFamily: JAPANESE_FONT,
					color: "#171412",
				}}
			>
				<div style={{fontSize: 34, fontWeight: 900, letterSpacing: -0.6}}>
					作業中のドキュメント
				</div>
				<div style={{marginTop: 18, fontSize: 18, lineHeight: 1.75, color: "rgba(23,20,18,0.62)"}}>
					集中して文章を書いている最中に、右側から通知が重なってくる。
				</div>

				<div style={{marginTop: 42}}>
					{[
						"今日の進捗をまとめる",
						"UIの違和感をメモする",
						"撮影する実機映像の構成を決める",
						"最後にレンダーして確認する",
					].map((text, index) => (
						<div
							key={text}
							style={{
								height: 54,
								display: "flex",
								alignItems: "center",
								gap: 16,
								borderBottom: "1px solid rgba(10,5,8,0.07)",
								fontSize: 22,
								fontWeight: 760,
								color: index === activeLine ? "#171412" : "rgba(23,20,18,0.48)",
							}}
						>
							<div
								style={{
									width: 22,
									height: 22,
									borderRadius: 7,
									border: "2px solid rgba(10,5,8,0.18)",
									background: index < activeLine ? "#06C755" : "transparent",
								}}
							/>
							{text}
							{index === activeLine ? (
								<div
									style={{
										width: 2,
										height: 28,
										background: "#171412",
										opacity: caretOpacity,
									}}
								/>
							) : null}
						</div>
					))}
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					right: 70,
					top: 130,
					width: 284,
					height: 472,
					borderRadius: 28,
					background: "linear-gradient(180deg, #F8FAFF, #FFFFFF)",
					boxShadow: "inset 0 0 0 1px rgba(10,5,8,0.08)",
					overflow: "hidden",
				}}
			>
				<div style={{padding: 22, fontFamily: font("ui", "Inter, system-ui, sans-serif")}}>
					<div style={{fontSize: 13, fontWeight: 900, letterSpacing: 1.2, color: "rgba(23,20,18,0.42)"}}>
						FOCUS MODE
					</div>
					<div style={{marginTop: 16, fontSize: 36, fontWeight: 900, color: "#171412"}}>
						24:00
					</div>
					<div style={{marginTop: 26, height: 10, borderRadius: 999, background: "rgba(10,5,8,0.08)"}}>
						<div
							style={{
								width: `${42 + Math.sin(frame * 0.03) * 8}%`,
								height: "100%",
								borderRadius: 999,
								background: "#6E56CF",
							}}
						/>
					</div>
					{["Write", "Review", "Render"].map((label, index) => (
						<div
							key={label}
							style={{
								marginTop: 26,
								height: 48,
								borderRadius: 16,
								background: index === 0 ? "rgba(110,86,207,0.12)" : "rgba(10,5,8,0.045)",
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

const getCursorPosition = ({
	frame,
	textLeft,
	textRight,
	touchYs,
	designW,
	designH,
}: {
	frame: number;
	textLeft: number;
	textRight: number;
	touchYs: number[];
	designW: number;
	designH: number;
}): CursorPoint => {
	const safeRightX = designW - 88;
	const cursorRight = Math.min(textRight + 22, safeRightX);
	const cursorLeft = textLeft - 18;
	const firstStart = notifications[0].absorb;

	if (frame < firstStart) {
		const x = interpolate(
			frame,
			frameRange(10, firstStart),
			[cursorLeft - 54, cursorLeft],
			{
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: easeOutSoft,
			},
		);
		const y = interpolate(
			frame,
			frameRange(10, firstStart),
			[touchYs[0] - 18, touchYs[0]],
			{
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: easeOutSoft,
			},
		);
		return {x, y};
	}

	for (let i = 0; i < notifications.length; i++) {
		const start = notifications[i].absorb;
		const end = start + SWEEP_FRAMES;

		if (frame <= end) {
			const x = interpolate(frame, frameRange(start, end), [cursorLeft, cursorRight], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: easeInFast,
			});
			return {x, y: touchYs[i]};
		}

		const next = notifications[i + 1];
		if (next && frame < next.absorb) {
			const x = interpolate(
				frame,
				frameRange(end, next.absorb),
				[cursorRight, cursorLeft],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: easeInOutSmooth,
				},
			);
			const y = interpolate(
				frame,
				frameRange(end, next.absorb),
				[touchYs[i], touchYs[i + 1]],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: easeInOutSmooth,
				},
			);
			return {x, y};
		}
	}

	const lastEnd = notifications[notifications.length - 1].absorb + SWEEP_FRAMES;
	const x = interpolate(
		frame,
		frameRange(lastEnd, lastEnd + 24),
		[cursorRight, designW * 0.58],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		},
	);
	const y = interpolate(
		frame,
		frameRange(lastEnd, lastEnd + 24),
		[touchYs[touchYs.length - 1], designH * 0.49],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: easeInOutSmooth,
		},
	);

	return {x, y};
};

export const S06Notification: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const designW = VIDEO_WIDTH;
	const designH = VIDEO_HEIGHT;

	const cardW = 344;
	const cardH = 82;
	const textLeft = notifications[0].x * designW + 72;
	const textRight = notifications[0].x * designW + cardW - 26;
	const touchYs = notifications.map((item) => item.y * designH + 67);

	const cursor = getCursorPosition({
		frame,
		textLeft,
		textRight,
		touchYs,
		designW,
		designH,
	});

	const bhX = cursor.x + noise2D("s5-bh-x", 3, frame * 0.014) * 0.65;
	const bhY = cursor.y + noise2D("s5-bh-y", 9, frame * 0.014) * 0.65;

	const bhEnterRaw = spring({
		frame: frame - 8,
		fps,
		config: holeSpring,
	});
	const bhOpacity = interpolate(frame, [8, 18], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: easeOutSoft,
	});

	const activeAbsorb = notifications.find(
		(item) => frame >= item.absorb - 3 && frame <= item.absorb + SWEEP_FRAMES,
	);
	const absorbPulse = activeAbsorb
		? interpolate(
				frame,
				frameRange(
					activeAbsorb.absorb - 3,
					activeAbsorb.absorb + 5,
					activeAbsorb.absorb + 13,
					activeAbsorb.absorb + SWEEP_FRAMES,
				),
				[0, 0.06, -0.045, 0],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: easeInOutSmooth,
				},
			)
		: 0;

	const entryScale = Math.max(0, Math.min(1.1, bhEnterRaw));
	const bhScale = entryScale + absorbPulse;

	const absorbedCount = notifications.filter(
		(n) => frame >= n.absorb + SWEEP_FRAMES,
	).length;

	const lastEnd = notifications[notifications.length - 1].absorb + SWEEP_FRAMES;
	const toastStart = lastEnd + 5;
	const toastEnd = toastStart + 24;
	const showToast = frame >= toastStart && frame < toastEnd + 10;
	const toastOpacity = showToast
		? interpolate(
				frame,
				frameRange(toastStart, toastStart + 8, toastEnd, toastEnd + 10),
				[0, 1, 1, 0],
				{
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: easeInOutSmooth,
				},
			)
		: 0;

	return (
		<AbsoluteFill
			style={{
				background: WARM_CREAM,
				overflow: "hidden",
			}}
		>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(circle at 50% 43%, rgba(118,85,255,0.12), transparent 32%), radial-gradient(circle at 42% 60%, rgba(255,184,84,0.13), transparent 30%), linear-gradient(180deg, #FDF8EF 0%, #F5F0E8 58%, #EEE6DB 100%)",
				}}
			/>

			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage:
						"radial-gradient(circle at 12% 18%, rgba(10,5,8,0.035) 0 1px, transparent 1.6px), radial-gradient(circle at 72% 64%, rgba(10,5,8,0.026) 0 1px, transparent 1.8px)",
					backgroundSize: "38px 38px, 54px 54px",
					opacity: 0.62,
					pointerEvents: "none",
					zIndex: 0,
				}}
			/>

			<WorkBrowserMock frame={frame} />

			{notifications.map((item, index) => (
				<NotificationCard
					key={`${item.app}-${index}`}
					item={item}
					index={index}
					frame={frame}
					fps={fps}
					bhX={bhX}
					bhY={bhY}
					cardW={cardW}
					cardH={cardH}
				/>
			))}

			<BlackHoleCursor
				x={bhX}
				y={bhY}
				scale={bhScale}
				opacity={bhOpacity}
				frame={frame}
			/>

			{showToast && toastOpacity > 0.04 ? (
				<div
					style={{
						position: "absolute",
						right: 84,
						top: 56,
						padding: "14px 20px",
						borderRadius: 999,
						background: "rgba(255,253,248,0.96)",
						border: "1px solid rgba(10,5,8,0.1)",
						boxShadow: "0 18px 46px rgba(50,44,32,0.16)",
						fontFamily: JAPANESE_FONT,
						fontSize: 16,
						fontWeight: 820,
						letterSpacing: -0.2,
						color: "#171412",
						zIndex: 100,
						opacity: toastOpacity,
						transform: `translateY(${interpolate(toastOpacity, [0, 1], [-8, 0], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
							easing: easeOutSoft,
						})}px)`,
					}}
				>
					{absorbedCount}件の通知文を吸い込みました
				</div>
			) : null}

			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(180deg, rgba(255,255,255,0.16), transparent 22%, transparent 74%, rgba(10,5,8,0.04))",
					pointerEvents: "none",
					zIndex: 120,
				}}
			/>
		</AbsoluteFill>
	);
};

export default S06Notification;
