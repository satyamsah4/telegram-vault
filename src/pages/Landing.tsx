import { BrandMark, BrandWordmark } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { CHUNK_BYTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  Download,
  Folder,
  Infinity as InfinityIcon,
  Layers,
  Laptop,
  Send,
  Server,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

const PART_MB = Math.round(CHUNK_BYTES / (1024 * 1024));

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </Reveal>
  );
}

const STEPS = [
  {
    icon: Bot,
    title: "Make a bot",
    body: "Two messages with @BotFather. That bot becomes your private storage account — nobody else can see its chat.",
  },
  {
    icon: Send,
    title: "Press Start",
    body: "One tap in Telegram tells the vault exactly which chat to write files into. No channel to create, no config files.",
  },
  {
    icon: Upload,
    title: "Fill it up",
    body: "Drag files in, nest folders as deep as you like, pull anything back down whenever you need it.",
  },
];

const FEATURES = [
  {
    icon: Folder,
    title: "Folders, all the way down",
    body: "Create, rename, move and delete nested folders. Breadcrumbs keep you oriented however deep you go.",
  },
  {
    icon: Layers,
    title: `Any size file`,
    body: `Files are split into ${PART_MB} MB parts before they leave your tab and stitched back together on the way home — right past Telegram's ${20} MB bot download limit.`,
  },
  {
    icon: InfinityIcon,
    title: "No quota to manage",
    body: "Telegram never publishes a storage ceiling. No tiers, no upgrade nag, no bill when the folder fills up.",
  },
  {
    icon: Download,
    title: "Downloads that stream",
    body: "Parts stream back one after another and write straight to disk where your browser allows it.",
  },
  {
    icon: ShieldCheck,
    title: "The token stays inside",
    body: "Your bot token lives only on the server. Downloads go through short-lived links that expire in minutes.",
  },
  {
    icon: User,
    title: "Built for one",
    body: "No teams, no seats, no sharing links to leak. Version 1 assumes the only person here is you.",
  },
];

const TRAVEL = [
  {
    icon: Laptop,
    title: "Your browser",
    body: `Slices the file into ${PART_MB} MB parts and hands them over one at a time.`,
  },
  {
    icon: Server,
    title: "The vault server",
    body: "Holds folder structure, names and Telegram handles — plus the bot token, never the browser.",
  },
  {
    icon: Send,
    title: "Your Telegram chat",
    body: "The actual copy of every part, living in your own chat with your own bot.",
  },
];

const MOCK_FILES = [
  { name: "brand-refresh.fig", size: "84.2 MB", date: "Today" },
  { name: "Q4-numbers.xlsx", size: "2.1 MB", date: "Yesterday" },
  { name: "talk-through.mp4", size: "412 MB", date: "12 Oct" },
];

const MOCK_TREE = ["All files", "Projects", "Personal", "Archive"];

