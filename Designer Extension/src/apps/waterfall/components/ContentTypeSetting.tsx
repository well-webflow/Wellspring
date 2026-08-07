import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../../../components/UI/Card';
import { WaterfallContentType } from '../waterfall';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import Tooltip from '../../../components/UI/Tooltip';

interface ContentTypeSettingProps {
  value: WaterfallContentType;
  onChange: (value: WaterfallContentType) => void;
}

export default function ContentTypeSetting({ value, onChange }: ContentTypeSettingProps) {
  return (
    <Card size="sm">
      <div className="flex flex-row gap-5 justify-between items-center">
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-3">
              <FontAwesomeIcon icon={faPencil} className="text-primary" />
              <span>Content Type</span>
              <Tooltip content="Choose how your waterfall will be populated with content" />
            </div>
          </div>
        </div>
        <div className="flex border-2 border-background5 rounded-xl p-1">
          <button
            type="button"
            onClick={() => onChange('static')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              value === 'static'
                ? 'bg-action-secondary-background text-action-primary-text'
                : 'bg-ui3 text-text2 hover:bg-ui4 hover:text-text1'
            }`}
          >
            Static
          </button>
          <button
            type="button"
            onClick={() => onChange('cms')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              value === 'cms'
                ? 'bg-action-secondary-background text-action-primary-text'
                : 'bg-ui3 text-text2 hover:bg-ui4 hover:text-text1'
            }`}
          >
            CMS
          </button>
        </div>
      </div>
    </Card>
  );
}
