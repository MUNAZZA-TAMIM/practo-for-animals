export const STUDIO_AUDIENCES = [
  {
    value: "pet-parents",
    label: "Pet parents",
    description: "Practical, reassuring education for people caring for a companion at home.",
  },
  {
    value: "veterinary-teams",
    label: "Veterinary teams",
    description: "Client-education drafts that a qualified team can review and adapt.",
  },
  {
    value: "clinic-owners",
    label: "Clinic owners",
    description: "Clear communication about services, routines, and what to expect.",
  },
  {
    value: "animal-ngos",
    label: "Animal NGOs",
    description: "Community-friendly guidance for foster networks and animal caregivers.",
  },
] as const;

export type StudioAudience = (typeof STUDIO_AUDIENCES)[number]["value"];

export const STUDIO_CHANNELS = [
  { value: "instagram", label: "Instagram carousel", note: "4:5 · up to 10 slides" },
  { value: "linkedin", label: "LinkedIn document", note: "4:5 · professional tone" },
  { value: "facebook", label: "Facebook carousel", note: "4:5 · community reach" },
] as const;

export type StudioChannel = (typeof STUDIO_CHANNELS)[number]["value"];

export const STUDIO_TONES = [
  { value: "warm-practical", label: "Warm & practical" },
  { value: "clinical-clear", label: "Clinical & clear" },
  { value: "playful", label: "Light & playful" },
  { value: "authoritative", label: "Measured & authoritative" },
] as const;

export type StudioTone = (typeof STUDIO_TONES)[number]["value"];

export const STUDIO_SLIDE_COUNTS = [4, 5, 6, 7, 8, 9, 10] as const;

export type StudioBrief = {
  topic: string;
  goal: string;
  audience: StudioAudience;
  channel: StudioChannel;
  tone: StudioTone;
  slideCount: number;
};

export type ResearchDeck = {
  summary: string;
  keyPoints: string[];
  cautions: string[];
  questions: string[];
  angles: string[];
  checks: string[];
  engine: "n8n" | "local-demo" | "local-fallback";
  warning?: string;
  generatedAt?: string;
};

export type OutlineItem = {
  id: string;
  title: string;
  purpose: string;
  keyPoint: string;
};

export type StudioSlide = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  cta?: string;
  imageNote?: string;
};

export type DesignDirectionId = "field-notes" | "clinic-calm" | "night-vet";

export type DesignDirection = {
  id: DesignDirectionId;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    line: string;
  };
  titleFont: "display" | "sans";
  coverWordmark: string;
};

export const DESIGN_DIRECTIONS: DesignDirection[] = [
  {
    id: "field-notes",
    name: "Field notes",
    description:
      "Warm ivory, forest ink, a coral stamp. Reads like a considered page from a field guide.",
    colors: {
      background: "#FBF7EE",
      surface: "#F4EDDF",
      ink: "#163B31",
      muted: "#5B655D",
      accent: "#B9523C",
      line: "#D9CEBA",
    },
    titleFont: "display",
    coverWordmark: "FIELD NOTES",
  },
  {
    id: "clinic-calm",
    name: "Clinic calm",
    description:
      "Soft mint, generous space, rounded information blocks. Calm without feeling clinical.",
    colors: {
      background: "#E7F0E7",
      surface: "#F7FBF6",
      ink: "#173B31",
      muted: "#506458",
      accent: "#2A604E",
      line: "#BFD8C2",
    },
    titleFont: "display",
    coverWordmark: "CARE NOTES",
  },
  {
    id: "night-vet",
    name: "Night vet",
    description:
      "Deep forest with ivory type and a coral accent. Best for urgent or evening topics.",
    colors: {
      background: "#102E26",
      surface: "#173B31",
      ink: "#FCF8EF",
      muted: "#C7D8CC",
      accent: "#E58B73",
      line: "#2E5446",
    },
    titleFont: "display",
    coverWordmark: "AFTER HOURS",
  },
];

export const REVIEW_ITEMS = [
  {
    id: "claims",
    label: "Every factual claim has been checked or removed.",
    detail: "No invented statistics, studies, expert quotes, or provider claims.",
  },
  {
    id: "medical",
    label: "No diagnosis, dosage, treatment plan, or guaranteed outcome.",
    detail: "General education only. Urgent guidance points to a veterinarian.",
  },
  {
    id: "tone",
    label: "The tone fits the audience and channel.",
    detail: "Warm and direct, without fear-based selling or talking down.",
  },
  {
    id: "design",
    label: "Design and copy are accessible.",
    detail: "Readable contrast, short lines, no meaning carried by colour alone.",
  },
  {
    id: "safety",
    label: "Emergency guidance and next steps are clear.",
    detail: "The reader knows when to stop reading and seek professional care.",
  },
  {
    id: "approval",
    label: "A named human reviewer approves this deck.",
    detail: "The reviewer takes responsibility for the final published copy.",
  },
] as const;

export type ReviewItemId = (typeof REVIEW_ITEMS)[number]["id"];

export type ReviewChecklist = Record<ReviewItemId, boolean>;

export const EMPTY_REVIEW: ReviewChecklist = {
  claims: false,
  medical: false,
  tone: false,
  design: false,
  safety: false,
  approval: false,
};

export const IDEA_PRESETS = [
  {
    topic: "Itchy skin in the monsoon: what to notice before changing foods",
    goal: "Help pet parents observe the pattern and know when to ask a vet",
    audience: "pet-parents" as StudioAudience,
    tone: "warm-practical" as StudioTone,
  },
  {
    topic: "Dental care for dogs who hate toothbrushes",
    goal: "Make a low-stress dental routine feel possible",
    audience: "pet-parents" as StudioAudience,
    tone: "warm-practical" as StudioTone,
  },
  {
    topic: "A calmer first vet visit for cats",
    goal: "Reduce carrier stress and help clients prepare",
    audience: "veterinary-teams" as StudioAudience,
    tone: "clinical-clear" as StudioTone,
  },
  {
    topic: "What to pack for a boarding trial",
    goal: "Set clear expectations before the first overnight stay",
    audience: "clinic-owners" as StudioAudience,
    tone: "authoritative" as StudioTone,
  },
  {
    topic: "Senior dog mobility: small changes worth asking about",
    goal: "Encourage earlier conversations about comfort and mobility",
    audience: "pet-parents" as StudioAudience,
    tone: "warm-practical" as StudioTone,
  },
  {
    topic: "Fireworks and anxious dogs: a calm preparation plan",
    goal: "Give caregivers a practical, non-medical preparation routine",
    audience: "animal-ngos" as StudioAudience,
    tone: "warm-practical" as StudioTone,
  },
];

export const DEFAULT_BRIEF: StudioBrief = {
  topic: "",
  goal: "",
  audience: "pet-parents",
  channel: "instagram",
  tone: "warm-practical",
  slideCount: 6,
};

export const STUDIO_DRAFT_KEY = "pfa-studio-draft-v1";
export const STUDIO_DRAFT_TTL = 7 * 24 * 60 * 60 * 1000;

export function getDesignDirection(id: DesignDirectionId): DesignDirection {
  return DESIGN_DIRECTIONS.find((direction) => direction.id === id) ?? DESIGN_DIRECTIONS[0];
}

