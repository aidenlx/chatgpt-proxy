import { Analytics } from "@vercel/analytics/react";
import "./global.css";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto h-screen flex flex-col">
          {children}
        </div>
      </body>
      <Analytics />
    </html>
  );
}
