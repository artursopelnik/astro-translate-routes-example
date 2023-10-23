import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  schema: () =>
    z.object({
      draft: z.boolean(),
      title: z.string(),
      publishDate: z.string().transform((str: string) => new Date(str)),
      author: z.string().default('Astroship'),
      category: z.string(),
      tags: z.array(z.string()),
    }),
});

export const collections = {
  blog: blogCollection,
};
