import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import BlurFade from "@/components/magicui/blur-fade";
import { siteContent } from "@/data/site-content";
import {
  Timeline,
  TimelineItem,
  TimelineConnectItem,
} from "@/components/timeline";
import { sectionIndex } from "@/lib/sections";
import { withBase } from "@/lib/base";
import { Icons, type IconProps } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronDown, Mail } from "lucide-react";

const BLUR_FADE_DELAY = 0.05;

/**
 * Hover-intent windows for the section peek. Collapsed headings stack close
 * together, so without a lead-in delay a pointer merely crossing the page
 * flutters several sections open and shut. The closing delay is the longer of
 * the two so that clipping a corner on the way to the content does not snap it
 * back down.
 */
const PEEK_OPEN_MS = 110;
const PEEK_CLOSE_MS = 240;

/**
 * Height collapse that measures its children. CSS `0fr`→`1fr` transitions and
 * Motion's `height: "auto"` both failed to open panels in Chromium here, so
 * we animate between `0` and the observed pixel height instead.
 */
function Collapsible({
  id,
  open,
  className,
  children,
}: {
  id?: string;
  open: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Rounded up: `scrollHeight` is an integer, so fractional content heights
    // lose their last sub-pixel row to the `overflow-hidden` above.
    const measure = () =>
      setHeight(Math.ceil(el.getBoundingClientRect().height));
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      id={id}
      // `inert` rather than `aria-hidden`: the collapsed copy is clipped but
      // still laid out, so without it the links and buttons inside stay in the
      // tab order and focus disappears into a section nobody can see.
      inert={!open}
      className={cn("overflow-hidden", className)}
      style={{
        height: open ? height : 0,
        transition: shouldReduceMotion
          ? undefined
          : "height 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* `flow-root` establishes a block formatting context. Without it the
          child's top margin collapses straight through this wrapper, so it
          lands outside the box `scrollHeight` reports and the panel opens
          that many pixels short — clipping the end of every section. */}
      <div ref={contentRef} className="flow-root">
        {children}
      </div>
    </div>
  );
}

const {
  basics,
  about,
  experience,
  research,
  projects,
  education,
  skills,
  awards,
  certifications,
} = siteContent;

const linkIcons: Record<string, (props: IconProps) => React.ReactNode> = {
  github: Icons.github,
  linkedin: Icons.linkedin,
};

type Metric = { value: string; label: string };

/* -------------------------------------------------------------------------- */
/*  Shared editorial primitives                                               */
/* -------------------------------------------------------------------------- */

/**
 * Numbered eyebrow + serif title + hairline rule running to the margin, doubling
 * as the disclosure control for its section.
 *
 * The button sits inside the `h2` rather than around it: a heading is flow
 * content and is not valid inside a button, and this is the shape assistive
 * tech expects of an accordion — the heading keeps the document outline while
 * the button carries the expanded state.
 */
function SectionHeading({
  id,
  title,
  kicker,
  open,
  pinned,
  onToggle,
}: {
  id: string;
  title: string;
  kicker?: string;
  open: boolean;
  pinned: boolean;
  onToggle: () => void;
}) {
  return (
    <h2>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className="group flex w-full cursor-pointer items-baseline gap-4 text-left"
      >
        <span className="font-mono text-label-lg tabular-nums tracking-[0.2em] text-brand">
          {sectionIndex(id)}
        </span>
        <span className="font-serif text-3xl leading-none tracking-tight transition-opacity group-hover:opacity-70 sm:text-4xl xl:text-[2.75rem]">
          {title}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        {kicker && (
          <span className="hidden shrink-0 font-mono text-label uppercase tracking-[0.16em] text-muted-foreground sm:inline">
            {kicker}
          </span>
        )}
        {/* Brand colour is the only signal separating a pinned section from one
            that is merely being peeked at, since both are simply open. */}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 self-center transition-transform duration-300 motion-reduce:transition-none",
            open && "rotate-180",
            pinned ? "text-brand" : "text-muted-foreground",
          )}
        />
      </button>
    </h2>
  );
}

