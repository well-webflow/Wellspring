import { faCog, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import { ATTR_WATERFALL_CONTENT } from 'well-waterfall';

export default function generalConfig() {
  let config: WaterfallCategory = {
    name: 'General',
    id: 'general',
    icon: faCog,
    description: 'Basic settings for all sliders',
    summary: 'Basic settings for all sliders',
    items: [
      {
        name: 'Content Type',
        attr: ATTR_WATERFALL_CONTENT,
        swiperDefault: '',
        value: 'static',
        description: 'Choose between static content or CMS driven content',
        type: 'select',
        icon: faDatabase,
        options: ['static', 'cms'],
      },
    ],
  };

  return config;
}
