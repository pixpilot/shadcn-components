import faData from '@iconify-json/fa/icons.json';
// Import icon data statically
import mdiIcons from '@iconify-json/mdi/icons.json';

import tablerIcons from '@iconify-json/tabler/icons.json';

import { http, HttpResponse } from 'msw';

interface IconData {
  prefix: string;
  icons: Record<string, unknown>;
  [key: string]: unknown;
}

const iconSets: Record<string, IconData> = {
  mdi: mdiIcons as IconData,
  fa: faData as IconData,
  tabler: tablerIcons as IconData,
};

export const handlers = [
  // Handle /api/iconify/:prefix.json requests
  http.get('/api/iconify/:prefix.json', ({ request, params }) => {
    const { prefix } = params;
    const url = new URL(request.url);
    const iconsParam = url.searchParams.get('icons');

    const iconData = iconSets[prefix as string];

    if (!iconData) {
      return HttpResponse.json(
        { error: `Icon set "${String(prefix)}" not found` },
        { status: 404 },
      );
    }

    // If specific icons are requested, filter them
    if (iconsParam != null) {
      const iconList = iconsParam.split(',').map((i) => i.trim());

      // Filter icons while preserving all metadata
      const filteredIcons = iconList.reduce(
        (acc, icon) => {
          const data = iconData.icons[icon];
          if (data !== undefined) {
            acc[icon] = data;
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );

      // Create response with all metadata fields from original
      const response = {
        prefix: iconData.prefix,
        lastModified: iconData.lastModified,
        width: iconData.width,
        height: iconData.height,
        icons: filteredIcons,
      };

      return HttpResponse.json(response);
    }

    // Return entire icon set
    return HttpResponse.json(iconData);
  }),

  // Handle /api/iconify/:prefix/icons.json requests
  http.get('/api/iconify/:prefix/icons.json', ({ params }) => {
    const { prefix } = params;

    const iconData = iconSets[prefix as string];

    return HttpResponse.json(iconData);
  }),
];
