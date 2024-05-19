import type { Metadata } from "next";
import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "GeschenkIdee.io | Dein KI-basierter Geschenke-Assistent",
  description: "Finde sofort die perfekte Geschenkidee für deine Liebsten!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="bg-peach-50">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=1"
        />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=1"
          color="#fd9745"
        />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <meta name="apple-mobile-web-app-title" content="GeschenkIdee.io" />
        <meta name="application-name" content="GeschenkIdee.io" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#fff4e0"></meta>
      </head>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main className="flex flex-col flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
