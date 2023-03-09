"use client";

import type { ChatGPTMessage } from "@/utils/OpenAIStream";
import { cn } from "@/utils/cn";
import dynamic from "next/dynamic";

import chatgptIcon from "../assets/chatgpt.svg";
import Image from "next/image";

const Markdown = dynamic(() => import("./Markdown"), { ssr: false });

const aiName = (
  <Image className="mb-1" width={20} height={20} src={chatgptIcon} alt="ChatGPT AI" />
);

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
    <div className="flex flex-grow space-x-3">
      <div className="min-w-0 flex-1">
        <p className="font-large text-xxl text-gray-900">{aiName}</p>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
            <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
          </div>
          <div className="h-2 rounded bg-zinc-500"></div>
        </div>
      </div>
    </div>
  </div>
);

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export function ChatLine({
  role = "assistant",
  content,
  plaintext,
}: ChatGPTMessage & { plaintext?: boolean }) {
  if (!content) {
    return null;
  }
  return (
    <div
      className={
        role != "assistant" ? "float-right clear-both" : "float-left clear-both"
      }
    >
      <div className="float-right mb-5 rounded-lg bg-white px-4 py-5 shadow-lg ring-1 ring-zinc-100 sm:px-6">
        <div className="flex space-x-3">
          <div className="flex-1 gap-4">
            <p className="font-large text-xxl text-gray-900">
              {role == "assistant" ? aiName : "You"}
            </p>
            <p
              className={cn(
                "text",
                role == "assistant" ? "font-semibold" : "text-gray-400"
              )}
            >
              {plaintext ? (
                convertNewLines(content)
              ) : (
                <Markdown>{content}</Markdown>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
