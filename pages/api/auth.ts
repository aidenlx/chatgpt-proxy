import { getIronSession } from "iron-session/edge";
import { LoginApi, LoginStatusApi, apiCookie } from "@/utils/interface";
import { NextRequest } from "next/server";
import { getSession } from "@/utils/getSession";

export const config = { runtime: "edge" };

declare module "iron-session" {
  interface IronSessionData {
    apiKey: string;
    orgId?: string;
  }
}

async function GET(req: NextRequest): Promise<Response> {
  const session = await getSession(req, new Response());
  const resp: LoginStatusApi = { login: !!session.apiKey };
  return new Response(JSON.stringify(resp));
}

async function POST(req: NextRequest): Promise<Response> {
  const body: LoginApi = await req.json();

  const resp = new Response();
  const session = await getSession(req, resp);
  session.apiKey = body.apiKey;
  session.orgId = body.orgId;
  await session.save();
  return resp;
}

async function DELETE(req: NextRequest): Promise<Response> {
  const resp = new Response();
  const session = await getSession(req, resp);
  session.destroy();
  return resp;
}

export default async function handler(req: NextRequest): Promise<Response> {
  switch (req.method) {
    case "POST":
      return POST(req);
    case "DELETE":
      return DELETE(req);
    case "GET":
      return GET(req);
    default:
      return new Response("Method not allowed", { status: 405 });
  }
}
