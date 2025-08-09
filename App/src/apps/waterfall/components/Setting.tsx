import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input, { Select } from '../../../components/Input';
import Tooltip from '../../../components/Tooltip';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faDesktopAlt, faMobile, faPortrait, faTablet } from '@fortawesome/free-solid-svg-icons';
import { faDeskpro } from '@fortawesome/free-brands-svg-icons';
import { useWaterfall } from '../hooks/WaterfallContext';
import { WaterfallSetting } from '../waterfall';
import { BreakpointObject } from '../../../utils/breakpoints';

const breakpointIcons: IconDefinition[] = [faMobile, faPortrait, faTablet, faDeskpro, faDesktopAlt, faDesktopAlt];

export default function Setting({ prop }: { prop: WaterfallSetting }) {
  const { updateWaterfall, waterfallNames } = useWaterfall();

  let type = prop.type || 'string';

  return (
    <div className="flex flex-col gap-10 px-3 py-8 bg-background3 rounded-md">
      <div className="flex flex-row gap-5 justify-between">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <div className="flex flex-row items-center gap-3">
              {prop.icon && <FontAwesomeIcon icon={prop.icon} className="text-primary" />}
              <span>{prop.name}</span>
              <Tooltip content={prop.description} defaultValue={prop.swiperDefault} />
            </div>
            <span className="text-sm text-text3">{prop.attr}</span>
          </div>
        </div>
        {type === 'number' && (
          <Input
            type="number"
            value={prop.value}
            placeholder={prop.swiperDefault}
            onChange={(e) => updateWaterfall(prop.attr, e.target.value)}
          />
        )}
        {type === 'string' && (
          <Input
            type="string"
            value={prop.value}
            placeholder={prop.swiperDefault}
            onChange={(e) => updateWaterfall(prop.attr, e.target.value)}
          />
        )}
        {(type === 'boolean' || type === 'select') && (
          <Select
            type={type}
            value={prop.value || prop.swiperDefault}
            options={prop.options}
            onChange={(e) => updateWaterfall(prop.attr, e.target.value)}
          />
        )}
        {type === 'waterfall' && (
          <Select
            type="select"
            value={prop.value}
            options={['--', ...waterfallNames]}
            onChange={(e) => updateWaterfall(prop.attr, e.target.value)}
          />
        )}
      </div>
      {prop.breakpoints && (
        <div className="flex flex-row gap-3 py-10 w-full overflow-x-scroll border-border2 border-t">
          {Object.entries(prop.breakpoints as BreakpointObject).map(([key, value]) => (
            <div key={key}>
              <div className="flex flex-row gap-3">
                <FontAwesomeIcon icon={breakpointIcons[1]} />
                {key}
              </div>
              {prop.breakpoints && (
                <Input value={value.toString()} onChange={(e) => updateWaterfall(prop.attr, e.target.value, key)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
