import type { Research } from "../schema";

/** Research appointments, newest first. */
export const research = [
  {
    org: "Department of ISE",
    role: "Undergraduate Research Assistant",
    logo: "/logos/ut-tennessee-t.png",
    logoAlt: "University of Tennessee logo",
    start: "February 2026",
    end: "Present",
    bullets: [
      "The team's neural forging surrogate had no ground-truth simulator to check it against, so I proposed measuring its uncertainty with a deep ensemble instead. The team adopted the approach.",
      "Trained a 3-model ensemble and used how far the models disagreed as the reliability signal: it decayed 3.7× over a 73-strike trajectory, which became a calibrated uncertainty penalty in the reinforcement-learning reward.",
      "Caught a mismatch between the action space in the training script and the one in the deployed model, before it cost the team 12-hour training runs.",
    ],
    metrics: [
      { value: "3.7×", label: "reliability decay quantified" },
      { value: "3", label: "model surrogate ensemble" },
    ],
  },
] satisfies Research[];
