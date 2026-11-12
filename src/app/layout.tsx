import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem("booknook-theme");
                const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const theme =
                  savedTheme === "dark" || savedTheme === "light"
                    ? savedTheme
                    : systemDark
                      ? "dark"
                      : "light";

                document.documentElement.classList.toggle("dark", theme === "dark");
                document.documentElement.style.colorScheme = theme;
              } catch (error) {}
            `,
          }}
        />
      </head>

      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />

          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

