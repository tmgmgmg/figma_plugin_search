import { ThemeProvider } from "@/components/theme-provider";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata = {
  title: "Fig Plugin Finder",
  description: "WEB制作でよく使うFigmaプラグインを集めたサイトです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
