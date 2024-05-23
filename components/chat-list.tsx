import { UIState } from "@/lib/chat/actions";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

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
      <div className="flex flex-wrap items-start gap-4 -mt-2">
        {quickAnswers.map((suggestion) => (
          <Button
            key={suggestion}
            color="mint"
            className="flex gap-2 items-center font-base"
            onClick={() => onSelectAnswer(suggestion)}
          >
            <Sparkles size={18} strokeWidth={2} className="text-main" />
            <span className="text-nowrap">{suggestion}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
