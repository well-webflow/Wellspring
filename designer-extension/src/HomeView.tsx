import { Link, useLocation } from 'react-router';
import HorizontalRule from './components/UI/hr';
import { Tab, Tabs } from './components/Tabs';
import { Heading, Paragraph } from './components/Typography';
import waterfallIcon from './assets/waterfall.png';
import { useEffect } from 'react';
import { faBug, faChevronLeft, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useWellflow } from './context/wellspringContext';
import NavigationLink from './components/UI/NavigationLink';
import wellspringLogo from './assets/wellspring.png';
import petalIcon from './assets/petal.png';
import chamomileIcon from './assets/chamomile.png';
import Card from './components/UI/Card';
import { AuthorizationStatus } from './apps/waterfall/views/WaterfallLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function HomeView() {
  const { changeActiveApp } = useWellflow();

  useEffect(() => {
    webflow.setExtensionSize('comfortable');
  });

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        <WellflowHeader />
        <div className="flex-1">
          <Tabs headerClasses="" contentClasses="p-3">
            <Tab label="Apps">
              <div className="flex flex-col gap-2">
                <Link to="/waterfall" onClick={() => changeActiveApp('Waterfall')}>
                  <Card size="sm" className="flex items-center gap-3">
                    <img src={waterfallIcon} alt="Waterfall App" className="rounded-sm h-12 w-12" />
                    <div className="">
                      <Heading level={5}>Waterfall</Heading>
                      <Paragraph size="sm" className="text-text2 mb-0">
                        Create custom sliders
                      </Paragraph>
                    </div>
                  </Card>
                </Link>
                <Card size="sm" className="flex items-center gap-3" disabled>
                  <img src={petalIcon} alt="Petal App" className="rounded-sm h-12 w-12" />
                  <div className="">
                    <Heading level={5}>Petal</Heading>
                    <Paragraph size="sm" className="text-text2 mb-0">
                      Tabs, Accordions, Dropdowns
                    </Paragraph>
                  </div>
                </Card>
                <Card size="sm" className="flex items-center gap-3" disabled>
                  <img src={chamomileIcon} alt="Chamomile App" className="rounded-sm h-12 w-12" />
                  <div className="">
                    <Heading level={5}>Chamomile</Heading>
                    <Paragraph size="sm" className="text-text2 mb-0">
                      Validate Form inputs
                    </Paragraph>
                  </div>
                </Card>
                <Card
                  disabled
                  size="sm"
                  className="flex items-center gap-3 border-2 border-border2 border-dashed bg-transparent"
                >
                  <div className="h-12 w-12 rounded-sm bg-background5"></div>
                  <div className="">
                    <Heading level={5}>More Coming Soon</Heading>
                  </div>
                </Card>
              </div>
            </Tab>
            <Tab label="About">
              <div className="flex flex-row gap-2 items-baseline">
                <Heading level={5}>Wellspring</Heading>
                <Paragraph size="sm" className="text-text2">
                  v1.0.0
                </Paragraph>
              </div>
              <Paragraph size="sm">
                Thank you for installing <span className="text-primary">Wellspring</span>! My goal with this package is
                to provide an affordable solution for common no-code problems, starting with sliders. I am a solo
                developer creating these apps in my free time. If you appreciate the work, please consider donating.
              </Paragraph>
              <Paragraph size="sm">
                <a
                  href="https://wellspring-app.webflow.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
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
        <div className="fixed bottom-0 left-0 right-0 bg-background5 w-full border-t border-t-border1 p-3 flex flex-row justify-center gap-4">
          <NavigationLink to="https://wellspring-app.webflow.io/contact" target="_blank" icon={faBug}>
            Bug Report
          </NavigationLink>
          <NavigationLink to="https://www.buymeacoffee.com/cactoid" target="_blank" icon={faHeart}>
            Donate
          </NavigationLink>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export function WellflowHeader() {
  const { activeApp, appIcon, changeActiveApp } = useWellflow();
  const location = useLocation();

  return (
    <>
      <div className="bg-background5 w-full border-b border-b-border1 p-3 flex flex-row justify-between items-center">
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
        {activeApp && <AuthorizationStatus />}
      </div>
    </>
  );
}
