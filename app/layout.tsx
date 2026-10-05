import type { Metadata } from "next";
import { IBM_Plex_Serif,  Mona_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";


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
  description:
    "Transform your books into interactive AI conversations. Upload PDFs, and chat with your books using voice.",
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
        {children}
      </body>
    </html>
  );
}
