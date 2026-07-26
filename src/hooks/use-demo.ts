import { useEffect, useRef, useState } from "react";
import type { HoloCardProps } from "react-holo-card";
import { toast } from "sonner";

import {
  ART_API,
  FALLBACK,
  HAS_GYRO,
  NEEDS_GYRO_TAP,
  NUM_DEFAULTS,
  toArt,
} from "@/constants";
import type { Art, NumKey } from "@/constants";

/**
 * Every control on the page and the card they all drive. One hook, called once
 * in App — the sections share the result rather than each holding their own.
 */
export function useDemo() {
  const [cards, setCards] = useState<Art[]>([]);
  const [pick, setPick] = useState("");
  const [radius, setRadius] = useState<HoloCardProps["radius"]>("md");
  const [sparkles, setSparkles] = useState(true);
  const [nums, setNums] = useState(NUM_DEFAULTS);
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

  /** Everything the button can run into, each said in the toast rather than by disabling it. */
  const enableMotion = () => {
    if (!HAS_GYRO)
      return toast.info("Motion tilt needs a phone", {
        description:
          "This device has no gyroscope to read. Open the page on a phone and tap this button — the card then follows how you hold it.",
      });

    if (!gyro)
      return toast.warning("The gyro prop is off", {
        description:
          "Switch gyro back on under Props, then tap Enable motion tilt.",
      });

    if (!NEEDS_GYRO_TAP)
      return toast.success("Motion tilt is already on", {
        description:
          "Your browser hands out orientation without asking. Tilt your phone and the card follows.",
      });

    // HoloCard asks iOS for motion access on its own click. Forward this one so a
    // visible button works as well as tapping the art — same user gesture either way.
    stage.current?.querySelector<HTMLElement>(".holo-card")?.click();
    toast.info("Approve motion access", {
      description:
        "iOS asks once, and only over HTTPS. Approve it, then tilt your phone.",
    });
  };

  const snippet = [
    "<HoloCard",
    `  url="${art?.file ?? "…"}"`,
    "  width={280} height={390}",
    radius !== "md" && `  radius="${radius}"`,
    !sparkles && "  showSparkles={false}",
    ...Object.entries(nums)
      .filter(([k, v]) => v !== NUM_DEFAULTS[k as NumKey])
      .map(([k, v]) => `  ${k}={${v}}`),
    !gyro && "  gyro={false}",
    "/>",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    cards,
    art,
    ready,
    radius,
    sparkles,
    nums,
    gyro,
    stage,
    snippet,
    setPick,
    setRadius,
    setSparkles,
    setNums,
    setGyro,
    enableMotion,
  };
}

export type Demo = ReturnType<typeof useDemo>;