function AppMock() {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lift">
        <div className="flex">
          <div className="hidden w-44 shrink-0 space-y-3 border-r border-border/60 bg-sidebar p-3 sm:block">
            <div className="flex items-center gap-2">
              <BrandMark className="size-6" />
              <span className="text-xs font-semibold">Telegram Vault</span>
            </div>
            <div className="rounded-md border border-dashed border-border px-2 py-1.5 text-[11px] text-muted-foreground">
              + New folder
            </div>
            <ul className="space-y-1 pt-1">
              {MOCK_TREE.map((item, index) => (
                <li
                  key={item}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px]",
                    index === 1
                      ? "bg-[var(--brand-soft)] font-medium text-[var(--brand-soft-foreground)]"
                      : "text-muted-foreground",
                  )}
                >
                  <Folder className="size-3" />
                  <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-md bg-[var(--brand-soft)] px-2 py-1.5">
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--brand-soft-foreground)]">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                @vault_bot connected
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-xs font-medium">
                All files <span className="text-muted-foreground">/ Projects</span>
              </p>
              <span className="rounded-md bg-[var(--brand)] px-2 py-1 text-[10px] font-medium text-[var(--brand-foreground)]">
                Upload
              </span>
            </div>

            <ul className="mt-3 divide-y divide-border/60 rounded-lg border border-border/60">
              {MOCK_FILES.map((file) => (
                <li
                  key={file.name}
                  className="flex items-center gap-2.5 px-2.5 py-2"
                >
                  <span className="size-5 shrink-0 rounded bg-muted" />
                  <span className="min-w-0 flex-1 truncate text-[11px]">
                    {file.name}
                  </span>
                  <span className="font-mono-nums shrink-0 text-[10px] text-muted-foreground">
                    {file.size}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 rounded-lg border border-border/60 p-2.5">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="truncate">IMG_4410.raw</span>
                <span className="font-mono-nums shrink-0 text-muted-foreground">
                  64%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
                <div
                  className="h-full rounded-full bg-[var(--brand)]"
                  style={{ width: "64%" }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Sending part 3 of 5 to Telegram…
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute -right-3 -top-4 flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium shadow-card sm:-right-6"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Check className="size-3.5 text-[var(--brand)]" />
        Stored · no quota
      </motion.div>
    </div>
  );
}

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background text-foreground"
    >
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
          <BrandWordmark />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#how">
              How it works
            </a>
            <a className="transition-colors hover:text-foreground" href="#features">
              What's inside
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="#travel"
            >
              Where files live
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">
                Open the vault
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(900px 420px at 72% -8%, color-mix(in oklab, var(--brand) 14%, transparent), transparent 70%)",
            }}
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                  <span className="size-1.5 rounded-full bg-[var(--brand)]" />
                  Version 1 · one owner, no ceiling
                </span>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="mt-6 text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]">
                  Telegram's storage,
                  <br />
                  finally <span className="text-brand">organized</span>.
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Telegram ships every account unlimited cloud storage — it just
                  has no folders, no file manager and no download you can trust.
                  The Vault adds exactly that, on a bot only you control.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button size="lg" asChild>
                    <Link to="/dashboard">
                      Open the vault
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="#how">See how it works</a>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border/70 pt-6">
                  {[
                    { value: "0", label: "storage quota to manage" },
                    { value: `${PART_MB} MB`, label: "parts, any file size" },
                    { value: "1", label: "owner in the whole app" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className="font-mono-nums text-2xl font-semibold tracking-[-0.02em]">
                        {stat.value}
                      </dt>
                      <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                        {stat.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <AppMock />
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="border-t border-border/70 bg-card/60 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <SectionHeading
              eyebrow="Setup"
              title="Three steps, then you never think about it again."
              description="Everything below happens once. After that the vault is just folders and files, like it should be."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.07} className="h-full">
                  <article className="flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 shadow-card transition-shadow hover:shadow-lift">
                    <span className="grid size-9 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-soft-foreground)]">
                      <step.icon className="size-4" />
                    </span>
                    <p className="font-mono-nums text-xs text-muted-foreground">
                      0{index + 1}
                    </p>
                    <h3 className="text-lg font-medium tracking-[-0.015em]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {step.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border/70 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <SectionHeading
              eyebrow="What's inside"
              title="A file manager over an API that never says no."
              description="Version 1 does folders properly and nothing else — no tags, no shares, no dashboards you'd never open."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delay={(index % 3) * 0.06}>
                  <article className="flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 shadow-card transition-shadow hover:shadow-lift">
                    <span className="grid size-9 place-items-center rounded-lg bg-muted text-foreground">
                      <feature.icon className="size-4" />
                    </span>
                    <h3 className="text-base font-medium tracking-[-0.01em]">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {feature.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Where files live */}
        <section
          id="travel"
          className="border-t border-border/70 bg-card/60 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <SectionHeading
              eyebrow="The path"
              title="Where your files actually live."
              description="No mystery cloud and no vendor lock-in: the copy sits in your own Telegram chat, and you can read it in Telegram yourself."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {TRAVEL.map((stage, index) => (
                <Reveal key={stage.title} delay={index * 0.07}>
                  <div className="relative h-full rounded-2xl border border-border/70 bg-card p-6 shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-lg bg-[var(--brand-soft)] text-[var(--brand-soft-foreground)]">
                        <stage.icon className="size-4" />
                      </span>
                      <span className="font-mono-nums text-xs text-muted-foreground">
                        {index + 1}/3
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-medium tracking-[-0.01em]">
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {stage.body}
                    </p>
                    {index < TRAVEL.length - 1 ? (
                      <ArrowRight className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-muted-foreground/50 md:block" />
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <p className="mt-8 flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
                The database only stores folder structure, names and the
                handles Telegram hands back. Your bot token is read on the
                server for every call and is never returned to the browser.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <Reveal>
              <div
                className="relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-10"
                style={{
                  backgroundColor: "var(--brand)",
                  color: "var(--brand-foreground)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(600px 240px at 50% 0%, rgba(255,255,255,0.18), transparent 70%)",
                  }}
                />
                <h2 className="relative text-3xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-4xl">
                  Give your files a home with no ceiling.
                </h2>
                <p className="relative mx-auto mt-4 max-w-xl text-sm leading-6 opacity-85 sm:text-base">
                  Sign in, connect a bot in two minutes, and start with an empty
                  folder tree that's entirely yours.
                </p>
                <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/dashboard">
                      Open the vault
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/auth">Sign in first</Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-6">
          <BrandWordmark />
          <p className="text-center text-xs leading-5 text-muted-foreground sm:text-left">
            Built for exactly one person. Storage by Telegram's cloud.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link to="/auth" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
            <a
              href="https://core.telegram.org/bots/api"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Bot API docs
            </a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
