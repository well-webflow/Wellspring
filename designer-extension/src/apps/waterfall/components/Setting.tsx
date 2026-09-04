import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select } from '../../../components/UI/Select';
import Tooltip from '../../../components/UI/Tooltip';
import { WaterfallSetting } from '../waterfall';
import { Input } from '../../../components/UI/Input';
import Card from '../../../components/UI/Card';
import { BooleanSwitch } from '../../../components/UI/BooleanSwitch';
import { useWaterfall } from '../hooks/WaterfallContext';
import { getCascadedBreakpointValue, isBreakpointOverridden } from '../lib/breakpointHelpers';
import clsx from 'clsx';
import { faBan } from '@fortawesome/free-solid-svg-icons';

export type SettingSize = 'base' | 'lg' | 'full';

interface SettingProps {
  prop: WaterfallSetting;
  size?: SettingSize;
  update: (attr: string, value: string, breakpoint?: string) => void;
}

export default function Setting({ prop, size, update }: SettingProps) {
  const { activeBreakpoint } = useWaterfall();

  // Determine if this setting supports breakpoints
  const supportsBreakpoints = !!prop.breakpoints;

  // Get the actual value for the current breakpoint (what's actually stored)
  const actualValue = activeBreakpoint && prop.breakpoints
    ? prop.breakpoints[activeBreakpoint] || ''
    : prop.value;

  // Get the cascaded value (for display when no actual value exists)
  const cascadedValue = activeBreakpoint
    ? getCascadedBreakpointValue(prop.breakpoints, activeBreakpoint, prop.value)
    : prop.value;

  // Check if this breakpoint value is overridden
  const isOverridden = isBreakpointOverridden(prop.breakpoints, activeBreakpoint);

  // Is the setting disabled (when on a breakpoint but setting doesn't support breakpoints)
  const isDisabled = activeBreakpoint !== null && !supportsBreakpoints;

  function handleValueChange(value: string) {
    if (prop.onChange) {
      prop.onChange(value);
    } else {
      // Pass the active breakpoint to update if we're on a breakpoint and it supports it
      const breakpointParam = activeBreakpoint && supportsBreakpoints ? activeBreakpoint : undefined;
      update(prop.attr, value, breakpointParam);
    }
  }

  const renderInputControl = () => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      handleValueChange(e.target.value);

    // For inputs: use actual value, show cascaded as placeholder
    const inputValue = actualValue;
    const inputPlaceholder = actualValue ? prop.swiperDefault : (cascadedValue || prop.swiperDefault);

    // For selects/booleans: use cascaded value for display
    const displayValue = cascadedValue || prop.swiperDefault;

    const wrapperClass = 'w-full min-w-[200px] flex justify-end';

    switch (prop.type) {
      case 'number':
        return (
          <div className={wrapperClass}>
            <Input
              type="number"
              inputSize={size}
              value={inputValue}
              placeholder={inputPlaceholder}
              onChange={onChange}
              disabled={isDisabled}
              {...(!activeBreakpoint && prop.onSubmit && { submit: () => prop.onSubmit!(inputValue) })}
            />
          </div>
        );

      case 'string':
        return (
          <div className={wrapperClass}>
            <Input
              type="text"
              inputSize={size}
              value={inputValue}
              placeholder={inputPlaceholder}
              onChange={onChange}
              disabled={isDisabled}
              {...(!activeBreakpoint && prop.onSubmit && { submit: () => prop.onSubmit!(inputValue) })}
            />
          </div>
        );

      case 'boolean':
        return (
          <div className={wrapperClass}>
            <BooleanSwitch
              checked={(displayValue) === 'true'}
              onChange={(e) => handleValueChange(e.target.checked ? 'true' : 'false')}
              disabled={isDisabled}
            />
          </div>
        );

      case 'select':
        return (
          <div className={wrapperClass}>
            <Select
              type={prop.type}
              value={displayValue}
              options={prop.options}
              onChange={onChange}
              disabled={isDisabled}
            />
          </div>
        );

      case 'instance':
        return (
          <div className={wrapperClass}>
            <Select
              type="select"
              value={displayValue}
              options={['--', ...(prop.instanceNames || [])]}
              onChange={onChange}
              disabled={isDisabled}
            />
          </div>
        );

      default:
        console.warn(`Unknown setting type: ${prop.type}`);
        return (
          <div className={wrapperClass}>
            <Input
              type="text"
              value={inputValue}
              placeholder={inputPlaceholder}
              onChange={onChange}
              disabled={isDisabled}
            />
          </div>
        );
    }
  };

  return (
    <Card
      className={clsx(
        'border border-transparent',
        isOverridden && 'bg-blue-500/10 !border-blue-500/30'
      )}
      disabled={isDisabled}
      title={isDisabled ? 'This setting cannot be edited per breakpoint' : undefined}
    >
      <div className="flex flex-row gap-5 justify-between items-center">
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              {prop.icon && <FontAwesomeIcon icon={prop.icon} className="text-primary" />}
              <span>{prop.name}</span>
              {isDisabled && (
                <div className="flex items-center gap-1 text-text2 text-xs">
                  <FontAwesomeIcon icon={faBan} />
                </div>
              )}
              {!isDisabled && <Tooltip content={prop.description} attrName={prop.attr} defaultValue={prop.swiperDefault} />}
            </div>
          </div>
        </div>
        {renderInputControl()}
      </div>
    </Card>
  );
}
