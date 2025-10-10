import { Heading } from '../../../../components/Typography';
import Setting from '../../components/Setting';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { WaterfallCategory } from '../../waterfall';
import { useParams } from 'react-router';
import { useEffect } from 'react';

export default function CategoryView() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { selectedCategory, setSelectedCategory, waterfallConfig } = useWaterfall();

  // Sync URL parameter with context state when navigating via browser buttons
  useEffect(() => {
    if (categoryName && categoryName !== selectedCategory) {
      setSelectedCategory(categoryName);
    }
  }, [categoryName]);

  if (!selectedCategory || !waterfallConfig) return null;

  const category: WaterfallCategory | undefined = waterfallConfig.find(
    (category) => category.id.toLowerCase() === selectedCategory.toLowerCase()
  );
  if (!category) return;

  const groups = category.groups || [];
  const settings = category.items || [];

  if (category)
    return (
      <div className="">
        <div className="">
          <div>
            <Heading level={3} className="mb-2">
              {category.name}
            </Heading>
            <p className="text-sm text-text2 mb-5">{category.description}</p>
          </div>
          {category.component && <SettingSection>{renderComponent(category)}</SettingSection>}
          {settings.length > 0 && (
            <SettingSection>
              <div className="flex flex-col gap-4">
                {settings.map((setting) => (
                  <Setting key={setting.name} prop={setting} />
                ))}
              </div>
            </SettingSection>
          )}
          {groups.map((group) => (
            <SettingSection key={group.id}>
              <div className="flex flex-col gap-4">
                <div>
                  <Heading level={3}>{group.name}</Heading>
                  <p className="text-sm mb-5 text-gray-300">{group.description}</p>
                </div>
                {group.items?.map((item) => (
                  <Setting key={item.name} prop={item} />
                ))}
              </div>
            </SettingSection>
          ))}
        </div>
      </div>
    );
}

function renderComponent(category: WaterfallCategory) {
  if (category.component) {
    const Component = category.component;
    return <Component />;
  }
}

type SettingSectionProps = {
  children: React.ReactNode;
};

function SettingSection({ children }: SettingSectionProps) {
  return <div className="border-b border-t border-border1 py-8">{children}</div>;
}
