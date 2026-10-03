import type { Metadata } from "next";
import { Source_Code_Pro, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { loadCurriculum } from "@/infrastructure/composition/server";
import { toMenu } from "@/presentation/menu";
import { ProgressProvider } from "@/presentation/progress-provider";
import { SiteHeader } from "@/presentation/site-header";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-source-serif",
  display: "swap",
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-source-code",
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
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} ${sourceCode.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ProgressProvider>
          <SiteHeader parts={menu} />
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
