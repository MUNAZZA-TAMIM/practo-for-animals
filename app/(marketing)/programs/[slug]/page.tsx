import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  Laptop,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getProgramme, programmes } from "@/lib/data/programs";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return programmes.map((programme) => ({ slug: programme.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) return { title: "Programme not found" };
  return {
    title: programme.name,
    description: programme.summary,
  };
}

export default async function ProgrammePage({ params }: PageProps) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();

  const related = programmes.filter((item) => item.slug !== programme.slug).slice(0, 2);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-ivory-100">
        <div
          className="pointer-events-none absolute -right-48 -top-40 h-[36rem] w-[36rem] rounded-full border border-forest-900/[0.06]"
          aria-hidden="true"
        />
        <div className="container-page relative py-8 sm:py-10 lg:py-12">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-semibold text-ink-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-forest-900">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-ink-muted/50" aria-hidden="true" />
                <Link href="/education" className="transition-colors hover:text-forest-900">
                  AI Academy
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-ink-muted/50" aria-hidden="true" />
                <span className="text-forest-900" aria-current="page">
                  {programme.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-mint-100">
                <Image
                  src={programme.image}
                  alt={programme.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-forest-950/40 to-transparent p-4">
                  <Badge variant="ghostInverse">{programme.label}</Badge>
                  <Badge variant="sample" className="bg-ivory-50/92">
                    Concept programme
                  </Badge>
                </div>
              </div>
              <p className="mt-2 text-[9.5px] leading-4 text-ink-muted/70">
                {programme.imageCredit}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <p className="kicker">AI Academy · Programme</p>
              <h1 className="mt-4 text-[40px] leading-[0.98] tracking-[-0.045em] text-forest-900 sm:text-[52px] lg:text-[56px]">
                {programme.name}
              </h1>
              <p className="mt-5 max-w-xl text-[14.5px] leading-7 text-ink-muted">
                {programme.summary}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-white-warm p-3">
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                    <Clock3 className="h-3 w-3" aria-hidden="true" />
                    Duration
                  </p>
                  <p className="mt-1.5 text-[11.5px] font-semibold text-forest-900">
                    {programme.duration}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-white-warm p-3">
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                    <Laptop className="h-3 w-3" aria-hidden="true" />
                    Format
                  </p>
                  <p className="mt-1.5 text-[11.5px] font-semibold text-forest-900">
                    {programme.format}
                  </p>
                </div>
                <div className="col-span-2 rounded-xl border border-line bg-white-warm p-3 sm:col-span-1">
                  <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
                    <Users className="h-3 w-3" aria-hidden="true" />
                    Effort
                  </p>
                  <p className="mt-1.5 text-[11.5px] font-semibold text-forest-900">
                    {programme.effort}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild>
                  <Link href={`/education?programme=${programme.slug}#enquire`}>
                    Register interest
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/education#curriculum">See the method</Link>
                </Button>
              </div>
              <p className="mt-4 text-[10px] leading-4 text-ink-muted">
                No confirmed dates, payment or placement is claimed. This is an expression of
                interest only.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_330px] lg:gap-14">
            <div className="min-w-0">
              <div>
                <p className="kicker">The programme</p>
                <h2 className="mt-4 max-w-2xl text-[34px] leading-[1.03] tracking-[-0.035em] text-forest-900 sm:text-[42px]">
                  A working programme, not a{" "}
                  <span className="display-italic text-forest-700">prompt library.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-[14px] leading-7 text-ink-muted">
                  {programme.description}
                </p>
              </div>

              <div className="mt-9 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="font-sans text-[16px] font-bold text-forest-900">Who it’s for</h3>
                  <ul className="mt-4 space-y-2.5">
                    {programme.audience.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-5 text-forest-800">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-700">
                          <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-sans text-[16px] font-bold text-forest-900">What you leave with</h3>
                  <ul className="mt-4 space-y-2.5">
                    {programme.outcomes.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-5 text-forest-800">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-700">
                          <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="kicker">Curriculum</p>
                    <h2 className="mt-3 text-[32px] leading-tight tracking-[-0.03em] text-forest-900 sm:text-[40px]">
                      Four working modules.
                    </h2>
                  </div>
                  <Badge variant="outline">{programme.modules.length} modules</Badge>
                </div>
                <Accordion type="single" collapsible className="mt-5 border-t border-line">
                  {programme.modules.map((module, index) => (
                    <AccordionItem key={module.title} value={`module-${index}`}>
                      <AccordionTrigger>
                        <span className="flex items-start gap-4 text-left">
                          <span className="mt-1 font-display text-[15px] font-normal text-coral-ink">
                            0{index + 1}
                          </span>
                          <span>
                            <span className="block">{module.title}</span>
                            <span className="mt-1 block text-[11.5px] font-normal leading-5 text-ink-muted">
                              {module.summary}
                            </span>
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 border-l border-line pl-4">
                          {module.lessons.map((lesson) => (
                            <li key={lesson} className="text-[12.5px] leading-6 text-ink-muted">
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="mt-12 rounded-[20px] border border-line bg-ivory-100/60 p-6">
                <h3 className="font-display text-[25px] leading-tight text-forest-900">
                  Outcomes, in full
                </h3>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {programme.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2.5 text-[11.5px] leading-5 text-forest-800">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" strokeWidth={2.5} aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-line pt-4 text-[10.5px] leading-5 text-ink-muted">
                  Outcomes describe the intended exercises and artefacts of the concept programme.
                  They are not guarantees of employment, placement or clinical competence.
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-[30px] leading-tight tracking-[-0.03em] text-forest-900">
                  Programme questions
                </h2>
                <Accordion type="single" collapsible className="mt-4 border-t border-line">
                  {programme.faqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`programme-faq-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <aside>
              <div className="space-y-4 lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-[20px] border border-line bg-white-warm">
                  <div className="bg-forest-950 p-5 text-ivory-50">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mint-300">
                      At a glance
                    </p>
                    <p className="mt-2 font-display text-[25px] leading-tight">
                      {programme.nextCohort}
                    </p>
                    <p className="mt-1.5 text-[10.5px] leading-4 text-ivory-50/50">
                      No cohort date is confirmed. This is an expression-of-interest flow.
                    </p>
                  </div>
                  <dl className="divide-y divide-line px-5">
                    <div className="flex items-center justify-between gap-4 py-3.5">
                      <dt className="flex items-center gap-2 text-[10.5px] font-medium text-ink-muted">
                        <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                        Duration
                      </dt>
                      <dd className="text-[11.5px] font-bold text-forest-900">{programme.duration}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-3.5">
                      <dt className="flex items-center gap-2 text-[10.5px] font-medium text-ink-muted">
                        <Laptop className="h-3.5 w-3.5" aria-hidden="true" />
                        Format
                      </dt>
                      <dd className="text-right text-[11.5px] font-bold text-forest-900">
                        {programme.format}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 py-3.5">
                      <dt className="flex items-center gap-2 text-[10.5px] font-medium text-ink-muted">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        Weekly effort
                      </dt>
                      <dd className="text-right text-[11.5px] font-bold text-forest-900">
                        {programme.effort}
                      </dd>
                    </div>
                  </dl>
                  <div className="p-5 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/education?programme=${programme.slug}#enquire`}>
                        Register interest
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-[20px] border border-amber-ink/15 bg-amber-bg p-5">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-amber-ink">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Honest scope
                  </p>
                  <p className="mt-3 text-[11px] leading-5 text-amber-ink/85">
                    This is a concept education product. It is not veterinary training, does not
                    provide a qualification, takes no payment, and has no confirmed cohort or
                    placement.
                  </p>
                </div>

                <div className="rounded-[20px] border border-line bg-mint-100/70 p-5">
                  <p className="font-display text-[22px] leading-tight text-forest-900">
                    Other programmes
                  </p>
                  <div className="mt-4 space-y-3">
                    {related.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/programs/${item.slug}`}
                        className="group flex items-start justify-between gap-3 border-t border-forest-900/10 pt-3 first:border-t-0 first:pt-0"
                      >
                        <div>
                          <p className="text-[11.5px] font-bold leading-5 text-forest-900">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-ink-muted">{item.duration}</p>
                        </div>
                        <ArrowUpRight
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-forest-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12 border-t border-line pt-6">
            <Button asChild variant="weakness">
              <Link href="/education">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to the Academy
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
