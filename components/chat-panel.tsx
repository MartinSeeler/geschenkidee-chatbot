import * as React from "react";

import { PromptForm } from "@/components/prompt-form";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { FooterText } from "@/components/footer";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/lib/chat/actions";
import { nanoid } from "nanoid";
import { UserMessage } from "@/components/message";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { PencilLine, PlayCircle } from "lucide-react";

export interface ChatPanelProps {
  input: string;
  setInput: (value: string) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ChatPanel({
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
}: ChatPanelProps) {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

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

  return (
    <div className="fixed inset-x-0 bg-mint-10 bottom-0 w-full duration-300 ease-in-out peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] dark:from-10%">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid sm:grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <Button
                key={example.heading}
                color="mint"
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

        <div className="grid gap-4 sm:pb-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
