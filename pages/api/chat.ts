import {
  ChatGPTMessage,
  OpenAIStream,
  OpenAIStreamPayload,
} from "@/utils/OpenAIStream";
import { ChatApi, customRolePrefix, userIdCookie } from "@/utils/interface";
import rolePreset from "@/preset.json";
import { NextRequest } from "next/server";
import { getSession } from "@/utils/getSession";

export const config = { runtime: "edge" };

function getPromptOf(role: string | undefined): string | null {
  if (role?.startsWith(customRolePrefix)) return role.substring(8);
  return role && role in rolePreset
    ? rolePreset[role as keyof typeof rolePreset]
    : null;
}

export default async function handler(req: NextRequest): Promise<Response> {
  const body: ChatApi = await req.json();

  // read-only session, independent of the response
  const session = await getSession(req, new Response());
  if (!session.apiKey) {
    return new Response("No API key provided", { status: 401 });
  }

  const messages: ChatGPTMessage[] = [
    {
      role: "system",
      content: getPromptOf(body.role) ?? rolePreset.general,
    },
  ];
  messages.push(...body.messages);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages,
    temperature: body.aiTemperature ?? 0.6,
    max_tokens: body.aiMaxTokens ?? 128,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: req.cookies.get(userIdCookie)?.value ?? undefined,
    n: 1,
  };

  const stream = await OpenAIStream(payload, session);
  return new Response(stream);
}
