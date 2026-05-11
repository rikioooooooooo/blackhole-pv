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
import {VIDEO_HEIGHT, VIDEO_WIDTH} from "../constants";
import {BlackHole} from "../components/BlackHole";

const clamp = {
	extrapolateLeft: "clamp" as const,
	extrapolateRight: "clamp" as const,
};

const FONTS = {
	japanese: "'Axis Std', sans-serif",
	ui: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};

const pageBg = "#F5F0E8";
const ink = "#15120f";
const bhCore = "#0A0508";
const blue = "#0B64D8";
const paleBlue = "#EAF3FF";
const storyCardWidth = 915;
const headlineMaxWidth = 700;

const easeOutSoft = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOutSmooth = Easing.bezier(0.65, 0, 0.35, 1);
const suckEase = Easing.bezier(0.7, 0, 0.84, 0);

const holeSpring = {
	mass: 0.55,
	damping: 8,
	stiffness: 180,
};

const panelSpring = {
	mass: 1,
	damping: 22,
	stiffness: 120,
};

const strictRange = (values: number[]) => {
	const range: number[] = [];

	for (let i = 0; i < values.length; i++) {
		if (i === 0) {
			range.push(values[i]);
		} else {
			range.push(Math.max(range[i - 1] + 1, values[i]));
		}
	}

	return range;
};

const charAdvance = (char: string, fontSize: number) => {
	if (char === " ") {
		return fontSize * 0.34;
	}

	if (/[A-Za-z0-9]/.test(char)) {
		return fontSize * 0.58;
	}

	if ("、。，．・：:（）()[]【】「」『』“”\"'".includes(char)) {
		return fontSize * 0.48;
	}

	return fontSize * 0.93;
};

const getHeadlineWidth = (text: string, fontSize: number) => {
	const chars = Array.from(text);
	const rawWidth = chars.reduce(
		(sum, char) => sum + charAdvance(char, fontSize),
		0
	);

	return Math.ceil(rawWidth + 36);
};

const getBlackHolePosition = (
	frame: number,
	cardLeft: number,
	cardTop: number
) => {
	const timeline = strictRange([
		0, 8, 16, 22, 38, 46, 48, 62, 70, 72, 86, 94, 96, 110, 118,
		120, 136, 144,
	]);

	const localX = interpolate(
		frame,
		timeline,
		[
			-90, 106, 106, 106, 826, 826, 106, 826, 826, 106, 826, 826,
			106, 826, 826, 106, 826, 1480,
		],
		{...clamp, easing: easeInOutSmooth}
	);

	const localY = interpolate(
		frame,
		timeline,
		[
			190, 190, 190, 190, 190, 298, 298, 298, 406, 406, 406, 514,
			514, 514, 622, 622, 622, 642,
		],
		{...clamp, easing: easeInOutSmooth}
	);

	return {
		x: cardLeft + localX,
		y: cardTop + localY,
	};
};

const PaperTexture: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				opacity: 0.17,
				backgroundImage: `
					radial-gradient(circle at 12% 18%, rgba(20,18,15,0.05) 0 1px, transparent 1px),
					radial-gradient(circle at 78% 44%, rgba(20,18,15,0.04) 0 1px, transparent 1px),
					radial-gradient(circle at 42% 86%, rgba(20,18,15,0.035) 0 1px, transparent 1px)
				`,
				backgroundSize: "34px 34px, 46px 46px, 58px 58px",
			}}
		/>
	);
};

