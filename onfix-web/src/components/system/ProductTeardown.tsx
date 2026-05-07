"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layers, Database, Smartphone, Cloud } from "lucide-react";

export function ProductTeardown() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 2.5D Parallax Effects - The layers spread apart as you scroll down
  const yLayer1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yLayer2 = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const yLayer3 = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={containerRef} className="py-40 relative overflow-hidden bg-foreground text-background rounded-[3rem] my-32 border border-border/20 shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold text-sm tracking-widest uppercase mb-6 border border-primary/30">
            <Layers size={16} /> Architecture Teardown
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold tracking-tighter mb-6 text-white">
            The multi-layer <span className="text-primary">engine.</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            A seamless stack designed for resilience. Each layer operates independently, ensuring your venue never stops.
          </p>
        </div>

        <div className="relative h-[800px] flex items-center justify-center perspective-[2000px]">
          
          {/* Layer 1: Cloud & Analytics */}
          <motion.div 
            style={{ y: yLayer1, rotateX: 60, rotateZ: -45 }}
            className="absolute w-[300px] md:w-[400px] aspect-video bg-blue-500/10 border-2 border-blue-500/30 rounded-3xl backdrop-blur-md shadow-[0_0_50px_rgba(59,130,246,0.2)] flex items-center justify-center z-30"
          >
            <div className="text-center">
              <Cloud size={48} className="mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Cloud Sync & Analytics</h3>
              <p className="text-xs text-blue-200/70 mt-2">Global data aggregation</p>
            </div>
          </motion.div>

          {/* Layer 2: Local Server / Database */}
          <motion.div 
            style={{ y: yLayer2, rotateX: 60, rotateZ: -45 }}
            className="absolute w-[350px] md:w-[450px] aspect-video bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.2)] flex items-center justify-center z-20"
          >
            <div className="text-center">
              <Database size={48} className="mx-auto mb-4 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Local Offline Node</h3>
              <p className="text-xs text-emerald-200/70 mt-2">Zero-latency local network</p>
            </div>
          </motion.div>

          {/* Layer 3: End-User Terminals */}
          <motion.div 
            style={{ y: yLayer3, rotateX: 60, rotateZ: -45 }}
            className="absolute w-[400px] md:w-[500px] aspect-video bg-primary/10 border-2 border-primary/30 rounded-3xl backdrop-blur-md shadow-[0_0_50px_rgba(255,92,0,0.2)] flex items-center justify-center z-10"
          >
            <div className="text-center">
              <Smartphone size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-white">Terminals & QR Tableside</h3>
              <p className="text-xs text-primary/70 mt-2">Frictionless interface</p>
            </div>
          </motion.div>

          {/* Connecting Line (faked via gradient) */}
          <div className="absolute top-1/2 left-1/2 w-1 h-[400px] bg-gradient-to-b from-blue-500 via-emerald-500 to-primary -translate-x-1/2 -translate-y-1/2 -z-10 blur-[2px] opacity-50" />
        </div>
      </div>
    </section>
  );
}
