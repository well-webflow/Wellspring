import { useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface FormFieldBaseProps {
  autoSize?: boolean;
  maxWidth?: number;
  className?: string;
  height?: 'sm' | 'md' | 'lg';
}

export interface AutoSizeConfig {
  enabled: boolean;
  maxWidth?: number;
  currentValue: string;
  extraSpace?: number;
}

/**
 * Hook to measure text width for auto-sizing
 */
export function useAutoSize(config: AutoSizeConfig) {
  const [width, setWidth] = useState<number>(60); // Start with minimum width
  const measureRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!config.enabled) return;

    // Use a small delay to ensure DOM is ready
    const measureWidth = () => {
      if (measureRef.current) {
        // Measure the width of the current value
        measureRef.current.textContent = config.currentValue || ' ';

        // If targetRef is available, copy its computed styles
        if (targetRef.current) {
          const computedStyle = window.getComputedStyle(targetRef.current);
          measureRef.current.style.fontFamily = computedStyle.fontFamily;
          measureRef.current.style.fontSize = computedStyle.fontSize;
          measureRef.current.style.fontWeight = computedStyle.fontWeight;
          measureRef.current.style.letterSpacing = computedStyle.letterSpacing;
        }

        // Force layout recalculation
        const measuredWidth = measureRef.current.getBoundingClientRect().width;

        // Add extra space (padding, borders, etc.)
        const extraSpace = config.extraSpace || 40;
        const calculatedWidth = Math.max(60, measuredWidth + extraSpace); // Minimum 60px

        // Apply max width if specified
        const finalWidth = config.maxWidth ? Math.min(calculatedWidth, config.maxWidth) : calculatedWidth;

        setWidth(Math.ceil(finalWidth));
      }
    };

    measureWidth();
  }, [config.enabled, config.currentValue, config.maxWidth, config.extraSpace]);

  return { width, measureRef, targetRef };
}

/**
 * Get container classes for form fields
 */
export function getFormFieldClasses(
  baseClasses: string,
  autoSize: boolean,
  height: 'sm' | 'md' | 'lg' = 'md',
  className?: string
): string {
  const heightClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  };

  return twMerge(
    clsx(
      'border-2 border-border1 rounded-xs overflow-hidden',
      heightClasses[height],
      baseClasses,
      className
    )
  );
}

/**
 * Render the invisible measuring span for auto-sizing
 */
export function MeasuringSpan({ measureRef }: { measureRef: React.RefObject<HTMLSpanElement> }) {
  return (
    <span
      ref={measureRef}
      className="invisible absolute pointer-events-none"
      style={{ whiteSpace: 'pre', left: '-9999px' }}
      aria-hidden="true"
    />
  );
}
