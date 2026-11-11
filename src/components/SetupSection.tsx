import React, { useEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import { defaultSetup, getSetupIcon } from '../data/setup';
import { proxiedImageUrl } from '../lib/media';

interface SetupSectionProps {
  onToast?: (msg: string) => void;
}

const IMAGE_ASPECT = 1449 / 1086;
const DESIGN_ASPECT = 16 / 9;

// Hotspot coordinates are tuned against the desktop (16:9) crop. Convert them
// into image space first, then back into the current container so the markers
// stay attached to the gear at every responsive aspect ratio.
const toImageSpace = (spot: { x: number; y: number }) => ({
  x: spot.x / 100,
  y: (spot.y / 100 - 0.5) / (DESIGN_ASPECT / IMAGE_ASPECT) + 0.5,
});

const toContainerSpace = (
  spot: { x: number; y: number },
  size: { width: number; height: number }
) => {
  const image = toImageSpace(spot);
  if (!size.width || !size.height) {
    return { left: `${spot.x}%`, top: `${spot.y}%` };
  }

  const containerAspect = size.width / size.height;
  if (containerAspect > IMAGE_ASPECT) {
    const factor = containerAspect / IMAGE_ASPECT;
    return {
      left: `${image.x * 100}%`,
      top: `${(factor * (image.y - 0.5) + 0.5) * 100}%`,
    };
  }

  const factor = IMAGE_ASPECT / containerAspect;
  return {
    left: `${(factor * (image.x - 0.5) + 0.5) * 100}%`,
    top: `${image.y * 100}%`,
  };
};

export const SetupSection: React.FC<SetupSectionProps> = () => {
  const { isDark } = useTheme();
  const { setup } = useContent();
  const activeSetup = setup ?? defaultSetup;
  const [activeId, setActiveId] = useState<string | null>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [mediaSize, setMediaSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = mediaRef.current;
    if (!element) return;

    const updateSize = () => {
      setMediaSize({ width: element.clientWidth, height: element.clientHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="setup"
      className={`py-16 sm:py-24 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#07080a] text-white border-t border-white/5' : 'bg-white text-neutral-900 border-t border-neutral-200'
        }`}
    >
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-[#FFBE0D]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${isDark
                  ? 'bg-[#FFBE0D]/10 border-[#FFBE0D]/30 text-[#FFBE0D]'
                  : 'bg-orange-50 border-orange-300 text-orange-900'
                }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Battle Station</span>
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-neutral-950'}`}>
            Interactive Setup
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Hover over the icons to preview each piece of gear.
          </p>
        </div>

        <div
          className={`relative rounded-[1.5rem] sm:rounded-[2rem] border overflow-hidden ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
            }`}
        >
          <div ref={mediaRef} className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] w-full">
            <img
              src={proxiedImageUrl(activeSetup.backgroundImage) || defaultSetup.backgroundImage}
              alt="Snnsei's GM7 battle station"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

            {activeSetup.items.map((item) => {
              const isActive = activeId === item.id;
              const Icon = getSetupIcon(item.icon);
              const tooltipAlign =
                item.hotspot.x > 68
                  ? 'left-auto right-0'
                  : item.hotspot.x < 32
                  ? 'left-0'
                  : 'left-1/2 -translate-x-1/2';
              const position = toContainerSpace(item.hotspot, mediaSize);
              return (
                <div
                  key={item.id}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  style={position}
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <button
                    type="button"
                    className={`relative transition-transform duration-150 ${isActive ? 'scale-110' : 'scale-100 hover:scale-110'
                      }`}
                    aria-label={`View ${item.name}`}
                  >
                    <span
                      className={`absolute -inset-2 rounded-full transition-opacity duration-150 ${isActive ? 'opacity-40' : 'opacity-0'
                        }`}
                      style={{ background: 'radial-gradient(circle, rgba(255,190,13,0.9) 0%, transparent 70%)' }}
                    />
                    <div
                      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-150 ${isActive
                          ? 'bg-[#FFBE0D] border-white shadow-[0_0_18px_rgba(255,190,13,0.9)]'
                          : 'bg-black/85 border-white/80 hover:bg-[#FFBE0D] hover:border-white'
                        }`}
                    >
                      <Icon className={`w-4 h-4 transition-colors duration-150 ${isActive ? 'text-black' : 'text-white hover:text-black'}`} />
                    </div>
                  </button>

                  <div
                    className={`absolute bottom-full mb-2.5 w-[176px] sm:w-[220px] transition-all duration-150 ${tooltipAlign} ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none'
                      }`}
                  >
                    <div
                      className={`rounded-xl border overflow-hidden backdrop-blur-md shadow-xl ${isDark ? 'bg-neutral-950/98 border-[#FFBE0D]/40' : 'bg-white/98 border-orange-300'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 p-2.5">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg ${
                            isDark ? 'bg-[#FFBE0D]/15 text-[#FFBE0D]' : 'bg-orange-50 text-orange-700'
                          }`}
                        >
                          {item.image ? (
                            <img src={proxiedImageUrl(item.image)} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-neutral-950'}`}>{item.name}</p>
                          <p className={`text-[10px] truncate ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{item.spec}</p>
                          <span className={`text-[9px] font-mono uppercase tracking-[0.25em] ${isDark ? 'text-[#FFBE0D]' : 'text-orange-700'}`}>
                            {item.category}
                          </span>
                        </div>
                      </div                    >
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
