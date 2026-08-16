import type { Skills } from "../schema";

export const skills = {
  languages: ["JavaScript", "Python", "C++", "MATLAB"],
  frameworks: ["FastAPI", "Office.js", "LangChain"],
  tools: [
    "REST APIs",
    "Microsoft Graph API",
    "Git/GitHub",
    "UNIX/Linux terminal",
    "Qdrant",
  ],
} satisfies Skills;
