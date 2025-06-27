import { useEffect } from 'react';
import { Heading, Paragraph } from './Typography';
import { Link } from 'react-router';

export default function WellflowAppList() {
  useEffect(() => {
    webflow.setExtensionSize('comfortable');
  });

  return (
    <Link to="/waterfall">
      <div className="bg-background2 p-5 rounded-sm">
        <Heading level={4}>Waterfall</Heading>
        <Paragraph size="sm" className="text-text2 mb-0">
          Add fully custom sliders to your website
        </Paragraph>
      </div>
    </Link>
  );
}
