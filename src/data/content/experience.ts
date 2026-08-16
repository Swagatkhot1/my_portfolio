import type { Experience } from "../schema";

/** Jobs and internships, newest first. */
export const experience = [
  {
    org: "Summer Studio Program",
    role: "AdviseAssist",
    logo: "/logos/ut-tennessee-t.png",
    logoAlt: "University of Tennessee logo",
    url: "https://haslam.utk.edu/news/uts-entrepreneurship-center-announces-2026-summer-studio-cohort/",
    start: "June 2026",
    end: "Present",
    bullets: [
      "Built an Outlook add-in prototype in Office.js and Python/FastAPI that sorts an academic advisor's incoming email, pulls up the policy behind each question, and drafts a reply for them to edit.",
      "Connected it to advisors' inboxes through the Microsoft Graph API using MSAL/OAuth, with a retrieval pipeline (RAG) that finds the policy passages a draft should be based on.",
      "Wrote a scrubber — regex plus spaCy named-entity recognition — that strips student personal information out of an email before any of it reaches the language model.",
      "Interviewed 4 university advisors and shaped the task pane around how they already work; all 4 said they would adopt the prototype. It is in process for a fall pilot.",
    ],
    metrics: [{ value: "4 / 4", label: "advisors would adopt" }],
  },
  {
    org: "West Tennessee Consulting",
    role: "Intern",
    location: "Memphis, TN",
    logo: "/logos/west-tn-consulting.png",
    logoAlt: "West Tennessee Consulting logo",
    url: "https://www.westtn.consulting/en",
    start: "May 2025",
    end: "July 2025",
    bullets: [
      "Automated the invoice run in Zapier — QuickBooks to a Slack approval to a generated PDF — which cut manual data entry by 20%.",
      "Helped build DocChat, a serverless question-and-answer system running on AWS Lambda.",
    ],
    metrics: [{ value: "20%", label: "less manual data entry" }],
  },
] satisfies Experience[];
