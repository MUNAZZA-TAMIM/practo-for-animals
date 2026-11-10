import {
  DESIGN_DIRECTIONS,
  type OutlineItem,
  type ResearchDeck,
  type StudioAudience,
  type StudioBrief,
  type StudioChannel,
  type StudioSlide,
  type StudioTone,
} from "./data";

type Theme = {
  key: string;
  keywords: string[];
  observations: string[];
  checkTitle: string;
  checkSteps: string[];
  careTitle: string;
  careSteps: string[];
  redFlags: string[];
  questions: string[];
  preventionTitle: string;
  preventionBody: string;
  extraTitle: string;
  extraBody: string;
  mythTitle: string;
  mythBody: string;
};

const SKIN: Theme = {
  key: "skin",
  keywords: [
    "skin",
    "itch",
    "scratch",
    "coat",
    "rash",
    "shedding",
    "dandruff",
    "allergy",
    "monsoon",
    "hot spot",
  ],
  observations: [
    "Where it started — paws, ears, belly, face, or under the collar.",
    "What changed around the same time: food, shampoo, plants, weather, or routine.",
    "Whether the scratching is occasional, worse at night, or interrupting sleep and play.",
  ],
  checkTitle: "A five-minute, hands-off check",
  checkSteps: [
    "Photograph the area in daylight, from the same angle each time.",
    "Part the coat gently. Note redness, flakes, broken skin, or a smell.",
    "Look at the ears and paws without cleaning them first.",
    "Write down the timeline instead of relying on memory.",
  ],
  careTitle: "Keep the next 48 hours simple",
  careSteps: [
    "Keep the coat dry and the area clean; skip new shampoos for now.",
    "Pause new foods, supplements, or home remedies until you have advice.",
    "Do not apply human creams or oils — some are harmful if licked.",
    "Use a cone only if a vet has advised it for that specific area.",
  ],
  redFlags: [
    "Trouble breathing, facial swelling, or sudden hives.",
    "Open, weeping, or rapidly spreading skin.",
    "Lethargy, not eating, or a feverish feel.",
    "Scratching that breaks sleep or leaves skin broken.",
  ],
  questions: [
    "Could this be linked to food, environment, or a seasonal trigger?",
    "What should I photograph or track before the next visit?",
    "Which products are safe around the eyes and ears?",
    "At what point should I stop watching and come in?",
  ],
  preventionTitle: "Make the next flare easier to read",
  preventionBody:
    "Keep a simple photo-and-note log: date, location, what changed, and how sleep was affected. Patterns are more useful than a single dramatic photo.",
  extraTitle: "Bring the timeline, not just the photo",
  extraBody:
    "A vet can work with when it started, what changed, what you tried, and how your companion is eating, sleeping, and behaving. A close-up alone leaves those questions unanswered.",
  mythTitle: "A common mix-up",
  mythBody:
    "Itching is not automatically a food allergy. Parasites, infections, contact irritants, and other causes can look similar — which is why a professional exam matters.",
};

