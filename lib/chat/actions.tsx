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
import { ReactNode } from "react";
import { SearchResultItem } from "paapi5-typescript-sdk";

const quickAnsersModel = "gpt-3.5-turbo";
const chatModel = "ft:gpt-3.5-turbo-0125:martin-seeler::9NG2I8g6"; // :ckpt-step-68

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

export async function generateQuickAnswers(lastMessage: string): Promise<{
  quickAnswers: string[];
}> {
  "use server";

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai(quickAnsersModel),
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

  const uiStream = createStreamableUI(
    <BotCard>
      <SpinnerMessage />
    </BotCard>
  );

  // I want the string: "Heute ist Donnerstag, der 05. Mai 2024";
  const today = new Date();
  const formattedDate = format(today, "EEEE, 'der' dd. MMMM yyyy", {
    locale: de,
  });

  const system_message: string = `Du bist GeschenkIdee.io, ein hilfreicher Assistent zum finden von Geschenken. Heute ist ${formattedDate}.`;

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
              "Der maximale Preis, den das Produkt haben darf. Bspw 5000 für 50€"
            ),
        }),
        generate: async function* ({ query, page, maxPrice }) {
          console.log("searchAmazon", { query, page, maxPrice });
          if (functionCalled) {
            return uiStream.value;
          } else {
            functionCalled = true;
          }
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

          const itemsContent =
            "Ergebnisse:\n" +
            amazonResults.SearchResult?.Items.map(itemToText).join("------\n");

          const assistantMessage: CoreMessage = {
            role: "assistant",
            content: itemsContent,
          };

          console.log(
            "assistantMessage",
            JSON.stringify(assistantMessage, null, 2)
          );

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                role: "assistant",
                content: "",
                function_call: {
                  name: "searchAmazon",
                  arguments: JSON.stringify({ query, page, maxPrice }),
                },
              },
              assistantMessage,
            ],
          });
          const responseStream = createStreamableValue("");
          uiStream.update(
            <>
              <BotCard>
                <AmazonSearchResults results={amazonResults} query={query} />
              </BotCard>
              <SpinnerMessage />
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
                uiStream.update(
                  <>
                    <BotCard>
                      <AmazonSearchResults
                        results={amazonResults}
                        query={query}
                      />
                    </BotCard>
                    <BotMessage content={responseStream.value} />
                  </>
                );
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
    //   display: <SpinnerMessage />,
    // },
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
