import SelectedElement from '../../../../components/SelectedElement';
import Button from '../../../../components/UI/Button';
import { convertElementToNextButton, convertElementToPrevButton, createNavigation } from '../../lib/waterfallElements';

export default function NavigationScreen() {
  return (
    <div className="flex flex-col gap-3">
      <Button onClick={() => createNavigation()}>Create Navigation</Button>
      <Button onClick={convertElementToNextButton}>
        Convert <SelectedElement /> to Next Button
      </Button>
      <Button onClick={convertElementToPrevButton}>
        Convert <SelectedElement /> to Prev Button
      </Button>
    </div>
  );
}
