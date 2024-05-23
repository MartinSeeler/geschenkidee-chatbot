export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-white sm:p-8 p-4 text-sm sm:text-base shadow-base border-2 border-black">
        <h1 className="text-pretty text-2xl font-space sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
          Lass uns gemeinsam das perfekte Geschenk finden!
        </h1>
        <p className="leading-snug text-zinc-900">
          Schreib mir einfach, was du suchst, und ich zaubere dir sofort
          personalisierte Geschenkideen. Keine endlosen Listen, kein Stress –
          nur coole Vorschläge genau für dich. Lass uns starten und das ideale
          Geschenk finden!
        </p>
      </div>
    </div>
  );
}