const DENTAL: Theme = {
  key: "dental",
  keywords: ["dental", "tooth", "teeth", "breath", "gum", "plaque", "brush", "mouth"],
  observations: [
    "A change in breath — not just ‘dog breath’, but a new or stronger smell.",
    "Chewing on one side, dropping food, or pawing at the mouth.",
    "Red or swollen gum edges, brown build-up, or a damaged tooth.",
  ],
  checkTitle: "Look, lift, note, stop",
  checkSteps: [
    "Lift the lip gently for a few seconds on each side.",
    "Photograph both sides in good light.",
    "Note flinching, head-shy behaviour, or a change in eating.",
    "Do not scrape, scale, or use sharp tools at home.",
  ],
  careTitle: "Build a low-stress routine",
  careSteps: [
    "Start with a soft cloth or a vet-approved finger brush.",
    "Use pet-safe toothpaste only — never human toothpaste.",
    "Keep sessions under 30 seconds and reward calm.",
    "Ask your vet what brush or chew suits your animal's mouth.",
  ],
  redFlags: [
    "Facial swelling, or swelling under the eye.",
    "Dropping food, inability to close the mouth, or bleeding.",
    "Not eating or drinking for a day.",
    "Heavy drooling or a sudden change in bite.",
  ],
  questions: [
    "Is the gum line healthy, or is this build-up below the surface?",
    "What is a realistic home routine for my animal's mouth?",
    "Would a professional dental assessment be appropriate now?",
    "Which chews or toys are safe, and which are too hard?",
  ],
  preventionTitle: "Little and often beats a heroic effort",
  preventionBody:
    "Two calm 20-second sessions a week are more sustainable than a monthly battle. Pair the routine with a reward and stop before your animal pulls away.",
  extraTitle: "The detail that makes the visit easier",
  extraBody:
    "Write down what your animal will and will not tolerate near their mouth. A team can adapt handling when they know about head-shyness, prior pain, or a preferred side.",
  mythTitle: "A common mix-up",
  mythBody:
    "Chewing hard objects does not replace a dental check. It can also fracture teeth — especially in small mouths or older animals.",
};

const CAT_VISIT: Theme = {
  key: "cat-visit",
  keywords: ["cat", "carrier", "vet visit", "quiet", "first visit", "cat-friendly"],
  observations: [
    "How your cat reacts to the carrier before the car even moves.",
    "Whether the waiting area is shared with dogs or loud equipment.",
    "How long the journey is, and whether your cat has eaten beforehand.",
  ],
  checkTitle: "Prepare the carrier, not just the appointment",
  checkSteps: [
    "Leave the carrier out with a familiar blanket for several days.",
    "Avoid strong new smells; familiar scent does more than a new toy.",
    "Cover the carrier in the car and keep it level.",
    "Ask for a quiet slot or the first appointment of the day.",
  ],
  careTitle: "Make the visit easier for everyone",
  careSteps: [
    "Ask your vet about food timing before travel; do not decide alone.",
    "Bring a written list of changes and questions.",
    "Tell the team if your cat is fearful, so handling can be adapted.",
    "Plan a quiet, dark recovery space at home afterwards.",
  ],
  redFlags: [
    "Open-mouth breathing or collapse on the way to the clinic.",
    "A cat who has not eaten for 24 hours.",
    "Straining to urinate, especially with repeated litter visits.",
    "Sudden hiding with signs of pain or a swollen abdomen.",
  ],
  questions: [
    "Can we book a quiet appointment or a cat-only waiting slot?",
    "What carrier and handling approach do you recommend?",
    "Which changes should I track before the next visit?",
    "What would make this visit less stressful next time?",
  ],
  preventionTitle: "Familiarity lowers the temperature",
  preventionBody:
    "A carrier that lives in the room is furniture, not a warning sign. Short, calm practice sessions — no car ride — make the real journey less surprising.",
  extraTitle: "The quiet details matter",
  extraBody:
    "Note how your cat travels best: covered or uncovered, with or without a familiar blanket, and with or without a companion. The clinic can plan around that.",
  mythTitle: "A common mix-up",
  mythBody:
    "A cat who is silent in the car is not necessarily calm. Freezing is a common fear response, not proof of comfort.",
};

