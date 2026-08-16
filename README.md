# Portfolio

Built with Astro, React, and Tailwind CSS.

## Development

```sh
npm run build
```

Site copy lives in `src/data/content/` — one file per section. Edit those files to change what the page says; the layout code does not need to change.

| What to change | File |
| --- | --- |
| Name, title, email, social links | `src/data/content/basics.ts` |
| About lede, current-work blocks, interests | `src/data/content/about.ts` |
| Jobs and internships | `src/data/content/experience.ts` |
| Research appointments | `src/data/content/research.ts` |
| Project cards | `src/data/content/projects.ts` |
| School, standing, GPA | `src/data/content/education.ts` |
| Languages, frameworks, tools | `src/data/content/skills.ts` |
| Awards | `src/data/content/awards.ts` |
| Certifications | `src/data/content/certifications.ts` |

The files are assembled and checked in `src/data/site-content.ts`. Theme and typography knobs are in `src/data/config.ts`.
