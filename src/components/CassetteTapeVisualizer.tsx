import React from 'react';

interface CassetteTapeVisualizerProps {
  isPlaying: boolean;
  trackTitle?: string;
  artistName?: string;
  tapeLabel?: string;
}

export const CassetteTapeVisualizer: React.FC<CassetteTapeVisualizerProps> = ({
  isPlaying,
  trackTitle = 'Lofi Study Beats',
  artistName = 'Xuan Hieu Chill Radio',
  tapeLabel = 'SIDE A • 90 MIN CHILL',
}) => {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto bg-[#1a1829] border-2 border-[#0d0c17] rounded-sm p-2 shadow-[3px_3px_0px_#000] select-none">
      {/* Top Screws */}
      <div className="flex justify-between items-center px-1 mb-1 text-[8px] text-[#4b4668] font-mono">
        <span>✚</span>
        <span className="text-[9px] font-pixel text-[#ea76cb] tracking-wider uppercase">
          TYPE I • NORMAL BIAS
        </span>
        <span>✚</span>
      </div>

      {/* Cassette Label Sticker */}
      <div className="relative bg-[#f5c2e7] border-2 border-[#201e33] p-1.5 rounded-xs text-[#1e1c2b]">
        {/* Label Header */}
        <div className="flex items-center justify-between border-b border-[#201e33]/30 pb-0.5 mb-1 text-[9px] font-retro">
          <span className="font-bold flex items-center gap-1 text-[#d20f39]">
            <span>🌸</span> {tapeLabel}
          </span>
          <span className="text-[8px] font-mono text-[#5c5f77]">STEREO HQ</span>
        </div>

        {/* Dynamic Track Name on Cassette Label */}
        <div className="px-1 py-0.5 bg-[#ffffff88] border border-[#201e33]/40 rounded-xs mb-1.5 overflow-hidden text-center">
          <div className="text-[10px] font-retro font-bold text-[#1e1c2b] truncate">
            {trackTitle}
          </div>
          <div className="text-[8px] font-pixel text-[#5c5f77] truncate">
            by {artistName}
          </div>
        </div>

        {/* Central Tape Reel Window */}
        <div className="relative bg-[#0d0c17] border-2 border-[#201e33] rounded-xs p-1.5 flex items-center justify-between overflow-hidden shadow-inner h-14">
          {/* Left Spool Reel */}
          <div className="relative flex items-center justify-center w-11 h-11 bg-[#181622] rounded-full border-2 border-[#4b4668]">
            {/* Spinning Wheel Teeth */}
            <div
              className={`w-8 h-8 rounded-full border-2 border-dashed border-[#f2cdcd] flex items-center justify-center transition-transform duration-500 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              <div className="w-3.5 h-3.5 bg-[#f5c2e7] rounded-full border border-[#0d0c17] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#0d0c17] rounded-full"></div>
              </div>
            </div>
            {/* Spool Teeth Accents */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[7px] text-[#f2cdcd] font-mono">✦</span>
            </div>
          </div>

          {/* Magnetic Ribbon Bridge & Level Indicator */}
          <div className="flex-1 px-2 flex flex-col items-center justify-center">
            {/* Reel Bridge window */}
            <div className="w-full h-3 bg-[#1e1c2b] border border-[#4b4668] rounded-xs relative flex items-center justify-center overflow-hidden">
              {/* Tape ribbon passing through */}
              <div
                className={`w-full h-1 bg-[#8839ef] opacity-80 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
              ></div>
              {/* Center Tape Level Ruler */}
              <div className="absolute inset-0 flex items-center justify-around text-[6px] font-mono text-[#a6adc8]">
                <span>100</span>
                <span>50</span>
                <span>0</span>
              </div>
            </div>

            {/* Retro Tape Counter */}
            <div className="mt-1 px-1.5 py-0.2 bg-[#000] border border-[#313244] text-[8px] font-mono text-[#a6e3a1]">
              {isPlaying ? 'TAPE RUN ▶' : 'TAPE STOP ■'}
            </div>
          </div>

          {/* Right Spool Reel */}
          <div className="relative flex items-center justify-center w-11 h-11 bg-[#181622] rounded-full border-2 border-[#4b4668]">
            {/* Spinning Wheel Teeth */}
            <div
              className={`w-8 h-8 rounded-full border-2 border-dashed border-[#f2cdcd] flex items-center justify-center transition-transform duration-500 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '3s' }}
            >
              <div className="w-3.5 h-3.5 bg-[#f5c2e7] rounded-full border border-[#0d0c17] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#0d0c17] rounded-full"></div>
              </div>
            </div>
            {/* Spool Teeth Accents */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[7px] text-[#f2cdcd] font-mono">✦</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tape Guide Holes & Screws */}
      <div className="mt-1.5 pt-1 border-t border-[#201e33] flex justify-between items-center px-2 text-[8px] text-[#4b4668]">
        <span>✚</span>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#0d0c17] rounded-full border border-[#313244]"></div>
          <div className="w-4 h-1.5 bg-[#0d0c17] rounded-xs border border-[#313244]"></div>
          <div className="w-2.5 h-2.5 bg-[#0d0c17] rounded-full border border-[#313244]"></div>
        </div>
        <span>✚</span>
      </div>
    </div>
  );
};