const BOARDING: Theme = {
  key: "boarding",
  keywords: ["boarding", "daycare", "travel", "pack", "overnight", "kennel", "sitter"],
  observations: [
    "How your animal settles in new spaces and with new people.",
    "Their usual meal, rest routine, and the cues that help them relax.",
    "Vaccination records and any behaviour or separation needs.",
  ],
  checkTitle: "Ask before you book",
  checkSteps: [
    "Visit or video-call the space, including the rest areas.",
    "Ask how introductions are paced and how quiet time is enforced.",
    "Confirm who supervises and what happens after hours.",
    "Ask what information they need about food, behaviour, and contact preferences.",
  ],
  careTitle: "Pack for familiarity, not novelty",
  careSteps: [
    "Familiar food, clearly labelled with portions.",
    "A worn-smelling blanket rather than a brand-new toy.",
    "A short written routine and an emergency contact.",
    "Leave valuable or risky items at home.",
  ],
  redFlags: [
    "The provider cannot explain supervision or emergency steps.",
    "A nervous animal is booked overnight without a trial or meet-and-greet.",
    "There is a medical change close to the stay — speak to your vet first.",
    "You feel rushed into a booking before your questions are answered.",
  ],
  questions: [
    "What does a normal day look like, including rest time?",
    "How do you introduce a new animal to the group?",
    "Who do I call after hours, and what is the escalation plan?",
    "What would make you decline a booking?",
  ],
  preventionTitle: "A trial day is information, not a formality",
  preventionBody:
    "A shorter first stay reveals how your animal settles, eats, and rests. It is a chance to adjust before a longer trip — not a test to pass.",
  extraTitle: "Write the one-page handover",
  extraBody:
    "Include food, water, rest cues, what worries your animal, and how you want to be contacted. A good handover reduces guesswork for everyone.",
  mythTitle: "A common mix-up",
  mythBody:
    "A bigger playgroup is not automatically better. Group size, supervision ratio, and enforced rest matter more than how busy the photos look.",
};

const SENIOR: Theme = {
  key: "senior",
  keywords: ["senior", "older", "mobility", "arthritis", "stiff", "joint", "stairs", "aging"],
  observations: [
    "Whether your companion is slower to rise, climb stairs, or jump into the car.",
    "Changes in sleep, appetite, toileting, or willingness to walk.",
    "Whether the change is steady, sudden, or tied to a particular time of day.",
  ],
  checkTitle: "Look at the daily route",
  checkSteps: [
    "Walk the route your animal takes at home and note slippery floors or high steps.",
    "Check whether food, water, and a favourite bed are easy to reach.",
    "Film a short, normal walk from the side — no forcing movement.",
    "Write down changes over a week instead of judging one bad day.",
  ],
  careTitle: "Make comfort easier, not harder",
  careSteps: [
    "Add non-slip mats on the routes your animal already uses.",
    "Raise food and water only if your vet has advised it for your animal.",
    "Keep nails managed; long nails change how weight is carried.",
    "Do not start pain relief or supplements without veterinary advice.",
  ],
  redFlags: [
    "Sudden inability to bear weight, or a leg that drags.",
    "Breathing changes, collapse, or a swollen abdomen.",
    "Crying, trembling, or refusing food.",
    "A rapid change in mobility over hours rather than weeks.",
  ],
  questions: [
    "Is this normal aging, or should we examine it?",
    "What safe exercise and home changes would help?",
    "Which changes should I track over the next two weeks?",
    "How do we balance comfort with maintaining strength?",
  ],
  preventionTitle: "Small adjustments compound",
  preventionBody:
    "A non-slip path to water, a shorter evening walk, and a consistent rest spot can make a real difference — without pretending to treat an underlying condition.",
  extraTitle: "Record the good days too",
  extraBody:
    "A video of a comfortable walk is useful context. It shows what 'normal' looks like for your animal when the vet is comparing change over time.",
  mythTitle: "A common mix-up",
  mythBody:
    "Slowing down is not always 'just age'. Discomfort, dental pain, vision changes, and other issues can look like a quieter dog or cat.",
};

