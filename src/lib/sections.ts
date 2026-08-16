import { siteContent } from "@/data/site-content";

export interface Section {
  id: string;
  label: string;
  /** Two-digit index, shown in both the sidebar rail and the section heading. */
  index: string;
}

const {
  experience,
  research,
  projects,
  education,
  skills,
  awards,
  certifications,
} = siteContent;

const candidates: { id: string; label: string; present: boolean }[] = [
  { id: "about", label: "About", present: true },
  { id: "experience", label: "Experience", present: experience.length > 0 },
  { id: "research", label: "Research", present: research.length > 0 },
  { id: "projects", label: "Projects", present: projects.length > 0 },
  { id: "education", label: "Education", present: education.length > 0 },
  {
    id: "skills",
    label: "Skills",
    present:
      skills.languages.length + skills.frameworks.length + skills.tools.length >
      0,
  },
  {
    id: "credentials",
    label: "Credentials",
    present: awards.length + certifications.length > 0,
  },
  { id: "contact", label: "Contact", present: true },
];

/**
 * A vertical rail has room for every section, so unlike the old top bar there
 * is no curated subset — all of them get a link.
 */
export const sections: Section[] = candidates
  .filter((section) => section.present)
  .map(({ id, label }, i) => ({
    id,
    label,
    index: String(i + 1).padStart(2, "0"),
  }));

export function sectionIndex(id: string): string {
  return sections.find((section) => section.id === id)?.index ?? "";
}
