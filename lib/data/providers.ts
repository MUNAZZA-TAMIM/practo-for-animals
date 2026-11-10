export type ProviderCategory =
  | "veterinary"
  | "emergency"
  | "grooming"
  | "boarding"
  | "training"
  | "mobile"
  | "exotic"
  | "rescue"
  | "equine";

export type ProviderFeature =
  | "home-visits"
  | "emergency"
  | "open-24-7"
  | "cat-friendly"
  | "accessible"
  | "parking";

export type ProviderStatus = "published" | "paused" | "draft";

export type Provider = {
  id: string;
  slug: string;
  name: string;
  category: ProviderCategory;
  city: string;
  area: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  about: string;
  services: string[];
  species: string[];
  features: ProviderFeature[];
  hours: string;
  priceNote: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  status: ProviderStatus;
  featured: boolean;
  isSample: boolean;
  completeness: number;
  providerId?: string;
  updatedAt: string;
};

export const PROVIDER_CATEGORIES: {
  value: ProviderCategory;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  image?: string;
  imageAlt?: string;
}[] = [
  {
    value: "veterinary",
    label: "Veterinary care",
    shortLabel: "Vets",
    description: "Check-ups, diagnostics, dentistry and ongoing care.",
    icon: "Stethoscope",
    image: "/images/vet-care.jpg",
    imageAlt: "Veterinarian examining a German Shepherd in a clinic",
  },
  {
    value: "emergency",
    label: "Emergency care",
    shortLabel: "Emergency",
    description: "Urgent help when your companion needs it now.",
    icon: "Siren",
  },
  {
    value: "grooming",
    label: "Grooming & wellness",
    shortLabel: "Grooming",
    description: "Coat care, baths and gentle first-groom visits.",
    icon: "Scissors",
    image: "/images/golden-puppy.jpg",
    imageAlt: "Golden retriever puppy running through sunlit grass",
  },
  {
    value: "boarding",
    label: "Boarding & daycare",
    shortLabel: "Boarding",
    description: "Daycare, overnight stays and enrichment.",
    icon: "Home",
  },
  {
    value: "training",
    label: "Training & behaviour",
    shortLabel: "Training",
    description: "Puppy foundations, reactivity and family routines.",
    icon: "GraduationCap",
  },
  {
    value: "mobile",
    label: "Home visits",
    shortLabel: "Home visits",
    description: "Care that comes to your home, at your pace.",
    icon: "House",
  },
  {
    value: "exotic",
    label: "Exotic & avian care",
    shortLabel: "Exotic care",
    description: "Birds, rabbits and the smaller companions.",
    icon: "Bird",
    image: "/images/parrot.jpg",
    imageAlt: "Parrot perched on a mossy branch",
  },
  {
    value: "rescue",
    label: "Rescues & rehoming",
    shortLabel: "Rescues",
    description: "Trusts and networks supporting animals in need.",
    icon: "HeartHandshake",
    image: "/images/cat-high-five.jpg",
    imageAlt: "Kitten reaching a paw upward against a soft mint backdrop",
  },
  {
    value: "equine",
    label: "Equine care",
    shortLabel: "Equine",
    description: "Preventive and rehabilitative care for horses.",
    icon: "Heart",
  },
];

export const PROVIDER_FEATURES: {
  value: ProviderFeature;
  label: string;
  description: string;
}[] = [
  {
    value: "home-visits",
    label: "Home visits",
    description: "Provides care or collection at home.",
  },
  {
    value: "emergency",
    label: "Emergency care",
    description: "Handles urgent, unplanned visits.",
  },
  {
    value: "open-24-7",
    label: "Open 24/7",
    description: "Around-the-clock availability.",
  },
  {
    value: "cat-friendly",
    label: "Cat-friendly",
    description: "Quiet handling and cat-specific waiting areas.",
  },
  {
    value: "accessible",
    label: "Accessible",
    description: "Step-free access or other accessibility support.",
  },
  {
    value: "parking",
    label: "Parking nearby",
    description: "Convenient parking for appointments.",
  },
];

