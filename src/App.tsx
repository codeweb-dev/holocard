import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Check, Copy, Moon, Sun } from "lucide-react";
import { HoloCard } from "react-holo-card";
import type { HoloCardProps } from "react-holo-card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const INSTALL = "npm install react-holo-card";
const GITHUB = "https://github.com/codeweb-dev/holo-card";
const NPM = "https://www.npmjs.com/package/react-holo-card";
const VERSION = "0.3.4";

/** The four Base Set holos, straight off pokemontcg.io — nothing ships in the repo. */
const ART_API =
  "https://api.pokemontcg.io/v2/cards?q=set.id:base1&pageSize=4&select=id,name,images";

type Art = { id: string; file: string; alt: string };

const toArt = (name: string, file: string): Art => ({
  id: name.toLowerCase(),
  file,
  alt: `${name}, a holographic card from the Pokémon Base Set`,
});

/** The API 500s a few times an hour. Its image CDN doesn't — same four cards, no request. */
const FALLBACK = ["Alakazam", "Blastoise", "Chansey", "Charizard"].map(
  (name, i) => toArt(name, `https://images.pokemontcg.io/base1/${i + 1}_hires.png`),
);

/** iOS 13+ is the only engine that withholds orientation until a gesture asks for it. */
const NEEDS_GYRO_TAP =
  typeof (
    window.DeviceOrientationEvent as unknown as {
      requestPermission?: unknown;
    }
  )?.requestPermission === "function";

