"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Star, Download, BookOpen, Link as LinkIcon, Info, Cpu, FileText } from "lucide-react";

// The hexagon icon
const HexagonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const pages = [
  {
    title: "System",
    href: "/system",
    description: "Explore the core architecture. POS, PMS, and KDS seamlessly intertwined.",
    icon: Layers,
    preview: (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent rounded-2xl" />
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-background border border-border/50 rounded-xl flex items-center justify-center shadow-lg z-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}><Cpu size={16} className="text-primary"/></div>
          <div className="h-[2px] w-4 bg-primary/30" />
          <div className="h-12 w-12 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center shadow-lg z-20"><Layers size={20} className="text-primary"/></div>
          <div className="h-[2px] w-4 bg-primary/30" />
          <div className="h-10 w-10 bg-background border border-border/50 rounded-xl flex items-center justify-center shadow-lg z-10 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}><FileText size={16} className="text-primary"/></div>
        </div>
      </div>
    )
  },
  {
    title: "Reviews",
    href: "/reviews",
    description: "Hear from industry leaders who completely transformed their F&B operations.",
    icon: Star,
    preview: (
      <div className="w-full h-full flex items-center justify-center p-4 relative">
        <div className="bg-background border border-border/50 rounded-xl p-4 shadow-xl w-full max-w-[220px] transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-primary text-primary" />)}
          </div>
          <p className="text-xs text-foreground/80 italic leading-snug">"Ticket times dropped by 40% and reporting is finally real-time..."</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20" />
            <p className="text-[10px] font-bold text-muted-foreground">- The Grand Royale</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Partners",
    href: "/partners",
    description: "Discover our integrations ecosystem. We play nice with your favorite tools.",
    icon: LinkIcon,
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-500 delay-75"><span className="text-[9px] font-black tracking-tighter">XERO</span></div>
          <div className="h-10 w-10 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-500 delay-150"><span className="text-[9px] font-black tracking-tighter">UBER</span></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-500 delay-100"><span className="text-[9px] font-black tracking-tighter">STRPE</span></div>
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-md text-primary font-bold text-xs transform group-hover:scale-110 transition-transform duration-500">+15</div>
        </div>
      </div>
    )
  },
  {
    title: "Guides",
    href: "/guides",
    description: "Deep-dive implementation blueprints, technical tutorials, and operational strategies.",
    icon: BookOpen,
    preview: (
      <div className="w-full h-full flex flex-col justify-center gap-3 p-4">
        <div className="bg-background border border-border/50 rounded-lg p-3 flex items-center gap-3 shadow-sm transform translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
          <BookOpen size={14} className="text-primary" />
          <span className="text-xs font-bold">Hardware Setup Guide</span>
        </div>
        <div className="bg-background border border-border/50 rounded-lg p-3 flex items-center gap-3 shadow-sm transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
          <BookOpen size={14} className="text-primary" />
          <span className="text-xs font-bold">Menu Engineering 101</span>
        </div>
      </div>
    )
  },
  {
    title: "Media",
    href: "/media",
    description: "Download official ONFIX brand assets, press kits, and promotional videos.",
    icon: Download,
    preview: (
      <div className="w-full h-full flex items-center justify-center gap-3 p-4">
        <div className="w-20 h-24 rounded-xl bg-muted bg-cover bg-center shadow-md transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=200)' }} />
        <div className="w-20 h-20 rounded-xl bg-muted bg-cover bg-center shadow-md transform translate-y-4 rotate-3 group-hover:rotate-0 transition-transform duration-500" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200)' }} />
      </div>
    )
  },
  {
    title: "About",
    href: "/about",
    description: "Learn about our DNA, our engineering team, and why we are obsessed with fixing tech.",
    icon: Info,
    preview: (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="w-16 h-16 rounded-full border-4 border-card shadow-xl overflow-hidden bg-muted absolute z-30 transform -translate-x-12 group-hover:-translate-x-16 transition-transform duration-500" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100)', backgroundSize: 'cover' }} />
          <div className="w-16 h-16 rounded-full border-4 border-card shadow-xl overflow-hidden bg-muted absolute z-20" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100)', backgroundSize: 'cover' }} />
          <div className="w-16 h-16 rounded-full border-4 border-card shadow-xl overflow-hidden bg-muted absolute z-10 transform translate-x-12 group-hover:translate-x-16 transition-transform duration-500" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100)', backgroundSize: 'cover' }} />
        </div>
      </div>
    )
  }
];

export function EcosystemNavigator() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tighter mb-6"
          >
            The ONFIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Ecosystem.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to understand, implement, and scale the ultimate hospitality operating system.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, i) => (
            <Link key={page.title} href={page.href} className="block group">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative h-full bg-card border border-border/50 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-colors duration-500 shadow-sm hover:shadow-[0_15px_40px_rgba(255,92,0,0.15)] flex flex-col"
              >
                {/* The Preview Area (Top Half) */}
                <div className="relative h-48 w-full bg-foreground/[0.02] border-b border-border/30 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
                  {page.preview}
                </div>

                {/* Content Area (Bottom Half) */}
                <div className="p-8 relative z-10 flex-1 flex flex-col overflow-hidden">
                  {/* Subtle primary solid orange splash on hover */}
                  <div className="absolute inset-0 bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Massive Background Hexagon */}
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 text-primary opacity-0 group-hover:opacity-[0.08] transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-125 pointer-events-none">
                    <HexagonIcon className="w-full h-full" />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <page.icon size={24} className="text-primary" />
                      <h3 className="text-2xl font-bold font-heading">{page.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                      {page.description}
                    </p>
                  </div>

                  {/* Animated Arrow Button */}
                  <div className="relative z-10 flex items-center gap-2 font-bold text-sm tracking-widest uppercase text-foreground/50 group-hover:text-primary transition-colors duration-300">
                    Explore {page.title}
                    <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
