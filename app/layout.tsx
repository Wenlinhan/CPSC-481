import type { Metadata } from "next";
import "./globals.css";
import "./styles/meeting21.css";
import "./styles/meeting22.css";

export const metadata: Metadata = {
  title: { default: "CPSC 481 · Introduction to Artificial Intelligence", template: "%s | CPSC 481" },
  description:
    "A unified 15-module course with 30 interactive meetings for CPSC 481 Introduction to Artificial Intelligence.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
