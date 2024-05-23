"use client";

import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/codeblock";
import { MemoizedReactMarkdown } from "@/components/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { StreamableValue } from "ai/rsc";
import { useStreamableText } from "@/lib/hooks/use-streamable-text";
import { Loader, LoaderCircle } from "lucide-react";

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end place-items-end">
      <div className="space-y-2 overflow-hidden py-2 px-4 max-w-md sm:max-w-lg rounded-base shadow-base border-2 border-black bg-mint-800 text-black">
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) {
  const text = useStreamableText(content);

  return (
    <div className={cn("group flex items-start", className)}>
      <div className="space-y-2 overflow-hidden px-4 py-2 max-w-md sm:max-w-lg rounded-base shadow-base border-2 border-black bg-white text-black">
        <MemoizedReactMarkdown
          className="prose prose-p:leading-relaxed prose-pre:p-0 prose-p:text-black prose-li:marker:font-bold prose-li:text-black prose-li:marker:text-black/80"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {text}
        </MemoizedReactMarkdown>
      </div>
    </div>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group flex items-start">
      <div className="flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        <Loader className="animate-spin duration-1000" />
      </div>
    </div>
  );
}
