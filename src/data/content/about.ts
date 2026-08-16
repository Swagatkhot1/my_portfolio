import type { About } from "../schema";

/** About section: opening lede, current-work blocks, and off-hours interests. */
export const about = {
  lede: "I'm Swagat — the name means welcome. I build software that starts with the person using it, and I like the problems where a better tool changes what someone can get done.",
  ledeEmphasis: "welcome",
  blocks: [
    {
      label: "Research",
      lead: "HAMMER",
      text: "a neural model that predicts how metal behaves during hot forging — and the uncertainty estimates that say when to trust it.",
    },
    {
      label: "Building",
      lead: "AdviseAssist",
      text: "an Outlook add-in that helps university academic advisors work through student email. In process for a fall pilot.",
    },
  ],
  interestsLabel: "Off hours",
  interests: [
    "Basketball",
    "Cricket",
    "Badminton",
    "Pickleball",
    "Table tennis",
    "Lifting",
  ],
} satisfies About;
