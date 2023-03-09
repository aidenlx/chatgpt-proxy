import { a11yDark as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism } from "react-syntax-highlighter";
import type { CodeProps } from "react-markdown/lib/ast-to-react";
export default function SyntaxHighlighter({
  node,
  inline,
  className,
  children,
  language,
  ...props
}: CodeProps & { language?: string }) {
  return (
    <Prism
      // @ts-ignore
      style={theme}
      language={language}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </Prism>
  );
}
