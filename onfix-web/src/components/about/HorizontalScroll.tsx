"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Lightbulb, Heart, Shield, Zap, Globe, type LucideIcon } from "lucide-react";
import type { AboutValueVM } from "@/lib/cms";

// Maps the value `icon` string (from the About global) to a component.
// Keep in sync with the select options in AboutContent.ts.
const ICON_MAP: Record<string, LucideIcon> = { Target, Lightbulb, Heart, Shield, Zap, Globe };

export function HorizontalScroll({ values }: { values: AboutValueVM[] }) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  
  const { scrollYProgress } = useScroll({ 
    target: targetRef,
  });
  
  // Maps scroll progress (0 to 1) to horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-20">
        
        <div className="container mx-auto px-6 max-w-7xl mb-16 shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter">Our DNA</h2>
            <p className="text-2xl text-muted-foreground mt-6 font-medium">The architectural principles that drive every line of code we write.</p>
          </motion.div>
        </div>
        
        {/* Horizontal Scrolling Container */}
        <div className="w-full overflow-hidden">
          <motion.div style={{ x }} className="flex gap-8 px-6 md:px-12 w-max">
            {values.map((val, idx) => {
              const Icon = ICON_MAP[val.icon] ?? Target;
              return (
              <div
                key={idx}
                className="w-[85vw] md:w-[500px] h-[450px] p-12 rounded-[3rem] bg-card border border-border/50 flex flex-col justify-center relative overflow-hidden group hover:border-primary/50 transition-all duration-700 hover:shadow-[0_0_50px_rgba(255,92,0,0.1)]"
              >
                 {/* Background Glow on hover */}
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                 {/* Animated grid inside card */}
                 <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none group-hover:opacity-20 transition-opacity duration-700" />

                 <div className="h-24 w-24 rounded-[2rem] bg-foreground text-background flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-2xl relative z-10">
                   <Icon size={48} strokeWidth={1.5} />
                 </div>
                 
                 <h3 className="text-4xl font-heading font-bold tracking-tight mb-6 relative z-10">{val.title}</h3>
                 <p className="text-muted-foreground text-xl leading-relaxed relative z-10">{val.desc}</p>
              </div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
