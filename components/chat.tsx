"use client";

import { cn, nanoid } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyScreen } from "@/components/empty-screen";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useEffect, useState } from "react";
import { AI, QuickAnswersResponse } from "@/lib/chat/actions";
import {
  readStreamableValue,
  useAIState,
  useActions,
  useUIState,
} from "ai/rsc";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { UserMessage } from "./message";
import { Button } from "./ui/button";
import { PencilLine } from "lucide-react";

export interface ChatProps extends React.ComponentProps<"div"> {
  // initialMessages?: Message[]
  id?: string;
}

const exampleMessages = [
  {
    heading: "Zum Geburtstag",
    subheading: "Etwas ganz besonderes",
    message: `Ich suche für einen Geburtstag ein ganz besonderes Geschenk.`,
  },
  {
    heading: "Zum Hochzeitstag",
    subheading: "Für meinen Frau",
    message: `Ich suche ein Geschenk für meine Frau zum Hochzeitstag.`,
  },
  {
    heading: "Für Weihnachten",
    subheading: "Für jemanden, der schon alles hat",
    message: `Ich suche ein Weihnachts-Geschenk für jemanden, der schon alles hat.`,
  },
  {
    heading: "Zur Schuleinführung",
    subheading: "Für einen Jungen",
    message: `Ich suche ein Geschenk für einen Jungen zur Schuleinführung.`,
  },
];

export function Chat({ id, className }: ChatProps) {
  const [input, setInput] = useState("");
  const [aiState, setAIState] = useAIState<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage, generateQuickAnswers } = useActions();
  const [quickAnswers, setQuickAnswers] = useState<string[]>([]);

  useEffect(() => {
    const lastMessage = aiState.messages[aiState.messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      (async () => {
        const { object } = await generateQuickAnswers(lastMessage.content);

        for await (const partialObject of readStreamableValue<QuickAnswersResponse>(
          object
        )) {
          // console.log(partialObject)
          if (partialObject) {
            setQuickAnswers(partialObject.quickAnswers);
          }
        }
      })();
    } else {
      setQuickAnswers([]);
    }
  }, [generateQuickAnswers, aiState.messages]);

  useEffect(() => {
    // reset quick answers when messages change
    setQuickAnswers([]);
  }, [messages]);

  const [_, setNewChatId] = useLocalStorage("newChatId", id);

  useEffect(() => {
    setNewChatId(id);
  });

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  const onSelectAnswer = async (answer: string) => {
    // Optimistically add user message UI
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        role: "user",
        display: <UserMessage>{answer}</UserMessage>,
      },
    ]);
    const response = await submitUserMessage(answer, []);
    setMessages((currentMessages: any[]) => [...currentMessages, response]);
  };

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn("pb-[200px] pt-4 md:pt-10", className)}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList
            messages={messages}
            quickAnswers={quickAnswers ?? []}
            onSelectAnswer={onSelectAnswer}
          />
        ) : (
          <div className="mx-auto max-w-2xl px-4 flex flex-col gap-4">
            <EmptyScreen />
            <div className="mb-4 grid sm:grid-cols-2 gap-2 sm:gap-4">
              {messages.length === 0 &&
                exampleMessages.map((example, index) => (
                  <Button
                    key={example.heading}
                    theme="mint"
                    size="none"
                    onClick={async () => {
                      setMessages((currentMessages) => [
                        ...currentMessages,
                        {
                          id: nanoid(),
                          role: "user",
                          display: <UserMessage>{example.message}</UserMessage>,
                        },
                      ]);

                      const responseMessage = await submitUserMessage(
                        example.message
                      );

                      setMessages((currentMessages) => [
                        ...currentMessages,
                        responseMessage,
                      ]);
                    }}
                  >
                    <div className="flex content-between w-full px-4 py-2 items-center sm:items-start">
                      <div className="flex flex-col gap-1 items-start w-full">
                        <div className="font-heading font-space text-lg">
                          {example.heading}
                        </div>
                        <div className="text-sm font-base">
                          {example.subheading}
                        </div>
                      </div>
                      <PencilLine
                        size={36}
                        strokeWidth={3}
                        absoluteStrokeWidth
                        className="text-main"
                      />
                    </div>
                  </Button>
                ))}
            </div>
          </div>
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
