import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader } from "next/font/google";
import { loadCurriculum } from "@/infrastructure/composition/server";
import { toMenu } from "@/presentation/menu";
import { ProgressProvider } from "@/presentation/progress-provider";
import { SiteHeader } from "@/presentation/site-header";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kotlin Field Guide",
    template: "%s · Kotlin Field Guide",
  },
  description:
    "A beginner-to-pro Kotlin guide for Android: the JVM, Compose, coroutines, and the state a screen actually needs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const menu = toMenu(loadCurriculum());

  return (
    <html lang="en" className={`${newsreader.variable} ${plex.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-serif text-foreground">
        <ProgressProvider>
          <SiteHeader parts={menu} />
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
