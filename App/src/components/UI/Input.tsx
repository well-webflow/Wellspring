import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from './Button';
import { BaseInput, InputSize } from './BaseInput';

const BASE_INPUT_CLASSES = 'text-action-primary-text w-full h-full outline-none';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  classNames?: string;
  submit?: () => void;
}

export function Input({ submit, inputSize = 'base', classNames, ...props }: InputProps) {
  const input = twMerge(clsx(BASE_INPUT_CLASSES));

  return (
    <BaseInput size={inputSize}>
      <input {...props} className={input} />
      {submit && (
        <Button size="sm" fillHeight onClick={submit}>
          Submit
        </Button>
      )}
    </BaseInput>
  );
}
