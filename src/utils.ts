import { configHelper } from 'config';

export const slugify = (slug: string) => {
  const parts = slug.split('/');
  const result = parts.pop() || parts.pop();

  return `${!configHelper.isTrailingSlashEnabled ? '/' : ''}${result}`;
};
