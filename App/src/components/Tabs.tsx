import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import React from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

type TabProps = {
  label: string;
  icon?: IconProp;
  children: React.ReactNode;
};

type TabsProps = {
  headerClasses?: string;
  contentClasses?: string;
  children: React.ReactNode;
};

export const Tab = ({ children }: TabProps) => {
  return <div>{children}</div>;
};

export const Tabs = ({ headerClasses, contentClasses, children }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  function tabStyles(index: number) {
    return twMerge(
      clsx(
        'cursor-pointer py-1 px-3 rounded-sm text-base text-text1 hover:text-text2',
        index === activeIndex && 'bg-white text-black hover:text-black font-semibold'
      )
    );
  }

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
            <button onClick={() => setActiveIndex(index)} className={tabStyles(index)}>
              {tab.props.icon && <FontAwesomeIcon icon={tab.props.icon} className="mr-2" />}
              {tab.props.label}
            </button>
            {index < tabs.length - 1 && <div className="border-l border-border1 h-6 self-center"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className={contentStyles()}>{tabs[activeIndex]}</div>
    </div>
  );
};