/**
 * Sections start collapsed. Pointing at one peeks it open, clicking pins it so
 * it survives the pointer leaving, and clicking again puts it away.
 *
 * The peek is deliberately pointer-only. Opening on focus as well would mean
 * tabbing through the page inflates all eight sections in turn, and keyboard
 * users already have Enter and Space on a real button.
 *
 * Panel height is measured and animated via `Collapsible` — see that helper
 * for why CSS `fr` tracks and Motion's `height: "auto"` were not enough.
 */
function Section({
  id,
  title,
  kicker,
  children,
  delay = 0,
}: {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const [pinned, setPinned] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const peekTimer = useRef<number | null>(null);
  const open = pinned || peeking;

  const schedulePeek = (next: boolean, delayMs: number) => {
    if (peekTimer.current !== null) window.clearTimeout(peekTimer.current);
    peekTimer.current = window.setTimeout(() => setPeeking(next), delayMs);
  };

  useEffect(
    () => () => {
      if (peekTimer.current !== null) window.clearTimeout(peekTimer.current);
    },
    [],
  );

  // Following a rail link or a deep link has to pin the target, otherwise it
  // scrolls to a heading with nothing underneath it.
  useEffect(() => {
    const pinIfTargeted = () => {
      if (window.location.hash === `#${id}`) setPinned(true);
    };
    pinIfTargeted();
    window.addEventListener("hashchange", pinIfTargeted);
    return () => window.removeEventListener("hashchange", pinIfTargeted);
  }, [id]);

  return (
    <section
      id={id}
      className="scroll-mt-24"
      onPointerEnter={(event) => {
        // Touch fires enter on tap, which would race the click into pinning and
        // then immediately unpinning. Peeking is a pointer affordance only.
        if (event.pointerType === "mouse") schedulePeek(true, PEEK_OPEN_MS);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") schedulePeek(false, PEEK_CLOSE_MS);
      }}
    >
      <BlurFade inView delay={delay}>
        <SectionHeading
          id={id}
          title={title}
          kicker={kicker}
          open={open}
          pinned={pinned}
          onToggle={() => {
            // Dropping the peek alongside the pin keeps the two from disagreeing:
            // collapsing while the pointer is still inside would otherwise leave
            // `peeking` true and the section stuck open.
            setPinned((wasPinned) => !wasPinned);
            setPeeking(false);
            if (peekTimer.current !== null) {
              window.clearTimeout(peekTimer.current);
              peekTimer.current = null;
            }
          }}
        />
      </BlurFade>

      <Collapsible id={`${id}-panel`} open={open}>
        <div className="mt-8 xl:mt-10">{children}</div>
      </Collapsible>
    </section>
  );
}

/** Headline numbers set as display type, framed by hairlines. */
function Metrics({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-border py-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col-reverse gap-1">
          <dt className="font-mono text-label uppercase tracking-[0.14em] text-muted-foreground">
            {metric.label}
          </dt>
          <dd className="font-serif text-2xl leading-none tracking-tight text-brand">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Bullets with a hairline dash marker instead of a disc. */
function Bullets({ items }: { items: readonly string[] }) {
  // Font-size lives on the list so `max-w-measure` (an em value) resolves
  // against the bullet copy rather than the inherited body size.
  return (
    <ul className="max-w-measure space-y-2.5 text-[0.95rem]">
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-6 leading-relaxed text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-[0.72em] h-px w-3.5 bg-border"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-1 font-mono text-label uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </span>
  );
}

function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        images.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
      )}
    >
      {images.map((image) => (
        <img
          key={image.src}
          src={withBase(image.src)}
          alt={image.alt}
          loading="lazy"
          className="h-auto w-full max-w-full rounded-md border border-border object-cover"
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  About                                                                     */
/* -------------------------------------------------------------------------- */

/** Picks `emphasis` out of the lede without dangerous HTML injection. */
function Lede({ text, emphasis }: { text: string; emphasis?: string }) {
  const at = emphasis ? text.indexOf(emphasis) : -1;
  const className =
    "text-pretty font-serif text-[1.65rem] leading-[1.35] tracking-tight text-foreground sm:text-3xl sm:leading-[1.28]";

  const body =
    at === -1 ? (
      text
    ) : (
      <>
        {text.slice(0, at)}
        <em className="italic text-brand">{emphasis}</em>
        {text.slice(at + emphasis!.length)}
      </>
    );

  return (
    <p className={cn("relative max-w-[22em] pl-5 sm:pl-6", className)}>
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-0 w-px bg-brand"
      />
      {body}
    </p>
  );
}

/** Lede, then current-work cards, then off-hours as a separate closing line. */
function About() {
  return (
    <div className="flex flex-col gap-10">
      <Lede text={about.lede} emphasis={about.ledeEmphasis} />

      {about.blocks.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {about.blocks.map((block) => (
            <article
              key={block.label}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card/40 p-6"
            >
              <p className="font-mono text-label uppercase tracking-[0.16em] text-muted-foreground">
                {block.label}
              </p>
              {block.lead && (
                <h3 className="font-serif text-2xl leading-tight tracking-tight">
                  {block.lead}
                </h3>
              )}
              <p className="text-[0.95rem] leading-relaxed text-foreground/75">
                {block.text}
              </p>
            </article>
          ))}
        </div>
      )}

      {about.interests.length > 0 && (
        <div className="border-t border-border pt-6">
          <p className="font-mono text-label uppercase tracking-[0.16em] text-muted-foreground">
            {about.interestsLabel}
          </p>
          <p className="mt-3 font-serif text-xl leading-relaxed tracking-tight text-foreground/80">
            {about.interests.map((interest, index) => (
              <span key={interest}>
                {index > 0 && (
                  <span aria-hidden="true" className="mx-2.5 text-border">
                    &middot;
                  </span>
                )}
                {interest}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Experience & research timeline                                            */
/* -------------------------------------------------------------------------- */

type TimelineEntry = (typeof experience)[number] | (typeof research)[number];

/**
 * Timeline rows can stay header-only until hovered (or tapped) when
 * `detailsOnHover` is set — used for Experience and Research.
 */
function EntryTimeline({
  entries,
  detailsOnHover = false,
}: {
  entries: readonly TimelineEntry[];
  detailsOnHover?: boolean;
}) {
  return (
    <Timeline
      className={cn(
        "p-0",
        detailsOnHover
          ? "[--timeline-gap:1.75rem]"
          : "[--timeline-gap:3rem]",
      )}
    >
      {entries.map((entry, index) => (
        <EntryRow
          key={`${entry.org}-${entry.role}`}
          entry={entry}
          index={index}
          detailsOnHover={detailsOnHover}
        />
      ))}
    </Timeline>
  );
}

function EntryRow({
  entry,
  index,
  detailsOnHover,
}: {
  entry: TimelineEntry;
  index: number;
  detailsOnHover: boolean;
}) {
  const isCurrent = /present/i.test(entry.end);
  const [pinned, setPinned] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const peekTimer = useRef<number | null>(null);
  const detailsOpen = !detailsOnHover || pinned || peeking;

  const schedulePeek = (next: boolean, delayMs: number) => {
    if (peekTimer.current !== null) window.clearTimeout(peekTimer.current);
    peekTimer.current = window.setTimeout(() => setPeeking(next), delayMs);
  };

  useEffect(
    () => () => {
      if (peekTimer.current !== null) window.clearTimeout(peekTimer.current);
    },
    [],
  );

  const details = (
    <>
      {entry.metrics && entry.metrics.length > 0 && (
        <Metrics metrics={entry.metrics} />
      )}
      <Bullets items={entry.bullets} />
      {entry.images && entry.images.length > 0 && (
        <ImageGallery images={entry.images} />
      )}
    </>
  );

  return (
    <TimelineItem className="flex w-full items-start gap-5">
      <TimelineConnectItem className="flex items-start justify-center">
        {"logo" in entry && entry.logo ? (
          <img
            src={withBase(entry.logo)}
            alt={entry.logoAlt ?? `${entry.org} logo`}
            className="z-10 size-11 shrink-0 flex-none overflow-hidden rounded-full border border-border bg-white object-contain p-1.5 ring-4 ring-background"
          />
        ) : (
          <div className="z-10 size-11 shrink-0 flex-none rounded-full border border-border bg-card ring-4 ring-background" />
        )}
      </TimelineConnectItem>

      <BlurFade
        inView
        delay={BLUR_FADE_DELAY * index}
        className="min-w-0 flex-1 pb-2"
      >
        <article
          className="flex flex-col gap-4"
          onPointerEnter={(event) => {
            if (detailsOnHover && event.pointerType === "mouse") {
              schedulePeek(true, PEEK_OPEN_MS);
            }
          }}
          onPointerLeave={(event) => {
            if (detailsOnHover && event.pointerType === "mouse") {
              schedulePeek(false, PEEK_CLOSE_MS);
            }
          }}
        >
          <header className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <time className="font-mono text-label uppercase tracking-[0.14em] text-muted-foreground">
                {entry.start} — {entry.end}
              </time>
              {isCurrent && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 px-2 py-0.5 font-mono text-label-sm uppercase tracking-[0.14em] text-brand">
                  <span className="size-1 rounded-full bg-brand" />
                  Current
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-fit items-center gap-1.5 font-serif text-2xl leading-tight tracking-tight decoration-border underline-offset-[6px] hover:underline"
                  >
                    {entry.org}
                    <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <h3 className="font-serif text-2xl leading-tight tracking-tight">
                    {entry.org}
                  </h3>
                )}

                <p className="mt-1.5 text-[0.95rem] text-foreground/75">
                  {entry.role}
                  {"location" in entry && entry.location && (
                    <span className="text-muted-foreground">
                      {" · "}
                      {entry.location}
                    </span>
                  )}
                </p>
              </div>

              {detailsOnHover && (
                <button
                  type="button"
                  aria-expanded={detailsOpen}
                  aria-label={
                    detailsOpen
                      ? `Hide details for ${entry.org}`
                      : `Show details for ${entry.org}`
                  }
                  onClick={() => {
                    setPinned((wasPinned) => !wasPinned);
                    setPeeking(false);
                    if (peekTimer.current !== null) {
                      window.clearTimeout(peekTimer.current);
                      peekTimer.current = null;
                    }
                  }}
                  className="mt-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 transition-transform duration-300 motion-reduce:transition-none",
                      detailsOpen && "rotate-180",
                      pinned && "text-brand",
                    )}
                  />
                </button>
              )}
            </div>
          </header>

          {detailsOnHover ? (
            <Collapsible open={detailsOpen}>
              <div className="flex flex-col gap-4 pt-1">{details}</div>
            </Collapsible>
          ) : (
            details
          )}
        </article>
      </BlurFade>
    </TimelineItem>
  );
}

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

/** Screenshot when one exists; otherwise a ruled panel with a serif monogram. */
function ProjectCover({
  project,
  className,
}: {
  project: (typeof projects)[number];
  className?: string;
}) {
  const cover = project.images?.[0];

  // A demo clip outranks a still: it fills the same panel and loops silently,
  // so the poster frame is all a reduced-motion or slow connection ever shows.
  if (project.video) {
    return (
      <video
        src={withBase(project.video.src)}
        poster={withBase(project.video.poster)}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={cn("w-full bg-muted object-cover object-top", className)}
      />
    );
  }

  if (cover) {
    return (
      <img
        src={withBase(cover.src)}
        alt={cover.alt}
        loading="lazy"
        className={cn("w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden bg-muted/40",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.5] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--border) 0 1px, transparent 1px 9px)",
          maskImage: "radial-gradient(120% 100% at 50% 0%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(120% 100% at 50% 0%, black, transparent)",
        }}
      />
      <span className="relative font-serif text-5xl italic leading-none text-foreground/25">
        {project.name.charAt(0)}
      </span>
    </div>
  );
}

function ProjectLinks({ project }: { project: (typeof projects)[number] }) {
  const links = [
    project.demo && { label: "Live", url: project.demo },
    project.repo && { label: "Source", url: project.repo },
  ].filter(Boolean) as { label: string; url: string }[];

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-4">
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
          <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: (typeof projects)[number];
  index: number;
  featured?: boolean;
}) {
  // Stills not already spent on the cover.
  const gallery = project.video
    ? (project.images ?? [])
    : (project.images ?? []).slice(1);

  return (
    <article
      className={cn(
        "group flex overflow-hidden rounded-lg border border-border bg-card transition-all duration-300",
        "hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]",
        featured ? "flex-col sm:flex-row" : "flex-col",
      )}
    >
      <ProjectCover
        project={project}
        className={cn(
          "shrink-0 border-border",
          featured
            ? "border-b sm:h-auto sm:w-2/5 sm:border-b-0 sm:border-r"
            : "h-32 border-b",
          // Stacked above the copy, the cover is a wide letterbox. Phone-shot
          // clips are portrait, so give them room instead of slicing a band
          // out of the middle.
          featured && (project.video ? "h-72 sm:h-auto" : "h-44"),
        )}
      />

      <div className="flex flex-1 flex-col gap-3.5 p-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-label tabular-nums tracking-[0.16em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          {featured && (
            <span className="rounded-full border border-brand/40 px-2 py-0.5 font-mono text-label-sm uppercase tracking-[0.14em] text-brand">
              Featured
            </span>
          )}
        </div>

        <h3
          className={cn(
            "font-serif leading-tight tracking-tight",
            featured ? "text-3xl" : "text-xl",
          )}
        >
          {project.name}
        </h3>

        <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
          {project.blurb}
        </p>

        {project.highlights.length > 0 && (
          <Bullets items={project.highlights} />
        )}

        {project.metrics && project.metrics.length > 0 && (
          <Metrics metrics={project.metrics} />
        )}

        {gallery.length > 0 && <ImageGallery images={gallery} />}

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {project.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>

        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  const skillGroups = [
    { label: "Languages", items: skills.languages },
    { label: "Frameworks", items: skills.frameworks },
    { label: "Tools", items: skills.tools },
  ].filter((group) => group.items.length > 0);

  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <main className="flex flex-col gap-20 sm:gap-24 lg:gap-28 xl:gap-32">
      <Section id="about" title="About" kicker="Who I am" delay={BLUR_FADE_DELAY}>
        <About />
      </Section>

      {experience.length > 0 && (
        <Section id="experience" title="Experience" kicker="Where I've worked">
          <EntryTimeline entries={experience} detailsOnHover />
        </Section>
      )}

      {research.length > 0 && (
        <Section id="research" title="Research" kicker="Undergraduate research">
          <EntryTimeline entries={research} detailsOnHover />
        </Section>
      )}

      {projects.length > 0 && (
        <Section
          id="projects"
          title="Projects"
          kicker={`${projects.length} selected`}
        >
          <div className="flex flex-col gap-4">
            {featured.map((project, i) => (
              <BlurFade inView key={project.name} delay={BLUR_FADE_DELAY * i}>
                <ProjectCard project={project} index={i} featured />
              </BlurFade>
            ))}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {rest.map((project, i) => (
                  <BlurFade
                    inView
                    key={project.name}
                    delay={BLUR_FADE_DELAY * i}
                    className="flex"
                  >
                    <ProjectCard
                      project={project}
                      index={featured.length + i}
                    />
                  </BlurFade>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section id="education" title="Education" kicker="In progress">
          <div className="flex flex-col gap-6">
            {education.map((entry) => (
              <BlurFade inView key={entry.school}>
                <article className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border p-6">
                  <div className="flex min-w-0 items-start gap-4">
                    {entry.logo && (
                      <img
                        src={withBase(entry.logo)}
                        alt={entry.logoAlt ?? `${entry.school} logo`}
                        className="size-11 shrink-0 rounded-full border border-border bg-white object-contain p-1.5"
                      />
                    )}
                    <div className="min-w-0">
                      {entry.url ? (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-serif text-2xl leading-tight tracking-tight underline-offset-[6px] hover:underline"
                        >
                          {entry.school}
                        </a>
                      ) : (
                        <h3 className="font-serif text-2xl leading-tight tracking-tight">
                          {entry.school}
                        </h3>
                      )}
                      <p className="mt-1.5 text-[0.95rem] text-foreground/75">
                        {entry.degree}
                      </p>
                      {(entry.standing || entry.gpa) && (
                        <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-label uppercase tracking-[0.14em] text-muted-foreground">
                          {entry.standing && <span>{entry.standing}</span>}
                          {/* A dot, not a slash: the GPA already reads
                              "3.81 / 4.00" and a second slash blurs the two. */}
                          {entry.standing && entry.gpa && (
                            <span aria-hidden="true" className="text-border">
                              &middot;
                            </span>
                          )}
                          {entry.gpa && <span>GPA {entry.gpa}</span>}
                        </p>
                      )}
                      {entry.coursework.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {entry.coursework.map((course) => (
                            <Tag key={course}>{course}</Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <time className="shrink-0 font-mono text-label uppercase tracking-[0.14em] text-muted-foreground">
                    {entry.start ? `${entry.start} — ${entry.end}` : entry.end}
                  </time>
                </article>
              </BlurFade>
            ))}
          </div>
        </Section>
      )}

      {skillGroups.length > 0 && (
        <Section id="skills" title="Skills" kicker="What I work with">
          <dl className="flex flex-col">
            {skillGroups.map((group) => (
              <BlurFade inView key={group.label}>
                <div className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-border py-6 sm:grid-cols-[9rem_1fr]">
                  <dt className="font-mono text-label uppercase tracking-[0.16em] text-muted-foreground">
                    {group.label}
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </dd>
                </div>
              </BlurFade>
            ))}
          </dl>
        </Section>
      )}

      {awards.length + certifications.length > 0 && (
        <Section
          id="credentials"
          title="Credentials"
          kicker="Awards & certifications"
        >
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {awards.length > 0 && (
              <BlurFade inView>
                <h3 className="font-mono text-label uppercase tracking-[0.16em] text-muted-foreground">
                  Awards
                </h3>
                <ul className="mt-5 flex flex-col">
                  {awards.map((award) => (
                    <li
                      key={award.name}
                      className="border-t border-border py-4 last:border-b"
                    >
                      <p className="font-serif text-xl leading-tight tracking-tight">
                        {award.name}
                      </p>
                      <p className="mt-1.5 font-mono text-label uppercase tracking-[0.14em] text-muted-foreground">
                        {award.org}
                        {award.date && ` · ${award.date}`}
                      </p>
                    </li>
                  ))}
                </ul>
              </BlurFade>
            )}

            {certifications.length > 0 && (
              <BlurFade inView delay={BLUR_FADE_DELAY}>
                <h3 className="font-mono text-label uppercase tracking-[0.16em] text-muted-foreground">
                  Certifications
                </h3>
                <ul className="mt-5 flex flex-col">
                  {certifications.map((certification) => (
                    <li
                      key={certification.name}
                      className="border-t border-border py-4 last:border-b"
                    >
                      {certification.url ? (
                        <a
                          href={certification.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 font-serif text-xl leading-tight tracking-tight underline-offset-[6px] hover:underline"
                        >
                          {certification.name}
                          <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      ) : (
                        <p className="font-serif text-xl leading-tight tracking-tight">
                          {certification.name}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </BlurFade>
            )}
          </div>
        </Section>
      )}

      <Section id="contact" title="Contact" kicker="Say hello">
        <BlurFade inView>
          <div className="rounded-lg border border-border px-6 py-14 text-center sm:px-10 sm:py-20">
            <p className="font-mono text-label uppercase tracking-[0.18em] text-muted-foreground">
              Open to software engineering opportunities
            </p>
            <p className="mx-auto mt-6 max-w-lg text-pretty font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Let's build something{" "}
              <span className="italic text-brand">worth using.</span>
            </p>
            <a
              href={`mailto:${basics.email}`}
              className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 font-mono text-label-lg uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-85"
            >
              <Mail className="size-3.5" />
              {basics.email}
            </a>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {basics.links.map((link) => {
                const LinkIcon =
                  linkIcons[link.label.toLowerCase()] ?? Icons.globe;
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LinkIcon className="size-3.5" />
                    {link.label}
                    <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </BlurFade>
      </Section>
    </main>
  );
}
