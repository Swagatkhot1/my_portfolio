import type { Basics } from "../schema";

/** Name, title, contact, and social links — used in the sidebar, footer, and SEO. */
export const basics = {
  name: "Swagat Khot",
  title: "Computer Science Student",
  tagline:
    "Computer science student at UT Knoxville. I build software around the people who have to use it, and study the machine learning underneath.",
  email: "Skhot@vols.utk.edu",
  location: "Knoxville, TN",
  links: [
    { label: "GitHub", url: "https://github.com/WTCSwagat" },
    { label: "LinkedIn", url: "https://linkedin.com/in/swagat-khot" },
  ],
} satisfies Basics;
