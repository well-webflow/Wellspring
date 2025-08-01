import { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function Input({ ...props }: InputProps) {
  return (
    <div className="border-2 border-border1 w-[220px] h-8 rounded-xs overflow-hidden">
      <input className="bg-background1 text-action-primary-text w-full h-full pl-1" {...props} />
    </div>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  type: 'boolean' | 'select';
  options: string[] | undefined;
}

export function Select({ type, options, value, ...props }: SelectProps) {
  return (
    <div className="border-2 border-border1 w-[220px] h-8 rounded-xs overflow-hidden">
      <select className="bg-background1 text-action-primary-text rounded-xs w-full h-full" value={value} {...props}>
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
    </div>
  );
}
