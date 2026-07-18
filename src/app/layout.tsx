import type { Metadata, Viewport } from "next";
import SiteShell from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northern Birch Credit Union",
  description: "Insurance, Investments, International Transfers, Estate Planning, Business Benefits. 70+ years of community trust.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B2A4A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
