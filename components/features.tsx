import Marquee from "react-fast-marquee";
import {
  BadgeEuro,
  BadgePercent,
  BellOff,
  BotMessageSquare,
  HeartHandshake,
  LucideProps,
  MailX,
  MessageCircleHeart,
  ShieldCheck,
} from "lucide-react";
import { ForwardRefExoticComponent } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

type Feature = {
  title: string;
  text?: string;
  icon: ForwardRefExoticComponent<LucideProps>;
};

const features: Feature[] = [
  {
    title: "Keine Anmeldung erforderlich",
    text: "Starte sofort ohne lästige Registrierungen und erhalte direkt deine Geschenkideen. Keine Email-Adresse notwendig!",
    icon: MailX,
  },
  {
    title: "Für immer kostenlos",
    text: "Der KI-Assistent kostet dich nichts! Keine versteckten Kosten oder Abos. Nur die Geschenke musst du selbst bezahlen.",
    icon: BadgeEuro,
  },
  {
    title: "Ohne nervige Werbung",
    text: "Nervige Werbung? Nein Danke! Erlebe eine werbefreie Benutzererfahrung und konzentriere dich nur auf das Finden des perfekten Geschenks.",
    icon: BellOff,
  },
  {
    title: "Schnell und persönlich",
    text: "Erhalte in Sekundenschnelle maßgeschneiderte Geschenkideen basierend auf deinen Angaben zur Person und dem Anlass.",
    icon: MessageCircleHeart,
  },
  {
    title: "Einfach zu bedienen",
    text: "Keine komplizierten Filter oder endlose Suchergebnisse. Rede einfach mit dem KI-Assistenten und erhalte passende Vorschläge.",
    icon: BotMessageSquare,
  },
  {
    title: "Datenschutz garantiert",
    text: "Wir speichern keine Texte. Deine Eingaben sind sicher und werden nur zur Generierung der Vorschläge genutzt.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  return (
    <div>
      <div>
        <Marquee
          className="border-y-2 border-y-black bg-white py-3 font-base sm:py-5"
          direction="left"
          autoFill
          pauseOnHover
        >
          {features.slice(0, 3).map((feature) => {
            return (
              <div
                className="flex items-center"
                key={"feature-top-" + feature.title}
              >
                <span className="mx-10 text-lg font-heading sm:text-xl lg:text-2xl">
                  {feature.title}
                </span>
                <feature.icon size={30} strokeWidth={3} absoluteStrokeWidth />
              </div>
            );
          })}
        </Marquee>
      </div>
      <section className="bg-mint-50 py-20 font-base lg:py-[100px]">
        <header className="mb-14 lg:mb-20 text-pretty">
          <h2 className="px-5 text-center text-2xl font-freeman font-heading md:text-3xl lg:text-4xl">
            Dein persönlicher KI-Berater für Geschenkideen
          </h2>
        </header>

        <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-8 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            return (
              <div
                className="relative flex flex-col gap-3 rounded-base border-2 border-black bg-white p-5 shadow-base"
                key={i}
              >
                <div className="text-white absolute top-0 right-0 -mt-4 mr-4 rounded-xl bg-purple-800 p-3 border-2 border-black">
                  <feature.icon size={40} strokeWidth={4} absoluteStrokeWidth />
                </div>
                <h3 className="mt-4 text-xl font-freeman font-heading">
                  {feature.title}
                </h3>
                <p>{feature.text}</p>
              </div>
            );
          })}
        </div>
        <div className="w-full flex mt-12">
          <Button
            size="lg"
            color="purple"
            className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl mx-auto"
            asChild
          >
            <Link href="/chat">
              Ausprobieren und erste Geschenkideen erhalten
            </Link>
          </Button>
        </div>
      </section>
      <div>
        <Marquee
          className="border-y-2 border-y-black bg-white py-3 font-base sm:py-5"
          direction="left"
          autoFill
          pauseOnHover
        >
          {features.slice(3, 6).map((feature) => {
            return (
              <div
                className="flex items-center"
                key={"feature-top-" + feature.title}
              >
                <span className="mx-10 text-lg font-heading sm:text-xl lg:text-2xl">
                  {feature.title}
                </span>
                <feature.icon size={30} strokeWidth={3} absoluteStrokeWidth />
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
