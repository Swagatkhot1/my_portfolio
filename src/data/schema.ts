import { z } from "astro/zod";

const assetUrl = z.string().refine(
  (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
  "Expected an absolute URL or internal asset path",
);

const imageList = z
  .array(z.object({ src: assetUrl, alt: z.string().min(1) }))
  .optional();

/** Silent looping demo clip, used as the card's cover in place of a still. */
const video = z
  .object({ src: assetUrl, poster: assetUrl.optional() })
  .optional();

/**
 * Headline numbers lifted out of an entry's bullets so they can be set as
 * display type. Every value must already appear in the bullets below it.
 */
const metricList = z
  .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
  .optional();

export const siteContentSchema = z.object({
  basics: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    tagline: z.string().min(1),
    email: z.string().email(),
    location: z.string().min(1),
    /** Optional portrait for the sidebar; falls back to a serif monogram. */
    avatar: assetUrl.optional(),
    avatarAlt: z.string().min(1).optional(),
    links: z.array(z.object({ label: z.string().min(1), url: z.string().url() })),
  }),
  about: z.object({
    /** Display lede. Kept short — it is set large, at a narrow measure. */
    lede: z.string().min(1),
    /** Substring of `lede` picked out in brand italic. Must occur in it. */
    ledeEmphasis: z.string().min(1).optional(),
    /** Label + copy rows, so the section scans instead of being read. */
    blocks: z
      .array(
        z.object({
          label: z.string().min(1),
          /** Optional opening phrase, set brighter than the rest. */
          lead: z.string().min(1).optional(),
          text: z.string().min(1),
        }),
      )
      .default([]),
    /** Rendered as tags rather than prose. */
    interests: z.array(z.string().min(1)).default([]),
    interestsLabel: z.string().min(1).default("Off hours"),
  }),
  experience: z.array(
    z.object({
      org: z.string().min(1),
      role: z.string().min(1),
      location: z.string().optional(),
      logo: assetUrl.optional(),
      logoAlt: z.string().min(1).optional(),
      url: z.string().url().optional(),
      start: z.string().min(1),
      end: z.string().min(1),
      bullets: z.array(z.string().min(1)),
      metrics: metricList,
      images: imageList,
    }),
  ),
  research: z.array(
    z.object({
      org: z.string().min(1),
      role: z.string().min(1),
      advisor: z.string().min(1).optional(),
      logo: assetUrl.optional(),
      logoAlt: z.string().min(1).optional(),
      url: z.string().url().optional(),
      start: z.string().min(1),
      end: z.string().min(1),
      bullets: z.array(z.string().min(1)),
      metrics: metricList,
      images: imageList,
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string().min(1),
      blurb: z.string().min(1),
      stack: z.array(z.string().min(1)),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      featured: z.boolean().optional(),
      highlights: z.array(z.string().min(1)),
      metrics: metricList,
      images: imageList,
      video,
    }),
  ),
  education: z.array(
    z.object({
      school: z.string().min(1),
      degree: z.string().min(1),
      /** Class year, e.g. "Sophomore". Needs a hand-edit each autumn. */
      standing: z.string().min(1).optional(),
      gpa: z.string().min(1).optional(),
      logo: assetUrl.optional(),
      logoAlt: z.string().min(1).optional(),
      url: z.string().url().optional(),
      start: z.string().min(1).optional(),
      end: z.string().min(1),
      coursework: z.array(z.string().min(1)),
    }),
  ),
  skills: z.object({
    languages: z.array(z.string().min(1)),
    frameworks: z.array(z.string().min(1)),
    tools: z.array(z.string().min(1)),
  }),
  awards: z.array(
    z.object({
      name: z.string().min(1),
      org: z.string().min(1),
      date: z.string().min(1).optional(),
    }),
  ),
  certifications: z.array(
    z.object({
      name: z.string().min(1),
      url: z.string().url().optional(),
    }),
  ),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

/** Input shapes for the files in `content/` — defaults like `interestsLabel` stay optional. */
type SiteContentInput = z.input<typeof siteContentSchema>;
export type Basics = SiteContentInput["basics"];
export type About = SiteContentInput["about"];
export type Experience = SiteContentInput["experience"][number];
export type Research = SiteContentInput["research"][number];
export type Project = SiteContentInput["projects"][number];
export type Education = SiteContentInput["education"][number];
export type Skills = SiteContentInput["skills"];
export type Award = SiteContentInput["awards"][number];
export type Certification = SiteContentInput["certifications"][number];
