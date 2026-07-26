import { GITHUB, NPM } from "@/constants";

export function Footer() {
  return (
    <footer className="rise mt-7 flex justify-between gap-3 text-[11px] text-muted-foreground">
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
  );
}
