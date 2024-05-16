import { ExternalLink } from "@/components/external-link";

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 sm:p-8 p-4 text-sm sm:text-base">
        <h1 className="text-pretty text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
          Finde sofort die perfekte Geschenkidee
        </h1>
        <h2 className="text-pretty text-lg sm:text-xl tracking-tight font-semibold max-w-fit inline-block pt-2">
          Brauchst du Geschenkideen? Ich bin für dich da!
        </h2>
        <p className="leading-snug text-zinc-900">
          Ich bin dein KI-basierter Geschenke-Assistent. Kein Durchforsten von
          Listen oder Filtern – beginne einfach zu chatten, und ich schlage dir
          passende Geschenkideen vor.
        </p>
        <h2 className="text-pretty text-lg sm:text-xl tracking-tight font-semibold max-w-fit inline-block pt-2">
          Je mehr wir plaudern, desto präziser die Ideen
        </h2>
        <p className="leading-snug text-zinc-900">
          Mit jedem Gespräch verstehe ich deine Wünsche besser und finde immer
          passendere Geschenk.
        </p>
        <h2 className="text-pretty text-lg sm:text-xl tracking-tight font-semibold max-w-fit inline-block pt-2">
          Ohne Anmeldung und komplett kostenlos
        </h2>
        <p className="leading-snug text-zinc-900">
          Fang direkt an zu tippen und beschreibe die Person oder den Anlass
          unten im Eingabefeld. Deine Texte und Infos speichern wir nicht. Unser
          Service ist kostenlos, da wir durch Vermittlung an Amazon verdienen.
        </p>
      </div>
    </div>
  );
}
