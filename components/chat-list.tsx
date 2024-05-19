import { AI, UIState } from "@/lib/chat/actions";
import { useAIState, useActions, useUIState } from "ai/rsc";
import { useEffect, useState } from "react";
import { SparklesIcon } from "./ui/icons";
import { BotCard } from "./message";
import { Button } from "./ui/button";
import { Sparkles, WandSparkles } from "lucide-react";

export interface ChatList {
  messages: UIState;
  quickAnswers: string[];
  onSelectAnswer: (answer: string) => Promise<void>;
}

export function ChatList({ messages, quickAnswers, onSelectAnswer }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl grid auto-rows-max gap-8 px-4">
      {messages.map((message) => (
        <div key={message.id}>{message.display}</div>
      ))}
      <BotCard showAvatar={false}>
        <div className="flex flex-wrap items-start gap-2 -mt-2">
          {quickAnswers.map((suggestion) => (
            <Button
              key={suggestion}
              variant={"default"}
              color="red"
              className="flex gap-2 items-center"
              onClick={() => onSelectAnswer(suggestion)}
            >
              <Sparkles
                size={18}
                strokeWidth={2}
                absoluteStrokeWidth
                color="#a88dff"
              />
              <span className="text-nowrap">{suggestion}</span>
            </Button>
          ))}
        </div>
      </BotCard>
    </div>
  );
}