const AbsorbingHeadline: React.FC<{
	text: string;
	x: number;
	y: number;
	fontSize: number;
	passStart: number;
	passEnd: number;
	frame: number;
	bhX: number;
	bhRadius?: number;
	color?: string;
	fontWeight?: React.CSSProperties["fontWeight"];
	letterSpacing?: number;
	zIndex?: number;
	maxWidth?: number;
}> = ({
	text,
	x,
	y,
	fontSize,
	passStart,
	passEnd,
	frame,
	bhX,
	bhRadius = 66,
	color = ink,
	fontWeight = 850,
	letterSpacing = -1,
	zIndex = 20,
	maxWidth,
}) => {
	const width = getHeadlineWidth(text, fontSize);
	const visualWidth = Math.min(width, maxWidth ?? width);
	const safeEnd = Math.max(passStart + 1, passEnd);
	const charW = fontSize * 1.0;
	const bhDrivenWipe = Math.max(0, Math.min(width, bhX - x + bhRadius));
	const wipeRaw = frame < passStart ? 0 : frame > safeEnd ? width : bhDrivenWipe;
	const snapped = Math.floor(wipeRaw / charW) * charW;
	const wipePx = wipeRaw >= width ? width : snapped;

	const edgeOpacity = interpolate(
		frame,
		strictRange([passStart, safeEnd]),
		[0.72, 0],
		{...clamp, easing: Easing.out(Easing.cubic)}
	);

	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: visualWidth,
				maxWidth: visualWidth,
				height: fontSize * 1.35,
				zIndex,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					width,
					height: fontSize * 1.35,
					clipPath: `inset(0 0 0 ${wipePx}px)`,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						fontFamily: FONTS.japanese,
						fontSize,
						fontWeight,
						letterSpacing,
						lineHeight: 1.08,
						color,
						whiteSpace: "nowrap",
						fontVariantLigatures: "none",
						maxWidth: visualWidth,
						overflow: "hidden",
						textOverflow: "clip",
					}}
				>
					{text}
				</div>
			</div>

			{frame >= passStart && frame <= safeEnd ? (
				<div
					style={{
						position: "absolute",
						left: wipePx - 4,
						top: 4,
						width: 10,
						height: fontSize * 1.1,
						borderRadius: 999,
						background:
							"linear-gradient(180deg, rgba(109,69,255,0), rgba(109,69,255,0.34), rgba(255,177,95,0.22), rgba(109,69,255,0))",
						opacity: edgeOpacity,
						pointerEvents: "none",
					}}
				/>
			) : null}
		</div>
	);
};

const PickerAvatars: React.FC<{
	left: number;
	top: number;
	count: string;
}> = ({left, top, count}) => {
	return (
		<div
			style={{
				position: "absolute",
				left,
				top,
				height: 28,
				display: "flex",
				alignItems: "center",
				zIndex: 12,
			}}
		>
			{[0, 1, 2].map((index) => (
				<div
					key={index}
					style={{
						width: 28,
						height: 28,
						borderRadius: "50%",
						background:
							index === 0 ? blue : index === 1 ? "#1A1E2A" : "#E67E22",
						marginLeft: index === 0 ? 0 : -8,
						boxShadow: "0 0 0 2px #fff",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#fff",
						fontSize: 11,
						fontWeight: 900,
					}}
				>
					{index === 0 ? "P" : ""}
				</div>
			))}
			<div
				style={{
					marginLeft: 10,
					fontFamily: FONTS.ui,
					fontSize: 13,
					fontWeight: 800,
					color: "rgba(24,24,24,0.58)",
				}}
			>
				{count} Picks
			</div>
		</div>
	);
};

const CommentCount: React.FC<{
	right: number;
	top: number;
	count: string;
}> = ({right, top, count}) => {
	return (
		<div
			style={{
				position: "absolute",
				right,
				top,
				height: 30,
				padding: "0 12px",
				borderRadius: 999,
				background: paleBlue,
				display: "flex",
				alignItems: "center",
				gap: 7,
				zIndex: 12,
			}}
		>
			<div
				style={{
					width: 14,
					height: 11,
					borderRadius: 5,
					background: blue,
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
						right: 1,
						bottom: -3,
						width: 6,
						height: 6,
						background: blue,
						transform: "rotate(45deg)",
					}}
				/>
			</div>
			<div
				style={{
					fontFamily: FONTS.ui,
					fontSize: 13,
					fontWeight: 900,
					color: blue,
				}}
			>
				{count}
			</div>
		</div>
	);
};

