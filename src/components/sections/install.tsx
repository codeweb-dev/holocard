import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { SectionTitle } from "@/components/section-title";
import { Button } from "@/components/ui/button";
import { INSTALL, SECTION } from "@/constants";

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

export function Install() {
  return (
    <section className={SECTION}>
      <SectionTitle note="react ≥ 17 · pulls in react-parallax-tilt">
        Install
      </SectionTitle>
      <div className="flex items-center gap-2.5 rounded-lg bg-card py-1.5 pr-1.5 pl-3 ring-1 ring-border ring-inset">
        <span className="font-mono text-[11.5px] text-muted-foreground">$</span>
        <code className="flex-1 overflow-x-auto font-mono text-[11.5px] tracking-normal whitespace-nowrap text-primary">
          {INSTALL}
        </code>
        <CopyButton text={INSTALL} />
      </div>
    </section>
  );
}
