import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select } from '../../../components/UI/Select';
import Tooltip from '../../../components/UI/Tooltip';
import { useWaterfall } from '../hooks/WaterfallContext';
import { WaterfallSetting } from '../waterfall';
import { BreakpointObject } from '../../../utils/breakpoints';
import { BreakpointInput } from './BreakpointInput';
import { Input } from '../../../components/UI/Input';
import Card from '../../../components/UI/Card';
import { BooleanSwitch } from '../../../components/UI/BooleanSwitch';

export type SettingSize = 'base' | 'lg' | 'full';

export default function Setting({ prop, size }: { prop: WaterfallSetting; size: SettingSize }) {
  // Setting being used outside of WaterfallContext
  const { updateWaterfall, waterfallNames } = useWaterfall();

  function handleValueChange(value: string, breakpoint?: string) {
    if (prop.onChange) {
      prop.onChange(value);
    } else {
      updateWaterfall(prop.attr, value, breakpoint);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    handleValueChange(e.target.value);
  }

  const renderInput = () => {
    const commonProps = {
      value: prop.value || '',
      placeholder: prop.swiperDefault,
      onChange: handleInputChange,
    };

    switch (prop.type) {
      case 'number':
        return (
          <Input
            type="number"
            inputSize={size}
            {...commonProps}
            {...(prop.onSubmit && { submit: () => prop.onSubmit!(commonProps.value) })}
          />
        );

      case 'string':
        return (
          <Input
            type="text"
            inputSize={size}
            {...commonProps}
            {...(prop.onSubmit && { submit: () => prop.onSubmit!(commonProps.value) })}
          />
        );

      case 'boolean':
        return (
          <BooleanSwitch
            checked={prop.value === 'true'}
            onChange={(e) => handleValueChange(e.target.checked ? 'true' : 'false')}
          />
        );
      case 'select':
        return (
          <Select
            type={prop.type}
            value={prop.value || prop.swiperDefault}
            options={prop.options}
            onChange={handleInputChange}
          />
        );

      case 'waterfall':
        return (
          <Select
            type="select"
            value={prop.value || ''}
            options={['--', ...waterfallNames]}
            onChange={handleInputChange}
          />
        );

      default:
        console.warn(`Unknown setting type: ${prop.type}`);
        return <Input type="text" {...commonProps} />;
    }
  };

  function renderBreakpoints() {
    if (!prop.breakpoints) return null;
    const breakpointEntries = Object.entries(prop.breakpoints as BreakpointObject);
    return (
      <div className="flex flex-row gap-3 py-10 w-full overflow-x-scroll border-border2 border-t">
        {breakpointEntries.map(([breakpoint, value]) => (
          <BreakpointInput
            key={breakpoint}
            breakpoint={breakpoint}
            value={value}
            onChange={(newValue) => handleValueChange(newValue, breakpoint)}
          />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <div className="flex flex-row gap-5 justify-between items-start">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              {prop.icon && <FontAwesomeIcon icon={prop.icon} className="text-primary" />}
              <span>{prop.name}</span>
              <Tooltip content={prop.description} defaultValue={prop.swiperDefault} />
            </div>
          </div>
          <span className="text-sm text-text3">{prop.attr}</span>
        </div>
        {renderInput()}
      </div>
      {renderBreakpoints()}
    </Card>
  );
}
