import { FadeIn } from "@/components/animations/FadeIn";
import { ArrowRight, TrendingUp, Zap, Globe, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SystemScrollytelling } from "@/components/system/SystemScrollytelling";
import { ProductTeardown } from "@/components/system/ProductTeardown";
import { TableOfContents } from "@/components/system/TableOfContents";
import { getSystemModules } from "@/lib/cms";

export const revalidate = 60;

const featureCategories = [
  {
    title: "Revenue Drivers",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    features: [
      { name: "Frictionless Digital Tableside", desc: "Turn tables 30% faster and increase average ticket sizes by allowing guests to order instantly from their personal devices." },
      { name: "Unified Master Folio Billing", desc: "Maximize guest spend by allowing them to seamlessly charge restaurant, bar, and service tabs directly to their hotel room." },
      { name: "Automated Guest Loyalty", desc: "Drive consistent repeat business by automatically recognizing, profiling, and rewarding your most valuable patrons." },
      { name: "Lightning-Fast Line Busting", desc: "Process walk-in customers in seconds during peak rushes to capture every possible sale without creating bottlenecks." },
    ]
  },
  {
    title: "Operational Efficiency",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    features: [
      { name: "Instantaneous Kitchen Routing", desc: "Eliminate kitchen chaos and missing paper tickets with color-coded, real-time digital Kitchen Display System (KDS) routing." },
      { name: "Automated FIFO Margin Protection", desc: "Stop food waste before it happens with intelligent stock rotation that automatically tracks expiration dates and purchase prices per batch." },
      { name: "Single-Assignment Task Claiming", desc: "Ensure guests are never left waiting—or double-served—with a smart waiter notification and task-claiming system." },
      { name: "One-Click Shift & Payroll Automation", desc: "Drastically cut administrative hours using reusable roster templates and automated salary line-item calculations." },
    ]
  },
  {
    title: "Enterprise & Scale",
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    features: [
      { name: "Global Multi-Property Command", desc: "Scale your empire effortlessly by managing 10 or 1,000 locations from a single, centralized organizational dashboard." },
      { name: "Frictionless Cross-Property Transfers", desc: "Move ingredients and stock seamlessly between different warehouse locations and properties without ever losing tracking history." },
      { name: "Centralized Executive Reporting", desc: "Make data-driven decisions instantly with aggregated, real-time financial and operational summaries across all branches." },
      { name: "Granular Role-Based Access Control", desc: "Secure your operations by strictly defining exactly what every staff member, manager, and auditor can see and execute." },
    ]
  },
  {
    title: "Reliability (The Moat)",
    icon: ShieldCheck,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    features: [
      { name: "Military-Grade Offline Architecture", desc: "Never drop an order or halt service during an ISP outage; our local desktop app keeps your venue running 100% offline." },
      { name: "Zero-Latency Real-Time Sync", desc: "Experience immediate updates across your entire venue as the POS, KDS, and inventory communicate instantly via our localized network bridge." },
      { name: "Hardware-Agnostic Thermal Routing", desc: "Coordinate complex, multi-kitchen operations with a robust Node.js print bridge that routes tickets to the exact right station, every time." },
    ]
  },
  {
    title: "Guest Experience",
    icon: TrendingUp,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    features: [
      { name: "Smart Booking Calendar", desc: "Visualize room availability, manage reservations, and eliminate double-bookings with a drag-and-drop booking management interface." },
      { name: "Guest Self-Service Portal", desc: "Let guests order room service, request housekeeping, set DND status, and call reception — all from their phone." },
      { name: "Housekeeping Command Board", desc: "Give your housekeeping team real-time visibility into room statuses, cleaning assignments, and maintenance requests." },
      { name: "Customer Profiles & History", desc: "Automatically build rich guest profiles with order history, preferences, and spending patterns for personalized service." },
    ]
  },
  {
    title: "Financial Control",
    icon: Globe,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    features: [
      { name: "Cash Drawer Sessions", desc: "Open, track, and reconcile cash drawers per shift with denomination counting and audit trail documentation." },
      { name: "Expense Tracking & Categorization", desc: "Log every operational expense with categories and detailed breakdowns for complete financial visibility." },
      { name: "Supplier Payment Tracking", desc: "Track outstanding balances, payment history, and returns for every supplier in your network." },
    ]
  }
];

