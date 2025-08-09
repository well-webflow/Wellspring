import { Heading } from '../../../../components/Typography';
import { EditNavigation } from '../../components/Navigation';
import Setting from '../../components/Setting';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { WaterfallCategory } from '../../waterfall';

export default function CategoryView() {
  const { selectedCategory, waterfallConfig, loadedWaterfall } = useWaterfall();

  if (!selectedCategory || !waterfallConfig) return null;

  const category: WaterfallCategory | undefined = waterfallConfig.find(
    (category) => category.id.toLowerCase() === selectedCategory.toLowerCase()
  );
  if (!category) return;

  const groups = category.groups || [];
  const filteredProps = category.items || [];

  if (category)
    return (
      <>
        <EditNavigation onGoBack={() => {}} heading={`Editing ${loadedWaterfall?.name} / ${category.name}`} />
        <div className="p-5">
          <p className="mb-5 text-gray-300">{category.description}</p>
          <SettingSection>
            <div className="flex flex-col gap-4">
              {filteredProps.map((prop) => (
                <Setting key={prop.name} prop={prop} />
              ))}
            </div>
          </SettingSection>
          {groups.map((group) => (
            <SettingSection key={group.id}>
              <div className="flex flex-col gap-4">
                <div>
                  <Heading level={3}>{group.name}</Heading>
                  <p className="text-sm mb-5 text-gray-300">{group.description}</p>
                </div>
                {group.items.map((item) => (
                  <Setting key={item.name} prop={item} />
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
