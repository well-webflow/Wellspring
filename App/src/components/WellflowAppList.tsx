import { useWellflow } from '../context/wellflowContext';
import { Heading, Paragraph } from './Typography';
import { Link } from 'react-router';
import Card from './UI/Card';
import waterfallIcon from '../assets/waterfall.png';

export default function WellflowAppList() {
  const { changeActiveApp } = useWellflow();

  return (
    <div className="flex flex-col gap-2">
      <Link to="/waterfall" onClick={() => changeActiveApp('Waterfall')}>
        <Card size="sm" className="flex items-center gap-3">
          <img src={waterfallIcon} alt="Waterfall App" className="rounded-sm h-12 w-12" />
          <div className="">
            <Heading level={4}>Waterfall</Heading>
            <Paragraph size="sm" className="text-text2 mb-0">
              Create custom sliders
            </Paragraph>
          </div>
        </Card>
      </Link>
      <Card size="sm" className="flex items-center gap-3 border-2 border-border2 border-dashed bg-transparent">
        <div className="h-12 w-12 rounded-sm bg-background5"></div>
        <div className="">
          <Heading level={4}>More Apps Coming Soon</Heading>
        </div>
      </Card>
    </div>
  );
}