const ANXIETY: Theme = {
  key: "anxiety",
  keywords: ["fireworks", "anxiety", "anxious", "thunder", "noise", "fear", "reactivity", "calm"],
  observations: [
    "What your animal does before the noise peaks: pacing, hiding, panting, or freezing.",
    "Which room feels safest, and whether that changes with the sound.",
    "What helps them recover afterwards — and how long recovery takes.",
  ],
  checkTitle: "Prepare the space before the event",
  checkSteps: [
    "Choose a quiet room with a familiar bed and a closed, secure exit.",
    "Test background sound at normal volume earlier in the week.",
    "Keep water and a litter tray or toilet route accessible.",
    "Ask your vet about a plan in advance; do not wait for the peak.",
  ],
  careTitle: "Support, do not force",
  careSteps: [
    "Stay calm and allow your animal to hide if that is their choice.",
    "Do not force interaction, food, or a ‘brave’ walk during the event.",
    "Keep doors, windows, and escape routes secure.",
    "Never give medication unless it is prescribed for that animal.",
  ],
  redFlags: [
    "Injury from trying to escape, or a door left open.",
    "Breathing distress, collapse, or pale gums.",
    "Your animal does not recover for many hours after the event.",
    "Self-injury, destructive panic, or a sudden new severe response.",
  ],
  questions: [
    "What is a safe, non-medical preparation plan for this animal?",
    "At what point does fear need professional behaviour support?",
    "Which signs should I record before the next appointment?",
    "How should we handle future events without reinforcing panic?",
  ],
  preventionTitle: "Practice on ordinary days",
  preventionBody:
    "Short, positive sessions with recorded sounds at very low volume — only if your animal stays relaxed — can build familiarity. Stop if they show fear; this is not a challenge to push through.",
  extraTitle: "Comfort does not create fear",
  extraBody:
    "Sitting nearby, speaking softly, or offering a familiar blanket is not ‘rewarding’ fear. Punishment and forced exposure are the things to avoid.",
  mythTitle: "A common mix-up",
  mythBody:
    "A dog who is ‘fine’ during fireworks may still be shut down, not calm. Look for freezing, excessive licking, and recovery time, not just barking.",
};

const NUTRITION: Theme = {
  key: "nutrition",
  keywords: ["weight", "food", "diet", "treat", "nutrition", "portion", "chubby", "eating", "kibble"],
  observations: [
    "What a normal day of food, treats, and chews actually adds up to.",
    "Whether the waist is visible from above and the ribs are easy to feel.",
    "Changes in appetite, water intake, stool, or energy over the past month.",
  ],
  checkTitle: "Measure before you change",
  checkSteps: [
    "Weigh the usual portion instead of estimating by eye.",
    "Count treats and chews for two ordinary days.",
    "Use the same scale and a consistent time for weight checks.",
    "Photograph the body shape from the side and above, if your animal is comfortable.",
  ],
  careTitle: "Change one variable at a time",
  careSteps: [
    "Do not start a restrictive diet without veterinary guidance.",
    "Swap only a small portion of the usual food at first, and note tolerance.",
    "Keep treats small and account for them in the day's total.",
    "Make water easy to reach and keep the routine predictable.",
  ],
  redFlags: [
    "Rapid weight loss or gain without a deliberate plan.",
    "Not eating for 24 hours, or repeated vomiting.",
    "A distended or painful abdomen, or unproductive retching.",
    "Changes in thirst, urination, or energy that persist.",
  ],
  questions: [
    "What is a healthy weight range for this animal, and how should we measure progress?",
    "Which diet changes are safe to try, and which need a prescription?",
    "How do treats and chews fit into the daily plan?",
    "What symptoms would make this urgent?",
  ],
  preventionTitle: "Make the default easier",
  preventionBody:
    "Portion the day's food in advance, keep treats out of easy reach, and use play or sniffing as a reward alongside food. Small environmental changes outlast willpower.",
  extraTitle: "Bring two ordinary days, not a guess",
  extraBody:
    "A simple food diary with portions, treats, and times gives a vet more than a single recall question. It also reveals the habits nobody notices.",
  mythTitle: "A common mix-up",
  mythBody:
    "A shiny coat is not proof of a balanced diet, and a chubby animal is not automatically healthy. Body condition and individual health matter more than appearance.",
};

