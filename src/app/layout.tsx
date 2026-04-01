import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard - Projects",
  description: "Dashboard projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FFFFFF] font-sans text-slate-900">
        <StoreProvider>
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </StoreProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
