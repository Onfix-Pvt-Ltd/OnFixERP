"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Clock, Leaf } from "lucide-react";
import type { RoiConfigVM } from "@/lib/cms";

export function RoiCalculator({ roi }: { roi: RoiConfigVM }) {
  const [tables, setTables] = useState(roi.defaultTables);
  const [ticketSize, setTicketSize] = useState(roi.defaultTicketSize);
  const [turns, setTurns] = useState(roi.defaultTurns);

  // Math logic — uplift assumptions come from the Home Page global (editable in /admin).
  const dailyRevenueBefore = tables * turns * ticketSize;
  const newTicketSize = ticketSize * (1 + roi.ticketUpliftPct / 100); // upsell uplift
  const newTurns = turns * (1 + roi.turnsUpliftPct / 100); // faster turns via QR & KDS
  const dailyRevenueAfter = tables * newTurns * newTicketSize;

  const monthlyExtraRevenue = Math.round((dailyRevenueAfter - dailyRevenueBefore) * 30);
  const hoursSavedMonthly = Math.round(tables * turns * (roi.minutesSavedPerTurn / 60) * 30);
  const wasteSavedMonthly = Math.round((dailyRevenueBefore * 30) * (roi.wasteReductionPct / 100));

  return (
    <section className="py-32 relative bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase mb-6 border border-primary/20">
            <Calculator size={16} /> ROI Engine
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tighter mb-6">
            Calculate your <span className="text-primary">Impact.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop guessing. Adjust the metrics below to see exactly how much capital and time ONFIX will return to your business every month.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Inputs Section */}
          <div className="lg:col-span-5 bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-xl backdrop-blur-xl relative">
            <h3 className="text-2xl font-bold font-heading mb-8">Current Metrics</h3>
            
            <div className="space-y-10">
              {/* Tables Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Number of Tables</label>
                  <span className="font-bold text-3xl text-foreground font-heading">{tables}</span>
                </div>
                <input 
                  type="range" min="5" max="150" value={tables} 
                  onChange={(e) => setTables(Number(e.target.value))} 
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>

              {/* Ticket Size Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Avg. Ticket Size</label>
                  <span className="font-bold text-3xl text-foreground font-heading">${ticketSize}</span>
                </div>
                <input 
                  type="range" min="10" max="250" value={ticketSize} 
                  onChange={(e) => setTicketSize(Number(e.target.value))} 
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>

              {/* Turns Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Daily Table Turns</label>
                  <span className="font-bold text-3xl text-foreground font-heading">{turns}</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="0.5" value={turns} 
                  onChange={(e) => setTurns(Number(e.target.value))} 
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>
            </div>
            
            <div className="mt-10 p-4 rounded-2xl bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary font-medium text-center">
                Calculations based on aggregate data from ONFIX enterprise clients achieving {roi.ticketUpliftPct}% upsell rates and {roi.turnsUpliftPct}% faster table turns.
              </p>
            </div>
          </div>

          {/* Outputs Section */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Primary Stat */}
            <motion.div 
              className="md:col-span-2 bg-gradient-to-br from-primary to-orange-500 rounded-[2.5rem] p-10 text-white shadow-[0_20px_50px_rgba(255,92,0,0.3)] relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-20"><DollarSign size={120} /></div>
              <div className="relative z-10">
                <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-4">Projected Monthly Revenue Lift</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-7xl font-extrabold font-heading tracking-tighter">
                    ${monthlyExtraRevenue.toLocaleString()}
                  </span>
                </div>
                <p className="mt-6 text-white/90 font-medium max-w-sm">
                  Generated through frictionless QR upselling and turning tables {roi.turnsUpliftPct}% faster during peak hours.
                </p>
              </div>
            </motion.div>

            {/* Secondary Stat 1 */}
            <motion.div 
              className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-lg hover:border-primary/30 transition-colors group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-2">Operational Hours Saved</p>
              <span className="text-4xl font-extrabold font-heading">{hoursSavedMonthly} <span className="text-xl text-muted-foreground font-normal">hrs/mo</span></span>
              <p className="mt-4 text-sm text-muted-foreground">Eliminated walking times, manual ticket running, and payroll admin.</p>
            </motion.div>

            {/* Secondary Stat 2 */}
            <motion.div 
              className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-lg hover:border-primary/30 transition-colors group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <Leaf size={24} />
              </div>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-2">Food Waste Recouped</p>
              <span className="text-4xl font-extrabold font-heading">${wasteSavedMonthly.toLocaleString()} <span className="text-xl text-muted-foreground font-normal">/mo</span></span>
              <p className="mt-4 text-sm text-muted-foreground">Capital saved through automated FIFO stock rotation and exact recipe depletion.</p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
