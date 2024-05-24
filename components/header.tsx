import { Button } from "@/components/ui/button";
import Link from "next/link";

// bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:80px_80px]

export default function Header() {
  return (
    <header className="inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center">
      <div className="mx-auto w-container max-w-3xl px-5 py-[110px] text-center lg:py-[150px]0">
        <h1 className="font-space text-5xl font-heading md:text-5xl lg:text-6xl text-pretty">
          Finde das perfekte Geschenk in Sekunden
        </h1>
        <p className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed">
          Schnell, personalisiert und ohne Anmeldung.
          <br />
          Mit deinem persönlichen KI-Berater findest du passende Geschenkideen
          für jeden Anlass.
        </p>

        <Button
          size="lg"
          theme="mint"
          className="h-12 md:text-lg lg:h-14 lg:text-xl"
          asChild
        >
          <Link href="/chat">Jetzt kostenlos Geschenkideen erhalten</Link>
        </Button>
      </div>
    </header>
  );
}
