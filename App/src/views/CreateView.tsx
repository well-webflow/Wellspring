import Button from '../components/Button';
import Heading from '../components/Heading';
import Navigation from '../components/Navigation';
import { convertToWaterfallEl } from '../lib/functions';
import { defaultWaterfallSettings } from '../lib/waterfallSettings';

export default function CreateView() {
  return (
    <div>
      <Navigation />
      <div className="p-5">
        <Heading level={1} className="mb-10">
          Create Elements
        </Heading>
        {defaultWaterfallSettings.map((category) => (
          <div key={category.name}>
            {category.actions && (
              <div className="mb-10">
                <Heading level={2} className="text-primary mb-3">
                  {category.name}
                </Heading>
                <div className="flex flex-row gap-3">
                  {category.actions.map((action) => (
                    <Button
                      key={action.attr}
                      onClick={async () =>
                        await convertToWaterfallEl(action.attr, action.label)
                      }
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
