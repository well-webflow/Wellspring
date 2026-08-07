import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select } from '../../../components/UI/Select';
import Tooltip from '../../../components/UI/Tooltip';
import { WaterfallSetting } from '../waterfall';
import { BreakpointObject, breakpointConfigs, Breakpoints } from '../../../utils/breakpoints';
import { Input } from '../../../components/UI/Input';
import Card from '../../../components/UI/Card';
import { BooleanSwitch } from '../../../components/UI/BooleanSwitch';

export type SettingSize = 'base' | 'lg' | 'full';

interface SettingProps {
  prop: WaterfallSetting;
  size?: SettingSize;
  update: (attr: string, value: string, breakpoint?: string) => void;
}

export default function Setting({ prop, size, update }: SettingProps) {
  function handleValueChange(value: string, breakpoint?: string) {
    if (prop.onChange) {
      prop.onChange(value);
    } else {
      update(prop.attr, value, breakpoint);
    }
  }

  const renderInputControl = (value: string, breakpoint?: string) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      handleValueChange(e.target.value, breakpoint);

    const commonProps = {
      value: value || '',
      placeholder: prop.swiperDefault,
      onChange,
    };

    const wrapperClass = breakpoint ? 'w-full min-w-[200px]' : 'w-full min-w-[200px] flex justify-end';

    switch (prop.type) {
      case 'number':
        return (
          <div className={wrapperClass}>
            <Input
              type="number"
              inputSize={size}
              {...commonProps}
              {...(!breakpoint && prop.onSubmit && { submit: () => prop.onSubmit!(commonProps.value) })}
            />
          </div>
        );

      case 'string':
        return (
          <div className={wrapperClass}>
            <Input
              type="text"
              inputSize={size}
              {...commonProps}
              {...(!breakpoint && prop.onSubmit && { submit: () => prop.onSubmit!(commonProps.value) })}
            />
          </div>
        );

      case 'boolean':
        return (
          <div className={wrapperClass}>
            <BooleanSwitch
              checked={value === 'true'}
              onChange={(e) => handleValueChange(e.target.checked ? 'true' : 'false', breakpoint)}
            />
          </div>
        );

      case 'select':
        return (
          <div className={wrapperClass}>
            <Select type={prop.type} value={value || prop.swiperDefault} options={prop.options} onChange={onChange} />
          </div>
        );

      case 'instance':
        return (
          <div className={wrapperClass}>
            <Select
              type="select"
              value={value || ''}
              options={['--', ...(prop.instanceNames || [])]}
              onChange={onChange}
            />
          </div>
        );

      default:
        if (!breakpoint) {
          console.warn(`Unknown setting type: ${prop.type}`);
        }
        return (
          <div className={wrapperClass}>
            <Input type="text" {...commonProps} />
          </div>
        );
    }
  };

  const renderInput = () => {
    return renderInputControl(prop.value || '');
  };

  function renderBreakpoints() {
    if (!prop.breakpoints) return null;
    const breakpointEntries = Object.entries(prop.breakpoints as BreakpointObject);
    return (
      <div className="flex flex-row gap-2 mt-3 py-5 w-full overflow-x-scroll border-border2 border-t">
        {breakpointEntries.map(([breakpoint, value]) => {
          const config = breakpointConfigs[breakpoint as Breakpoints];
          return (
            <div className="shrink-0 min-w-0" key={breakpoint}>
              <div className="flex flex-row items-center gap-1 mb-2">
                <img src={config.icon} alt={config.displayName} className="w-4 h-4 brightness-0 invert" />
                <div className="w-full flex flex-row items-center justify-between gap-1 pr-2">
                  <span className="text-sm font-medium">{config.displayName}</span>
                  <span className="text-xs text-gray-300">{config.size}</span>
                </div>
              </div>
              {renderInputControl(value.toString(), breakpoint)}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <div className="flex flex-row gap-5 justify-between items-center">
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              {prop.icon && <FontAwesomeIcon icon={prop.icon} className="text-primary" />}
              <span>{prop.name}</span>
              <Tooltip content={prop.description} attrName={prop.attr} defaultValue={prop.swiperDefault} />
            </div>
          </div>
        </div>
        {renderInput()}
      </div>
      {renderBreakpoints()}
    </Card>
  );
}