const PUPPY: Theme = {
  key: "puppy",
  keywords: ["puppy", "kitten", "vaccination", "socialisation", "new pet", "first weeks", "litter"],
  observations: [
    "What a normal day already looks like: meals, naps, play, and toileting.",
    "Which experiences are new, and which ones your animal avoids.",
    "What the breeder, shelter, or previous carer has already shared.",
  ],
  checkTitle: "Build a calm first-week map",
  checkSteps: [
    "Write down the current feeding, rest, and toileting routine.",
    "Create one safe space that is never used for punishment.",
    "Ask your vet which outings and introductions are appropriate before vaccination is complete.",
    "Keep new experiences short, optional, and paired with something familiar.",
  ],
  careTitle: "Socialisation is not a checklist of strangers",
  careSteps: [
    "Prioritise calm observation over being handled by everyone.",
    "Watch body language and end before your animal is overwhelmed.",
    "Carry your puppy in safe areas if your vet advises it.",
    "For kittens, keep the first room small and predictable.",
  ],
  redFlags: [
    "Not eating or drinking, or repeated vomiting or diarrhoea.",
    "Lethargy, breathing difficulty, or a sudden change in behaviour.",
    "A puppy or kitten that cannot settle or seems painful.",
    "Any known exposure to a serious infectious disease — call your vet.",
  ],
  questions: [
    "Which vaccinations and checks are due, and when?",
    "What is safe to do before the vaccination schedule is complete?",
    "How should we introduce other animals in the home?",
    "What does healthy play look like for this age?",
  ],
  preventionTitle: "Protect sleep like an appointment",
  preventionBody:
    "Young animals need more rest than many households expect. A predictable quiet space and short, gentle sessions prevent overwhelm more effectively than a busy social calendar.",
  extraTitle: "The first handover is valuable",
  extraBody:
    "Bring any records, feeding notes, and the previous carer's contact preferences if permitted. Continuity reduces guesswork in the first weeks.",
  mythTitle: "A common mix-up",
  mythBody:
    "Socialisation is not about meeting every dog or person. It is about building confidence with ordinary sounds, surfaces, and gentle handling over time.",
};

const EMERGENCY: Theme = {
  key: "emergency",
  keywords: ["emergency", "breathing", "seizure", "poison", "bleeding", "collapse", "urgent", "swelling"],
  observations: [
    "What changed, and when — breathing, alertness, movement, or gum colour.",
    "Whether the animal can stand, eat, drink, or settle.",
    "What they may have eaten, touched, or been given, and when.",
  ],
  checkTitle: "Call first, then move safely",
  checkSteps: [
    "Call the clinic or emergency service and say you are coming.",
    "Note the address, your route, and any after-hours entrance.",
    "Use a secure carrier or a blanket as a stretcher if needed, without twisting the spine.",
    "Bring medication packaging, plants, or anything potentially swallowed.",
  ],
  careTitle: "Do not improvise treatment",
  careSteps: [
    "Do not give food, water, or human medicine unless instructed.",
    "Do not induce vomiting unless a professional tells you to.",
    "Keep the animal warm, contained, and as calm as safety allows.",
    "Do not wait to see if a serious sign passes.",
  ],
  redFlags: [
    "Trouble breathing, pale gums, or collapse.",
    "A seizure that does not stop, or repeated seizures.",
    "Suspected poisoning or a known toxic exposure.",
    "Severe bleeding, a swollen abdomen, or inability to urinate.",
  ],
  questions: [
    "What should I do while I travel to you?",
    "Which entrance should I use after hours?",
    "What information do you need by phone?",
    "What should I bring from home?",
  ],
  preventionTitle: "Know the route before you need it",
  preventionBody:
    "Save the nearest emergency contact, check after-hours access, and keep a carrier or safe transport plan ready. Preparation reduces decisions in a frightening moment.",
  extraTitle: "The phone call is part of the care",
  extraBody:
    "Calling ahead lets the team prepare and tell you what not to do on the way. It is not a delay if you are already moving.",
  mythTitle: "A common mix-up",
  mythBody:
    "Waiting to see if a serious sign passes can be the riskiest choice. When in doubt, call and describe what you are seeing.",
};

