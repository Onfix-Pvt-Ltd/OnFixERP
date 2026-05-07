"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "hero", label: "Overview" },
  { id: "scrollytelling", label: "Core Modules" },
  { id: "teardown", label: "Architecture Layers" },
  { id: "features", label: "Benefit Impact" },
  { id: "ip", label: "Proprietary IP" },
];

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState("hero");

  // A simple scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      // Logic to determine active section based on scroll position
      // For simplicity in this demo, we'll just leave it static or simple
      const scrollY = window.scrollY;
      if (scrollY < 500) setActiveSection("hero");
      else if (scrollY < 1500) setActiveSection("scrollytelling");
      else if (scrollY < 2500) setActiveSection("teardown");
      else if (scrollY < 3500) setActiveSection("features");
      else setActiveSection("ip");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hidden md:block fixed top-24 left-1/2 -translate-x-1/2 z-50 w-max transition-all duration-500">
      <div className="bg-background/60 backdrop-blur-2xl border border-border/50 rounded-full px-8 py-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center gap-8 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-xl pointer-events-none" />
        
        <nav className="flex items-center gap-8 relative z-10">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <div key={section.id} className="relative group cursor-pointer flex flex-col items-center" onClick={() => {
                window.scrollTo({ top: sections.findIndex(s => s.id === section.id) * 800, behavior: "smooth" });
              }}>
                <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {section.label}
                </span>
                
                {/* Active indicator line */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-[15px] left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(255,92,0,0.5)]"
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