/** Stagger index for the shared rise-in animation. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

const RADII = ["none", "sm", "md", "lg", "xl", "full"] as const;

const LAYERS = [
  [
    "--rx --ry",
    "Tilt",
    "Pointer — or the phone's gyroscope — becomes a rotateX / rotateY, clamped to maxTilt.",
  ],
  [
    "--mx --my",
    "Glare",
    "A specular hotspot under the cursor, plus a sheen band sweeping back.",
  ],
  [
    "--distance",
    "Foil",
    "A diagonal rainbow in color-dodge, strengthening toward the edge.",
  ],
  [
    "0 deps",
    "Quiet",
    "Values are written to the DOM in rAF. React never re-renders on move.",
  ],
];

const API: [prop: string, type: string, def: string, desc: string][] = [
  ["url", "string", "—", "Image URL rendered inside the card"],
  ["width", "number", "320", "Card width in px"],
  ["height", "number", "446", "Card height in px"],
  [
    "radius",
    "preset | number",
    '"md"',
    "none · sm · md · lg · xl · full, or raw px",
  ],
  ["showSparkles", "boolean", "true", "Rainbow foil sparkle layer"],
  ["maxTilt", "number", "30", "Max tilt rotation in degrees at the edge"],
  [
    "gyro",
    "boolean",
    "true",
    "Tilt with the device gyroscope. iOS 13+ only grants motion after a tap, so the card asks on its first click — give users a visible button too",
  ],
  ["alt", "string", '""', "Alt text for the image"],
  ["className", "string", "—", "Extra class on the root element"],
  ["style", "object", "—", "Extra inline styles on the root element"],
];

const CHIP =
  "h-7 rounded-md px-2.5 text-[11px] font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground";

function SectionTitle({ children, note }: { children: string; note: string }) {
  return (
    <h2 className="mb-2 text-[12.5px] font-medium tracking-[-0.009em] text-card-foreground">
      {children}
      <small className="ml-2 text-[11px] font-normal text-muted-foreground">
        {note}
      </small>
    </h2>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[46px] flex-col justify-center gap-2 border-b border-border py-2 first:border-t sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="font-mono text-[11px] tracking-normal whitespace-nowrap text-card-foreground">
        {label}
        <span className="block font-sans text-[10.5px] tracking-[-0.006em] text-muted-foreground">
          {hint}
        </span>
      </span>
      {children}
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
      }}
    >
      {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </Button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground"
      aria-label="Copy install command"
      onClick={() =>
        navigator.clipboard.writeText(text).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          },
          () => {},
        )
      }
    >
      {copied ? (
        <Check className="size-3.5 text-primary" />
      ) : (
        <Copy className="size-3.5" />
      )}
      <span className="sr-only" role="status">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </Button>
  );
}

export default function App() {
  const [cards, setCards] = useState<Art[]>([]);
  const [pick, setPick] = useState("");
  const [radius, setRadius] = useState<HoloCardProps["radius"]>("md");
  const [sparkles, setSparkles] = useState(true);
  const [tilt, setTilt] = useState(30);
  const [gyro, setGyro] = useState(true);
  const [ready, setReady] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetch(ART_API, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(({ data }: { data: { name: string; images: { large: string } }[] }) =>
        setCards(data.map((c) => toArt(c.name, c.images.large))),
      )
      // ponytail: one shot, then the hardcoded CDN URLs. No retry loop for a demo.
      .catch(() => !ac.signal.aborted && setCards(FALLBACK));
    return () => ac.abort();
  }, []);

  const art = cards.find((c) => c.id === pick) ?? cards[0];
  const url = art?.file;

  // The hires PNGs run ~1 MB. Decode first, then mount the card, so it never pops in half-drawn.
  useEffect(() => {
    if (!url) return;
    setReady(false);
    const img = new Image();
    img.onload = img.onerror = () => setReady(true);
    img.src = url;
    return () => {
      img.onload = img.onerror = null;
    };
  }, [url]);

  const snippet = [
    "<HoloCard",
    `  url="${art?.file ?? "…"}"`,
    "  width={280} height={390}",
    radius !== "md" && `  radius="${radius}"`,
    !sparkles && "  showSparkles={false}",
    tilt !== 30 && `  maxTilt={${tilt}}`,
    !gyro && "  gyro={false}",
    "/>",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <main className="mx-auto w-full max-w-[520px] px-5 pt-10 pb-9">
      <header
        className="rise mb-0.5 flex items-baseline justify-between"
        style={at(0)}
      >
        <h1 className="flex items-center gap-2 text-[21px] font-semibold tracking-[-0.026em] text-primary">
          holocard
        </h1>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10.5px] tracking-normal text-muted-foreground">
            v{VERSION} · 0 deps
          </span>
          <a
            href={GITHUB}
            className="text-[12px] text-muted-foreground transition-colors hover:text-primary"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </header>

      <p className="rise mt-0.5 mb-6 text-pretty" style={at(1)}>
        A card that tilts, catches the light, and throws rainbow foil —
        everywhere your pointer goes.{" "}
        <strong className="font-medium text-card-foreground">
          Every control below drives the real component.
        </strong>
      </p>

      <section className="rise mb-6" style={at(2)}>
        <div
          ref={stage}
          className="grid place-items-center rounded-lg bg-card bg-[image:repeating-linear-gradient(90deg,transparent_0_27px,color-mix(in_srgb,var(--foreground)_3%,transparent)_27px_28px)] pt-7 pb-8 ring-1 ring-border ring-inset"
        >
          {art && ready ? (
            <HoloCard
              url={art.file}
              alt={art.alt}
              width={280}
              height={390}
              radius={radius}
              showSparkles={sparkles}
              maxTilt={tilt}
              gyro={gyro}
            />
          ) : (
            <div
              className="grid h-[390px] w-[280px] animate-pulse place-items-center rounded-md bg-muted px-6 text-center text-[11px] text-balance text-muted-foreground"
              role="status"
            >
              {art
                ? `Loading ${art.id} — full-resolution scans run about a megabyte.`
                : "Fetching cards from pokemontcg.io…"}
            </div>
          )}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Move your pointer across the card — or tilt your phone. That's the
          whole API.
        </p>
        {NEEDS_GYRO_TAP && (
          <div className="mt-2.5 flex flex-col items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={!gyro || !ready}
              className="h-8 text-[11.5px]"
              // HoloCard asks iOS for motion access on its own click. Forward this one so a
              // visible button works as well as tapping the art — same user gesture either way.
              onClick={() =>
                stage.current
                  ?.querySelector<HTMLElement>(".holo-card")
                  ?.click()
              }
            >
              Enable motion tilt
            </Button>
            <p className="text-center text-[10.5px] text-balance text-muted-foreground">
              iOS won't hand out gyroscope data until you approve it, and only
              over HTTPS. Tapping the card asks too — but ship a button like
              this so people know the permission exists.
            </p>
          </div>
        )}
      </section>

      <section className="rise mb-6" style={at(3)}>
        <SectionTitle note="live">Props</SectionTitle>

        <Row label="url" hint="live from pokemontcg.io">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={art?.id ?? ""}
            onValueChange={(v) => v && setPick(v)}
            className="justify-start sm:justify-end"
          >
            {cards.map((item) => (
              <ToggleGroupItem key={item.id} value={item.id} className={CHIP}>
                {item.id}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>

        <Row label="radius" hint="corner preset or px">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={radius as string}
            onValueChange={(v) => v && setRadius(v as HoloCardProps["radius"])}
            className="justify-start sm:justify-end"
          >
            {RADII.map((r) => (
              <ToggleGroupItem key={r} value={r} className={CHIP}>
                {r}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Row>

        <Row label="showSparkles" hint="rainbow foil">
          <Switch
            checked={sparkles}
            onCheckedChange={setSparkles}
            aria-label="Toggle rainbow foil"
          />
        </Row>

        <Row label="maxTilt" hint="degrees at the edge">
          <div className="flex items-center gap-3">
            <Slider
              min={0}
              max={50}
              step={1}
              value={[tilt]}
              onValueChange={([v]) => setTilt(v)}
              aria-label="Max tilt in degrees"
              className="w-full sm:w-[140px]"
            />
            <output className="w-8 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
              {tilt}°
            </output>
          </div>
        </Row>

        <Row label="gyro" hint="tilt your phone · iOS needs approval">
          <Switch
            checked={gyro}
            onCheckedChange={setGyro}
            aria-label="Toggle gyroscope tilt"
          />
        </Row>

        <pre className="mt-2.5 overflow-x-auto rounded-lg bg-card px-4 py-3.5 font-mono text-[11px] leading-[1.65] tracking-normal text-card-foreground ring-1 ring-border ring-inset">
          {snippet}
        </pre>
      </section>

      <section className="rise mb-6" style={at(4)}>
        <SectionTitle note="three layers, zero re-renders">
          How it works
        </SectionTitle>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {LAYERS.map(([vars, title, body]) => (
            <Card key={title} size="sm" className="rounded-lg ring-border">
              <CardContent>
                <code className="font-mono text-[10px] tracking-normal text-primary">
                  {vars}
                </code>
                <div className="mt-1.5 text-[12px] font-medium text-card-foreground">
                  {title}
                </div>
                <p className="mt-0.5 text-[10.5px] leading-[1.45] text-pretty text-muted-foreground">
                  {body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rise mb-6" style={at(5)}>
        <SectionTitle note="peer dependency: react ≥ 17">Install</SectionTitle>
        <div className="flex items-center gap-2.5 rounded-lg bg-card py-1.5 pr-1.5 pl-3 ring-1 ring-border ring-inset">
          <span className="font-mono text-[11.5px] text-muted-foreground">
            $
          </span>
          <code className="flex-1 overflow-x-auto font-mono text-[11.5px] tracking-normal whitespace-nowrap text-primary">
            {INSTALL}
          </code>
          <CopyButton text={INSTALL} />
        </div>
      </section>

      <section className="rise mb-6" style={at(6)}>
        <SectionTitle note="ten props, none required but one">
          Reference
        </SectionTitle>
        <div className="overflow-hidden rounded-lg bg-card ring-1 ring-border ring-inset">
          <Table className="text-[11px]">
            <TableBody>
              {API.map(([prop, type, def, desc]) => (
                <TableRow key={prop} className="hover:bg-muted/50">
                  <TableCell className="py-2.5 font-mono tracking-normal whitespace-nowrap text-primary">
                    {prop}
                    {prop === "url" && (
                      <Badge
                        variant="outline"
                        className="ml-1.5 h-4 px-1.5 text-[9px]"
                      >
                        req
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 font-mono tracking-normal whitespace-nowrap text-muted-foreground">
                    {type}
                  </TableCell>
                  <TableCell className="py-2.5 font-mono tracking-normal whitespace-nowrap text-muted-foreground">
                    {def}
                  </TableCell>
                  <TableCell className="py-2.5 text-muted-foreground">
                    {desc}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <footer
        className="rise mt-7 flex justify-between gap-3 text-[11px] text-muted-foreground"
        style={at(7)}
      >
        <span>MIT © Allen Labrague</span>
        <span>
          <a
            href={NPM}
            className="text-primary underline underline-offset-2 hover:text-muted-foreground"
          >
            npm
          </a>{" "}
          ·{" "}
          <a
            href={GITHUB}
            className="text-primary underline underline-offset-2 hover:text-muted-foreground"
          >
            source
          </a>
        </span>
      </footer>
    </main>
  );
}
