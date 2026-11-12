import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "BookNook | A Small Online Library",
    template: "BookNook | %s",
  },
  description:
    "Discover, share and borrow books with BookNook, your little corner for every reader.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#faf6f0] font-sans text-[#34282a] antialiased">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
