import { ChatGPTMessage } from "./OpenAIStream";

export interface ChatApi {
  role?: string;
  // read from cookie
  // user?: string;
  messages: ChatGPTMessage[];
  aiTemperature?: number;
  aiMaxTokens?: number;
}

export interface LoginApi {
  apiKey: string;
  orgId?: string;
}

export interface LoginStatusApi {
  login: boolean;
}

export const userIdCookie = "chatgpt-user-id";
export const apiCookie = "chatgpt-api";
export const customRolePrefix = "#custom#";
