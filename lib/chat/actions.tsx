import "server-only";

import {
  createAI,
  getMutableAIState,
  createStreamableValue,
  streamUI,
  createStreamableUI,
} from "ai/rsc";
import { CoreMessage, streamObject, streamText } from "ai";

import { openai } from "@ai-sdk/openai";

import {
  BotCard,
  BotMessage,
  UserMessage,
  SpinnerMessage,
  SystemMessage,
} from "@/components/message";

import { z } from "zod";
import { AmazonSearchResultsSkeleton } from "@/components/chat/amazon-search-results-skeleton";
import { AmazonSearchResults } from "@/components/chat/amazon-search-results";
import { nanoid } from "@/lib/utils";
import {
  FakeResponse,
  get_item_by_asin,
  search_items,
} from "@/lib/amazon/actions";
import { ItemDetailCard } from "@/components/chat/item-detail";
import { ReactNode } from "react";

const modelName = "gpt-3.5-turbo";

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function generateQuickAnswers(lastMessage: string): Promise<{
  quickAnswers: string[];
}> {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai(modelName),
      system: `Du bist Experte im Erstellen von Schnellantworten. Die Antworten beziehen sich immer auf den Text.
Jede Schnellantwort enthält ein passendes Emoji. Der Text ist maximal 2 Wörter lang.

Beispiel:
Frage: Hallo! Das ist schön, dass du nach einem Geschenk für deine Mama suchst. 😊 Um dir eine passende Geschenkidee vorzuschlagen, könntest du mir ein paar Informationen über deine Mama geben? Hat sie besondere Hobbys oder Interessen? Gibt es etwas, das sie besonders gerne mag oder schon lange haben wollte? Jede kleine Info hilft, um das perfekte Geschenk zu finden! 🎁✨
Schnellantworten: ["👩‍🍳 Hobby-Bäckerin", "🍫 Naschkatze", "📺 Serien-Junki", "🌸 Blumenliebhaberin"]

Frage: Eine Hochzeit ist immer ein besonderer Anlass! Hast du schon eine Idee, was du dem glücklichen Paar schenken möchtest, oder brauchst du noch Vorschläge? 🎁💍🥂
Schnellantworten: ["💒 Traditionelles", "💡 Kreatives", "💸 Günstiges", "🤔 Bin Ratlos"]

Frage: Wie romantisch! 🌹 Hier sind einige Vorschläge für rote Rosen, die du für deine Frau kaufen kannst:

1. Dominik Blumen und Pflanzen, Blumenstrauß "Charlotte" mit rosa Lilien, Chrysantheme, Gerbera und Schleierkraut - Preis: 21,99 €
2. Blumenstrauß Farbtraum, Bunter mit Rosen, Inkalilien und Statice, 7-Tage-Frischegarantie - Preis: 31,99 €
3. BoriYa Muttertagsgeschenk Infinity Rosen im Glas Engel - Ewige Rose in Angel Glaskuppel mit LED Licht und Perlen - Preis: 18,99 €
Welcher Vorschlag gefällt dir am besten oder soll ich noch nach etwas anderem suchen?
Schnellantworten: ["💐 Charlotte","🌈 Farbtraum","🌹 Infinity Rosen","👎 Nope"]

Frage: Ich bin GeschenkIdee.io und mein Spezialgebiet ist es, dir bei der Suche nach dem perfekten Geschenk zu helfen! Egal ob Geburtstage, Jubiläen, Feiertage oder einfach nur so - ich bin hier, um kreative und individuelle Geschenkideen für deine Liebsten zu finden. Sag mir einfach, für wen du ein Geschenk suchst und lass uns loslegen! 🎉
Schnellantworten: ["👶 Baby", "👦 Kind", "👨 Erwachsener"]
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

  return { object: stream.value };
}

async function submitUserMessage(content: string): Promise<ClientMessage> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  const uiStream = createStreamableUI();

  const system_message: string = `Du bist GeschenkIdee.io. Du bist seit 20 Jahren Berater für Geschenkideen und weißt alles, was man über das Thema schenken, Anlässe, Feiertage und Geschenke wissen muss. Deine Aufgabe ist es, den Nutzern dabei zu helfen, das perfekte Geschenk für ihre Liebsten zu finden. 
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

Hier ein paar Beispiele für den Sprachstil:
Nutzer: Ich suche ein Geschenk für meinen Sohn zum 10. Geburtstag.
Assistent: Wie, der kleine wird schon 10? Da muss ein ganz besonderes Geschenk her! Hat er denn Hobbies, außer zocken? 😅

Nutzer: Ich suche ein Geschenk für meine Frau zum Muttertag.
Assistent: Alles klar, dann wollen wir deine Frau mal mit einem ganz besonderen Geschenk überraschen! Was sind denn ihre Lieblingsfarben?

Nutzer: Ich suche ein Geschenk für meine Oma zum 70. Geburtstag.
Assistent: Okay, und wie ist deine Oma so drauf? Typ Rocker-Oma oder eher die gemütliche Kaffeetante?
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

  await streamUI({
    model: openai(modelName),
    temperature: 0.25,
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
          query: z
            .string()
            .describe(
              'Der Suchbegriff, nach dem gesucht werden soll. Bspw "auto gelb baby 1 jahr"'
            ),
          page: z
            .number()
            .optional()
            .describe(
              "Die Seite, die angezeigt werden soll. Beginnend bei 1. Kann verwendet werden, um für den gleichen Suchbegriff weitere Produkte zu finden."
            ),
          maxPrice: z
            .number()
            .optional()
            .describe(
              "Der maximale Preis, den das Produkt haben darf. Bspw 5000 für 50€"
            ),
        }),
        generate: async function* ({ query, page, maxPrice }) {
          uiStream.update(
            <BotCard>
              <AmazonSearchResultsSkeleton query={query} />
            </BotCard>
          );

          const amazonResults = await search_items(query, page, maxPrice);

          uiStream.update(
            <>
              <BotCard>
                <AmazonSearchResults
                  results={amazonResults} // .slice(0, 8)
                  query={query}
                />
              </BotCard>
              <SpinnerMessage />
            </>
          );

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                role: "assistant",
                content: JSON.stringify({
                  query,
                  results: amazonResults.SearchResult.Items.slice(0, 8).map(
                    (item) => ({
                      asin: item.ASIN,
                      title: item.ItemInfo?.Title?.DisplayValue,
                      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
                      price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount,
                    })
                  ),
                }),
              },
            ],
          });
          const responseStream = createStreamableValue("");
          uiStream.update(
            <>
              <BotCard>
                <AmazonSearchResults results={amazonResults} query={query} />
              </BotCard>
              <BotMessage content={responseStream.value} />
            </>
          );
          let assistentContent = "";
          (async () => {
            const { textStream } = await streamText({
              model: openai(modelName),
              system: system_message,
              messages: aiState.get().messages as CoreMessage[],
            });

            const reader = textStream.getReader();

            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                responseStream.done();
                uiStream.done(
                  <>
                    <BotCard>
                      <AmazonSearchResults
                        results={amazonResults}
                        query={query}
                      />
                    </BotCard>
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
    //       <BotCard>
    //         <AmazonSearchResults
    //           results={FakeResponse}
    //           query="Blumen Muttertag"
    //         />
    //       </BotCard>
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
