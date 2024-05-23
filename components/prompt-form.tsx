"use client";

import * as React from "react";
import Textarea from "react-textarea-autosize";

import { useActions, useUIState } from "ai/rsc";

import { UserMessage } from "@/components/message";
import { type AI } from "@/lib/chat/actions";
import { Button } from "@/components/ui/button";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { nanoid } from "nanoid";
import { CornerDownLeft } from "lucide-react";

export function PromptForm({
  input,
  setInput,
}: {
  input: string;
  setInput: (value: string) => void;
}) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState<typeof AI>();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault();

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target["message"]?.blur();
        }

        const value = input.trim();
        setInput("");
        if (!value) return;

        // Optimistically add user message UI
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: nanoid(),
            role: "user",
            display: <UserMessage>{value}</UserMessage>,
          },
        ]);

        const responseMessage = await submitUserMessage(value);
        setMessages((currentMessages) => [...currentMessages, responseMessage]);
      }}
    >
      <div className="relative flex max-h-60 w-full grow overflow-hidden bg-white border-2 border-black px-4 sm:rounded-lg sm:px-4">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Schreibe eine Nachricht."
          className="min-h-[60px] w-full bg-transparent placeholder:text-gray-800/50 resize-none pr-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
        />
        <div className="items-center flex">
          <Button
            type="submit"
            size="icon"
            disabled={input === ""}
            className=""
          >
            <CornerDownLeft strokeWidth={2} absoluteStrokeWidth />
            <span className="sr-only">
              Schreibe eine Nachricht an den Geschenke-Bot.
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
}
