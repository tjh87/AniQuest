import type { Metadata } from "next";
import "./globals.css";
import "./interface-design.css";

export const metadata: Metadata = {
  title: "AniQuest — Explore Singapore wildlife",
  description: "Learn about Singapore animals, habitats and conservation through sourced profiles, adaptive quizzes and wildlife news.",
  other: { "codex-preview": "development" },
  icons: {
    icon: "/aniquest-logo.png",
    shortcut: "/aniquest-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('aniquest-theme');document.documentElement.classList.toggle('dark',t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches);var d=localStorage.getItem('aniquest-density');if(d!==null)document.documentElement.dataset.density=d;document.documentElement.dataset.uiStyle=localStorage.getItem('aniquest-ui-style')==='retro'?'retro':'classic';var p=localStorage.getItem('aniquest-pixel-palette');document.documentElement.dataset.pixelPalette=p==='forest'||p==='sunset'?p:'arcade'}catch(e){}` }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
