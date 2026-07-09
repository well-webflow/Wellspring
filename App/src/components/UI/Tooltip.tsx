import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

interface TooltipProps {
  content: string;
  defaultValue?: string;
  attrName?: string;
  position?: 'left' | 'right' | 'up' | 'down';
}

function Tooltip({ content, defaultValue, attrName, position = 'right' }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    right: 'left-5 top-1/2 transform -translate-y-1/2 ml-2',
    left: 'right-5 top-1/2 transform -translate-y-1/2 mr-2',
    up: 'bottom-5 left-1/2 transform -translate-x-1/2 mb-2',
    down: 'top-5 left-1/2 transform -translate-x-1/2 mt-2',
  };

  const arrowClasses = {
    right:
      'left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-6 border-r-6 border-b-6 border-transparent border-r-gray-900',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-6 border-l-6 border-b-6 border-transparent border-l-gray-900',
    up: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-900',
    down: 'top-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-transparent border-b-gray-900',
  };

  return (
    <div
      className="relative flex items-center z-0"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <FontAwesomeIcon icon={faQuestionCircle} className="text-gray-500 cursor-pointer" />
      {visible && (
        <div
          className={`absolute z-10 bg-gray-900 text-white text-sm py-2 px-2 rounded-sm shadow-lg whitespace-normal max-w-xs w-max transition-opacity duration-200 ease-in-out opacity-100 ${positionClasses[position]}`}
        >
          {/* Triangle */}
          <div className={`absolute ${arrowClasses[position]}`} />
          {content}
          {(attrName || defaultValue) && <hr className="my-2" />}
          <div className="flex flex-row gap-2">
            {attrName && <div className="text-primary">{attrName}</div>}
            {defaultValue && (
              <div>
                <b>Default:</b> <em>{defaultValue}</em>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
