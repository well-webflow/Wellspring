import { useWellflow } from '../context/wellflowContext';
import { Heading, Paragraph } from './Typography';
import { Link } from 'react-router';

export default function WellflowAppList() {
  const { setActiveApp } = useWellflow();

  function selectApp(app: string) {
    setActiveApp(app);
  }

  return (
    <Link to="/waterfall" onClick={() => selectApp('Waterfall')}>
      <div className="bg-background2 p-5 rounded-xs">
        <Heading level={4}>Waterfall</Heading>
        <Paragraph size="sm" className="text-text2 mb-0">
          Add fully custom sliders to your website
        </Paragraph>
      </div>
    </Link>
  );
}
