import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent cost preview",
  description: "Estimate what a Sim agent workflow will cost before you deploy it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
