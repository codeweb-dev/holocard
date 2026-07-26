import { SectionTitle } from "@/components/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { LAYERS, SECTION } from "@/constants";

export function HowItWorks() {
  return (
    <section className={SECTION}>
      <SectionTitle note="pointer and sensor, zero re-renders">
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
  );
}
