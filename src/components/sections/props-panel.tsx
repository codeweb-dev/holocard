import type { ReactNode } from "react";
import type { HoloCardProps } from "react-holo-card";

import { SectionTitle } from "@/components/section-title";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CHIP,
  CODE,
  MOTION_SNIPPET,
  NUMS,
  RADII,
  SECTION,
  TAB,
} from "@/constants";
import type { NumKey } from "@/constants";
import type { Demo } from "@/hooks/use-demo";

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

export function PropsPanel({ demo }: { demo: Demo }) {
  const {
    cards,
    art,
    radius,
    sparkles,
    nums,
    gyro,
    snippet,
    setPick,
    setRadius,
    setSparkles,
    setNums,
    setGyro,
  } = demo;

  return (
    <section className={SECTION}>
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

      {(Object.keys(NUMS) as NumKey[]).map((key) => {
        const { hint, min, max, step, unit } = NUMS[key];
        return (
          <Row key={key} label={key} hint={hint}>
            <div className="flex items-center gap-3">
              <Slider
                min={min}
                max={max}
                step={step}
                value={[nums[key]]}
                // step 0.01 lands on 1.0700000000000003 without the round
                onValueChange={([v]) =>
                  setNums((n) => ({ ...n, [key]: +v.toFixed(2) }))
                }
                aria-label={key}
                className="w-full sm:w-[140px]"
              />
              <output className="w-12 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                {nums[key]}
                {unit}
              </output>
            </div>
          </Row>
        );
      })}

      <Row label="gyro" hint="tilt your phone · iOS needs approval">
        <Switch
          checked={gyro}
          onCheckedChange={setGyro}
          aria-label="Toggle gyroscope tilt"
        />
      </Row>

      <Tabs defaultValue="usage" className="mt-3.5 gap-2.5">
        <TabsList variant="line" className="h-6">
          <TabsTrigger value="usage" className={TAB}>
            usage
          </TabsTrigger>
          <TabsTrigger value="motion" className={TAB}>
            motion tilt
          </TabsTrigger>
        </TabsList>
        <TabsContent value="usage">
          <pre className={CODE}>{snippet}</pre>
        </TabsContent>
        <TabsContent value="motion">
          <pre className={CODE}>{MOTION_SNIPPET}</pre>
        </TabsContent>
      </Tabs>
    </section>
  );
}
