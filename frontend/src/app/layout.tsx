import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Africa Launchpad - Pre-launch Discovery Platform",
  description: "Discover and follow upcoming African startups before they launch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1 flex flex-col">
              <div className="container flex-1 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
