import { Link } from 'react-router';
import Button from '../components/Button';
import HorizontalRule from '../components/hr';
import { Tab, Tabs } from '../components/Tabs';
import { Heading, Paragraph } from '../components/Typography';
import WellflowAppList from '../components/WellflowAppList';
import { useAuth } from '../hooks/useAuth';
import { addWellflowScript } from '../utils/customCode';

export default function WellflowMainView() {
  const { sessionToken, siteData, openAuthWindow } = useAuth();

  const siteId = siteData?.siteId || '';

  return (
    <div>
      <WellflowHeader />
      <div className="p-3">
        <Tabs>
          <Tab label="Apps">
            <div className="">
              <WellflowAppList />
            </div>
          </Tab>
          <Tab label="Setup">
            <div className="flex flex-row gap-2 items-baseline">
              <Heading level={4}>Wellflow</Heading>
              <Paragraph size="sm" className="text-text2">
                v1.0.0
              </Paragraph>
            </div>
            <Paragraph size="sm">
              Thank you for installing{' '}
              <span className="text-primary">Wellflow</span>! My goal with this
              package is to provide a free and open-source library for common
              Webflow problems. I develop these solutions in my free time, if
              you appreciate the work, please consider donating.
            </Paragraph>
            <Button size="sm" color="secondary">
              Donate
            </Button>
            <HorizontalRule className="my-3" />
            <Heading level={4} className="mt-3">
              1. Authorize
            </Heading>
            <Paragraph size="sm">
              Wellflow needs permission to access your site before working.
            </Paragraph>
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
              In order to run, install the code snippet on your site. The
              Wellflow code package includes: SwiperJS
            </Paragraph>
            <Button
              onClick={() => addWellflowScript(siteId, sessionToken)}
              color="primary"
              size="sm"
            >
              Add Code
            </Button>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export function WellflowHeader() {
  return (
    <>
      <div className="w-full border-b border-b-border1 p-3 flex flex-row justify-between">
        <Link to="/">
          <img
            src="/wellflow-logo-white.svg"
            alt="Wellflow Logo"
            width={80}
            height={20}
            className=""
          />
        </Link>
        <div className="flex flex-row gap-2"></div>
      </div>
    </>
  );
}
