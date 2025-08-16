import { Heading } from '../../../components/Typography';
import Card from '../../../components/UI/Card';
import { Tab, Tabs } from '../../../components/Tabs';
import { faCirclePlus, faGear, faPencil } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCode } from '../components/WaterfallCode';
import SelectWaterfallView from './edit/SelectWaterfallView';
import CreateView from './CreateView';

export default function InitializationView() {
  return (
    <div>
      <div className="h-full">
        <div className="mb-5">
          <Tabs>
            <Tab label="Create" icon={faCirclePlus}>
              <CreateView />
            </Tab>
            <Tab label="Edit" icon={faPencil}>
              <SelectWaterfallView />
            </Tab>
            <Tab label="Setup" icon={faGear}>
              <Heading level={1}>Waterfall</Heading>
              <p className="text-sm mb-5">
                Waterfall is a wrapper around SwiperJS (11.2.10) that allows for full swiper customization using
                attributes.
              </p>
              <Card>
                <WaterfallCode />
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
