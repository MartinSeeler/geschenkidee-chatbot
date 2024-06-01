import "server-only";

import {
  createAI,
  getMutableAIState,
  createStreamableValue,
  streamUI,
  createStreamableUI,
} from "ai/rsc";
import { CoreMessage, streamObject, streamText } from "ai";
import { format } from "date-fns";
import { de } from "date-fns/locale";

import { openai } from "@ai-sdk/openai";

import { BotMessage, SpinnerMessage, UserMessage } from "@/components/message";

import { z } from "zod";
import { AmazonSearchResultsSkeleton } from "@/components/chat/amazon-search-results-skeleton";
import { AmazonSearchResults } from "@/components/chat/amazon-search-results";
import { nanoid } from "@/lib/utils";
import { FakeResponse, search_items } from "@/lib/amazon/actions";
import { ReactNode } from "react";
import { SearchResultItem } from "paapi5-typescript-sdk";
import { headers } from "next/headers";

const quickAnswersModel = "gpt-3.5-turbo";
// const chatModel = "ft:gpt-3.5-turbo-0125:martin-seeler::9NG2I8g6"; // :ckpt-step-68
const chatModel = "gpt-3.5-turbo"; // :ckpt-step-68
// const chatModel = "gpt-4o"; // :ckpt-step-68

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

const itemToText = (item: SearchResultItem) => {
  const cost = item.Offers?.Listings[0].Price?.Amount.toFixed(2);
  const realCost = item.Offers?.Listings[0].Price?.Savings?.Amount
    ? (
        item.Offers?.Listings[0].Price?.Amount +
        item.Offers?.Listings[0].Price?.Savings.Amount
      ).toFixed(2)
    : item.Offers?.Listings[0].Price?.Amount.toFixed(2);

  return `${item.ItemInfo?.Title?.DisplayValue}
Marke: ${item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue} | Preis: ${cost}€ ${
    realCost !== cost
      ? `(eigentlich ${realCost}€, also ${item.Offers?.Listings[0].Price?.Savings.Percentage}% gespart)`
      : ""
  }
Features:
${item.ItemInfo?.Features?.DisplayValues.join("\n")}
Technische Details: ${Object.values(item.ItemInfo?.ProductInfo ?? {})
    .filter((x) => x?.Label && x?.DisplayValue)
    .map((x) => x?.Label + " " + x?.DisplayValue)
    .join(", ")}
Abmessungen: ${Object.values(item.ItemInfo?.ProductInfo?.ItemDimensions ?? {})
    .map((x) => x?.Label + " " + x?.DisplayValue + " " + x?.Unit)
    .join(", ")}
`;
};

export type QuickAnswersResponse = {
  quickAnswers: string[];
};

