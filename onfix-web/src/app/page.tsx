"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Play, Activity, Combine, ShieldCheck, Zap } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { EcosystemNavigator } from "@/components/home/EcosystemNavigator";
import { TrustBanner } from "@/components/home/TrustBanner";
import { RoiCalculator } from "@/components/home/RoiCalculator";

// --- FLOWING AIR / ENERGY BUTTON COMPONENT ---
function EnergyButton({ children, href }: { children: React.ReactNode, href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-foreground px-10 font-bold text-background transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
    >
      {/* Animated flowing border/glow background */}
      <div className="absolute inset-[-100%] z-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_30%,#FF5C00_50%,transparent_70%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-[2px] z-0 rounded-full bg-foreground" />
      
      {/* Core gradient fade */}
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-primary/80 to-orange-400/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen" />
      
      <span className="relative z-10 flex items-center gap-3 text-lg">
        {children}
      </span>
    </Link>
  );
}

// --- MAIN PAGE ---
export default function Home() {
  const heroRef = useRef(null);
  const sequenceRef = useRef(null);
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Hero Parallax
  const y1 = useTransform(heroProgress, [0, 1], [0, 200]);
  const y2 = useTransform(heroProgress, [0, 1], [0, -100]);
  const opacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(heroProgress, [0, 0.5], [1, 0.95]);

  // --- ADVANCED SCROLL SEQUENCE (APPLE-LIKE) ---
  const { scrollYProgress: seqProgress } = useScroll({
    target: sequenceRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress so it feels like liquid
  const smoothProgress = useSpring(seqProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // 1. Hexagon Path Drawing (0 to 0.3)
  const hexPathLength = useTransform(smoothProgress, [0, 0.3], [0, 1]);
  const hexOpacity = useTransform(smoothProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
  
  // 2. Hexagon Zooming In (0.3 to 0.7)
  const hexScale = useTransform(smoothProgress, [0.3, 0.7, 1], [1, 15, 30]);
  
  // 3. Text Reveals
  const text1Opacity = useTransform(smoothProgress, [0.1, 0.2, 0.3], [0, 1, 0]);
  const text1Y = useTransform(smoothProgress, [0.1, 0.2, 0.3], [50, 0, -50]);
  
  const text2Opacity = useTransform(smoothProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.4, 0.5, 0.6], [50, 0, -50]);

  const text3Opacity = useTransform(smoothProgress, [0.7, 0.8, 0.9], [0, 1, 0]);
  const text3Y = useTransform(smoothProgress, [0.7, 0.8, 0.9], [50, 0, -50]);

  // Inner core glow reveals at end
  const coreGlow = useTransform(smoothProgress, [0.5, 0.8], [0, 1]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative min-h-[95vh] pt-32 pb-20 flex items-center overflow-hidden">
        
        {/* Textured Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div className="lg:col-span-7 flex flex-col items-start" style={{ y: y1, opacity }}>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-[5.5rem] leading-[1.05] font-heading font-extrabold tracking-tighter mb-8 relative"
            >
              Operate with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-primary bg-[length:200%_auto] animate-[gradient_8s_linear_infinite]">
                absolute clarity.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
              className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl font-medium leading-relaxed"
            >
              The definitive ERP infrastructure for high-performance hospitality. Seamlessly synchronize POS, inventory, payroll, and room management in real-time.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
            >
              <EnergyButton href="/contact">
                Deploy Now <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </EnergyButton>
              
              <Link
                href="/media"
                className="group flex h-16 w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-border bg-transparent px-8 font-semibold text-foreground transition-all hover:bg-foreground/5 active:scale-95"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors group-hover:bg-primary group-hover:text-white">
                  <Play size={14} className="fill-current ml-0.5" />
                </div>
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="lg:col-span-5 relative hidden lg:block" style={{ y: y2, scale }}>
            <motion.div 
              initial={{ opacity: 0, rotateY: 20, x: 100 }} animate={{ opacity: 1, rotateY: -5, x: 0 }} transition={{ duration: 1.5, delay: 0.2 }}
              className="relative z-20 w-full aspect-[4/5] rounded-[2rem] bg-background/50 backdrop-blur-3xl shadow-2xl p-[2px] perspective-[2000px] overflow-hidden group"
            >
              {/* Spinning Neon Border */}
              <div className="absolute inset-[-50%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#FF5C00_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 w-full h-full rounded-[1.5rem] bg-card overflow-hidden flex flex-col shadow-inner">

                <div className="h-14 border-b border-border/30 flex items-center px-6 justify-between bg-muted/20 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-foreground/20" />
                    <div className="h-3 w-3 rounded-full bg-foreground/20" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4 relative z-10">
                  <div className="flex gap-4 mb-4">
                    <div className="h-24 w-24 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 w-1/2 rounded-full bg-foreground/10" />
                      <div className="h-4 w-3/4 rounded-full bg-foreground/5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="rounded-2xl bg-foreground/5 border border-border/30 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50" />
                    </div>
                    <div className="rounded-2xl bg-foreground/5 border border-border/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- TRUST BANNER --- */}
      <TrustBanner />

      {/* 
        ========================================================================
        LOGO MARQUEE (Social Proof)
        ========================================================================
      */}
      <section className="py-12 border-y border-border/10 overflow-hidden bg-background">
        <div className="container mx-auto px-6 mb-8">
          <p className="text-center text-sm font-semibold tracking-widest text-muted-foreground uppercase">Powering operations for industry leaders</p>
        </div>
        
        {/* Infinite CSS Marquee */}
        <div className="group relative flex overflow-hidden w-full before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[150px] before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[150px] after:bg-gradient-to-l after:from-background after:to-transparent">
          
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
            {/* Array is repeated twice to ensure seamless loop. */}
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex gap-20 sm:gap-32 items-center px-10 sm:px-16 shrink-0">
                
                {/* Logo 1 */}
                <div className="flex items-center gap-3 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,92,0,0.5)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  <span className="text-2xl font-heading font-black tracking-tighter">HILTON</span>
                </div>
                
                {/* Logo 2 */}
                <div className="flex items-center gap-3 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,92,0,0.5)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                  <span className="text-2xl font-heading font-black tracking-tighter">MARRIOTT</span>
                </div>
                
                {/* Logo 3 */}
                <div className="flex items-center gap-3 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,92,0,0.5)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                  <span className="text-2xl font-heading font-black tracking-tighter">THE RITZ</span>
                </div>

                {/* Logo 4 */}
                <div className="flex items-center gap-3 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,92,0,0.5)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span className="text-2xl font-heading font-black tracking-tighter">CAFE NERO</span>
                </div>

                {/* Logo 5 */}
                <div className="flex items-center gap-3 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,92,0,0.5)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="text-2xl font-heading font-black tracking-tighter">NOBU</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ADVANCED PROGRESSIVE SCROLL SEQUENCE (300vh) --- */}
      <section ref={sequenceRef} className="relative h-[300vh] bg-foreground text-background dark:bg-[#050505] dark:text-foreground">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* Central Building Hexagon */}
          <motion.div 
            className="absolute flex items-center justify-center origin-center"
            style={{ scale: hexScale, opacity: hexOpacity }}
          >
            <svg width="400" height="400" viewBox="0 0 100 100" className="drop-shadow-[0_0_30px_rgba(255,92,0,0.5)]">
              {/* Abstract Smooth Hexagon/Oval representing the logo */}
              <motion.path
                d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary/50"
                style={{ pathLength: hexPathLength }}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/30"
                style={{ pathLength: hexPathLength }}
              />
            </svg>
            
            {/* The Core Energy inside the Hexagon */}
            <motion.div 
              className="absolute h-32 w-32 rounded-full bg-primary blur-[50px] mix-blend-screen"
              style={{ opacity: coreGlow }}
            />
          </motion.div>

          {/* Sequential Text Reveals */}
          <motion.div className="absolute text-center px-6" style={{ opacity: text1Opacity, y: text1Y }}>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter mb-4">Building the Foundation.</h2>
            <p className="text-xl text-background/60 max-w-2xl mx-auto">We started with a completely new database architecture, designed for zero-latency operations.</p>
          </motion.div>

          <motion.div className="absolute text-center px-6" style={{ opacity: text2Opacity, y: text2Y }}>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter mb-4 text-primary">Connecting Every Module.</h2>
            <p className="text-xl text-background/60 max-w-2xl mx-auto">POS, Inventory, and PMS aren't integrated. They are native to the same neural network.</p>
          </motion.div>

          <motion.div className="absolute text-center px-6" style={{ opacity: text3Opacity, y: text3Y }}>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter mb-4">Entering the Ecosystem.</h2>
            <p className="text-xl text-background/60 max-w-2xl mx-auto">Welcome to the inner workings of ONFIX.</p>
          </motion.div>

        </div>
      </section>

      {/* --- UI SHOWCASE --- */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-10">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold tracking-tighter">
              Software that <br /> works like magic.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="md:col-span-8 rounded-[2rem] bg-foreground/5 border border-border/50 p-8 min-h-[400px] flex flex-col justify-end relative overflow-hidden group"
            >
              <h3 className="text-3xl font-bold font-heading mb-2 relative z-10">Global Multi-Branch Sync</h3>
              <p className="text-muted-foreground text-lg max-w-md relative z-10">Deploy menu updates, track aggregate inventory, and manage permissions across 1,000+ locations instantly.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:col-span-4 rounded-[2rem] bg-foreground/5 border border-border/50 p-8 min-h-[400px] flex flex-col justify-end relative overflow-hidden group"
            >
              <h3 className="text-2xl font-bold font-heading mb-2">QR Tableside</h3>
              <p className="text-muted-foreground">Turnover tables 30% faster with zero-friction digital ordering.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ROI CALCULATOR --- */}
      <RoiCalculator />

      {/* --- ECOSYSTEM NAVIGATOR --- */}
      <EcosystemNavigator />

      {/* --- FINAL CTA --- */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary via-transparent to-transparent blur-3xl rounded-full" />
        </div>
        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter mb-8">
              Don't let legacy software <br/> hold you back.
            </h2>
            <p className="text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join the new standard of hospitality operations. Book a personalized architectural review of your business today.
            </p>
            
            <EnergyButton href="/contact">
              Start Your Journey <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
            </EnergyButton>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
