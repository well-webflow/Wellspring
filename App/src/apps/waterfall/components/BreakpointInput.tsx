import { Input } from '../../../components/UI/Input';

interface BreakpointInputProps {
  breakpoint: string;
  value: string | number;
  onChange: (value: string) => void;
}
export function BreakpointInput({ breakpoint, value, onChange }: BreakpointInputProps) {
  return (
    <div className="flex-shrink-0 min-w-0">
      <div className="flex flex-row items-center gap-2 mb-2">
        <span className="text-sm font-medium capitalize">{breakpoint}</span>
      </div>
      <Input value={value.toString()} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
