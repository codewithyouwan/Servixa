import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BestBuild — AI-Powered Construction Marketplace",
  description:
    "Post your home project and get matched with verified, AI-vetted service providers near you — free to post, no obligation.",
};

/**
 * Applies the saved theme (or the OS preference) before first paint so
 * there is no light-mode flash for dark-mode users.
 */
const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem("bestbuild.theme");
    var dark =
      t === "dark" ||
      ((t === null || t === "system") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
<<<<<<< HEAD
      <body className="min-h-full flex flex-col">
        {/* Apply the saved theme before paint to avoid a light/dark flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
        {children}
      </body>
=======
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
>>>>>>> dev/geature/hero_page
    </html>
  );
}