const StoryShell: React.FC<{
	top: number;
	index: number;
	label: string;
	picks: string;
	comments: string;
	active?: boolean;
}> = ({top, index, label, picks, comments, active = false}) => {
	return (
		<div
			style={{
				position: "absolute",
				left: 66,
				top,
				width: storyCardWidth,
				height: 96,
				borderRadius: 24,
				background: active ? "#FFFFFF" : "rgba(255,255,255,0.9)",
				boxShadow: active
					? "0 16px 44px rgba(17,35,58,0.12), inset 0 0 0 1px rgba(15,31,52,0.08)"
					: "inset 0 0 0 1px rgba(15,31,52,0.07)",
				zIndex: 9,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 22,
					top: 18,
					width: 28,
					height: 28,
					borderRadius: 9,
					background: index === 0 ? blue : "rgba(11,100,216,0.12)",
					color: index === 0 ? "#fff" : blue,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: FONTS.ui,
					fontSize: 14,
					fontWeight: 900,
				}}
			>
				{index + 1}
			</div>
			<div
				style={{
					position: "absolute",
					left: 62,
					top: 20,
					fontFamily: FONTS.ui,
					fontSize: 12,
					fontWeight: 900,
					letterSpacing: 0.8,
					color: blue,
				}}
			>
				{label}
			</div>
			<PickerAvatars left={62} top={58} count={picks} />
			<CommentCount right={24} top={54} count={comments} />
		</div>
	);
};

const ConsistentBlackHole = BlackHole as React.FC<{
	size?: number;
	coreColor?: string;
}>;

