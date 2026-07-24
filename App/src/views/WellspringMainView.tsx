import { useLocation } from 'react-router';
import HorizontalRule from '../components/UI/hr';
import { Tab, Tabs } from '../components/Tabs';
import { Heading, Paragraph } from '../components/Typography';
import WellspringAppList from '../components/AppList';
import { useEffect } from 'react';
import { faBug, faChevronLeft, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useWellflow } from '../context/wellflowContext';
import NavigationLink from '../components/UI/NavigationLink';
import wellspringLogo from '../assets/wellspring.png';

export default function WellflowMainView() {
  //const { siteData } = useAuth();
  //const siteId = siteData?.siteId || '';

  useEffect(() => {
    webflow.setExtensionSize('comfortable');
  });

  return (
    <div>
      <WellflowHeader />
      <Tabs headerClasses="" contentClasses="p-3">
        <Tab label="Apps">
          <WellspringAppList />
        </Tab>
        <Tab label="About">
          <div className="flex flex-row gap-2 items-baseline">
            <Heading level={4}>Wellspring</Heading>
            <Paragraph size="sm" className="text-text2">
              v1.0.0
            </Paragraph>
          </div>
          <Paragraph size="sm">
            Thank you for installing <span className="text-primary">Wellspring</span>! My goal with this package is to
            provide an affordable solution for common no-code problems, starting with sliders. I am a solo developer
            creating these apps in my free time. If you appreciate the work, please consider donating.
          </Paragraph>
          <Paragraph size="sm">
            <a href="https://wellspring-app.webflow.io" target="_blank" rel="noopener noreferrer" className="text-primary">
              Visit our Website
            </a>
          </Paragraph>
          <Paragraph size="sm">
            Created by{' '}
            <a href="https://kevingerstner.com" target="_blank" rel="noopener noreferrer" className="text-primary">
              Kevin Gerstner
            </a>
          </Paragraph>
          <HorizontalRule className="my-3" />
          <Heading level={4} className="mb-2">
            Release Notes
          </Heading>
          <Heading level={5}>1.0.0</Heading>
          <li className="list-none">
            <ul className="text-sm text-text2">- Initial Release</ul>
          </li>
        </Tab>
      </Tabs>
    </div>
  );
}

export function WellflowHeader() {
  const { activeApp, appIcon, changeActiveApp } = useWellflow();
  const location = useLocation();

  return (
    <>
      <div className="bg-background5 w-full border-b border-b-border1 p-3 flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          {activeApp ? (
            <NavigationLink
              to="/"
              onClick={() => changeActiveApp('')}
              icon={location.pathname !== '/' ? faChevronLeft : undefined}
            >
              <span className="flex items-center gap-2 text-base font-bold text-text1 ml-2 pl-2 border-l-2 border-border1">
                <img src={appIcon} alt="Waterfall App" className="rounded-sm h-6 w-6" />
                {activeApp.name}
              </span>
            </NavigationLink>
          ) : (
            <img src={wellspringLogo} alt="Wellspring Logo" width={80} height={20} className="" />
          )}
        </div>
        <div className="flex flex-row gap-4">
          <NavigationLink to="https://wellspring-app.webflow.io/contact" target="_blank" icon={faBug}>
            Bug Report
          </NavigationLink>
          <NavigationLink to="https://www.buymeacoffee.com/cactoid" target="_blank" icon={faHeart}>
            Donate
          </NavigationLink>
        </div>
      </div>
    </>
  );
}
