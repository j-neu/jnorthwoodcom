import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const site = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    headline: z.string().optional(),
    note: z.string().optional(),
    email: z.string().optional(),
    name: z.string().optional(),
    buttons: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(['primary', 'secondary', 'inverted']).optional(),
        })
      )
      .optional(),
    items: z
      .array(
        z.object({
          name: z.string(),
          body: z.string(),
        })
      )
      .optional(),
    rotator: z
      .object({
        firstPart: z.string(),
        secondPart: z.string(),
        words: z.array(
          z.object({
            word: z.string(),
            color: z.string(),
          })
        ),
      })
      .optional(),
    quote: z.string().optional(),
    quoteAuthor: z.string().optional(),
    projects: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          tagline: z.string(),
          description: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { site };
