import Card from '../../components/Card';
import { StickyNavigation } from '../../components/Navigation';
import { Heading } from '../../components/Typography';
import { defaultWaterfallSettings } from '../../utils/waterfallSettings';

export default function CreateView() {
  return (
    <div>
      <StickyNavigation onGoBack={() => {}}>
        <Heading level={4}>Create Elements</Heading>
      </StickyNavigation>
      <div className="p-3">
        {defaultWaterfallSettings.map((category) => (
          <div key={category.name}>
            {category.actions && (
              <div className="mb-10">
                <Heading level={2} className="text-primary mb-3">
                  {category.name}
                </Heading>
                <div className="flex flex-col gap-3">
                  {category.actions.map((action) => (
                    <Card key={action.label} onClick={async () => action.func()}>
                      {action.label}
                    </Card>
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
