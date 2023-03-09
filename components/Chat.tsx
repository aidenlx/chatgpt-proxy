"use client";

import { useEffect, useState } from "react";
import { Button } from "@/basic/button";
import { ChatLine, LoadingChatLine } from "./ChatLine";
import { useCookies } from "react-cookie";
import { ChatGPTMessage } from "@/utils/OpenAIStream";
import { ChatApi, userIdCookie } from "../utils/interface";
import TextareaAutosize from "react-textarea-autosize";
import { Send } from "lucide-react";
import { useStore } from "@/utils/store";
import { usePersist } from "./Settings";

const InputMessage = ({
  input,
  setInput,
  sendMessage,
}: {
  input: string;
  setInput: (input: string) => void;
  sendMessage: (input: string) => void;
}) => (
  <div className="mt-4 flex clear-both">
    <TextareaAutosize
      aria-label="chat input"
      required
      minRows={1}
      rows={1}
      placeholder="Type a message to start the conversation"
      className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm"
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          sendMessage(input);
          setInput("");
        }
      }}
      onChange={(e) => {
        setInput(e.target.value);
      }}
    />
    <Button
      type="submit"
      className="ml-4 flex-none"
      onClick={() => {
        sendMessage(input);
        setInput("");
      }}
    >
      <Send size={16} />
    </Button>
  </div>
);

function useSetMsg(id: string) {
  const setMessages = useStore((state) => state.setMessages);
  return (messages: ChatGPTMessage[]) => {
    setMessages(id, messages);
  };
}

export function Chat({ id }: { id: string }) {
  const messages = useStore((state) => state.sessions[id].messages);
  const role = useStore((state) => state.sessions[id].role);
  const setMessages = useSetMsg(id);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useCookies([userIdCookie]);

  useEffect(() => {
    if (!cookie[userIdCookie]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7);
      setCookie(userIdCookie, randomId);
    }
  }, [cookie, setCookie]);

  const [aiTemperature] = usePersist<number>("ai-temp", 0.7, parseFloat);
  const [aiMaxTokens] = usePersist<number>("ai-max-token", 128, (val) =>
    parseInt(val, 10)
  );
  // send message to API /api/chat endpoint
  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];
    setMessages(newMessages);
    const last10messages = newMessages.slice(-10); // remember last 10 messages
    const body: ChatApi = {
      role,
      messages: last10messages,
      aiMaxTokens,
      aiTemperature,
    };
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      setMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as ChatGPTMessage,
      ]);

      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col flex-1 max-h-full min-h-0">
      <div className="w-full min-h-0 flex-1 overflow-y-scroll max-w-3xl mx-auto flex flex-col gap-12 p-4">
        <div>
          {messages.length === 0 && (
            <ChatLine
              role={"assistant"}
              content="Hello from ChatGPT :)"
              plaintext
            />
          )}
          {messages.map(({ content, role }, index) => (
            <ChatLine key={index} role={role} content={content} />
          ))}

          {loading && <LoadingChatLine />}
        </div>
      </div>
      <div className="w-full max-w-3xl mx-auto">
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
