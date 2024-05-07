import type { Metadata } from "next";
import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "GeschenkIdee.io",
  description:
    "Keine Ahnung was du schenken sollst? GeschenkIdee.io ist dein schneller und kostenloser Helfer!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
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
