import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prithvi | Disaster Observatory",
  description:
    "Live environmental signals, historical context, and practical disaster preparedness for India.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
