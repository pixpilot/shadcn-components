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

  http.get('/uploads/:fileName', async ({ request }) => fetch(request)),

  // Handle file upload requests with delay simulation
  http.post('/api/upload', async ({ request }) => {
    try {
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];

      if (files.length === 0) {
        return HttpResponse.json({ error: 'No files provided' }, { status: 400 });
      }

      // Mock response with file information
      const uploadedFiles = await Promise.all(
        files.map(async (file) => ({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          url: `/uploads/${file.name}`,
        })),
      );

      return HttpResponse.json({
        success: true,
        files: uploadedFiles,
        message: `${files.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'File upload failed', details: String(error) },
        { status: 500 },
      );
    }
  }),
];
