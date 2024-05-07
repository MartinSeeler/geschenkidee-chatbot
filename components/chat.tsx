"use client";

import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyScreen } from "@/components/empty-screen";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useEffect, useState } from "react";
import { useUIState } from "ai/rsc";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";

export interface ChatProps extends React.ComponentProps<"div"> {
  // initialMessages?: Message[]
  id?: string;
}

export function Chat({ id, className }: ChatProps) {
  const [input, setInput] = useState("");
  const [messages] = useUIState();

  const [_, setNewChatId] = useLocalStorage("newChatId", id);

  useEffect(() => {
    setNewChatId(id);
  });

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn("pb-[200px] pt-4 md:pt-10", className)}
        ref={messagesRef}
      >
        {messages.length ? <ChatList messages={messages} /> : <EmptyScreen />}
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
