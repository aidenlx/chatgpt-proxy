import { getIronSession } from "iron-session/edge";
import { apiCookie } from "./interface";

export async function getSession(req: Request, resp: Response) {
  const password = process.env.SESSION_ENCRYPTION_KEY ?? "";
  if (!password) throw new Error("SESSION_ENCRYPTION_KEY not configured");
  return await getIronSession(req, resp, {
    password: process.env.SESSION_ENCRYPTION_KEY ?? "",
    cookieName: apiCookie,
  });
}
