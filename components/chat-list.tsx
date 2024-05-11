import { AI, UIState } from "@/lib/chat/actions";
import { useAIState, useActions, useUIState } from "ai/rsc";
import { useEffect, useState } from "react";
import { SparklesIcon } from "./ui/icons";

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
      <div className="flex flex-col sm:flex-row flex-wrap items-start gap-2">
        {quickAnswers.map((suggestion) => (
          <button
            key={suggestion}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
            onClick={() => onSelectAnswer(suggestion)}
          >
            <SparklesIcon />
            <span className="text-nowrap">{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
