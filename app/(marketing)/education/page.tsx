import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  Compass,
  Feather,
  GraduationCap,
  Layers,
  MessageSquareQuote,
  PenLine,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EducationForm } from "@/components/forms/education-form";
import { educationFaqs, programmes } from "@/lib/data/programs";

export const metadata: Metadata = {
  title: "AI Academy",
  description:
    "Practical, responsible AI education for veterinary teams, animal NGOs and pet-care communicators. A concept programme built around human review.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const audiences = [
  {
    icon: GraduationCap,
    title: "Veterinary teams",
    body: "Reduce administrative drag without handing clinical judgement to a model.",
  },
  {
    icon: Users,
    title: "Clinic owners",
    body: "Build a small, realistic system your team can actually sustain.",
  },
  {
    icon: Feather,
    title: "Pet-care brands",
    body: "Turn audience questions into content with a visible research trail.",
  },
  {
    icon: MessageSquareQuote,
    title: "Animal NGOs",
    body: "Communicate with warmth and clarity while keeping claims accountable.",
  },
];

const curriculum = [
  {
    step: "01",
    title: "Start with a real job",
    description:
      "Map one workflow or content question. Separate useful assistance from risky shortcuts.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Understand the audience",
    description:
      "Who is reading, what do they already know, and what decision are they trying to make?",
    icon: Users,
  },
  {
    step: "03",
    title: "Research with a paper trail",
    description:
      "Use AI for structure, not invented authority. Keep claims visible, sourced or removed.",
    icon: ScanSearch,
  },
  {
    step: "04",
    title: "Write the outline",
    description:
      "Give the work a narrative: a hook, a useful middle, and a clear next step.",
    icon: Layers,
  },
  {
    step: "05",
    title: "Draft and edit",
    description:
      "Produce editable copy and a design direction, then cut anything that sounds like advice.",
    icon: PenLine,
  },
  {
    step: "06",
    title: "Review before it leaves",
    description:
      "A named human checks claims, safety, tone and accessibility. That is the publish gate.",
    icon: ClipboardCheck,
  },
];

