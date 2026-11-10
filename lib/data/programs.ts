export type Programme = {
  slug: string;
  name: string;
  label: string;
  summary: string;
  description: string;
  duration: string;
  format: string;
  effort: string;
  nextCohort: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  accent: "forest" | "mint" | "coral";
  audience: string[];
  outcomes: string[];
  modules: {
    title: string;
    summary: string;
    lessons: string[];
  }[];
  faqs: { question: string; answer: string }[];
};

export const programmes: Programme[] = [
  {
    slug: "ai-for-animal-health-teams",
    name: "AI for Animal Health Teams",
    label: "Flagship programme",
    summary:
      "A four-week working programme for veterinary teams who want AI to reduce admin, improve client communication, and stay firmly under human review.",
    description:
      "This is not a prompt-tricks course. You will map one real workflow, test where AI helps, write the guardrails, and leave with a reviewed playbook your team can actually use. The programme is built around animal-health scenarios: discharge notes, client education, appointment prep, and content that must never drift into diagnosis.",
    duration: "4 weeks",
    format: "Live clinics + async studio",
    effort: "6–8 hours per week",
    nextCohort: "New cohort forming",
    image: "/images/vet-pomeranian.jpg",
    imageAlt: "Veterinarian holding a small Pomeranian in a clinic",
    imageCredit:
      "Photography via Pexels. Used illustratively; not the programme team.",
    accent: "forest",
    audience: [
      "Veterinarians and veterinary nurses",
      "Clinic managers and practice owners",
      "Animal-hospital communication teams",
    ],
    outcomes: [
      "Identify the administrative and communication tasks where AI is genuinely useful — and the clinical decisions where it is not.",
      "Write structured prompts that carry context, constraints, audience, and a review step.",
      "Turn rough clinical notes into clear first drafts for client communication without inventing advice.",
      "Build a lightweight content workflow from idea to reviewed carousel using the Content Studio method.",
      "Create a one-page AI policy covering privacy, human approval, and escalation.",
      "Evaluate AI output for accuracy, tone, accessibility, and medical safety.",
    ],
    modules: [
      {
        title: "See the work before you automate it",
        summary:
          "Map a real week in your practice and separate useful automation from risky shortcuts.",
        lessons: [
          "Where AI fits — and where it does not",
          "Mapping one workflow end to end",
          "A simple risk register for animal-health teams",
        ],
      },
      {
        title: "Prompts that hold up in practice",
        summary:
          "Move from one-line prompts to reusable briefs with context, constraints, and a reviewer.",
        lessons: [
          "Anatomy of a reliable prompt",
          "Audience, tone, and the missing-context problem",
          "Designing a human review checkpoint",
        ],
      },
      {
        title: "From notes to useful communication",
        summary:
          "Draft client education and follow-up content with explicit medical guardrails.",
        lessons: [
          "Drafting discharge and follow-up explanations",
          "Creating a content brief from a clinic question",
          "Editing for plain language and accessibility",
        ],
      },
      {
        title: "A clinic-ready AI playbook",
        summary:
          "Leave with a policy, a reviewed workflow, and a 30-day adoption plan.",
        lessons: [
          "Writing the one-page AI policy",
          "Measuring usefulness without vanity metrics",
          "Presenting your workflow for team sign-off",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this clinical training?",
        answer:
          "No. This programme teaches AI workflow, communication, and review practices. It does not teach diagnosis, treatment, surgery, or prescribing, and it does not replace veterinary qualifications or clinical judgement.",
      },
      {
        question: "Do I need to be technical?",
        answer:
          "No. You need to be curious and willing to test one real workflow. We work in plain language with everyday tools, not code.",
      },
      {
        question: "Will we use real client data?",
        answer:
          "No. Exercises use fictional or de-identified scenarios. The programme covers privacy and data minimisation, and you should not put client records into a third-party AI tool without your practice's approval.",
      },
      {
        question: "What do I leave with?",
        answer:
          "A mapped workflow, a reusable prompt brief, a review checklist, a one-page AI policy draft, and a 30-day plan for your team.",
      },
    ],
  },
  {
    slug: "ai-content-for-pet-care-brands",
    name: "AI Content for Pet-Care Brands",
    label: "Studio programme",
    summary:
      "A three-week studio for pet-care marketers and founders who need a consistent, responsible content engine — not a feed full of unchecked AI posts.",
    description:
      "Build a repeatable carousel workflow from audience insight to research, outline, editable slides, and human approval. You will use the same six-stage method as the Content Studio, with extra attention on medical claims, source checks, design consistency, and the handoff to a designer or Canva template.",
    duration: "3 weeks",
    format: "Self-paced lessons + two live studios",
    effort: "4–6 hours per week",
    nextCohort: "New cohort forming",
    image: "/images/cat-high-five.jpg",
    imageAlt: "Kitten reaching a paw upward against a mint backdrop",
    imageCredit: "Photography via Pexels. Used illustratively.",
    accent: "coral",
    audience: [
      "Pet-care brand marketers and content leads",
      "Founders running their own social channels",
      "Animal NGO communication teams",
    ],
    outcomes: [
      "Turn audience questions into a clear carousel thesis instead of generic tips.",
      "Research safely without inventing statistics, expert quotes, or medical claims.",
      "Write a hook, narrative arc, and close that respects the reader's intelligence.",
      "Build an editable design direction and a Canva handoff pack.",
      "Run a five-minute review checklist before anything is published.",
      "Create a weekly content system that a small team can sustain.",
    ],
    modules: [
      {
        title: "Useful before viral",
        summary:
          "Find the questions your audience is actually asking and choose a content job.",
        lessons: [
          "Audience questions versus content topics",
          "One carousel, one job",
          "A simple editorial calendar for a small team",
        ],
      },
      {
        title: "Research with a paper trail",
        summary:
          "Use AI for structure and first drafts while keeping claims accountable.",
        lessons: [
          "Separating observation from diagnosis",
          "Source checks and claim ledgers",
          "Writing hooks that do not mislead",
        ],
      },
      {
        title: "A studio-to-Canva workflow",
        summary:
          "Move from outline to editable carousel, then hand off without losing the system.",
        lessons: [
          "Storyboarding six slides",
          "Design directions and safe areas",
          "Export, review, and the Canva handoff",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this only for Instagram?",
        answer:
          "The core workflow transfers to any carousel or document format. The Studio currently supports Instagram, LinkedIn, and Facebook briefs.",
      },
      {
        question: "Does the programme include Canva templates?",
        answer:
          "The demo includes a handoff pack and template setup guidance. It does not claim a live Canva integration or a licensed template library.",
      },
      {
        question: "Can I bring my own brand?",
        answer:
          "Yes. The final project is built around your audience and brand voice, with a review step for claims and accessibility.",
      },
    ],
  },
  {
    slug: "clinic-automation-sprint",
    name: "Clinic Automation Sprint",
    label: "Two-week sprint",
    summary:
      "A focused sprint to improve one front-desk or follow-up workflow with AI assistance, clear boundaries, and a staff review step.",
    description:
      "Choose one workflow — appointment preparation, post-visit follow-up, or internal knowledge lookup — and redesign it with a human-in-the-loop AI step. The sprint is deliberately small so the result can be tested, not just presented. It is a concept programme for this demo.",
    duration: "2 weeks",
    format: "One workshop + one clinic review",
    effort: "4 hours per week",
    nextCohort: "New cohort forming",
    image: "/images/vet-care.jpg",
    imageAlt: "Veterinarian examining a dog with a stethoscope",
    imageCredit: "Photography via Pexels. Used illustratively.",
    accent: "mint",
    audience: [
      "Clinic owners and practice managers",
      "Front-desk and client-care leads",
      "Operations teams at multi-site practices",
    ],
    outcomes: [
      "Select a workflow with real administrative value and manageable risk.",
      "Draft an AI-assisted step with a named human owner.",
      "Define what the system must never decide on its own.",
      "Pilot for one week and collect useful staff feedback.",
      "Document the workflow for consistent use across the team.",
    ],
    modules: [
      {
        title: "Choose the smallest useful change",
        summary:
          "Map the current workflow and find one bottleneck worth improving.",
        lessons: [
          "Time, error, and frustration mapping",
          "Risk tiers for clinic tasks",
          "Writing a testable problem statement",
        ],
      },
      {
        title: "Pilot with a human in the loop",
        summary:
          "Build and trial a bounded assistant with a clear escalation path.",
        lessons: [
          "Prompt and context design for clinic admin",
          "The review-and-escalate step",
          "A one-week pilot plan",
        ],
      },
    ],
    faqs: [
      {
        question: "Will this automate clinical decisions?",
        answer:
          "No. The sprint is limited to administrative and communication workflows. Clinical decisions remain with qualified professionals.",
      },
      {
        question: "What if we do not have AI tools yet?",
        answer:
          "You can complete the sprint with a general assistant and a documented manual process. The point is the workflow and the review boundary, not a specific vendor.",
      },
    ],
  },
];

export const educationFaqs = [
  {
    question: "Who is the AI Academy for?",
    answer:
      "Veterinary teams, animal-health communicators, pet-care founders, and animal NGOs who want practical, responsible AI workflows. You do not need a technical background.",
  },
  {
    question: "Is this medical or veterinary training?",
    answer:
      "No. The Academy teaches AI use, communication, and review practices. It does not provide veterinary qualifications, diagnosis training, or clinical decision support.",
  },
  {
    question: "How much time does it take?",
    answer:
      "The flagship programme is designed for roughly 6–8 hours a week across four weeks, including two live sessions and short studio exercises. Other programmes range from a two-week sprint to a three-week studio.",
  },
  {
    question: "Will I build something real?",
    answer:
      "Yes. Participants choose one real workflow or content brief and work through it with fictional or de-identified examples. The output is a reviewed playbook or carousel handoff, not a certificate of clinical competence.",
  },
  {
    question: "Do you use real patient data?",
    answer:
      "No. Exercises use fictional or de-identified scenarios. The programme covers privacy, data minimisation, and when not to use a third-party AI tool.",
  },
  {
    question: "Are these real programmes with confirmed dates?",
    answer:
      "This is a demo education product built for an internship assignment. Programme outlines are illustrative, no cohort dates are confirmed, and no enrolment payment is taken here.",
  },
];

export function getProgramme(slug: string) {
  return programmes.find((programme) => programme.slug === slug);
}

export const programmeOptions = programmes.map((programme) => ({
  value: programme.slug,
  label: programme.name,
}));
