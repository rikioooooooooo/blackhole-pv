import React, {createContext, useContext} from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";

type PvTimingContextValue = {
	frameScale: number;
};

const PvTimingContext = createContext<PvTimingContextValue>({frameScale: 1});

export const PvTimingProvider: React.FC<{
	frameScale: number;
	children: React.ReactNode;
}> = ({frameScale, children}) => {
	return (
		<PvTimingContext.Provider value={{frameScale}}>
			{children}
		</PvTimingContext.Provider>
	);
};

export const usePvCurrentFrame = () => {
	const frame = useCurrentFrame();
	const {frameScale} = useContext(PvTimingContext);
	return frame / frameScale;
};

export const usePvVideoConfig = () => {
	const config = useVideoConfig();
	const {frameScale} = useContext(PvTimingContext);

	return {
		...config,
		fps: config.fps / frameScale,
		durationInFrames: config.durationInFrames / frameScale,
	};
};
