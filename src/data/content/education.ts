import type { Education } from "../schema";

/** Schools. Update `standing` each autumn. */
export const education = [
  {
    school: "The University of Tennessee at Knoxville",
    degree: "Bachelor of Science, Computer Science",
    standing: "Sophomore",
    gpa: "3.81 / 4.00",
    logo: "/logos/ut-tennessee-t.png",
    logoAlt: "University of Tennessee logo",
    end: "Expected May 2029",
    coursework: [],
  },
] satisfies Education[];
