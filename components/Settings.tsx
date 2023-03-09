"use client";

import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/basic/button";
import { Dialog, DialogContent, DialogTrigger } from "@/basic/dialog";
import { useLocalStorageValue } from "@react-hookz/web";
import { ChangeEvent, startTransition } from "react";
import { TooltipProvider } from "@/basic/tooltip";
import ApiOptions from "./ApiOptions";
import ChatOptions from "./ChatOptions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/basic/tabs";

export const usePersist = <T,>(
  key: string,
  defaultValue: T,
  convert: (val: string) => T
) => {
  const { value, set } = useLocalStorageValue<T>(key, { defaultValue });
  return [
    value,
    (evt: ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        set(convert(evt.target.value));
      });
    },
  ] as const;
};

export default function Settings({
  id,
  roles,
}: {
  id: string;
  roles: string[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-none h-auto">
          <SettingsIcon size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <TooltipProvider>
          <Tabs defaultValue="chat">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            <TabsContent value="api">
              <ApiOptions />
            </TabsContent>
            <TabsContent value="chat">
              <ChatOptions id={id} roles={roles} />
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}

export function LinkOpenAIDashboard() {
  return (
    <a
      className="text-blue-500 underline"
      href="https://beta.openai.com/account/api-keys"
      target="_blank"
      rel="noreferrer"
    >
      OpenAI API Keys dashboard
    </a>
  );
}
