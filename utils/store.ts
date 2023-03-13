import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval"; // can use anything: IndexedDB, Ionic Storage, etc.
import { ChatGPTMessage } from "./OpenAIStream";
import { nanoid } from "nanoid";
import { customRolePrefix } from "./interface";

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface SessionData {
  id: string;
  name: string;
  role?: string;
  messages: ChatGPTMessage[];
}

interface ChatStore {
  sessions: Record<string, SessionData>;
  setSession(data: SessionData): void;
  setMessages(id: string, message: ChatGPTMessage[]): void;
  setRole(id: string, role: string): void;
  setCustomPrompt(id: string, prompt: string): void;
  addSession(): void;
  removeSession(id: string): void;
}

export const useStore = create(
  persist<ChatStore>(
    (set, get) => ({
      sessions: {
        default: {
          id: "default",
          messages: [],
          name: "Chat",
        },
      },
      setSession(data) {
        set((state) => {
          const newSessions = { ...state.sessions };
          newSessions[data.id] = data;
          return { sessions: newSessions };
        });
      },
      setMessages(id, message) {
        set((state) => {
          const newSessions = { ...state.sessions };
          newSessions[id].messages = message;
          return { sessions: newSessions };
        });
      },
      setRole(id, role) {
        set((state) => {
          const newSessions = { ...state.sessions };
          newSessions[id].role = role;
          return { sessions: newSessions };
        });
      },
      setCustomPrompt(id, prompt) {
        set((state) => {
          const newSessions = { ...state.sessions };
          newSessions[id].role = customRolePrefix + prompt;
          return { sessions: newSessions };
        });
      },
      addSession() {
        set((state) => {
          let id;
          do {
            id = nanoid(6);
          } while (id in state.sessions);
          const newSession = {
            id,
            messages: [],
            name: getNameWithoutConflict(
              Object.values(state.sessions).map((s) => s.name)
            ),
          };
          return { sessions: { ...state.sessions, [id]: newSession } };
        });
      },
      removeSession(id) {
        set((state) => {
          const sessions = { ...state.sessions };
          if (id === "default") {
            sessions.default = {
              ...sessions.default,
              messages: [],
            };
            // delete sessions.default.role;
          } else {
            delete sessions[id];
          }
          return { sessions };
        });
      },
    }),
    {
      name: "chat-store", // unique name
      storage: createJSONStorage(() => storage),
    }
  )
);

function getNameWithoutConflict(names: string[]) {
  let name = "Chat";
  let i = 1;
  while (names.includes(name)) {
    name = `Chat ${i}`;
    i++;
  }
  return name;
}
