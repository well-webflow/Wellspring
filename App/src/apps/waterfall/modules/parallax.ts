import { ATTR_PARALLAX_ENABLED } from 'well-waterfall/src/lib/attributes';
import { WaterfallCategory } from '../waterfall';
import ParallaxScreen from '../components/ParallaxScreen';
import { faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';

export default function parallaxConfig() {
  let config: WaterfallCategory = {
    name: 'Parallax',
    id: 'parallax',
    icon: faArrowsLeftRight,
    summary: 'Parallax effect for elements inside of slider',
    description: 'Parallax effect for elements inside of slider',
    component: ParallaxScreen,
    items: [
      {
        name: 'Parallax Enabled',
        attr: ATTR_PARALLAX_ENABLED,
        type: 'boolean',
        swiperDefault: 'false',
        description: 'Enable, if you want to use "parallaxed" elements inside of slider',
        value: '',
      },
    ],
  };
  return config;
}
