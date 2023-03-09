import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";

const SyntaxHighlighter = dynamic(async () => await import("./Highlighter"), {
  ssr: false,
});

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter language={match[1]} {...props}>
              {children}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
