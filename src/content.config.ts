import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Providers: the companies behind marketplace offers.
// Add a new provider by creating src/content/providers/your-provider.md
const providers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/providers' }),
  schema: z.object({
    name: z.string(),
    logo: z.string().optional(),
    website: z.string().url(),
    summary: z.string(),
  }),
});

// Marketplace: individual affiliate offers/listings.
// Add a new offer by creating src/content/marketplace/your-offer.md
// It will automatically show up on its category page and in questionnaire
// results — no HTML or JS changes required.
const marketplace = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/marketplace' }),
  schema: z.object({
    title: z.string(),
    provider: reference('providers'),
    category: z.enum(['credit', 'loans', 'banking', 'insurance']),
    offerType: z.string(),
    summary: z.string(),
    affiliateUrl: z.string().url(),
    buttonText: z.string().default('Learn More'),
    featured: z.boolean().default(false),
    priority: z.number().default(0),
    logo: z.string().optional(),
    tags: z.array(z.string()).default([]),
    eligibility: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Articles: educational resources.
// Add a new article by creating src/content/articles/your-article.md
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['credit', 'loans', 'banking', 'insurance']),
    publishDate: z.date(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Categories: Credit / Loans / Banking / Insurance topic pages.
// Add a new category by creating src/content/categories/your-category.md
// The filename becomes the URL, e.g. insurance.md -> /insurance.html
const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    heroTitle: z.string(),
    heroDescription: z.string(),
    homeCardTitle: z.string(),
    homeCardDescription: z.string(),
    // Shown on the results page when a questionnaire answer matches this category
    questionnaireSummary: z.string(),
    order: z.number().default(0),
    ctaTitle: z.string(),
    ctaDescription: z.string(),
    // Optional override for the closing disclaimer text (each original
    // category page had slightly different wording). Falls back to the
    // shared default in <Disclaimer /> when omitted.
    disclaimer: z.string().optional(),
    sections: z.array(
      z.object({
        heading: z.string(),
        paragraphs: z.array(z.string()).optional(),
        grid: z
          .array(z.object({ heading: z.string(), text: z.string() }))
          .optional(),
        list: z.array(z.string()).optional(),
        faq: z
          .array(z.object({ question: z.string(), answer: z.string() }))
          .optional(),
      })
    ),
  }),
});

export const collections = { providers, marketplace, articles, categories };
