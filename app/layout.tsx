import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Serif, Mona_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { cn } from "@/lib/utils";


import NavBar from "@/components/NavBar";

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookWise",
  description: "Turn your books into interactive AI conversations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={cn(
          "relative font-sans antialiased",
          ibmPlexSerif.variable,
          monaSans.variable,
        )}
      >
        <ClerkProvider appearance={{theme: shadcn}}>
          {/* Header */}
          <NavBar />
          {/* Main Body */}
          {children}
          {/* End Body */}
        </ClerkProvider>
      </body>
    </html>
  );
}
