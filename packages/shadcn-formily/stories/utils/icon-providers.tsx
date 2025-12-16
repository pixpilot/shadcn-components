import type { IconProvider } from '../../src/types';
import faData from '@iconify-json/fa/icons.json';
import mdiData from '@iconify-json/mdi/icons.json';

export const iconProviders: IconProvider[] = [
  {
    prefix: mdiData.prefix,
    icons: Object.keys(mdiData.icons), // Limit to first 200 icons for performance
    name: 'Material Design',
  },
  {
    prefix: faData.prefix,
    icons: Object.keys(faData.icons), // Limit to first 200 icons for performance
    name: 'Font Awesome',
  },
];