const GENERAL: Theme = {
  key: "general",
  keywords: [],
  observations: [
    "What changed, and when it started.",
    "What your companion can still do comfortably, and what they are avoiding.",
    "What you have already tried, including food, products, or routines.",
  ],
  checkTitle: "Collect the useful details",
  checkSteps: [
    "Write a short timeline instead of relying on memory.",
    "Take a clear photo or a 20-second video in normal light.",
    "Note appetite, sleep, water, toileting, and energy.",
    "List any new products, foods, or changes at home.",
  ],
  careTitle: "Keep the next step small",
  careSteps: [
    "Avoid new treatments or supplements until you have advice.",
    "Keep routines familiar and reduce unnecessary stress.",
    "Make water and a quiet resting space easy to reach.",
    "Ask a professional before using human products.",
  ],
  redFlags: [
    "Trouble breathing, collapse, or pale gums.",
    "Not eating or drinking for 24 hours.",
    "Severe pain, repeated vomiting, or a swollen abdomen.",
    "Any sudden change that worries you — call and ask.",
  ],
  questions: [
    "What should I track before the next visit?",
    "Is this something to watch, or something to examine now?",
    "What safe changes can I make at home?",
    "What would make this urgent?",
  ],
  preventionTitle: "A short note beats a strong memory",
  preventionBody:
    "Keep a simple log of dates, changes, and what helped. It makes patterns visible and gives a professional a more useful starting point.",
  extraTitle: "Bring the context",
  extraBody:
    "The most useful history includes when it started, what changed, what you tried, and how daily life is affected — not only the symptom itself.",
  mythTitle: "A common mix-up",
  mythBody:
    "A single symptom rarely tells the whole story. Context and examination matter more than a search result that sounds certain.",
};

const THEMES: Theme[] = [
  SKIN,
  DENTAL,
  CAT_VISIT,
  BOARDING,
  SENIOR,
  ANXIETY,
  NUTRITION,
  PUPPY,
  EMERGENCY,
];

const AUDIENCE_PROFILES: Record<
  StudioAudience,
  {
    label: string;
    coverKicker: string;
    body: string;
    cta: string;
    reviewNote: string;
  }
> = {
  "pet-parents": {
    label: "pet parents",
    coverKicker: "A care guide for the person who notices first",
    body: "A calm, practical guide to noticing what has changed — and knowing when to ask for help.",
    cta: "Find a provider",
    reviewNote: "Check that every line sounds like a helpful neighbour, not a diagnosis.",
  },
  "veterinary-teams": {
    label: "veterinary teams",
    coverKicker: "Client education draft · for team review",
    body: "A client-education draft for the care team to review, adapt, and make local.",
    cta: "Review with the team",
    reviewNote: "A qualified veterinary professional must approve all clinical framing.",
  },
  "clinic-owners": {
    label: "clinic owners",
    coverKicker: "A clear communication draft for your practice",
    body: "A reviewable guide to help your team set expectations before the visit.",
    cta: "Share with the team",
    reviewNote: "Confirm that the advice matches your practice's protocols and local referrals.",
  },
  "animal-ngos": {
    label: "animal NGOs",
    coverKicker: "Plain-language guidance for community care",
    body: "A shareable guide for the people caring for animals in your community.",
    cta: "Share with your network",
    reviewNote: "Review against local resources and avoid implying access to care that is not available.",
  },
};

const TONE_PHRASES: Record<StudioTone, string> = {
  "warm-practical": "warm, plain-spoken, and practical",
  "clinical-clear": "clear, restrained, and clinically careful",
  playful: "light in tone without making light of health concerns",
  authoritative: "measured, precise, and confident about its limits",
};

const CHANNEL_LABEL: Record<StudioChannel, string> = {
  instagram: "Instagram carousel",
  linkedin: "LinkedIn document",
  facebook: "Facebook carousel",
};