export default async function EducationPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const requested = Array.isArray(raw.programme) ? raw.programme[0] : raw.programme;
  const defaultProgramme = programmes.some((programme) => programme.slug === requested)
    ? requested
    : undefined;

  return (
    <>
      <PageHero
        eyebrow="The AI Academy"
        title={
          <>
            Learn to use AI without leaving{" "}
            <span className="display-italic text-coral-600">judgement</span> behind.
          </>
        }
        description="Working programmes for animal-health teams and pet-care communicators. Less prompt theatre. More useful workflows, clear boundaries, and a human review step that holds."
        breadcrumbs={[{ href: "/education", label: "AI Academy" }]}
        actions={
          <>
            <Button asChild size="lg">
              <a href="#programmes">
                Explore programmes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#curriculum">See the method</a>
            </Button>
          </>
        }
        aside={
          <div className="relative">
            <div className="relative ml-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden rounded-[999px_999px_22px_22px] bg-mint-200">
              <Image
                src="/images/vet-portrait.jpg"
                alt="Veterinarian carefully holding a small orange Pomeranian"
                fill
                sizes="(max-width: 1024px) 80vw, 32vw"
                className="object-cover object-[50%_35%]"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-forest-950/60 to-transparent" />
            </div>
            <div className="absolute -left-2 bottom-8 w-[210px] rounded-2xl border border-line bg-white-warm p-4 shadow-[0_20px_50px_-30px_rgba(13,43,35,0.5)] sm:-left-8">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-coral-500/15 text-coral-ink">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-forest-700">
                  The principle
                </p>
              </div>
              <p className="mt-2.5 font-display text-[21px] leading-[1.1] text-forest-900">
                AI can draft. A person has to decide.
              </p>
            </div>
            <span className="absolute -right-4 top-8 hidden rounded-full border border-line bg-white-warm px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-amber-ink shadow-sm sm:inline-flex">
              Concept programme
            </span>
          </div>
        }
      />

      <section className="border-b border-line bg-white-warm">
        <div className="container-page grid gap-px py-0 sm:grid-cols-3">
          {[
            {
              icon: BookOpenCheck,
              label: "3 focused programmes",
              detail: "From a two-week sprint to a four-week working programme.",
            },
            {
              icon: ShieldCheck,
              label: "Human review, taught",
              detail: "Every workflow includes a named approval checkpoint.",
            },
            {
              icon: Sparkles,
              label: "No prompt theatre",
              detail: "Plain-language methods you can use in a real working week.",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-start gap-3.5 py-6 sm:px-6 ${index > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""}`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-800">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-forest-900">{item.label}</p>
                  <p className="mt-1 text-[11px] leading-5 text-ink-muted">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <SectionHeading
            eyebrow="Who it is for"
            title={
              <>
                Built for people who carry the{" "}
                <span className="display-italic text-forest-700">responsibility.</span>
              </>
            }
            description="You do not need to be technical. You do need to care about accuracy, privacy and the experience of the person on the other side of the screen."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <div
                  key={audience.title}
                  className="rounded-[18px] border border-line bg-white-warm p-5"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-[13px] bg-mint-100 text-forest-800">
                    <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-display text-[24px] leading-tight tracking-[-0.02em] text-forest-900">
                    {audience.title}
                  </h3>
                  <p className="mt-2.5 text-[12px] leading-5 text-ink-muted">{audience.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-ivory-100/70" id="curriculum">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[26px] bg-forest-950 px-6 py-10 text-ivory-50 sm:px-10 lg:px-14 lg:py-14">
            <div
              className="pointer-events-none absolute -right-40 -top-52 h-[36rem] w-[36rem] rounded-full border border-ivory-50/[0.07]"
              aria-hidden="true"
            />
            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <p className="kicker text-mint-300">The method</p>
                <h2 className="mt-4 max-w-md text-[38px] leading-[1.01] tracking-[-0.04em] text-ivory-50 sm:text-[48px]">
                  Six stages from a{" "}
                  <span className="display-italic text-mint-300">useful idea</span> to a reviewed
                  output.
                </h2>
                <p className="mt-5 max-w-sm text-[13.5px] leading-7 text-ivory-50/60">
                  The same method powers the Content Studio. You learn it by working through one
                  real brief, not by collecting prompt templates.
                </p>
                <Button asChild variant="inverse" className="mt-7">
                  <Link href="/content-studio">
                    Try the Studio
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <p className="mt-5 text-[10px] leading-4 text-ivory-50/40">
                  Studio research is generated by a local, deterministic demo engine. No external
                  model call is made.
                </p>
              </div>

              <div className="divide-y divide-ivory-50/12 border-y border-ivory-50/12">
                {curriculum.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="grid grid-cols-[42px_28px_1fr] items-start gap-3 py-4 sm:gap-4 sm:py-5"
                    >
                      <span className="font-display text-[20px] leading-none text-coral-300">
                        {item.step}
                      </span>
                      <span className="grid h-7 w-7 place-items-center rounded-full border border-ivory-50/15 text-mint-300">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-sans text-[13.5px] font-bold text-ivory-50">
                          {item.title}
                        </h3>
                        <p className="mt-1 max-w-lg text-[11.5px] leading-5 text-ivory-50/55">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="programmes">
        <div className="container-page">
          <SectionHeading
            eyebrow="The programmes"
            title={
              <>
                Choose the{" "}
                <span className="display-italic text-coral-600">working problem</span> you want to
                solve.
              </>
            }
            description="Every programme is built around a practical output. Outlines and cohorts are illustrative; no dates, placements or payments are live."
            action={
              <Badge variant="sample" className="w-fit">
                Concept programmes
              </Badge>
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme) => (
              <article
                key={programme.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white-warm card-lift"
              >
                <Link
                  href={`/programs/${programme.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-mint-100"
                >
                  <Image
                    src={programme.image}
                    alt={programme.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-forest-950/40 to-transparent p-4">
                    <Badge variant="ghostInverse">{programme.label}</Badge>
                    <span className="rounded-full bg-ivory-50/90 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-forest-900 backdrop-blur-sm">
                      {programme.duration}
                    </span>
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-[27px] leading-[1.06] tracking-[-0.025em] text-forest-900">
                    {programme.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[12.5px] leading-6 text-ink-muted">
                    {programme.summary}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
                    <div>
                      <dt className="text-[9px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
                        Format
                      </dt>
                      <dd className="mt-1 text-[10.5px] font-semibold leading-4 text-forest-900">
                        {programme.format}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[9px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
                        Effort
                      </dt>
                      <dd className="mt-1 text-[10.5px] font-semibold leading-4 text-forest-900">
                        {programme.effort}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-auto pt-5">
                    <Link
                      href={`/programs/${programme.slug}`}
                      className="inline-flex items-center gap-2 text-[11.5px] font-bold text-forest-900"
                    >
                      View programme
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-line/70 bg-ivory-100/60">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:gap-16">
            <div className="relative">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-mint-100">
                <Image
                  src="/images/vet-care.jpg"
                  alt="Veterinarian examining a German Shepherd"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-forest-950/50 p-4 backdrop-blur-sm">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-mint-300">
                    The output
                  </p>
                  <p className="mt-1.5 font-display text-[21px] leading-tight text-ivory-50">
                    A workflow your team can use on a normal Tuesday.
                  </p>
                </div>
              </div>
              <div className="absolute -right-3 -top-4 hidden rounded-2xl border border-line bg-white-warm p-3.5 shadow-[0_16px_40px_-26px_rgba(13,43,35,0.45)] sm:block">
                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-ink-muted/70">
                  Reviewed, not automated
                </p>
                <p className="mt-1.5 font-display text-[20px] text-forest-900">100% human gate</p>
              </div>
            </div>

            <div>
              <p className="kicker">What you leave with</p>
              <h2 className="mt-4 max-w-lg text-[38px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[46px]">
                Artefacts, not{" "}
                <span className="display-italic text-forest-700">certificates of confidence.</span>
              </h2>
              <ul className="mt-6 space-y-3.5">
                {[
                  "One mapped workflow with a named human owner.",
                  "A reusable prompt brief that carries context, constraints and audience.",
                  "A review checklist for claims, medical safety, tone and accessibility.",
                  "A one-page AI policy draft for your team.",
                  "A 30-day adoption plan you can test in real work.",
                ].map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-[13px] leading-6 text-forest-800">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest-900 text-ivory-50">
                      <Check className="h-3 w-3" strokeWidth={2.6} aria-hidden="true" />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-xl text-[11px] leading-5 text-ink-muted">
                This is not veterinary, medical or clinical training. It does not confer a
                qualification or replace professional judgement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="enquire">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="kicker">Register interest</p>
              <h2 className="mt-4 text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[48px]">
                Start with one{" "}
                <span className="display-italic text-coral-600">real question.</span>
              </h2>
              <p className="mt-5 max-w-md text-[14px] leading-7 text-ink-muted">
                Tell us what you would like to make easier. In a live programme, this would help
                shape the studio examples and the cohort conversation.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "No payment is taken and no cohort date is confirmed.",
                  "Your details are stored in the local demo data store only.",
                  "No marketing email, CRM sync or sales sequence is connected.",
                  "This is not veterinary training or clinical advice.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-[11.5px] leading-5 text-forest-800">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-[18px] border border-line bg-mint-100/60 p-5">
                <p className="font-display text-[22px] leading-tight text-forest-900">
                  Prefer to try the method first?
                </p>
                <p className="mt-2 text-[11.5px] leading-5 text-ink-muted">
                  The Content Studio is open without an account. Create a draft, review it, and
                  export it as a local file.
                </p>
                <Button asChild variant="secondary" size="sm" className="mt-4">
                  <Link href="/content-studio">
                    Open the Studio
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[22px] border border-line bg-white-warm p-5 shadow-card sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4 border-b border-line pb-5">
                <div>
                  <h3 className="font-display text-[27px] leading-tight text-forest-900">
                    Enquire about a programme
                  </h3>
                  <p className="mt-1.5 text-[11.5px] leading-5 text-ink-muted">
                    A short expression of interest, not a confirmed enrolment.
                  </p>
                </div>
                <Badge variant="sample">Demo</Badge>
              </div>
              <EducationForm
                programmes={programmes.map((programme) => ({
                  slug: programme.slug,
                  name: programme.name,
                  duration: programme.duration,
                }))}
                defaultProgramme={defaultProgramme}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-line/70 bg-ivory-100/60">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="kicker">Questions, answered</p>
              <h2 className="mt-4 max-w-sm text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[48px]">
                The honest{" "}
                <span className="display-italic text-forest-700">small print.</span>
              </h2>
              <p className="mt-5 max-w-sm text-[13px] leading-7 text-ink-muted">
                This Academy is a concept product for an internship assignment. The method is real;
                the commercial programme is illustrative.
              </p>
            </div>
            <Accordion type="single" collapsible className="border-t border-line">
              {educationFaqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`education-faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