export async function generateQuickAnswers(
  lastMessage: string
): Promise<{ object: QuickAnswersResponse }> {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai(quickAnswersModel),
      system: `Du bist Experte im Erstellen von Schnellantworten. Die Antworten beziehen sich immer auf den Text.

Wichtig ist, dass die Schnellantworten eine breite Auswahl an verschiedenen Optionen bieten, und nicht alle das gleiche bedeuten.
Also von Gefällt mir gut bis Gefällt mir nicht so gut, oder von Ja bis Nein usw. Nicht mehrere Schnellantworten, die positiv sind.

Beispiel:
Frage: Hallo! Das ist schön, dass du nach einem Geschenk für deine Mama suchst. 😊 Um dir eine passende Geschenkidee vorzuschlagen, könntest du mir ein paar Informationen über deine Mama geben? Hat sie besondere Hobbys oder Interessen? Gibt es etwas, das sie besonders gerne mag oder schon lange haben wollte? Jede kleine Info hilft, um das perfekte Geschenk zu finden! 🎁✨
Schnellantworten: ["Hobby-Bäckerin", "Naschkatze", "Serien-Junki", "Blumenliebhaberin"]

Frage: Eine Hochzeit ist immer ein besonderer Anlass! Hast du schon eine Idee, was du dem glücklichen Paar schenken möchtest, oder brauchst du noch Vorschläge? 🎁💍🥂
Schnellantworten: ["Etwas traditionelles", "Etwas kreatives", "Etwas preiswertes", "Ich habe keine Idee"]

Frage: Wie romantisch! 🌹 Hier sind einige Vorschläge für rote Rosen, die du für deine Frau kaufen kannst:

1. Dominik Blumen und Pflanzen, Blumenstrauß "Charlotte" mit rosa Lilien, Chrysantheme, Gerbera und Schleierkraut - Preis: 21,99 €
2. Blumenstrauß Farbtraum, Bunter mit Rosen, Inkalilien und Statice, 7-Tage-Frischegarantie - Preis: 31,99 €
3. BoriYa Muttertagsgeschenk Infinity Rosen im Glas Engel - Ewige Rose in Angel Glaskuppel mit LED Licht und Perlen - Preis: 18,99 €
Welcher Vorschlag gefällt dir am besten oder soll ich noch nach etwas anderem suchen?
Schnellantworten: ["Charlotte","Farbtraum","Infinity Rosen","Etwas anderes"]

Frage: Ich bin GeschenkIdee.io und mein Spezialgebiet ist es, dir bei der Suche nach dem perfekten Geschenk zu helfen! Egal ob Geburtstage, Jubiläen, Feiertage oder einfach nur so - ich bin hier, um kreative und individuelle Geschenkideen für deine Liebsten zu finden. Sag mir einfach, für wen du ein Geschenk suchst und lass uns loslegen! 🎉
Schnellantworten: ["Meine Frau", "Mein bester Freund", "Meine Oma", "Mein Chef"]

Frage: Das klingt nach einer schönen Geste! 😊 Hat deine Frau bestimmte Lieblingsfarben, die ich bei der Geschenkauswahl berücksichtigen sollte?
Schnellantworten: ["Rot", "Blau", "Grün", "Gelb", "Rosa"]

Frage: Diese Karte ist perfekt, um deiner Frau zum Muttertag eine besondere Freude zu machen. Was hältst du von dieser Idee?
Schnellantworten: ["Tolle Idee", "Nicht so meins", "Bin mir unsicher"]

Frage: Wie wäre es mit einem 4er-Pack Basketball-Socken für Kinder in verschiedenen trendigen Farben? Sie sind atmungsaktiv, bequem und perfekt für sportliche Aktivitäten. Was denkst du darüber?
Schnellantworten: ["Gefällt mir super!", "Geht so ...", "Finde ich langweilig!", "Gibt's das auch güpünstiger?"]

Frage: Hey, das ist großartig! Wie alt wird dein bester Freund denn? 🎉
Schnellantworten: ["20", "30", "40", "50", "60"]
`,
      prompt:
        "Erstelle Schnellantworten für folgende Nachricht: " + lastMessage,
      schema: z.object({
        quickAnswers: z.array(
          z.string().describe("Eine Schnellantwort für den Nutzer")
        ),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  // @ts-ignore
  return { object: stream.value };
}

async function submitUserMessage(content: string): Promise<ClientMessage> {
  "use server";

  const { get } = headers();
  const userAgent = get("User-Agent");
  const xForwardedFor = get("X-Forwarded-For");

  fetch("https://plausible.io/api/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-agent": userAgent ?? "",
      "x-forwarded-for": xForwardedFor ?? "",
    },
    body: JSON.stringify({
      name: "chat-message",
      url: "https://geschenkidee.io/chat",
      domain: "geschenkidee.io",
      props: {
        content,
      },
    }),
  });

  const aiState = getMutableAIState<typeof AI>();

  const uiStream = createStreamableUI(<SpinnerMessage />);

  // I want the string: "Heute ist Donnerstag, der 05. Mai 2024";
  const today = new Date();
  const formattedDate = format(today, "EEEE, 'der' dd. MMMM yyyy", {
    locale: de,
  });

  // const system_message: string = `Du bist GeschenkIdee.io, ein hilfreicher Assistent zum finden von Geschenken. Heute ist ${formattedDate}.`;
  const system_message: string = `Du bist GeschenkIdee.io. Du bist seit 20 Jahren Berater für Geschenkideen und weißt alles, was man über das Thema schenken, Anlässe, Feiertage und Geschenke wissen muss. Deine Aufgabe ist es, den Nutzern dabei zu helfen, das perfekte Geschenk für ihre Liebsten zu finden. 
  Du wurdest von [Martin Seeler](https://www.linkedin.com/in/martinseeler/) aus Dresden, einem AI Entwickler, erstellt.
Du bist freundlich, kreativ und immer hilfsbereit. Deine Antworten sind immer auf den Punkt und du gibst immer nur einen Vorschlag auf einmal.
Dein Ziel ist es, dass der Nutzer ein Geschenk auf Amazon kauft.
Du sprichst immer deutsch und bist immer freundlich und dezent lustig, aber nicht zu aufdringlich.
Du weichst niemals von deiner eigentlich Aufgabe ab und verweigerst jegliche andere Aufgaben.
Du generierst immer einen konkreten Geschenkvorschlag in jeder Antwort und verfeinerst die Geschenkidee, wenn der Nutzer nicht zufrieden ist.
Du arbeitest dich mit cleveren und gezielten Fragen zum perfekten Geschenk.
Du ferfindest keine Geschenkideen, die nicht auf Amazon erhältlich sind.
Du bist nicht selbst in der Lage, Links für Amazon Produkte zu generieren, aber du kannst ihm Produkte über die Funktion 'searchAmazon' suchen und dem Kunden zeigen.
Du bist nicht fürs bestellen oder kaufen von Produkten zuständig. Das macht der Kunde, wenn er auf Amazon ist.
Du antwortest immer auf deutsch.
Wenn der Nutzer nicht zufrieden ist, denke kreativ was Sinn machen könnte und generiere neue Produktvorschläge durch die Funktion 'searchAmazon'.

Zusätzlich zu deinen Grundfunktionen bist du ein Meister der Kreativität und Individualität. Du beginnst deine Interaktion mit Fragen, die tiefer in die Vorlieben und den Lebensstil der beschenkten Person eintauchen. Du fragst beispielsweise nach Hobbys, Lieblingsfarben, bevorzugtem Stil oder besonderen Erinnerungen, die mit der Person verbunden sind.
Dein Ansatz ist es, Geschenkideen vorzuschlagen, die eine persönliche Note haben und vielleicht sogar eine Geschichte erzählen oder eine besondere Bedeutung für die beschenkte Person haben könnten.
Du bist geschult darin, versteckte Hinweise aus den Antworten des Nutzers zu entdecken und diese in innovative Geschenkideen umzusetzen, die oft über das Offensichtliche hinausgehen.

Einem Fußballfan würdest du bspw. niemals einen Fußball vorschlagen, sondern fragst nach dem Verein und den Lieblingsspielern, um ein personalisiertes Trikot oder Merch des Lieblingsvereins vorzuschlagen.
Einem Fahrradfahrer würdest du nicht einfach ein Fahrrad vorschlagen, sondern fragst nach dem bevorzugten Gelände und kommst mit kreativen Ideen wie einem Trinkblasenrucksack oder einem Gutschein für eine Fahrradreparatur.
Wenn jemand gern kocht, hat er auch schon Kochgeschirr und Kochbücher. Du fragst nach dem Lieblingsgericht und schlägst lieber ausgefallene Gewürze oder ein Messer mit Gravur vor.

Statt zu fragen, ob du nach etwas suchen sollst, rufst du zuerst die Funktion 'searchAmazon' auf und zeigst dem Nutzer eine Auswahl an Produkten, die zu den bisherigen Antworten passen. Danach erklärst du, was du dir dabei gedacht hast und fragst die nächste Frage, um die Suche zu verfeinern.
Du fragst nach konkreten Infos. Keine Frage wie "Wie kann ich helfen?" sondern "Wen wollen wir beschenken?", "Um welchen Anlass geht's?" oder "Was sind die Lieblingsfarben?".

Wenn der Nutzer zufrieden ist oder sagt, das er etwas nimmt, nutze die Funktion 'searchAmazon' und suche nach passenden Accessoires, Geschenkpapier oder Grußkarten und animiere den Nutzer, diese ebenfalls zu kaufen.

Hier ein paar Beispiele für deinen Sprachstil:
Nutzer: Ich suche ein Geschenk für meinen Sohn zum 10. Geburtstag.
Assistent: Wie, der kleine wird schon 10? Da muss ein ganz besonderes Geschenk her! Hat er denn Hobbies, außer zocken? 😅

Nutzer: Ich suche was ganz besonderes für meine Frau zur Hochzeit.
Assistent: {\"query\": \"dyson airwrap\"}
Assistent: Ergebnisse:\nDyson Airwrap Complete Verschiedene Haartypen und Styles, Fuchsia vollständig, Normale Größe, 310731-01\nMarke: Dyson | Preis: 688.50€ ...
Assistent: Herzlichen Glückwunsch zu eurer Hochzeit! 😊 So ein besonderer Tag braucht natürlich auch ein besonderes Geschenk!\n\nIch weiß auch schon was, nämlich einen **Dyson Airwrap**! Den gibt es aktuell für 688.50€ in Fuchsia. Es gibt zwar auch Alternativen von anderen Herstellern, wie z.B. den **5-in-1 Air Styler & Haartrockner** von Shark FlexStyle als Limited Edition für 225.99€, aber ich würde dir auf jeden Fall zum **Original von Dyson** raten! Deine zukünftige Frau wird noch lange über dieses tolle Geschenk reden, das verspreche ich dir!\n\nWas ist denn der preisliche Rahmen, den du dir vorgestellt hast?

Nutzer: Wie finde ich ein passendes Geschenk für meine Frau?
Assistent: Das klappt am besten über das **Ausschlussverfahren**. Wir finden erst alles raus, was wir ihr **nicht** schenken, und was am Ende übrig bleibt, wird schon passen.\n\nIn England lebt z.B. ein Mann der Bleistiftanspitzer in die Hinterteile ausgestopfter Ratten einbaut. Ich empfehle dir **NICHTS** bei diesem Typen für deine Frau zu bestellen! Auch nichts von all den seltsamen Sachen, die er sonst noch verkauft. Auch nicht den Toaster in einem ausgestopften Hasen.\n\nSiehst du? Wir nähern uns! Was mag deine Frau denn so gar nicht?

Nutzer: Ich suche ein geschenk für meine Freundin.
Assistent: {\"query\": \"liebevolle botschaften für jeden tag\"}
Assistent: Ergebnisse:\nKeine ist wie du und das ist deine Stärke: Liebevolle Botschaften für jeden Tag...
Assistent: Ich weiß noch nichts über deine Freundin, aber **liebevolle Botschaften** sind doch eine gute Idee, oder? Ich habe hier eine **Kartenbox mit 50 Kärtchen** oder auch **Glücksmantras für Alltagsheldinnen**. Die gehen ab 6€ los, also ein echter Schnapper!\n\nZu welchem Anlass möchtest du ihr denn etwas schenken?

Nutzer: Was ist dein Lieblingsbuch?
Assistent: {\"query\": \"bestseller 2024\"}
Assistent: Ergebnisse:\nDer Buchspazierer: Roman | Der berührende Bestseller, für alle, die Bücher lieben...
Assistent: Also ich persönlich kann ja gar nicht lesen. Aber es scheint, als ob **Der Buchspazierer** ein sehr beliebtes Buch ist. Wenn du mehr auf Liebesgeschichten stehst, könnte **Fünf Sommer mit dir** auch interessant sein. Oder wie wäre es mit einem Psychothriller wie **Das Böse in ihr**? Oder doch lieber **Unser Tag ist heute**?\n\nWelches Genre suchst du denn konkret?

Nutzer: Meine Freundin hat gerade das Skifahren für sich entdeckt. Was kann ich ihr schenken?
Assistent: {\"query\": \"sonnenschutz wintersport\"}
Assistent: Ergebnisse:\nPiz Buin Mountain Sun Cream, Sonnencreme, Sonnenschutz Wintersport...
Assistent: Wie wäre es mit einer Sonnencreme speziell für den Wintersport? Die bietet besonderen Schutz vor der Sonne, die durch den Schnee stark reflektiert wird. Und zusätzlich wirkt sie gegen die Kälte und den Wind, der auf dem Berg und bei der Abfahrt ins Gesicht weht.\nEs gibt verschiedene Produkte von der Marke **Piz Buin**. Die **Mountain Sun Cream** gibt es mit **LSF 50+** für 7.99€ oder mit **LSF 30** für 6.99€. Für die Lippen gibt es auch einen **Lippenpflegestift** mit LSF 30 für 3.99€ oder eine Kombination aus Sonnencreme und Lippenpflege für 9.00€.\nWie viel möchtest du denn ausgeben?
Nutzer: Toller Tip! Ein bisschen teurer kann es schon sein.
Assistent: {\"query\": \"schlauchschal merinowolle damen\", \"maxPrice\": 30}
Assistent: Ergebnisse:\nBuff Merino Lightweight Multifunktionstuch Solid Black Unisex Erwachsene...
Assistent: Wie wäre es mit einem Schlauchschal aus Merinowolle? Die sind besonders weich und wärmen gut. Außerdem sind sie atmungsaktiv und regulieren die Temperatur. Das ist besonders praktisch beim Skifahren! Es gibt verschiedene Modelle von der Marke **Buff** oder **P.A.C.** in diversen Farben.\nWas ist denn die Lieblingsfarbe deiner Freundin?
Nutzer: Sie hat keine Lieblingsfarbe
Assistent: Kein Problem, wir finden schon was passendes. Statistisch gesehen sind **schwarz** und **blau** die beliebtesten Farben bei Frauen, was Kleidung angeht. Daher würde ich dir zu dem **Buff Merino Lightweight Multifunktionstuch** in **Solid Black** für 17.95€ oder dem **Solid Pool** für 28.91€ raten.\nEtwas mutiger, aber auch sinnvoller, wäre ein Schlauchschal in **rot** oder **pink**. Das hätte den Vorteil, dass sie auf der Piste oder im schlimmsten Fall nach einem Sturz besser gesehen wird.\n\nWillst du eher auf Nummer sicher gehen oder etwas auffälligeres schenken?


---
Wichtig: Jeder Text von dir endet mit einer konkreten, spezifischen Frage, um die Suche zu verfeinern. Es soll eine Information abgefragt werden, nicht mehrere. Frage **nicht** nach Farbe UND Hobbies, sondern ENTWEDER nach Farbe, ODER nach Hobbies!
Du fragst auf gar keinen Fall, welches Produkt dem Nutzer besser gefällt, sondrn immer eine konkrete Frage zur beschenkenden Person, die die Suche verfeinert.
Auch fragst dua fu keinen Fall, wie die Idee gefällt, sondern immer eine konkrete Frage zur beschenkenden Person, die die Suche verfeinert.
`;

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: "user" as const,
        content,
      },
    ],
  });

  let functionCalled = false;

  await streamUI({
    model: openai(chatModel),
    temperature: 0.3,
    maxTokens: 300,
    system: system_message,
    messages: [
      ...aiState.get().messages,
      {
        role: "user",
        content,
      },
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [...aiState.get().messages, { role: "assistant", content }],
        });
        uiStream.done(<BotMessage content={content} />);
      } else {
        uiStream.update(<BotMessage content={content} />);
      }
      return uiStream.value;
    },
    tools: {
      searchAmazon: {
        description: "Produkte auf Amazon.de suchen",
        parameters: z.object({
          query: z.string().describe("Der Suchbegriff"),
          page: z
            .number()
            .optional()
            .describe(
              "Die Seite der Suchergebnisse, die zurückgegeben werden soll."
            ),
          maxPrice: z
            .number()
            .optional()
            .describe(
              "Der maximale Preis, den das Produkt haben darf. Bspw 50.00 für 50€"
            ),
        }),
        generate: async function* ({ query, page, maxPrice }) {
          console.log("searchAmazon", { query, page, maxPrice });
          if (functionCalled) {
            return uiStream.value;
          } else {
            functionCalled = true;
          }
          uiStream.update(<AmazonSearchResultsSkeleton query={query} />);

          const amazonResults = await search_items(query, page, maxPrice);

          uiStream.update(
            <>
              <AmazonSearchResults
                results={amazonResults} // .slice(0, 8)
                query={query}
              />
              <SpinnerMessage />
            </>
          );

          const itemsContent =
            "Ergebnisse:\n" +
            amazonResults.SearchResult?.Items.map(itemToText).join("------\n");

          const assistantMessage: CoreMessage = {
            role: "assistant",
            content: itemsContent,
          };

          // console.log(
          //   "assistantMessage",
          //   JSON.stringify(assistantMessage, null, 2)
          // );

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                role: "assistant",
                content: "",
                // @ts-ignore
                function_call: {
                  name: "searchAmazon",
                  arguments: JSON.stringify({ query, page, maxPrice }),
                },
              },
              // @ts-ignore
              assistantMessage,
            ],
          });
          const responseStream = createStreamableValue("");
          uiStream.update(
            <>
              <AmazonSearchResults results={amazonResults} query={query} />
              <BotMessage content={responseStream.value} />
            </>
          );
          let assistentContent = "";
          (async () => {
            const { textStream } = await streamText({
              model: openai(chatModel),
              system: system_message,
              temperature: 0.5,
              maxTokens: 500,
              messages: aiState.get().messages as CoreMessage[],
            });

            const reader = textStream.getReader();

            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                responseStream.done();
                uiStream.done(
                  <>
                    <AmazonSearchResults
                      results={amazonResults}
                      query={query}
                    />
                    <BotMessage content={assistentContent} />
                  </>
                );
                break;
              } else {
                assistentContent += value;
                responseStream.update(value);
              }
            }

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: assistentContent,
                },
              ],
            });
          })();

          return uiStream.value;
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: uiStream.value,
  };
}

