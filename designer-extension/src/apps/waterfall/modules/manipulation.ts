import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import ManipulationScreen from '../components/modules/ManipulationScreen';
import { WaterfallCategory } from '../waterfall';

export default function manipulationCategory() {
  let config: WaterfallCategory = {
    name: 'Manipulation',
    id: 'manipulation',
    summary: 'Add slides at runtime',
    description: 'Add slides at runtime. If you want to set this up to CMS, set the attribute value to a CMS field.',
    icon: faAddressBook,
    component: ManipulationScreen,
  };

  return config;
}
