import { ExternalLink } from "@/components/external-link";

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 sm:p-8 p-4 text-sm sm:text-base">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
          Kein Plan was du schenken sollst?
        </h1>
        <p className="leading-normal text-zinc-900">
          Keine Sorge! Ich helfe dir gerne dabei, das perfekte Geschenk zu
          finden. Schreibe mir einfach, für wen du ein Geschenk suchst und ich
          werde dir einige Vorschläge machen. 🎁
        </p>

        <p className="leading-normal text-zinc-900">
          Ich bin als KI Chatbot darauf spezialisiert, dir bei der Suche nach
          Geschenken zu helfen. Und keine Sorge, hier wird nichts gespeichert
          oder weitergegeben. Deine Privatsphäre ist mir wichtig.
        </p>
        <p className="leading-normal text-zinc-900">
          Und das Beste? Es ist kostenlos! 😊 Wir verdienen nur Geld, wenn du
          was auf Amazon bestellst. Das kostet dich nichts extra, sondern wir
          bekommen von Amazon einfach eine Provision fürs Vermitteln.
        </p>
      </div>
    </div>
  );
}
