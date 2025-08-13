import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select } from '../../../components/UI/Select';
import Tooltip from '../../../components/UI/Tooltip';
import { useWaterfall } from '../hooks/WaterfallContext';
import { WaterfallSetting } from '../waterfall';
import { BreakpointObject } from '../../../utils/breakpoints';
import { GenericSetting } from './UI/GenericSetting';
import { BreakpointInput } from './BreakpointInput';
import { Input } from '../../../components/UI/Input';

export default function Setting({ prop }: { prop: WaterfallSetting }) {
  const { updateWaterfall, waterfallNames } = useWaterfall();

  function handleValueChange(value: string, breakpoint?: string) {
    updateWaterfall(prop.attr, value, breakpoint);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    handleValueChange(e.target.value);
  }

  let header = (
    <div className="flex flex-row items-center gap-3">
      {prop.icon && <FontAwesomeIcon icon={prop.icon} className="text-primary" />}
      <span>{prop.name}</span>
      <Tooltip content={prop.description} defaultValue={prop.swiperDefault} />
    </div>
  );

  const renderInput = () => {
    const commonProps = {
      value: prop.value || '',
      placeholder: prop.swiperDefault,
      onChange: handleInputChange,
    };

    switch (prop.type) {
      case 'number':
        return <Input type="number" {...commonProps} />;

      case 'string':
        return <Input type="text" {...commonProps} />;

      case 'boolean':
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
    <GenericSetting
      header={header}
      description={prop.attr}
      input={renderInput()}
      content={renderBreakpoints()}
    ></GenericSetting>
  );
}
