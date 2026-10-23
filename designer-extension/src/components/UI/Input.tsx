import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from './Button';
import { SettingSize } from '../../apps/waterfall/components/Setting';
import { FormFieldBaseProps, useAutoSize, getFormFieldClasses, MeasuringSpan } from './FormFieldBase';

// FormFieldBaseProps.height is a size token, so drop the native numeric height attribute
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'height'>, FormFieldBaseProps {
  inputSize?: SettingSize;
  classNames?: string;
  submit?: () => void;
}

export function Input({
  submit,
  inputSize = 'base',
  classNames,
  autoSize = false,
  maxWidth,
  height = 'md',
  className,
  value,
  ...props
}: InputProps) {
  const { width, measureRef, targetRef } = useAutoSize({
    enabled: autoSize,
    maxWidth,
    currentValue: String(value || ''),
    extraSpace: 40, // padding + border
  });

  const sizeClasses = {
    base: 'w-[220px]',
    lg: 'w-[330px]',
    full: 'flex-1',
  };

  const containerClasses = twMerge(
    clsx(
      'bg-background1 flex shrink-0 focus-within:border-primary pl-2 pr-1 py-1',
      {
        [sizeClasses[inputSize]]: !autoSize,
      },
      classNames,
      className
    )
  );

  const formFieldClasses = getFormFieldClasses(containerClasses, autoSize, height);
  const containerStyle = autoSize ? { width: `${width}px` } : undefined;

  return (
    <div className={formFieldClasses} style={containerStyle}>
      <input
        ref={targetRef as React.RefObject<HTMLInputElement>}
        value={value}
        {...props}
        className="text-action-primary-text w-full h-full outline-none bg-transparent"
      />
      {submit && (
        <Button size="sm" fillHeight onClick={submit}>
          Submit
        </Button>
      )}
      <MeasuringSpan measureRef={measureRef} />
    </div>
  );
}