const criticalFeatures = [
  { name: "The 'Never-Down' Offline Mutation Engine", desc: "Discover how our system queues, perfectly replays, and automatically resolves cloud-sync conflicts without human intervention after an internet outage." },
  { name: "Proprietary Double-Deduction Safety Locks", desc: "Learn how our architecture mathematically guarantees 100% inventory accuracy by preventing race conditions during peak multi-terminal ordering." },
  { name: "Seamless Cross-Domain Enterprise Handoff", desc: "See how our advanced JWT authentication allows executives to instantly teleport between hundreds of property databases without ever logging in twice." },
];

export default async function SystemPage() {
  const modules = await getSystemModules();

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background text-foreground relative">
      <TableOfContents />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="max-w-4xl mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
            The architecture of <br />
            <span className="text-primary">efficiency.</span>
          </h1>
          <p className="text-2xl text-muted-foreground max-w-2xl font-medium">
            Dive deep into the interconnected modules that make ONFIX the most powerful platform for hospitality.
          </p>
        </div>

        {/* PROGRESSIVE SCROLLYTELLING COMPONENT */}
        <SystemScrollytelling modules={modules} />

        {/* --- 2.5D PRODUCT TEARDOWN --- */}
        <ProductTeardown />

        {/* --- CORE FEATURES GRID --- */}
        <div className="py-32">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tighter mb-6">Built for <span className="text-primary">Impact.</span></h2>
            <p className="text-xl text-muted-foreground max-w-3xl">
              We engineered out the friction. Every line of code is designed to drive revenue, increase operational efficiency, and scale infinitely across your entire portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCategories.map((cat, idx) => (
              <div key={idx} className="bg-card border border-border/50 rounded-[2rem] p-8 lg:p-10 shadow-sm hover:shadow-[0_15px_40px_rgba(255,92,0,0.08)] transition-all duration-500 flex flex-col group/card">
                <div className="flex items-center gap-5 mb-10">
                  <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center ${cat.bg} ${cat.color} ${cat.border} border transition-transform duration-500 group-hover/card:scale-110`}>
                    <cat.icon size={32} />
                  </div>
                  <h3 className="text-3xl font-heading font-bold">{cat.title}</h3>
                </div>
                
                <div className="space-y-8 flex-1">
                  {cat.features.map((feature, fIdx) => (
                    <div key={fIdx} className="group">
                      <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2 mb-2">
                        {feature.name}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed pl-5 border-l-2 border-border/40 group-hover:border-primary/50 transition-colors">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CRITICAL IP FEATURES --- */}
        <div className="py-16 mt-16 relative overflow-hidden rounded-[3rem] bg-foreground text-background border border-border/20 shadow-2xl">
          {/* Subtle tech background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)] bg-[length:60px_60px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 opacity-[0.03] pointer-events-none transform -rotate-12">
            <Lock size={400} />
          </div>
          
          <div className="relative z-10 px-8 lg:px-16 py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold text-sm tracking-widest uppercase mb-8 border border-primary/30">
              <Lock size={16} /> Proprietary Technology
            </div>
            
            <h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter mb-6">
              The Architecture Secrets.
            </h3>
            <p className="text-xl text-background/70 max-w-3xl mb-12">
              Some capabilities are too advanced to list publicly. These architectural blueprints are the reason we outperform legacy systems, reserved strictly for private evaluation.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {criticalFeatures.map((feat, idx) => (
                <div key={idx} className="bg-background/5 border border-background/10 rounded-[1.5rem] p-8 backdrop-blur-sm hover:bg-background/10 transition-colors flex flex-col h-full">
                  <h4 className="text-xl font-bold mb-4">{feat.name}</h4>
                  <p className="text-background/60 leading-relaxed mb-8 flex-1">{feat.desc}</p>
                  <div className="mt-auto text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <ChevronRight size={16} /> Available in Live Demo
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- CTA --- */}
        <div className="mt-40 text-center animate-in fade-in duration-1000 delay-500">
          <div className="py-24 rounded-[3rem] bg-foreground text-background relative overflow-hidden group">
            {/* Spinning Neon Border inside the CTA */}
            <div className="absolute inset-[-50%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#FF5C00_100%)] opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute inset-[2px] bg-foreground rounded-[3rem] z-0" />
            
            <div className="relative z-10">
              <h3 className="text-5xl font-heading font-extrabold tracking-tighter mb-6">Ready to upgrade?</h3>
              <p className="text-xl text-background/70 mb-10 max-w-2xl mx-auto">Get a personalized walkthrough of the ONFIX architecture tailored to your venue.</p>
              <Link href="/contact" className="inline-flex h-16 items-center px-10 bg-primary text-white rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,92,0,0.3)] gap-3">
                Request Full Demo <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
