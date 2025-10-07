import { Heading } from '../../../components/Typography';
import Card from '../../../components/UI/Card';
import { WaterfallCode } from '../components/WaterfallCode';

export default function SetupView() {
  return (
    <>
      <Heading level={1}>Waterfall</Heading>
      <p className="text-sm mb-5">
        Waterfall is a Javascript library for Webflow that enables developers to build sliders based on SwiperJS with
        attributes. The Wellflow app also helps create, edit, and manage Waterfalls with an easy to use interface with
        full documentation.
      </p>
      <Card>
        <WaterfallCode />
      </Card>
    </>
  );
}
