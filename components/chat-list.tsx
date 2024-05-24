import { UIState } from "@/lib/chat/actions";
import { Button } from "./ui/button";
import { MessageCircleReply, Sparkles } from "lucide-react";

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
            theme="mint"
            className="flex gap-2 items-center"
            onClick={() => onSelectAnswer(suggestion)}
          >
            <MessageCircleReply
              size={24}
              strokeWidth={2}
              absoluteStrokeWidth
              className="text-main"
            />
            <span className="text-nowrap font-sans font-normal text-base">
              {suggestion}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
