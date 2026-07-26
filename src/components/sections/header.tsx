import { useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GITHUB, VERSION } from "@/constants";

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

export function Header() {
  return (
    <header className="rise mb-0.5 flex items-baseline justify-between">
      <h1 className="flex items-center gap-2 text-[21px] font-semibold tracking-[-0.026em] text-primary">
        holocard
      </h1>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10.5px] tracking-normal text-muted-foreground">
          v{VERSION} · 1 dep
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
  );
}
