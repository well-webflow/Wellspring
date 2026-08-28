import { Heading } from '../../../components/Typography';
import waterfallIcon from '../../../assets/waterfall.png';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

export default function SetupView() {
  return (
    <ErrorBoundary>
      <div className="p-3 w-full min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <img src={waterfallIcon} width={36} className="relative -top-0.75 rounded-sm"></img>
          <Heading level={2}>Waterfall</Heading>
        </div>
        <p className="text-sm text-text2 mb-5">
          Waterfall is a Javascript library for Webflow that enables developers to build sliders based on SwiperJS with
          attributes. The Wellflow app also helps create, edit, and manage Waterfalls with an easy to use interface with
          full documentation.
        </p>
        <p className="text-sm text-text2">
          Use the authorization button in the sidebar to connect your Webflow account and install Waterfall.
        </p>
      </div>
    </ErrorBoundary>
  );
}
