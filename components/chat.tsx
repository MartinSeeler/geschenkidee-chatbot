"use client";

import { cn, nanoid } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyScreen } from "@/components/empty-screen";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useEffect, useState } from "react";
import { AI, QuickAnswersResponse, UIState } from "@/lib/chat/actions";
import {
  readStreamableValue,
  useAIState,
  useActions,
  useUIState,
} from "ai/rsc";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { set } from "date-fns";
import { UserMessage } from "./message";

export interface ChatProps extends React.ComponentProps<"div"> {
  // initialMessages?: Message[]
  id?: string;
}

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
          <EmptyScreen />
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
