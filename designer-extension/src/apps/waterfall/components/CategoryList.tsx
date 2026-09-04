import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/UI/Button';
import { WaterfallCategory } from '../waterfall';
import { useWaterfall } from '../hooks/WaterfallContext';

interface CategoryListProps {
  categories: WaterfallCategory[] | null;
  onCategoryClick: (categoryId: string) => void;
}

export default function CategoryList({ categories, onCategoryClick }: CategoryListProps) {
  const { activeBreakpoint } = useWaterfall();

  // Check if all settings in a category don't support breakpoints
  const isCategoryDisabled = (category: WaterfallCategory): boolean => {
    if (!activeBreakpoint) return false;

    const allSettings = [
      ...(category.items || []),
      ...(category.groups?.flatMap((g) => g.items) || []),
    ];

    // If no settings, don't disable
    if (allSettings.length === 0) return false;

    // Category is disabled if ALL settings don't support breakpoints
    return allSettings.every((setting) => !setting.breakpoints);
  };

  return (
    <div className="space-y-2">
      {categories
        ?.filter((category) => category.id !== 'general')
        .map((category) => {
          const isDisabled = isCategoryDisabled(category);

          return (
            <Button
              size="lg"
              key={category.id}
              onClick={() => !isDisabled && onCategoryClick(category.id)}
              className="w-full"
              disabled={isDisabled}
              disabledTooltip={isDisabled ? 'No settings in this category can be edited per breakpoint' : undefined}
            >
              <div className="flex flex-row items-center text-left gap-4">
                {category.icon && (
                  <div className="bg-primary w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={category.icon} className="text-primary-dark text-[10px]" />
                  </div>
                )}
                <div className="">
                  <div className="text-base font-bold">{category.name}</div>
                  <div className="text-sm text-text2">{category.summary}</div>
                </div>
              </div>
            </Button>
          );
        })}
    </div>
  );
}
