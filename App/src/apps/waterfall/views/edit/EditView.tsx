import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../../components/UI/Button';
import { useWaterfall } from '../../hooks/WaterfallContext';

export default function EditView() {
  const { setSelectedCategory, waterfallConfig } = useWaterfall();

  const navigate = useNavigate();

  function goToCategory(selectedCategory: string) {
    setSelectedCategory(selectedCategory);
    navigate(`/waterfall/edit/${selectedCategory}`);
  }

  return (
    <div className="p-2 space-y-2">
      {waterfallConfig?.map((category) => (
        <Button size="lg" key={category.id} onClick={() => goToCategory(category.id)} className="w-full">
          <div className="flex flex-row items-center text-left gap-4">
            {category.icon && (
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={category.icon} className="text-primary-dark" />
              </div>
            )}
            <div className="">
              <div className="text-base font-bold">{category.name}</div>
              <div className="text-sm text-text2">{category.summary}</div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}
