"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import SearchOverlay from "./SearchOverlay";
import NotificationsPanel from "./NotificationsPanel";
import CookieBanner from "./CookieBanner";
import { ToastProvider } from "./ToastProvider";
import type { Lang } from "@/types";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const minimalChrome = pathname === "/messages";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setSearchOpen(false); setNotifOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ToastProvider>
      <Nav lang={lang} setLang={setLang} onSearch={() => setSearchOpen(true)} onNotifications={() => setNotifOpen(true)} />
      <main>{children}</main>
      {!minimalChrome && <Footer />}
      <ChatWidget />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <CookieBanner />
    </ToastProvider>
  );
}