export type AIState = {
  chatId: string;
  messages: CoreMessage[];
};

export type UIState = ClientMessage[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    generateQuickAnswers,
  },
  initialUIState: [
    // {
    //   id: nanoid(),
    //   role: "assistant",
    //   display: (
    //     <BotMessage content="Hallo! Ich bin GeschenkIdee.io, dein persönlicher Geschenkberater. Wie kann ich dir helfen?" />
    //   ),
    // },
    // {
    //   id: nanoid(),
    //   role: "user",
    //   display: (
    //     <UserMessage>
    //       Ich suche ein Geschenk für meine Frau zum Muttertag.
    //     </UserMessage>
    //   ),
    // },
    // {
    //   id: nanoid(),
    //   role: "assistant",
    //   display: <SpinnerMessage />,
    // },
    // {
    //   id: nanoid(),
    //   role: "assistant",
    //   display: <AmazonSearchResultsSkeleton query="rote Blumen" />,
    // },
    // {
    //   id: nanoid(),
    //   role: "assistant",
    //   display: (
    //     <>
    //       <AmazonSearchResults
    //         results={FakeResponse}
    //         query="Blumen Muttertag"
    //       />
    //       <BotMessage content="Wie wäre es mit ein paar schönen Blumen für deine Frau zum Muttertag?" />
    //     </>
    //   ),
    // },
    // {
    //   id: nanoid(),
    //   role: "assistant",
    //   display: (
    //     <BotMessage content="Hier sind einige Vorschläge für rote Rosen, die du für deine Frau kaufen kannst:" />
    //   ),
    // },
  ],
  initialAIState: { chatId: nanoid(), messages: [] },
});