export const CITIES = [
  "Bengaluru",
  "Mumbai",
  "Pune",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
] as const;

export const SPECIES = [
  "Dog",
  "Cat",
  "Rabbit",
  "Bird",
  "Exotic",
  "Equine",
  "Livestock",
] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured first" },
  { value: "name", label: "Name A–Z" },
] as const;

const credit =
  "Photography via Unsplash or Pexels. Used illustratively; not the pictured provider.";

export const providers: Provider[] = [
  {
    id: "prov-cedar-clover",
    slug: "cedar-clover-veterinary",
    name: "Cedar & Clover Veterinary",
    category: "veterinary",
    city: "Bengaluru",
    area: "Indiranagar",
    address: "12, 100 Feet Road, Indiranagar, Bengaluru 560038",
    phone: "+91 80 5550 0142",
    email: "hello@cedarclover.example",
    website: "https://example.com/cedar-clover",
    about:
      "A neighbourhood practice built around unhurried consultations. Appointments allow space for questions, a full history, and a clear plan you can take home. The team works with dogs, cats and small companion animals, with particular experience in preventive and senior care.",
    services: [
      "Preventive check-ups",
      "Dental assessment",
      "Diagnostics & ultrasound",
      "Senior companion care",
      "Nutrition conversations",
    ],
    species: ["Dog", "Cat", "Rabbit"],
    features: ["cat-friendly", "accessible", "parking"],
    hours: "Mon–Sat · 9:00–19:00",
    priceNote: "Consultation pricing is shared before booking. Sample listing.",
    image: "/images/vet-care.jpg",
    imageAlt: "Veterinarian listening to a German Shepherd's chest with a stethoscope",
    imageCredit: credit,
    status: "published",
    featured: true,
    isSample: true,
    providerId: "user-provider-cedar",
    completeness: 94,
    updatedAt: "2026-11-07T09:30:00.000Z",
  },
  {
    id: "prov-pawline",
    slug: "pawline-emergency",
    name: "Pawline Emergency & Critical Care",
    category: "emergency",
    city: "Bengaluru",
    area: "Koramangala",
    address: "48, 80 Feet Road, Koramangala, Bengaluru 560034",
    phone: "+91 80 5550 0119",
    email: "triage@pawline.example",
    website: "https://example.com/pawline",
    about:
      "A sample emergency listing designed around the questions a worried caregiver actually needs answered: who is on duty, what to bring, and what happens on arrival. This concept listing does not represent a real emergency service.",
    services: [
      "Emergency triage",
      "Critical care",
      "Digital imaging",
      "Overnight observation",
    ],
    species: ["Dog", "Cat", "Bird"],
    features: ["emergency", "open-24-7", "parking"],
    hours: "Open 24 hours · Sample listing",
    priceNote:
      "Emergency costs vary. Ask for an estimate on arrival. Sample listing.",
    image: "/images/vet-xray.jpg",
    imageAlt: "Veterinarian reviewing a digital X-ray of a dog",
    imageCredit: credit,
    status: "published",
    featured: true,
    isSample: true,
    completeness: 88,
    updatedAt: "2026-11-06T15:10:00.000Z",
  },
  {
    id: "prov-grooming-room",
    slug: "the-grooming-room",
    name: "The Grooming Room",
    category: "grooming",
    city: "Mumbai",
    area: "Bandra West",
    address: "7, Pali Hill Road, Bandra West, Mumbai 400050",
    phone: "+91 22 5550 0186",
    email: "studio@thegroomingroom.example",
    about:
      "A quiet, appointment-only grooming studio. First visits include a handling check and a coat consultation before any clipping, so the experience is paced to the animal rather than the clock. The studio also supports gentle de-shedding and senior coats.",
    services: [
      "Coat assessment",
      "Breed-specific trims",
      "Bath & blow-dry",
      "Nail care",
      "Puppy first groom",
    ],
    species: ["Dog", "Cat"],
    features: ["cat-friendly", "accessible"],
    hours: "Tue–Sun · 10:00–18:00",
    priceNote: "Final price depends on coat and handling time. Sample listing.",
    image: "/images/golden-puppy.jpg",
    imageAlt: "Golden retriever puppy running through sunlit grass",
    imageCredit: credit,
    status: "published",
    featured: true,
    isSample: true,
    completeness: 91,
    updatedAt: "2026-11-08T11:00:00.000Z",
  },
  {
    id: "prov-companion-boarding",
    slug: "companion-boarding-co",
    name: "Companion Boarding Co.",
    category: "boarding",
    city: "Pune",
    area: "Kalyani Nagar",
    address: "21, North Avenue, Kalyani Nagar, Pune 411006",
    phone: "+91 20 5550 0134",
    email: "stay@companionboarding.example",
    about:
      "Small-group daycare and overnight boarding with structured rest, outdoor play, and a daily note home. Spaces are limited so each animal has a predictable routine. A sample listing built to show how transparent boarding information could look.",
    services: [
      "Daycare",
      "Overnight boarding",
      "Enrichment sessions",
      "Pickup & drop",
    ],
    species: ["Dog"],
    features: ["parking"],
    hours: "Mon–Sun · 7:30–19:30",
    priceNote: "Trial day required before first overnight stay. Sample listing.",
    image: "/images/dog-run.jpg",
    imageAlt: "Two happy dogs running towards the camera at golden hour",
    imageCredit: credit,
    status: "published",
    featured: false,
    isSample: true,
    completeness: 86,
    updatedAt: "2026-11-05T08:45:00.000Z",
  },
  {
    id: "prov-calm-canine",
    slug: "calm-canine-behaviour",
    name: "Calm Canine Behaviour Studio",
    category: "training",
    city: "Delhi NCR",
    area: "Greater Kailash",
    address: "B-42, Greater Kailash II, New Delhi 110048",
    phone: "+91 11 5550 0171",
    email: "hello@calmcanine.example",
    about:
      "Force-free behaviour support for puppies and adult dogs. The studio starts with a family questionnaire and a calm observation session, then builds a realistic plan you can practise in short daily sessions. Not a boarding or bootcamp programme.",
    services: [
      "Puppy foundations",
      "Reactivity support",
      "Separation-related behaviour plans",
      "Family handling sessions",
    ],
    species: ["Dog"],
    features: ["home-visits"],
    hours: "Tue–Sat · 10:00–18:00 · By appointment",
    priceNote: "Initial consultation and plan quoted separately. Sample listing.",
    image: "/images/dog-portrait.jpg",
    imageAlt: "Golden retriever looking directly at the camera after a swim",
    imageCredit: credit,
    status: "published",
    featured: true,
    isSample: true,
    completeness: 90,
    updatedAt: "2026-11-07T18:20:00.000Z",
  },
  {
    id: "prov-home-vet",
    slug: "dr-meeras-home-vet",
    name: "Dr. Meera's Home Vet",
    category: "mobile",
    city: "Mumbai",
    area: "Powai",
    address: "Home visits across Powai, Chandivali and Vikhroli",
    phone: "+91 22 5550 0163",
    email: "visits@homevet.example",
    about:
      "A sample home-visit veterinary practice for routine wellness, vaccination and senior checks. Visits are planned with a pre-call so the home can be prepared and the animal has a quiet space. This is a concept listing, not a real practice.",
    services: [
      "Home wellness visits",
      "Vaccination visits",
      "Senior mobility checks",
      "Sample collection",
    ],
    species: ["Dog", "Cat"],
    features: ["home-visits", "cat-friendly"],
    hours: "Mon–Sat · 9:00–17:00 · By appointment",
    priceNote: "Home-visit fee confirmed before booking. Sample listing.",
    image: "/images/vet-portrait.jpg",
    imageAlt: "Veterinarian carefully holding a small orange Pomeranian",
    imageCredit: credit,
    status: "published",
    featured: true,
    isSample: true,
    completeness: 84,
    updatedAt: "2026-11-04T12:15:00.000Z",
  },
  {
    id: "prov-feather-fur",
    slug: "feather-and-fur-clinic",
    name: "Feather & Fur Clinic",
    category: "exotic",
    city: "Bengaluru",
    area: "Jayanagar",
    address: "9, 11th Main Road, Jayanagar 4th Block, Bengaluru 560011",
    phone: "+91 80 5550 0128",
    email: "care@featherfur.example",
    about:
      "A sample clinic focused on birds, rabbits and small exotic companions. The listing includes the details that matter before a visit: species seen, quiet hours, carrier guidance, and what to bring. It does not represent a real clinic.",
    services: [
      "Avian wellness",
      "Small mammal care",
      "Husbandry consultations",
      "Beak & nail care",
    ],
    species: ["Bird", "Rabbit", "Exotic"],
    features: ["accessible", "parking"],
    hours: "Mon–Sat · 9:30–18:00",
    priceNote: "Exotic species consultation quoted on enquiry. Sample listing.",
    image: "/images/parrot.jpg",
    imageAlt: "Bright green parrot perched on a branch in soft forest light",
    imageCredit: credit,
    status: "published",
    featured: false,
    isSample: true,
    completeness: 80,
    updatedAt: "2026-11-03T10:10:00.000Z",
  },
  {
    id: "prov-hoof-hound",
    slug: "hoof-and-hound-equine",
    name: "Hoof & Hound Equine Care",
    category: "equine",
    city: "Delhi NCR",
    area: "Gurugram",
    address: "Farm visits across South Gurugram · Sample address",
    phone: "+91 124 555 0148",
    email: "equine@hoofandhound.example",
    about:
      "A sample equine practice offering preventive and rehabilitative support for horses, with farm visits coordinated alongside farriers and trainers. The listing demonstrates how specialist care information could be structured; it is not a real practice.",
    services: [
      "Lameness assessment",
      "Equine dental checks",
      "Preventive wellness",
      "Farrier coordination",
    ],
    species: ["Equine"],
    features: ["home-visits"],
    hours: "By appointment · Farm visits",
    priceNote: "Visit fee depends on distance. Sample listing.",
    image: "/images/horse.jpg",
    imageAlt: "White horse cantering through a dark green meadow",
    imageCredit: credit,
    status: "published",
    featured: false,
    isSample: true,
    completeness: 76,
    updatedAt: "2026-11-02T16:40:00.000Z",
  },
  {
    id: "prov-whisker-wellness",
    slug: "whisker-wellness-cat-clinic",
    name: "Whisker Wellness Cat Clinic",
    category: "veterinary",
    city: "Chennai",
    area: "Alwarpet",
    address: "3, TTK Road, Alwarpet, Chennai 600018",
    phone: "+91 44 5550 0156",
    email: "quiet@whiskerwellness.example",
    about:
      "A cat-only sample clinic designed around low-stress visits: quiet waiting slots, towel-covered carriers, and longer appointment windows. The page shows how species-specific detail can help a caregiver choose with confidence.",
    services: [
      "Cat-only consultations",
      "Dental assessment",
      "Senior cat care",
      "Behaviour conversations",
    ],
    species: ["Cat"],
    features: ["cat-friendly", "accessible"],
    hours: "Mon–Sat · 10:00–18:30 · Quiet hours 10–12",
    priceNote: "Phone estimate provided before booking. Sample listing.",
    image: "/images/cat.jpg",
    imageAlt: "Black and white cat resting its paws on a bamboo rail",
    imageCredit: credit,
    status: "published",
    featured: true,
    isSample: true,
    completeness: 93,
    updatedAt: "2026-11-08T14:05:00.000Z",
  },
  {
    id: "prov-bunny-bloom",
    slug: "bunny-bloom-small-pet-care",
    name: "Bunny Bloom Small Pet Care",
    category: "exotic",
    city: "Hyderabad",
    area: "Banjara Hills",
    address: "8, Road No. 12, Banjara Hills, Hyderabad 500034",
    phone: "+91 40 5550 0139",
    email: "hello@bunnybloom.example",
    about:
      "A sample small-pet practice for rabbits, guinea pigs and other companion exotics. The listing prioritises husbandry, diet and environment conversations alongside routine checks. It is a demonstration listing only.",
    services: [
      "Rabbit wellness checks",
      "Dental health",
      "Nail & coat care",
      "Habitat advice",
    ],
    species: ["Rabbit", "Exotic"],
    features: ["accessible"],
    hours: "Tue–Sun · 10:00–17:00",
    priceNote: "Booking deposit may apply. Sample listing.",
    image: "/images/rabbit.jpg",
    imageAlt: "White rabbit sitting in a green garden",
    imageCredit: credit,
    status: "published",
    featured: false,
    isSample: true,
    completeness: 78,
    updatedAt: "2026-11-01T09:25:00.000Z",
  },
  {
    id: "prov-second-chance",
    slug: "second-chance-animal-trust",
    name: "Second Chance Animal Trust",
    category: "rescue",
    city: "Bengaluru",
    area: "Whitefield",
    address: "Sample rescue address · Whitefield, Bengaluru",
    phone: "+91 80 5550 0107",
    email: "help@secondchance.example",
    about:
      "A sample rescue and rehoming network. In a real listing, this section would cover intake policy, adoption process, foster support, and how to report an animal in distress. Here it shows how a rescue could be represented without invented impact numbers or donor claims.",
    services: [
      "Rescue coordination",
      "Foster network",
      "Adoption counselling",
      "Community feeding support",
    ],
    species: ["Dog", "Cat"],
    features: ["home-visits"],
    hours: "Helpline · 9:00–18:00 · Sample listing",
    priceNote: "No fees claimed. Sample listing; contact details are illustrative.",
    image: "/images/hero-dog.jpg",
    imageAlt: "Golden retriever holding a yellow tulip gently in its mouth",
    imageCredit: credit,
    status: "published",
    featured: false,
    isSample: true,
    completeness: 72,
    updatedAt: "2026-10-30T13:00:00.000Z",
  },
  {
    id: "prov-paws-pause",
    slug: "paws-and-pause-pet-sitting",
    name: "Paws & Pause Pet Sitting",
    category: "boarding",
    city: "Hyderabad",
    area: "Jubilee Hills",
    address: "Home visits across Jubilee Hills and Banjara Hills",
    phone: "+91 40 5550 0192",
    email: "care@pawspause.example",
    about:
      "A sample in-home pet-sitting service for cats and small dogs who prefer their own space. Visits include feeding, fresh water, play, litter or garden checks, and a photo note. This is not a medical or veterinary service.",
    services: [
      "Daily drop-in visits",
      "Overnight sitting",
      "Feeding routines",
      "Home safety check",
    ],
    species: ["Cat", "Dog", "Rabbit"],
    features: ["home-visits", "cat-friendly"],
    hours: "Mon–Sun · 7:00–21:00",
    priceNote: "Meet-and-greet required before first booking. Sample listing.",
    image: "/images/cat-high-five.jpg",
    imageAlt: "Kitten reaching a paw up against a soft mint background",
    imageCredit: credit,
    status: "published",
    featured: false,
    isSample: true,
    completeness: 82,
    updatedAt: "2026-11-06T17:30:00.000Z",
  },
];

export function getCategory(value: ProviderCategory) {
  return PROVIDER_CATEGORIES.find((category) => category.value === value);
}

export function getCategoryLabel(value: ProviderCategory) {
  return getCategory(value)?.label ?? value;
}

export function getFeatureLabel(value: ProviderFeature) {
  return PROVIDER_FEATURES.find((feature) => feature.value === value)?.label ?? value;
}

export function getProviderBySlug(slug: string) {
  return providers.find((provider) => provider.slug === slug);
}

export const featuredProviders = providers.filter((provider) => provider.featured);
