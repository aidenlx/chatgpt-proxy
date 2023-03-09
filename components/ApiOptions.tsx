"use client";
import { Button } from "@/basic/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/basic/dialog";
import { Input } from "@/basic/input";
import { useState } from "react";
import useSWR from "swr";
import { LoginApi, LoginStatusApi } from "@/utils/interface";
import { LinkOpenAIDashboard } from "./Settings";
import { LabelWithTooltip } from "./LabelWithTooltip";

function useAuthed() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/auth",
    (url) => fetch(url).then((res) => res.json()) as Promise<LoginStatusApi>
  );
  return {
    loggedIn: data?.login ?? false,
    error,
    isLoading,
    mutate,
  };
}
export default function ApiOptions() {
  const [apiKey, setApiKey] = useState("");
  const [orgId, setOrgId] = useState("");
  const { loggedIn, isLoading, mutate } = useAuthed();
  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      <DialogHeader>
        <DialogTitle>API Settings</DialogTitle>
        <DialogDescription>
          You can find your API key in the <LinkOpenAIDashboard />
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {!loggedIn && (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <LabelWithTooltip
                htmlFor="api-key"
                tooltip={
                  <>
                    The OpenAI API uses API keys for authentication.
                    <br /> Visit <LinkOpenAIDashboard /> to retrieve the API key
                    you&apos;ll use in your requests.
                  </>
                }
              >
                API Key
              </LabelWithTooltip>
              <Input
                id="api-key"
                required
                value={apiKey}
                placeholder="Enter OpenAI API key here"
                onChange={(evt) => setApiKey(evt.target.value)}
                className="col-span-3 invalid:border-pink-500 invalid:text-pink-600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <LabelWithTooltip
                htmlFor="org-id"
                tooltip={
                  <>
                    For users who belong to multiple organizations, you can
                    specify which organization is used for an API request.
                    <br />
                    Usage from these API requests will count against the
                    specified organization&apos;s subscription quota.
                  </>
                }
              >
                Organization ID
              </LabelWithTooltip>
              <Input
                id="org-id"
                type="text"
                value={orgId}
                onChange={(evt) => setOrgId(evt.target.value)}
                className="col-span-3 invalid:border-pink-500 invalid:text-pink-600"
              />
            </div>
          </>
        )}
      </div>
      <DialogFooter>
        {loggedIn ? (
          <Button
            onClick={() =>
              fetch("/api/auth", {
                method: "DELETE",
              }).then(() => mutate())
            }
          >
            Logout
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={(evt) => {
              evt.preventDefault();
              fetch("/api/auth", {
                method: "POST",
                body: JSON.stringify({ apiKey, orgId } satisfies LoginApi),
              }).then(() => mutate());
            }}
          >
            Save changes
          </Button>
        )}
      </DialogFooter>
    </>
  );
}
