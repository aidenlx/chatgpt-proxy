"use client";

import { useStore } from "@/utils/store";
import { Chat } from "./Chat";
import { Plus, X } from "lucide-react";
import Settings from "./Settings";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/basic/select";
import { startTransition, useEffect, useState } from "react";

function useActive(path?: string) {
  const [active, setActive] = useState(path);
  const sessions = useStore((state) => Object.keys(state.sessions));
  let activeId = "";
  if (!active) {
    activeId = sessions[0];
  } else if (sessions.includes(active)) {
    activeId = active;
  }
  useEffect(() => {
    function handler(evt: PopStateEvent) {
      startTransition(() => {
        setActive(evt.state?.id);
      });
    }
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [
    activeId,
    (id?: string) => {
      setActive(id);
      window.history.pushState({ id }, "", `/${id}`);
    },
  ] as const;
}

export default function Home({
  path,
  roles,
}: {
  path?: string;
  roles: string[];
}) {
  const [activeId, setActive] = useActive(path);
  const sessions = useStore((state) => Object.keys(state.sessions));

  return (
    <>
      <header className="max-w-full px-2 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-16 gap-2 sm:gap-4">
          <div className="sm:hidden flex flex-1 items-center">
            <TabsSelect active={activeId} setActive={setActive} />
          </div>
          {/** @see https://dfmcphee.com/flex-items-and-min-width-0/ */}
          <div className="hidden sm:flex min-w-0 items-center">
            <nav
              className="flex gap-1 items-center rounded-md bg-slate-100 p-1 min-w-0 dark:bg-slate-800"
              aria-label="Tabs"
            >
              <div className="overflow-x-scroll flex gap-1">
                {sessions.map((id) => (
                  <SessionTabTrigger
                    active={activeId === id}
                    setActive={setActive}
                    id={id}
                    key={id}
                  />
                ))}
              </div>
              <AddSessionButton />
            </nav>
          </div>
          <div className="flex items-center">
            <Settings id={activeId} roles={roles} />
          </div>
        </div>
      </header>
      {activeId && <Chat id={activeId} />}
      <footer />
    </>
  );
}

function AddSessionButton() {
  const addSession = useStore((state) => state.addSession);
  return (
    <button
      className="inline-flex items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium text-slate-700 transition-all  disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-200 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
      onClick={addSession}
    >
      <Plus width={16} height={16} />
    </button>
  );
}

function SessionTabTrigger({
  id,
  active,
  setActive,
}: {
  id: string;
  active: boolean;
  setActive: (id?: string) => void;
}) {
  const sessionName = useStore((state) => state.sessions[id].name);
  const removeSession = useStore((state) => state.removeSession);
  return (
    <a
      data-state={active ? "active" : undefined}
      href={`/${id}`}
      onClick={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        setActive(id);
      }}
      className="relative group inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium text-slate-700 transition-all  disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-200 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
    >
      {sessionName}
      <button
        className="z-50 group-hover:opacity-100 transition-opacity opacity-0 absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-sm font-medium text-white bg-red-700 rounded-full"
        onClick={(evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          removeSession(id);
          setActive();
        }}
      >
        <X width="0.75rem" height="0.75rem" />
      </button>
    </a>
  );
}

function SessionSelectItem({ value: id }: { value: string }) {
  const sessionName = useStore((state) => state.sessions[id].name);
  return (
    <SelectItem key={id} value={id} className="w-full">
      {sessionName}
    </SelectItem>
  );
}

function TabsSelect({
  active,
  setActive,
}: {
  active: string;
  setActive: (id: string) => void;
}) {
  const sessions = useStore((state) => Object.keys(state.sessions));
  const addSession = useStore((state) => state.addSession);
  const removeSession = useStore((state) => state.removeSession);

  return (
    <Select
      onValueChange={(id) =>
        startTransition(() => {
          setActive(id);
          window.history.pushState({}, "", `/${id}`);
        })
      }
      value={active}
    >
      <SelectTrigger className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900">
        <SelectValue placeholder="Choose Active Chat Session" />
      </SelectTrigger>
      <SelectContent>
        {sessions.map((id) => (
          <div className="flex group gap-2 items-center pr-2" key={id}>
            <SessionSelectItem value={id} />
            <button
              className="group-hover:opacity-100 transition-opacity opacity-0 inline-flex items-center justify-center w-4 h-4 text-sm font-medium text-white bg-red-700 rounded-sm"
              onClick={() => {
                removeSession(id);
              }}
            >
              <X width="0.75rem" height="0.75rem" />
            </button>
          </div>
        ))}
        <div
          onClick={() => {
            addSession();
          }}
          className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm font-medium outline-none focus:bg-slate-100 hover:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-700 dark:hover:bg-slate-700"
        >
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <Plus className="h-4 w-4" />
          </span>
          <span>Add New Chat</span>
        </div>
      </SelectContent>
    </Select>
  );
}
