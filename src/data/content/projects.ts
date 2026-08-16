import type { Project } from "../schema";

/**
 * Project cards. Set `featured: true` only when there is media worth a tall
 * panel; otherwise the card sits in the two-column grid.
 */
export const projects = [
  {
    name: "Basketball Shot Detection & Trajectory Prediction",
    blurb: "Follows a basketball through video footage and calls the shot before it lands.",
    stack: ["OpenCV", "Polynomial Regression"],
    highlights: [
      "Tracks the ball frame by frame with OpenCV, fits its arc with polynomial regression, and classifies the shot outcome from that curve.",
    ],
  },
  {
    name: "Vol Wash",
    blurb: "A sensor that tells you which washers and dryers are actually free, in real time.",
    stack: ["SW-420 vibration sensor", "ESP32"],
    featured: true,
    highlights: [
      "An SW-420 vibration sensor reads whether a machine is running; an ESP32 serves that live status to a web page.",
      "Placed 4th out of 9 teams.",
    ],
    metrics: [{ value: "4th / 9", label: "teams" }],
    images: [
      {
        src: "/projects/vol-wash-cover.jpg",
        alt: "Vol Wash poster and live demo setup at the project showcase",
      },
    ],
  },
  {
    name: "LED Clock Tower Circuit System (EF 152)",
    blurb: "An LED clock tower that shows the hour and ticks off the seconds in real time.",
    stack: ["Series/Parallel Circuits", "Kirchhoff's Laws"],
    featured: true,
    highlights: [
      "Sized every component with series/parallel resistance analysis, then used Kirchhoff's laws to check the circuit behaved the way the math said it would.",
    ],
    images: [
      {
        src: "/projects/ef152-clock-face.jpg",
        alt: "Clock face with twelve LEDs set around the hour markings",
      },
    ],
    video: {
      src: "/projects/ef152-clock-tower.mp4",
      poster: "/projects/ef152-clock-tower-poster.jpg",
    },
  },
  {
    name: "Poker Chip Launcher (EF 151)",
    blurb: "A spring-powered poker chip launcher, built for Engineering Fundamentals.",
    stack: ["Hooke's Law", "Projectile Motion", "Energy Conservation"],
    highlights: [
      "Predicted where a chip would land from Hooke's law, energy conservation, and projectile motion, and used those numbers to tune the launcher for accuracy.",
    ],
    images: [
      {
        src: "/projects/ef151-launcher-front.jpg",
        alt: "Launcher seen head-on, with a green poker chip seated between two white PVC half-pipe rails on the plywood base and a blue spring clamp holding each side to the workbench",
      },
      {
        src: "/projects/ef151-launcher-top.jpg",
        alt: "Top-down view of the launcher showing the plywood base, the two PVC rails either side of the poker chip, the binder clip on the wooden spring arm, and the clamps at each end",
      },
    ],
  },
] satisfies Project[];
