import clsx from 'clsx';
import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from './Button';
import { BaseInput, InputSize } from './BaseInput';

const BASE_INPUT_CLASSES = 'text-action-primary-text w-full h-full outline-none';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  classNames?: string;
}

interface InputWithButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  classNames?: string;
  buttonText: string;
  onButtonClick: () => void;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;
  buttonClassNames?: string;
}

export function Input({ inputSize = 'base', classNames, ...props }: InputProps) {
  const input = twMerge(clsx(BASE_INPUT_CLASSES));

  return (
    <BaseInput size={inputSize}>
      <input {...props} className={input} />
    </BaseInput>
  );
}

export function InputWithButton({
  inputSize = 'base',
  classNames,
  buttonText,
  onButtonClick,
  buttonProps,
  buttonClassNames,
  ...props
}: InputWithButtonProps) {
  const input = twMerge(clsx(BASE_INPUT_CLASSES));

  return (
    <BaseInput size={inputSize}>
      <input {...props} className={input} />
      <Button size="sm" fillHeight onClick={onButtonClick}>
        {buttonText}
      </Button>
    </BaseInput>
  );
}