const PURPOSE_BY_TYPE: Record<string, string> = {
  cover: "Stop the scroll with a specific, useful promise.",
  observations: "Validate what the reader has already noticed.",
  check: "Give one concrete, low-risk action.",
  care: "Offer safe general guidance without treatment claims.",
  redflags: "Make escalation unmissable.",
  questions: "Help the reader prepare for a professional conversation.",
  prevention: "Leave them with a sustainable habit.",
  extra: "Add the detail that makes the next visit more useful.",
  myth: "Correct one common misunderstanding with care.",
  cta: "Give one clear next step.",
};

type SlideDraft = {
  type: string;
  kicker: string;
  title: string;
  body: string;
  cta?: string;
  imageNote?: string;
};

function cleanTopic(topic: string) {
  const trimmed = topic.trim().replace(/\s+/g, " ");
  if (!trimmed) return "A calmer way to care for your companion";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function pickTheme(topic: string): Theme {
  const normalised = topic.toLowerCase();
  const matches = THEMES.map((theme) => ({
    theme,
    score: theme.keywords.reduce(
      (total, keyword) => total + (normalised.includes(keyword) ? keyword.length : 0),
      0,
    ),
  })).sort((a, b) => b.score - a.score);
  return matches[0]?.score > 0 ? matches[0].theme : GENERAL;
}

function bulletBlock(items: string[]) {
  return items.join("\n");
}

function buildSlideDrafts(brief: StudioBrief): SlideDraft[] {
  const theme = pickTheme(brief.topic);
  const topic = cleanTopic(brief.topic);
  const audience = AUDIENCE_PROFILES[brief.audience];
  const drafts: SlideDraft[] = [];

  drafts.push({
    type: "cover",
    kicker: audience.coverKicker,
    title: topic,
    body: audience.body,
    cta: "Save this guide",
    imageNote:
      "Cover art: a natural-light portrait of the animal this guide is for. No text baked into the image.",
  });

  drafts.push({
    type: "observations",
    kicker: "Start with what changed",
    title: "Notice the pattern, not just the symptom",
    body: bulletBlock(theme.observations),
    imageNote: "Use a warm, close crop of the animal or a quiet home detail.",
  });

  if (brief.slideCount >= 7) {
    drafts.push({
      type: "check",
      kicker: "A simple check",
      title: theme.checkTitle,
      body: bulletBlock(theme.checkSteps),
    });
  }

  if (brief.slideCount >= 5) {
    drafts.push({
      type: "care",
      kicker: "Practical next step",
      title: theme.careTitle,
      body: bulletBlock(theme.careSteps),
    });
  }

  drafts.push({
    type: "redflags",
    kicker: "When not to wait",
    title: "Signs that need a professional, now",
    body: bulletBlock(theme.redFlags),
  });

  if (brief.slideCount >= 6) {
    drafts.push({
      type: "questions",
      kicker: "For the conversation",
      title: "Questions worth taking to your vet",
      body: bulletBlock(theme.questions),
    });
  }

  if (brief.slideCount >= 8) {
    drafts.push({
      type: "prevention",
      kicker: "Keep in mind",
      title: theme.preventionTitle,
      body: theme.preventionBody,
    });
  }

  if (brief.slideCount >= 9) {
    drafts.push({
      type: "extra",
      kicker: "Worth doing",
      title: theme.extraTitle,
      body: theme.extraBody,
    });
  }

  if (brief.slideCount >= 10) {
    drafts.push({
      type: "myth",
      kicker: "A common mix-up",
      title: theme.mythTitle,
      body: theme.mythBody,
    });
  }

  drafts.push({
    type: "cta",
    kicker: "Your next step",
    title: "Good care starts with a clearer question.",
    body:
      brief.audience === "veterinary-teams"
        ? "Use this draft as a starting point for client education. A qualified team reviews and adapts every line before it is shared."
        : brief.audience === "clinic-owners"
          ? "A clear explanation before the visit saves time in the room. Review this draft with your team and adapt it to your practice."
          : "Save this guide, write down what you have noticed, and speak to a provider who can look at the whole picture with you.",
    cta: audience.cta,
    imageNote: "Closing art: a calm, spacious image with room for text.",
  });

  return drafts.slice(0, brief.slideCount);
}

export function generateResearch(brief: StudioBrief): ResearchDeck {
  const theme = pickTheme(brief.topic);
  const topic = cleanTopic(brief.topic);
  const audience = AUDIENCE_PROFILES[brief.audience];
  const tone = TONE_PHRASES[brief.tone];

  return {
    summary: `A ${tone} ${CHANNEL_LABEL[brief.channel].toLowerCase()} for ${audience.label} on “${topic}”. The draft focuses on observation, safe next steps, and clear escalation rather than diagnosis.`,
    keyPoints: [
      ...theme.observations.slice(0, 2),
      `The core takeaway: ${theme.careSteps[0]}`,
      `Make the escalation path visible: ${theme.redFlags[0]}`,
    ],
    cautions: [
      "This is general education, not a diagnosis, treatment plan, or substitute for an examination.",
      "Do not include medicine names, doses, or home remedies unless a qualified veterinarian has supplied and approved them.",
      "Avoid fear-based claims and any invented statistic, study, or expert quote.",
      `Reviewer note: ${audience.reviewNote}`,
    ],
    questions: theme.questions,
    angles: [
      "A five-minute observation routine",
      "The questions that make a vet visit more useful",
      "When to stop watching and seek care",
    ],
    checks: [
      "Confirm any claim about causes, prevalence, or risk with a veterinary source.",
      "Check local emergency contacts and hours before publishing.",
      "Ask a qualified veterinarian to review species-specific details.",
      "Add a source or remove any product, diet, or behaviour recommendation.",
      "Review readability, contrast, and alt text before export.",
    ],
    engine: "local-demo",
    generatedAt: new Date().toISOString(),
  };
}

export function generateOutline(brief: StudioBrief, research?: ResearchDeck): OutlineItem[] {
  const drafts = buildSlideDrafts(brief);
  return drafts.map((slide, index) => ({
    id: `outline-${index + 1}`,
    title: slide.title,
    purpose: PURPOSE_BY_TYPE[slide.type] ?? "Support the narrative.",
    keyPoint:
      index === 0
        ? slide.body
        : index === drafts.length - 1 && research
          ? research.angles[0] ?? slide.body
          : slide.body.split("\n")[0] ?? "",
  }));
}

export function generateSlides(
  brief: StudioBrief,
  outline?: OutlineItem[],
): StudioSlide[] {
  const drafts = buildSlideDrafts(brief);
  return drafts.map((slide, index) => ({
    id: `slide-${index + 1}`,
    kicker: slide.kicker,
    title: outline?.[index]?.title?.trim() || slide.title,
    body: slide.body,
    cta: slide.cta,
    imageNote: slide.imageNote,
  }));
}

export function getThemeLabel(topic: string) {
  const theme = pickTheme(topic);
  const labels: Record<string, string> = {
    skin: "Skin & coat",
    dental: "Dental care",
    "cat-visit": "Low-stress cat visits",
    boarding: "Boarding & travel",
    senior: "Senior comfort",
    anxiety: "Fear & noise",
    nutrition: "Nutrition & weight",
    puppy: "Puppy & kitten care",
    emergency: "Emergency readiness",
    general: "General care",
  };
  return labels[theme.key] ?? "General care";
}

export function getAudienceLabel(audience: StudioAudience) {
  return AUDIENCE_PROFILES[audience].label;
}

export function getChannelLabel(channel: StudioChannel) {
  return CHANNEL_LABEL[channel];
}

export function getDesignDirection(id: string) {
  return DESIGN_DIRECTIONS.find((direction) => direction.id === id) ?? DESIGN_DIRECTIONS[0];
}

export function slideCountForBrief(brief: StudioBrief) {
  return buildSlideDrafts(brief).length;
}
