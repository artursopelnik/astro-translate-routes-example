import type { AstroUserConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export const config: AstroUserConfig = {
  site: 'https://artursopelnik.github.io',
  base: '/astro-translate-routes-example',
  trailingSlash: 'always',
  integrations: [tailwind()],
};

export const base = config.base
  ? config.base.split('/').length === 1
    ? config.base
    : config.base.split('/')[1] || ''
  : '';

export const configHelper: {
  isTrailingSlashEnabled: boolean;
  isBaseEnabled: boolean;
} = {
  isTrailingSlashEnabled:
    config.trailingSlash !== undefined && config.trailingSlash === 'always',
  isBaseEnabled: base !== '',
};
