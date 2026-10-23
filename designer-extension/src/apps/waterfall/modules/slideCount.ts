import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import SlideCountScreen from '../components/modules/SlideCountScreen';

export default function slideCountCategory() {
  let config: WaterfallCategory = {
    name: 'Slide Count',
    id: 'slide-count',
    icon: faHashtag,
    summary: 'Display the current slide number and total slides',
    description: 'Add a slide count element to display slide numbers (e.g., "1 / 5")',
    groups: [
      {
        name: 'Elements',
        id: 'slide-count-elements',
        description: 'Create and configure slide count elements',
        component: SlideCountScreen,
        items: [],
      },
    ],
    items: [],
  };
  return config;
}
