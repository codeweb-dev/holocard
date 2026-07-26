import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Install } from "@/components/sections/install";
import { PropsPanel } from "@/components/sections/props-panel";
import { Reference } from "@/components/sections/reference";
import { Stage } from "@/components/sections/stage";
import { useDemo } from "@/hooks/use-demo";

export default function App() {
  // One source of truth: the stage renders it, the props panel drives it.
  const demo = useDemo();

  return (
    <main className="mx-auto w-full max-w-[520px] px-5 pt-10 pb-9">
      <Header />

      <p className="rise mt-0.5 mb-6 text-pretty">
        A card that tilts, catches the light, and throws rainbow foil —
        everywhere your pointer goes.{" "}
        <strong className="font-medium text-card-foreground">
          Every control below drives the real component.
        </strong>
      </p>

      <Stage demo={demo} />
      <PropsPanel demo={demo} />
      <HowItWorks />
      <Install />
      <Reference />
      <Footer />
    </main>
  );
}
