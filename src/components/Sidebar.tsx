import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { siteContent } from "@/data/site-content";
import { Icons, type IconProps } from "@/components/icons";
import { sections } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Mail } from "lucide-react";

const linkIcons: Record<string, (props: IconProps) => React.ReactNode> = {
  github: Icons.github,
  linkedin: Icons.linkedin,
};

/** Distance below the viewport top at which a section counts as "being read". */
const READING_LINE = 96;

/**
 * Tracks scroll position once and derives both the progress rule and the active
 * rail entry from it.
 *
 * Measuring positions directly (rather than accumulating IntersectionObserver
 * callbacks) keeps the highlight a pure function of scroll offset, so the very
 * first call on mount is already correct — which matters for hash deep-links
 * and for resizes that reflow section boundaries.
 */
function useScrollState() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);

      let current = sections[0]?.id ?? "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top > READING_LINE) break;
        current = section.id;
      }

      // On a tall viewport the trailing sections can never be scrolled up to
      // the reading line, so they would never light up. Once the page bottom
      // is reached, the reader is by definition in the last section.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1]?.id ?? current;

      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { progress, active };
}

export default function Sidebar() {
  const { basics } = siteContent;
  const { progress, active } = useScrollState();
  const [firstName, ...rest] = basics.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <>
      {/* Reading progress, pinned to the very top across the full viewport. */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* Sticky rather than fixed: the rail travels with the centred shell in
          Layout.astro instead of anchoring itself to the viewport's left edge,
          while still holding position for the length of the page. */}
      <aside
        className={cn(
          "z-40 flex flex-col border-b border-border bg-background",
          "lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r",
        )}
      >
        <div className="flex flex-col gap-6 px-6 pt-10 pb-6 sm:px-8 lg:pt-12">
          <div>
            <a
              href="#top"
              className="font-serif text-3xl leading-[1.05] tracking-tight transition-opacity hover:opacity-75"
            >
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span className="italic text-brand">{lastName}</span>
                </>
              )}
            </a>
          </div>

          <p className="max-w-sm text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">
            {basics.tagline}
          </p>

          {/* Stacked rather than inline: at rail width the two clauses always
              wrapped, leaving a hairline separator dangling at the line end. */}
          <div className="flex flex-col gap-1.5 font-mono text-label uppercase tracking-[0.16em] text-muted-foreground">
            <p className="flex items-center gap-2.5">
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
              </span>
              Open to opportunities
            </p>
            <p className="pl-4">{basics.location}</p>
          </div>
        </div>

        <nav
          aria-label="Sections"
          className={cn(
            // Horizontal scrolling rail below `lg`, vertical index at and above.
            "scrollbar-none flex gap-x-5 overflow-x-auto px-6 pb-5 sm:px-8",
            "lg:min-h-0 lg:flex-1 lg:flex-col lg:gap-x-0 lg:overflow-y-auto lg:pb-2",
            // Centred in the space between the header and the social row.
            // `safe` matters because this scrolls: on a short viewport plain
            // centring would push the first sections above the scroll origin,
            // out of reach. Safe centring falls back to top-aligned instead.
            "lg:justify-center-safe",
          )}
        >
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex shrink-0 items-center gap-3.5 rounded-md py-2.5 transition-colors lg:px-0",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "hidden font-mono text-label-sm tabular-nums transition-colors lg:inline",
                    isActive ? "text-brand" : "text-muted-foreground/70",
                  )}
                >
                  {section.index}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-px transition-all duration-300 lg:block",
                    isActive
                      ? "w-9 bg-brand"
                      : "w-5 bg-border group-hover:w-9 group-hover:bg-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "font-mono text-label-lg uppercase tracking-[0.14em] transition-colors",
                    isActive && "text-foreground",
                  )}
                >
                  {section.label}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-1 border-border px-6 pb-8 sm:px-8 lg:border-t lg:pt-5">
          {basics.links.map((link) => {
            const LinkIcon = linkIcons[link.label.toLowerCase()] ?? Icons.globe;
            return (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LinkIcon className="size-4" />
              </a>
            );
          })}
          <a
            href={`mailto:${basics.email}`}
            aria-label="Email"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Mail className="size-4" />
          </a>
          <ModeToggle />
          <a
            href="#contact"
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 font-mono text-label uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Get in touch
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </aside>
    </>
  );
}
