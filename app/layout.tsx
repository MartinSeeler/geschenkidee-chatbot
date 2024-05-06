import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
