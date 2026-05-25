"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReviewVM } from "@/lib/cms";

export function ReviewsShowcase({ caseStudies }: { caseStudies: ReviewVM[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeStudy, setActiveStudy] = useState<ReviewVM | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeStudy) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [activeStudy]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative w-full pb-32">
        <div className="container mx-auto px-6 lg:px-12 xl:px-24 flex justify-between items-end mb-10">
          <div>
             <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter">
                Operator <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Stories.</span>
             </h2>
          </div>
          <div className="flex gap-4 hidden md:flex">
             <button onClick={scrollLeft} className="h-12 w-12 rounded-full border border-border bg-background flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm">
               <ChevronLeft size={24} />
             </button>
             <button onClick={scrollRight} className="h-12 w-12 rounded-full border border-border bg-background flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm">
               <ChevronRight size={24} />
             </button>
          </div>
        </div>

        <div className="relative w-full">
          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 lg:px-12 xl:px-24 pb-12 pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Hide scrollbar for Chrome/Safari */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {caseStudies.map((study, index) => {
              // Two color tones
              const isTone2 = index % 2 !== 0;
              const cardBg = isTone2 ? "bg-primary/[0.03] border-primary/20" : "bg-card border-border/50";
              
              return (
                <div 
                  key={study.id} 
                  onClick={() => setActiveStudy(study)}
                  className={`snap-center shrink-0 w-[85vw] md:w-[420px] lg:w-[480px] h-[240px] rounded-[1.5rem] overflow-hidden relative cursor-pointer border shadow-md hover:shadow-[0_15px_40px_rgba(255,92,0,0.15)] transition-all duration-300 flex ${cardBg}`}
                >
                  {/* Image Left Side */}
                  <div className="w-[40%] h-full relative overflow-hidden shrink-0">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                      style={{ backgroundImage: `url(${study.image})` }}
                    />
                  </div>
                  
                  {/* Text Right Side */}
                  <div className="w-[60%] p-6 flex flex-col justify-between relative">
                    <div>
                      <div className="flex gap-1 mb-3">
                        {[...Array(study.rating)].map((_, j) => (
                          <Star key={j} className="fill-primary text-primary" size={14} />
                        ))}
                      </div>
                      <p className="text-sm font-medium leading-snug line-clamp-4 text-foreground/90">"{study.text}"</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <p className="font-bold text-foreground text-sm line-clamp-1">{study.name}</p>
                        <p className="text-muted-foreground text-xs line-clamp-1">{study.role}</p>
                      </div>
                      <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white">
                        <Play size={14} className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeStudy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStudy(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-card border border-border/50 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setActiveStudy(null)}
                className="absolute top-6 right-6 z-50 h-12 w-12 bg-background/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Modal Image */}
              <div 
                className="w-full md:w-2/5 h-64 md:h-auto bg-cover bg-center"
                style={{ backgroundImage: `url(${activeStudy.image})` }}
              />
              
              {/* Modal Content */}
              <div className="w-full md:w-3/5 p-8 md:p-16 overflow-y-auto">
                <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold uppercase tracking-widest">
                  Case Study
                </div>
                <h3 className="text-4xl md:text-5xl font-heading font-bold mb-4">{activeStudy.name}</h3>
                <p className="text-xl text-primary font-medium mb-12">{activeStudy.role}</p>
                
                <div className="pl-6 border-l-4 border-primary/50 py-2 mb-12">
                  <p className="text-2xl text-foreground leading-relaxed italic">
                    "{activeStudy.text}"
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-2xl font-bold">The Challenge & Solution</h4>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {activeStudy.fullStory}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
