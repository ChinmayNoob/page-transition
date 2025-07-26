import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cover Page Transition",
  description: "A cover page transition effect with GSAP animations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
