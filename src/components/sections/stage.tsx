import { Smartphone } from "lucide-react";
import { HoloCard } from "react-holo-card";

import { Button } from "@/components/ui/button";
import { HAS_GYRO, MOTION_NOTE, SECTION } from "@/constants";
import type { Demo } from "@/hooks/use-demo";

export function Stage({ demo }: { demo: Demo }) {
  const { art, ready, radius, sparkles, nums, gyro, stage, enableMotion } = demo;

  return (
    <section className={SECTION}>
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
            gyro={gyro}
            {...nums}
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
        {HAS_GYRO
          ? "Tilt your phone — or drag across the card. That's the whole API."
          : "Move your pointer across the card — or tilt your phone. That's the whole API."}
      </p>

      <div className="mt-3 flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!ready}
          className="h-9 w-full max-w-[280px] text-[12px]"
          onClick={enableMotion}
        >
          <Smartphone className="size-3.5" />
          Enable motion tilt
        </Button>
        <p className="max-w-[300px] text-center text-[10.5px] leading-[1.5] text-balance text-muted-foreground">
          {MOTION_NOTE}
        </p>
      </div>
    </section>
  );
}
