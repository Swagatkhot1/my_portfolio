import { about } from "./content/about";
import { awards } from "./content/awards";
import { basics } from "./content/basics";
import { certifications } from "./content/certifications";
import { education } from "./content/education";
import { experience } from "./content/experience";
import { projects } from "./content/projects";
import { research } from "./content/research";
import { skills } from "./content/skills";
import { siteContentSchema } from "./schema";

export type { SiteContent } from "./schema";
export { siteContentSchema } from "./schema";

/**
 * Assembles the section files in `src/data/content/` and validates them.
 * Edit those files — not this one — to change copy on the site.
 */
export const siteContent = siteContentSchema.parse({
  basics,
  about,
  experience,
  research,
  projects,
  education,
  skills,
  awards,
  certifications,
});
