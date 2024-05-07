import * as React from "react";

import { PromptForm } from "@/components/prompt-form";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { FooterText } from "@/components/footer";
import { useAIState, useActions, useUIState } from "ai/rsc";
import type { AI } from "@/lib/chat/actions";
import { nanoid } from "nanoid";
import { UserMessage } from "@/components/message";
import { cn } from "@/lib/utils";

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
      heading: "Zum Muttertag",
      subheading: "Für meine wundervolle Frau",
      message: `Ich möchte meiner Frau zum Muttertag eine Freude machen.`,
    },
    {
      heading: "Zum Geburtstag",
      subheading: "Für meinen besten Freund",
      message: `Ich brauche ein Geschenk für meinen besten Freund zum Geburtstag.`,
    },
  ];

  return (
    <div className="fixed inset-x-0 bg-white/90 bottom-0 w-full duration-300 ease-in-out peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] dark:from-10%">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid sm:grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={cn(
                  "cursor-pointer bg-zinc-50 text-zinc-950 rounded-2xl p-4 sm:p-6 hover:bg-zinc-100 transition-colors",
                  index > 1 && "hidden md:block"
                )}
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
                <div className="font-medium">{example.heading}</div>
                <div className="text-sm text-zinc-800">
                  {example.subheading}
                </div>
              </div>
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
