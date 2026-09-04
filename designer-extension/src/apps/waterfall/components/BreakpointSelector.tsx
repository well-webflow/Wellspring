import { breakpointConfigs, websiteBreakpoints } from '../../../utils/breakpoints';
import { useWaterfall } from '../hooks/WaterfallContext';
import clsx from 'clsx';

export default function BreakpointSelector() {
  const { activeBreakpoint, setActiveBreakpoint } = useWaterfall();

  return (
    <div className="flex gap-1">
      {/* Base (No breakpoint) button */}
      <button
        onClick={() => setActiveBreakpoint(null)}
        className={clsx(
          'px-1 py-1 rounded text-sm font-medium transition-colors flex items-center gap-2',
          activeBreakpoint === null ? 'bg-action-primary-background text-white' : 'bg-bg2 text-text1 hover:bg-bg3'
        )}
        title="Base (All Breakpoints)"
      >
        <span className="text-xs">ALL</span>
      </button>

      {/* Breakpoint buttons */}
      {websiteBreakpoints.map((breakpoint) => {
        const config = breakpointConfigs[breakpoint];
        const isActive = activeBreakpoint === breakpoint;

        return (
          <button
            key={breakpoint}
            onClick={() => setActiveBreakpoint(breakpoint)}
            className={clsx(
              'px-1 py-1 rounded text-sm font-medium transition-colors flex items-center justify-center',
              isActive ? 'bg-action-primary-background text-white' : 'bg-bg2 text-text1 hover:bg-bg3'
            )}
            title={`${config.displayName} - ${config.size}`}
          >
            <img
              src={config.icon}
              alt={config.displayName}
              className={clsx('w-4 h-4', isActive ? 'brightness-0 invert' : 'brightness-0 invert opacity-60')}
            />
          </button>
        );
      })}
    </div>
  );
}
