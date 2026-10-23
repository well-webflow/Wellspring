import { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import { FormFieldBaseProps, useAutoSize, getFormFieldClasses, MeasuringSpan } from './FormFieldBase';

export function Select({
  type,
  options,
  value,
  autoSize = false,
  maxWidth,
  height = 'md',
  className,
  ...props
}: SelectProps) {
  // Get the display value - either the controlled value or the first option
  const displayValue = value !== undefined ? String(value) : (options?.[0] || '');

  const { width, measureRef, targetRef } = useAutoSize({
    enabled: autoSize,
    maxWidth,
    currentValue: displayValue,
    extraSpace: 40, // padding + border + dropdown arrow
  });

  const containerClasses = getFormFieldClasses(
    clsx({
      'w-55': !autoSize,
    }),
    autoSize,
    height,
    className
  );

  const containerStyle = autoSize ? { width: `${width}px` } : undefined;

  return (
    <div className={containerClasses} style={containerStyle}>
      <select
        ref={targetRef as React.RefObject<HTMLSelectElement>}
        className="bg-background1 text-action-primary-text rounded-xs w-full h-full px-1"
        value={value}
        {...props}
      >
        {type === 'boolean' && (
          <>
            <option value="true">true</option>
            <option value="false">false</option>
          </>
        )}
        {type === 'select' &&
          options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
      </select>
      <MeasuringSpan measureRef={measureRef} />
    </div>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FormFieldBaseProps {
  type: 'boolean' | 'select';
  options: string[] | undefined;
}
