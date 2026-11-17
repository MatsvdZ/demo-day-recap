import { useState } from "react";
import { Hero } from "./components/Hero";
import { Evening } from "./components/Evening";
import { DemoList } from "./components/DemoList";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export function App() {
  // Demo codes the visitor added to their message with the plus button.
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const togglePick = (code: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  return (
    <div className="page">
      <Hero />
      <Evening />
      <DemoList picked={picked} onTogglePick={togglePick} />
      <Contact picked={picked} />
      <Footer />
    </div>
  );
}
