import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import ManipulationScreen from '../components/modules/ManipulationScreen';
import { WaterfallCategory } from '../waterfall';

export default function manipulationCategory() {
  let config: WaterfallCategory = {
    name: 'Manipulation',
    id: 'manipulation',
    summary: 'Add, remove, insert slides at runtime',
    description: 'Add, remove, insert slides at runtime',
    icon: faPlusSquare,
    component: ManipulationScreen,
  };

  return config;
}
