import { SelectHTMLAttributes } from 'react';

export function Select({ type, options, value, ...props }: SelectProps) {
  return (
    <div className="border-2 border-border1 w-[220px] h-11 rounded-xs overflow-hidden">
      <select
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
    </div>
  );
}
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  type: 'boolean' | 'select';
  options: string[] | undefined;
}
