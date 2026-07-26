export const INSTALL = "npm install react-holo-card";
export const GITHUB = "https://github.com/codeweb-dev/holo-card";
export const NPM = "https://www.npmjs.com/package/react-holo-card";
export const VERSION = "0.3.7";

/** The four Base Set holos, straight off pokemontcg.io — nothing ships in the repo. */
export const ART_API =
  "https://api.pokemontcg.io/v2/cards?q=set.id:base1&pageSize=4&select=id,name,images";

export type Art = { id: string; file: string; alt: string };

export const toArt = (name: string, file: string): Art => ({
  id: name.toLowerCase(),
  file,
  alt: `${name}, a holographic card from the Pokémon Base Set`,
});

/** The API 500s a few times an hour. Its image CDN doesn't — same four cards, no request. */
export const FALLBACK = ["Alakazam", "Blastoise", "Chansey", "Charizard"].map(
  (name, i) => toArt(name, `https://images.pokemontcg.io/base1/${i + 1}_hires.png`),
);

/**
 * ponytail: mobile by capability, not by viewport — a phone keeps its gyro at
 * any width, and a narrow desktop window never grows one.
 */
export const HAS_GYRO =
  "DeviceOrientationEvent" in window &&
  matchMedia("(pointer: coarse)").matches;

/** iOS 13+ is the only engine that withholds orientation until a gesture asks for it. */
export const NEEDS_GYRO_TAP =
  typeof (
    window.DeviceOrientationEvent as unknown as {
      requestPermission?: unknown;
    }
  )?.requestPermission === "function";

export const RADII = ["none", "sm", "md", "lg", "xl", "full"] as const;

export const LAYERS = [
  [
    "<Tilt>",
    "Tilt",
    "react-parallax-tilt owns the pointer transform — maxTilt, scale, perspective and ease-back forward to it.",
  ],
  [
    "--mx --my",
    "Glare",
    "A specular hotspot under the cursor, blended with screen so it survives light art.",
  ],
  [
    "--distance",
    "Foil",
    "A diagonal rainbow in color-dodge, strengthening toward the edge.",
  ],
  [
    "--rx --ry",
    "Gyro",
    "The gravity vector, low-passed — not raw beta/gamma, which flips sign holding a phone upright.",
  ],
];

export const API: [prop: string, type: string, def: string, desc: string][] = [
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
  ["scale", "number", "1.04", "Scale while the pointer is over the card"],
  ["perspective", "number", "1200", "3D depth in px — lower is more extreme"],
  [
    "transitionSpeed",
    "number",
    "400",
    "Ease-back duration in ms on pointer leave",
  ],
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

/** The numeric props, their defaults, and the range each one is worth dragging over. */
export const NUMS = {
  maxTilt: { def: 30, hint: "degrees at the edge", min: 0, max: 50, step: 1, unit: "°" },
  scale: { def: 1.04, hint: "grow while pointing", min: 1, max: 1.2, step: 0.01, unit: "×" },
  perspective: { def: 1200, hint: "3D depth · lower is extreme", min: 400, max: 2000, step: 50, unit: "px" },
  transitionSpeed: { def: 400, hint: "ease-back on leave", min: 0, max: 1000, step: 50, unit: "ms" },
} as const;

export type NumKey = keyof typeof NUMS;

export const NUM_DEFAULTS = Object.fromEntries(
  Object.entries(NUMS).map(([k, v]) => [k, v.def]),
) as Record<NumKey, number>;

/**
 * The motion-tilt recipe, which is exactly what the button under the card does:
 * forward a click to `.holo-card` so iOS sees the same user gesture.
 */
export const MOTION_SNIPPET = `const stage = useRef(null);

// iOS counts this as the same gesture as
// tapping the art, so it grants motion
const enable = () =>
  stage.current.querySelector(".holo-card").click();

<div ref={stage}>
  <HoloCard url="/card.png" />
</div>

<Button onClick={enable}>Enable motion tilt</Button>`;

/** What the button under the card can actually do here, said before it is pressed. */
export const MOTION_NOTE = !HAS_GYRO
  ? "On a phone this asks for motion access and the card starts following how you hold it. This device has no gyroscope, so it will just tell you that."
  : NEEDS_GYRO_TAP
    ? "iOS won't hand out gyroscope data until you approve it, and only over HTTPS. Tapping the card asks too — but ship a button like this so people know the permission exists."
    : "Your browser hands out motion data freely, so the card is already following your phone. On iOS you'd need to approve it first.";

export const CHIP =
  "h-7 rounded-md px-2.5 text-[11px] font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground";

export const TAB = "px-2 font-mono text-[11px] tracking-normal";

export const CODE =
  "overflow-x-auto rounded-lg bg-card px-4 py-3.5 font-mono text-[11px] leading-[1.65] tracking-normal text-card-foreground ring-1 ring-border ring-inset";

/** Every section is a direct child of <main> and rises in on DOM order — see .rise in index.css. */
export const SECTION = "rise mb-6";
