"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SystemScrollytelling({ modules }: { modules: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative flex flex-col lg:flex-row gap-12 items-start mt-20">
      {/* Left Column: Scrolling Text blocks */}
      <div className="w-full lg:w-5/12 pb-[50vh]">
        {modules.map((mod, index) => (
          <motion.div 
            key={mod.id}
            onViewportEnter={() => setActiveIndex(index)}
            viewport={{ margin: "-50% 0px -50% 0px" }}
            className={`min-h-[60vh] flex flex-col justify-center transition-opacity duration-700 ${activeIndex === index ? "opacity-100" : "opacity-20"}`}
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-foreground text-background font-bold text-2xl mb-8 shadow-xl transition-all duration-500">
              0{index + 1}
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter mb-6">{mod.title}</h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">{mod.description}</p>
            
            <div className="space-y-4 mb-10">
              {mod.benefits.map((benefit: string, i: number) => (
                <div key={i} className="flex items-center gap-4 text-foreground font-semibold text-lg">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  {benefit}
                </div>
              ))}
            </div>

            <div className="p-8 bg-muted/30 rounded-[2rem] border border-border/50">
              <h4 className="font-bold text-foreground mb-3 text-sm uppercase tracking-widest text-primary">Workflow</h4>
              <p className="text-muted-foreground text-lg leading-relaxed">{mod.workflow}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right Column: Sticky Dynamic Mockup */}
      <div className="hidden lg:block lg:w-7/12 sticky top-[20vh] h-[60vh]">
        <div className="w-full h-full rounded-[2.5rem] border border-border/50 bg-background/80 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.1)] overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted/5 to-background"
            >
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              
              <div className="text-center relative z-10 p-12 w-full flex flex-col items-center">
                <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-[0_0_40px_rgba(255,92,0,0.3)] backdrop-blur-md border border-primary/20">
                  <span className="text-5xl font-bold font-heading">0{activeIndex + 1}</span>
                </div>
                
                <h3 className="text-4xl lg:text-5xl font-heading font-bold text-foreground drop-shadow-md mb-12">{modules[activeIndex].title}</h3>
                
                {/* High-end Abstract UI representation */}
                <div className="w-full max-w-[450px] aspect-[16/9] mx-auto bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden relative flex flex-col">
                  {/* Fake UI Header */}
                  <div className="h-10 border-b border-border/30 bg-muted/30 flex items-center px-4 gap-2">
                     <div className="h-3 w-3 rounded-full bg-foreground/20" />
                     <div className="h-3 w-3 rounded-full bg-foreground/20" />
                     <div className="h-3 w-3 rounded-full bg-foreground/20" />
                  </div>
                  {/* Fake UI Body */}
                  <div className="flex-1 p-5 grid grid-cols-3 gap-5">
                     <div className="col-span-1 rounded-xl bg-primary/10 border border-primary/20 relative overflow-hidden">
                       <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                     </div>
                     <div className="col-span-2 rounded-xl bg-foreground/5 space-y-3 p-4 flex flex-col justify-center">
                       <div className="h-3 w-full rounded-full bg-foreground/10" />
                       <div className="h-3 w-3/4 rounded-full bg-foreground/10" />
                       <div className="h-3 w-1/2 rounded-full bg-foreground/10" />
                     </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
