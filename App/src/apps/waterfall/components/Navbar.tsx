import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../components/UI/Button';
import { useNavigate } from 'react-router';

export function StickyNavigation({ children, onGoBack }: { children: React.ReactNode; onGoBack: () => void }) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
    onGoBack();
  };
  return (
    <div className="sticky z-40 top-0 left-0 right-0 flex flex-row justify-stretch items-center gap-2 p-2 bg-background4">
      <Button
        size="sm"
        icon={faArrowLeft}
        onClick={() => goBack()}
        color="secondary"
        disabled={window.history.length <= 1}
      >
        {}
      </Button>
      {children}
    </div>
  );
}