export const S8News: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	void Img;
	void staticFile;
	void suckEase;

	const designWidth = VIDEO_WIDTH || width;
	const designHeight = VIDEO_HEIGHT || height;

	const cardLeft = designWidth / 2 - 700;
	const cardTop = designHeight / 2 - 380;

	const {x: bhX, y: bhY} = getBlackHolePosition(frame, cardLeft, cardTop);

	const entrance = spring({
		frame,
		fps,
		config: panelSpring,
	});

	const bhEntrance = spring({
		frame: frame - 8,
		fps,
		config: holeSpring,
	});

	const cardOpacity = interpolate(frame, strictRange([0, 14]), [0, 1], {
		...clamp,
		easing: easeOutSoft,
	});

	const cardScale = 0.965 + entrance * 0.035;
	const cardTranslateX = (1 - entrance) * 34;
	const cardTranslateY = (1 - entrance) * 16;
	const cardRotateY = (1 - entrance) * -3.4;

	const cameraScale = interpolate(
		frame,
		strictRange([0, 40, 96, 146]),
		[0.968, 1, 1.014, 1.022],
		{...clamp, easing: easeInOutSmooth}
	);

	const cameraX = interpolate(frame, strictRange([0, 146]), [10, -12], {
		...clamp,
		easing: easeInOutSmooth,
	});

	const bhOpacity = interpolate(
		frame,
		strictRange([8, 16, 138, 146]),
		[0, 1, 1, 0],
		{...clamp, easing: Easing.out(Easing.cubic)}
	);

	const bhExit = interpolate(frame, strictRange([138, 146]), [1, 0.86], {
		...clamp,
		easing: Easing.in(Easing.cubic),
	});

	const activePassBoost =
		[
			[22, 38],
			[48, 62],
			[72, 86],
			[96, 110],
			[120, 136],
		].some(([start, end]) => frame >= start && frame <= end)
			? 0.045
			: 0;

	const bhScale =
		Math.max(0, bhEntrance) *
		bhExit *
		(1 + Math.sin(frame * 0.12) * 0.012 + activePassBoost);

	const showToast = frame >= 139;
	const localBhX = bhX - cardLeft;
	const bhRadius = 66 * bhScale;

	return (
		<AbsoluteFill
			style={{
				background: pageBg,
				overflow: "hidden",
				fontFamily: FONTS.ui,
			}}
		>
			<AbsoluteFill
				style={{
					background: `
						radial-gradient(circle at 78% 22%, rgba(11,100,216,0.13), transparent 27%),
						radial-gradient(circle at 16% 80%, rgba(109,69,255,0.08), transparent 30%),
						linear-gradient(180deg, rgba(255,255,255,0.52), rgba(245,240,232,0))
					`,
				}}
			/>
			<PaperTexture />

			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `scale(${cameraScale}) translateX(${cameraX}px)`,
					transformOrigin: "50% 50%",
				}}
			>
				<div
					style={{
						position: "absolute",
						left: cardLeft,
						top: cardTop,
						width: 1400,
						height: 760,
						opacity: cardOpacity,
						transform: `perspective(1800px) rotateY(${cardRotateY}deg) translateX(${cardTranslateX}px) translateY(${cardTranslateY}px) scale(${cardScale})`,
						transformOrigin: "50% 50%",
						borderRadius: 38,
						background: "#F7F9FC",
						boxShadow:
							"0 42px 120px rgba(22,34,48,0.16), 0 18px 44px rgba(22,34,48,0.11), inset 0 0 0 1px rgba(20,30,40,0.09)",
						overflow: "hidden",
						zIndex: 5,
					}}
				>
					<div
						style={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(180deg, rgba(255,255,255,0.88), rgba(247,249,252,0.96))",
							zIndex: 1,
						}}
					/>

					<div
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							top: 0,
							height: 82,
							background: "#FFFFFF",
							boxShadow: "inset 0 -1px 0 rgba(20,30,40,0.1)",
							zIndex: 8,
						}}
					>
						<div
							style={{
								position: "absolute",
								left: 58,
								top: 22,
								display: "flex",
								alignItems: "center",
								gap: 14,
							}}
						>
							<div
								style={{
									width: 34,
									height: 34,
									borderRadius: 10,
									background: blue,
									color: "#fff",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontFamily: FONTS.ui,
									fontSize: 22,
									fontWeight: 900,
								}}
							>
								P
							</div>
							<div
								style={{
									fontFamily: FONTS.ui,
									fontSize: 34,
									letterSpacing: -1.2,
									fontWeight: 900,
									color: "#101820",
								}}
							>
								NewsPicks
							</div>
						</div>

						<div
							style={{
								position: "absolute",
								right: 56,
								top: 25,
								height: 34,
								padding: "0 18px",
								borderRadius: 999,
								background: paleBlue,
								color: blue,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontFamily: FONTS.ui,
								fontSize: 13,
								fontWeight: 900,
								letterSpacing: 1.1,
							}}
						>
							TRENDING NOW
						</div>
					</div>

					<div
						style={{
							position: "absolute",
							left: 66,
							top: 104,
							fontFamily: FONTS.japanese,
							fontSize: 22,
							fontWeight: 900,
							letterSpacing: -0.6,
							color: "#101820",
							zIndex: 10,
						}}
					>
						今日の注目ニュース
					</div>

					<StoryShell
						top={142}
						index={0}
						label="BUSINESS"
						picks="324"
						comments="42"
						active
					/>
					<StoryShell
						top={250}
						index={1}
						label="MONEY"
						picks="218"
						comments="31"
					/>
					<StoryShell
						top={358}
						index={2}
						label="WORK"
						picks="196"
						comments="24"
					/>
					<StoryShell top={466} index={3} label="AI" picks="281" comments="52" />
					<StoryShell
						top={574}
						index={4}
						label="LIFE"
						picks="157"
						comments="19"
					/>

					<AbsorbingHeadline
						text="【速報】大手IT企業、突然の大量解雇"
						x={128}
						y={176}
						fontSize={30}
						passStart={22}
						passEnd={38}
						frame={frame}
						bhX={localBhX}
						bhRadius={bhRadius}
						fontWeight={900}
						letterSpacing={-1.2}
						maxWidth={headlineMaxWidth}
					/>

					<AbsorbingHeadline
						text={'年収1000万でも"貧困"の現実'}
						x={128}
						y={284}
						fontSize={27}
						passStart={48}
						passEnd={62}
						frame={frame}
						bhX={localBhX}
						bhRadius={bhRadius}
						fontWeight={850}
						letterSpacing={-1}
						maxWidth={headlineMaxWidth}
					/>

					<AbsorbingHeadline
						text={'Z世代が"静かに辞める"本当の理由'}
						x={128}
						y={392}
						fontSize={27}
						passStart={72}
						passEnd={86}
						frame={frame}
						bhX={localBhX}
						bhRadius={bhRadius}
						fontWeight={850}
						letterSpacing={-1}
						maxWidth={headlineMaxWidth}
					/>

					<AbsorbingHeadline
						text="AIに奪われる仕事ランキング最新版"
						x={128}
						y={500}
						fontSize={27}
						passStart={96}
						passEnd={110}
						frame={frame}
						bhX={localBhX}
						bhRadius={bhRadius}
						fontWeight={850}
						letterSpacing={-1}
						maxWidth={headlineMaxWidth}
					/>

					<AbsorbingHeadline
						text="老後2000万円問題、実は4000万円だった"
						x={128}
						y={608}
						fontSize={27}
						passStart={120}
						passEnd={136}
						frame={frame}
						bhX={localBhX}
						bhRadius={bhRadius}
						fontWeight={850}
						letterSpacing={-1}
						maxWidth={headlineMaxWidth}
					/>

					<div
						style={{
							position: "absolute",
							right: 64,
							top: 126,
							width: 345,
							height: 548,
							borderRadius: 30,
							background: "#FFFFFF",
							boxShadow:
								"0 18px 54px rgba(17,35,58,0.1), inset 0 0 0 1px rgba(15,31,52,0.08)",
							zIndex: 9,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								position: "absolute",
								left: 26,
								top: 26,
								fontFamily: FONTS.ui,
								fontSize: 14,
								fontWeight: 900,
								letterSpacing: 1.2,
								color: blue,
							}}
						>
							PICKER COMMENTS
						</div>

						{[
							"不安を煽る見出しほど、長く残りやすい。",
							"読みたい情報だけ、静かに残せる。",
							"触れた文字だけ消えるのがポイント。",
						].map((comment, index) => (
							<div
								key={comment}
								style={{
									position: "absolute",
									left: 24,
									top: 76 + index * 126,
									width: 297,
									minHeight: 96,
									borderRadius: 22,
									background: index === 1 ? paleBlue : "#F6F8FB",
									padding: "18px 18px 16px",
									boxSizing: "border-box",
									overflow: "hidden",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: 10,
										marginBottom: 12,
									}}
								>
									<div
										style={{
											width: 28,
											height: 28,
											borderRadius: "50%",
											background: index === 1 ? blue : "#1A1E2A",
										}}
									/>
									<div
										style={{
											fontFamily: FONTS.ui,
											fontSize: 13,
											fontWeight: 900,
											color: "#1A1E2A",
										}}
									>
										Picker
									</div>
								</div>
								<div
									style={{
										fontFamily: FONTS.japanese,
										fontSize: 15,
										fontWeight: 700,
										lineHeight: 1.45,
										letterSpacing: -0.25,
										color: "rgba(16,24,32,0.78)",
									}}
								>
									{comment}
								</div>
							</div>
						))}

						<div
							style={{
								position: "absolute",
								left: 24,
								right: 24,
								bottom: 24,
								height: 62,
								borderRadius: 20,
								background: "#101820",
								color: "#fff",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontFamily: FONTS.japanese,
								fontSize: 17,
								fontWeight: 900,
								letterSpacing: -0.35,
							}}
						>
							見出しノイズを選んで消す
						</div>
					</div>

					{showToast ? (
						<div
							style={{
								position: "absolute",
								right: 58,
								top: 92,
								padding: "13px 20px",
								borderRadius: 999,
								background: "#FFFFFF",
								boxShadow:
									"0 14px 36px rgba(20,30,40,0.15), inset 0 0 0 1px rgba(20,30,40,0.1)",
								fontFamily: FONTS.japanese,
								fontSize: 16,
								fontWeight: 900,
								color: "#101820",
								zIndex: 30,
							}}
						>
							5本の見出しを吸い込みました
						</div>
					) : null}
				</div>

				{bhOpacity > 0.02 ? (
					<div
						style={{
							position: "absolute",
							left: bhX,
							top: bhY,
							width: 132,
							height: 132,
							transform: `translate(-50%, -50%) scale(${bhScale})`,
							opacity: bhOpacity,
							zIndex: 40,
							pointerEvents: "none",
						}}
					>
						<ConsistentBlackHole size={132} coreColor={bhCore} />
					</div>
				) : null}
			</div>

			<div
				style={{
					position: "absolute",
					left: 72,
					bottom: 54,
					fontFamily: FONTS.ui,
					fontSize: 14,
					fontWeight: 900,
					letterSpacing: 1.9,
					color: "rgba(30,25,20,0.76)",
				}}
			>
				BLACK HOLE / NEWS
			</div>

			<div
				style={{
					position: "absolute",
					right: 72,
					bottom: 48,
					width: 820,
					fontFamily: FONTS.japanese,
					fontSize: 22,
					fontWeight: 900,
					lineHeight: 1.45,
					letterSpacing: -0.55,
					textAlign: "right",
					color: "rgba(20,17,14,0.9)",
				}}
			>
				ブラックホールが文字の上を通過し、触れたところから静かに消していく。
			</div>
		</AbsoluteFill>
	);
};

export default S8News;
