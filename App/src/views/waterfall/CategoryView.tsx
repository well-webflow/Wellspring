import { useWaterfall } from '../../context/WaterfallContext';
import { Heading } from '../../components/Typography';
import BasicSetting from '../../components/BasicSetting';
import { StickyNavigation } from '../../components/Navigation';
import { WaterfallCategory } from '../../../types/waterfall-types';

export default function CategoryView() {
  const { selectedCategory, waterfallSettings } = useWaterfall();

  if (!selectedCategory || !waterfallSettings) return null;

  const category: WaterfallCategory = waterfallSettings.find(
    (category) => category.id.toLowerCase() === selectedCategory.toLowerCase()
  );
  if (!category) return;

  const groups = category.groups || [];
  const filteredProps = category.items || [];

  if (category)
    return (
      <>
        <StickyNavigation onGoBack={() => {}}>
          <Heading level={4}>{category.name}</Heading>
        </StickyNavigation>
        <div className="p-5">
          <p className="mb-5 text-gray-300">{category.description}</p>
          <SettingSection>
            <div className="flex flex-col gap-4">
              {filteredProps.map((prop) => (
                <BasicSetting key={prop.name} prop={prop} />
              ))}
            </div>
          </SettingSection>
          {groups.map((group) => (
            <SettingSection>
              <div className="flex flex-col gap-4">
                <Heading level={3}>{group.name}</Heading>
                {group.items.map((item) => (
                  <BasicSetting key={item.name} prop={item} />
                ))}
              </div>
            </SettingSection>
          ))}
        </div>
      </>
    );
}

type SettingSectionProps = {
  children: React.ReactNode;
};

function SettingSection({ children }: SettingSectionProps) {
  return <div className="border-b border-t border-border1 py-8">{children}</div>;
}
