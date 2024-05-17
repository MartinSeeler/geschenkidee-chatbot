import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:80px_80px]">
      <div className="mx-auto w-container max-w-2xl px-5 py-[110px] text-center lg:py-[150px]">
        <h1 className="text-3xl font-heading md:text-4xl lg:text-5xl text-pretty">
          Finde das perfekte Geschenk in Sekunden
        </h1>
        <p className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed">
          Schnell, personalisiert und ohne Anmeldung. Mit deinem persönlichen
          KI-Berater findest du das perfekte Geschenk für jeden Anlass.
        </p>

        <Button
          size="lg"
          className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
          asChild
        >
          <Link href="/chat">Jetzt kostenlose Geschenkideen erhalten</Link>
        </Button>
      </div>
    </header>
  );
}
