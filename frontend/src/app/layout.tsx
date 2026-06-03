import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoU Nexus - Uganda Financial Inclusion & Intelligence Platform",
  description:
    "One Platform. Every Ugandan. Every Financial Service. Bank of Uganda's national financial operating system for financial inclusion, stability, and innovation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
