"use client";
import { Input } from "@/basic/input";
import { DialogDescription, DialogHeader, DialogTitle } from "@/basic/dialog";
import { usePersist } from "./Settings";
import { LabelWithTooltip } from "./LabelWithTooltip";
import Textarea from "react-textarea-autosize";
import { useStore } from "@/utils/store";
import { customRolePrefix } from "@/utils/interface";

export default function ChatOptions({
  id,
  roles,
}: {
  id: string;
  roles: string[];
}) {
  const [aiTemp, setTemp] = usePersist<number>("ai-temp", 0.7, parseFloat);
  const [aiMaxToken, setMaxToken] = usePersist<number>(
    "ai-max-token",
    128,
    (val) => parseInt(val, 10)
  );

  const hasSession = useStore((state) => !!state.sessions[id]);
  const role = useStore((state) => state.sessions[id].role);
  const setCustomPrompt = useStore((state) => state.setCustomPrompt);
  const setRole = useStore((state) => state.setRole);
  return (
    <>
      <DialogHeader>
        <DialogTitle>Chat Settings</DialogTitle>
        <DialogDescription>
          See the{" "}
          <a
            href="https://platform.openai.com/docs/api-reference/chat/create"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            API Reference
          </a>{" "}
          for more details.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {hasSession && (
          <div className="grid grid-cols-4 items-center gap-4">
            <LabelWithTooltip
              htmlFor="chat-role"
              tooltip={<>Use pre-defined prompts to get started quickly.</>}
            >
              Role
            </LabelWithTooltip>
            <SelectRole
              roles={roles}
              value={
                !role
                  ? "general"
                  : !role.startsWith(customRolePrefix)
                  ? role
                  : ""
              }
              onChange={(role) => setRole(id, role)}
            />
          </div>
        )}
        {hasSession && (
          <div className="grid grid-cols-4 items-center gap-4">
            <LabelWithTooltip
              htmlFor="chat-prompt"
              tooltip={<>Use custom prompt to generate responses</>}
            >
              Custom Prompt
            </LabelWithTooltip>
            <Textarea
              id="chat-prompt"
              value={
                role?.startsWith(customRolePrefix)
                  ? role.slice(customRolePrefix.length)
                  : ""
              }
              className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 "
              onChange={(evt) => setCustomPrompt(id, evt.target.value)}
            />
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <LabelWithTooltip
            htmlFor="ai-temp"
            tooltip={
              <>
                What sampling temperature to use, between 0 and 2.
                <br /> Higher values like 0.8 will make the output more random,
                while lower values like 0.2 will make it more focused and
                deterministic.
              </>
            }
          >
            AI Temperature
          </LabelWithTooltip>
          <Input
            id="ai-temp"
            required
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={aiTemp}
            className="col-span-3 invalid:border-pink-500 invalid:text-pink-600"
            onChange={setTemp}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <LabelWithTooltip
            htmlFor="ai-max-token"
            tooltip={
              <>
                The maximum number of tokens allowed for the generated answer.
                <br />
                By default, the number of tokens the model can return will be
                (4096 - prompt tokens).
              </>
            }
          >
            AI Max Token
          </LabelWithTooltip>
          <Input
            id="ai-max-token"
            required
            type="number"
            min={0}
            step={1}
            pattern="[0-9]*"
            value={aiMaxToken}
            className="col-span-3 invalid:border-pink-500 invalid:text-pink-600"
            onChange={setMaxToken}
          />
        </div>
      </div>
    </>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/basic/select";

export function SelectRole({
  roles,
  onChange,
  value,
}: {
  roles: string[];
  value: string;
  onChange: (role: string) => void;
}) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="col-span-3 flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900">
        <SelectValue placeholder="Select Predefined Role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
