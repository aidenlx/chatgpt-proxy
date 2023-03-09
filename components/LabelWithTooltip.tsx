"use client";
import { Label } from "@/basic/label";
import {
  PropsWithChildren,
  ReactNode
} from "react";
import {
  Tooltip,
  TooltipContent, TooltipTrigger
} from "@/basic/tooltip";


export function LabelWithTooltip({
  children, tooltip, htmlFor,
}: PropsWithChildren<{
  tooltip: ReactNode;
  htmlFor: string;
}>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Label htmlFor={htmlFor} className="text-right">
          {children}
        </Label>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-md">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
