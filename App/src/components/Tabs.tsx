import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

type TabProps = {
  active?: boolean;
  onClick?: () => void;
  label: string;
  children?: React.ReactNode;
  icon?: IconProp;
};

type TabsProps = {
  headerClasses?: string;
  contentClasses?: string;
  children: React.ReactNode;
};

export const Tab = ({ label, icon, active, onClick }: TabProps) => {
  const tabStyles = clsx(
    'cursor-pointer py-1 px-3 rounded-sm text-base',
    active ? 'bg-white text-black hover:text-black font-semibold' : 'bg-none hover:bg-background2 text-text1'
  );

  return (
    <button onClick={onClick} className={tabStyles}>
      {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
      {label}
    </button>
  );
};

export const Tabs = ({ headerClasses, contentClasses, children }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  function headerStyles() {
    return twMerge(clsx('px-3 py-2 border-b border-border1 flex space-x-3', headerClasses));
  }

  function contentStyles() {
    return twMerge(clsx('p-3', contentClasses));
  }

  return (
    <div>
      {/* Tab Headers */}
      <div className={headerStyles()}>
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <Tab
              icon={tab.props.icon}
              label={tab.props.label}
              onClick={() => setActiveIndex(index)}
              active={activeIndex === index}
            />
            {index < tabs.length - 1 && <div className="border-l border-border1 h-6 self-center"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className={contentStyles()}>{tabs[activeIndex].props.children}</div>
    </div>
  );
};
