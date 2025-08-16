import { useLocation } from 'react-router';
import Button from '../components/UI/Button';
import HorizontalRule from '../components/UI/hr';
import { Tab, Tabs } from '../components/Tabs';
import { Heading, Paragraph } from '../components/Typography';
import WellflowAppList from '../components/WellflowAppList';
import { useAuth } from '../hooks/useAuth';
import { addWellflowScript } from '../utils/customCode';
import { useEffect } from 'react';
import { faBug, faChevronLeft, faCircleDollarToSlot } from '@fortawesome/free-solid-svg-icons';
import { useWellflow } from '../context/wellflowContext';
import NavigationLink from '../components/UI/NavigationLink';

export default function WellflowMainView() {
  const { sessionToken, siteData, openAuthWindow } = useAuth();

  const siteId = siteData?.siteId || '';

  useEffect(() => {
    webflow.setExtensionSize('large');
  });

  return (
    <div>
      <WellflowHeader />
      <Tabs headerClasses="" contentClasses="p-3">
        <Tab label="Apps">
          <WellflowAppList />
        </Tab>
        <Tab label="Setup">
          <div className="flex flex-row gap-2 items-baseline">
            <Heading level={4}>Wellflow</Heading>
            <Paragraph size="sm" className="text-text2">
              v1.0.0
            </Paragraph>
          </div>
          <Paragraph size="sm">
            Thank you for installing <span className="text-primary">Wellflow</span>! My goal with this package is to
            provide a free and open-source library for common Webflow problems. I develop these solutions in my free
            time, if you appreciate the work, please consider donating.
          </Paragraph>
          <Button size="sm" color="secondary">
            Donate
          </Button>
          <HorizontalRule className="my-3" />
          <Heading level={4} className="mt-3">
            1. Authorize
          </Heading>
          <Paragraph size="sm">Wellflow needs permission to access your site before working.</Paragraph>
          {!sessionToken ? (
            <Button onClick={openAuthWindow} size="sm" color="primary">
              Authorize App
            </Button>
          ) : (
            <Button onClick={() => {}} size="sm" color="secondary">
              Logout
            </Button>
          )}
          <HorizontalRule />
          <Heading level={4} className="mt-3">
            2. Install Code
          </Heading>
          <Paragraph size="sm">
            In order to run, install the code snippet on your site. The Wellflow code package includes: SwiperJS
          </Paragraph>
          <Button onClick={() => addWellflowScript(siteId, sessionToken)} color="primary" size="sm">
            Add Code
          </Button>
        </Tab>
      </Tabs>
    </div>
  );
}

export function WellflowHeader() {
  const { activeApp, setActiveApp } = useWellflow();
  const location = useLocation();

  function handleBackClick() {
    setActiveApp('');
  }
  return (
    <>
      <div className="bg-background5 w-full border-b border-b-border1 p-3 flex flex-row justify-between">
        <div className="flex flex-row items-baseline gap-2">
          <NavigationLink to="/" onClick={handleBackClick} icon={location.pathname !== '/' ? faChevronLeft : undefined}>
            <img src="/wellflow-logo-white.svg" alt="Wellflow Logo" width={80} height={20} className="" />
          </NavigationLink>
          {activeApp && (
            <span className="text-base font-bold text-text1 ml-2 pl-2 border-l-2 border-border1">{activeApp}</span>
          )}
        </div>
        <div className="flex flex-row gap-4">
          <NavigationLink
            to="mailto:kag@kevingerstner.com?subject=Wellflow%20Bug%20Report"
            target="_blank"
            icon={faBug}
          >
            Report Bug
          </NavigationLink>
          <NavigationLink to="https://www.buymeacoffee.com/cactoid" target="_blank" icon={faCircleDollarToSlot}>
            Donate
          </NavigationLink>
        </div>
      </div>
    </>
  );
}
