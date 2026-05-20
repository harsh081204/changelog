import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "./SessionProvider";

export const metadata: Metadata = { title: "Changelog Writer" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
