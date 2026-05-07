"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Send, MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-40 pb-32 min-h-screen relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <FadeIn>
          <div className="max-w-4xl mb-24 md:mb-32">
            <h1 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Let's build <br />
              <span className="text-primary">the future together.</span>
            </h1>
            <p className="text-2xl text-muted-foreground font-medium max-w-2xl">
              Book a personalized architectural review of your business operations. Our engineers are ready to assist.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Contact Form */}
          <FadeIn delay={0.2} direction="right" className="lg:col-span-7">
            <div className="p-8 md:p-12 rounded-[3rem] border border-border/50 bg-card/50 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden min-h-[600px] flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Send size={200} />
              </div>
              
              <h3 className="text-3xl font-heading font-extrabold tracking-tight mb-2 relative z-10">Build Your Architecture</h3>
              <p className="text-muted-foreground mb-10 relative z-10">Select your parameters to calculate your custom integration plan.</p>
              
              <form className="space-y-8 relative z-10 flex-1 flex flex-col" onSubmit={(e) => e.preventDefault()}>
                
                {/* Step 1: Venue Type */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">1</span>
                    Venue Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Fine Dining', 'Quick Service', 'Hotel / Resort', 'Cafe / Bakery', 'Bar / Nightclub', 'Enterprise'].map((type) => (
                      <button key={type} type="button" className="px-4 py-3 rounded-2xl border border-border/50 bg-background hover:border-primary/50 hover:bg-primary/5 text-sm font-semibold transition-all text-left focus:ring-2 focus:ring-primary focus:border-primary">
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Integrations */}
                <div className="space-y-4 pt-4 border-t border-border/30">
                  <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">2</span>
                    Current Integrations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Xero', 'QuickBooks', 'UberEats', 'DoorDash', 'Stripe', 'Square', 'Mailchimp', 'SevenRooms'].map((tool) => (
                      <button key={tool} type="button" className="px-4 py-2 rounded-full border border-border/50 bg-background hover:border-primary/50 hover:text-primary text-xs font-bold transition-all focus:bg-primary focus:text-white focus:border-primary">
                        + {tool}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Details */}
                <div className="space-y-4 pt-4 border-t border-border/30 flex-1">
                  <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">3</span>
                    Where should we send the blueprint?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm" placeholder="Full Name" />
                    <input type="email" className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm" placeholder="Work Email" />
                  </div>
                </div>
                
                <button type="button" className="group relative w-full h-16 inline-flex items-center justify-center overflow-hidden rounded-2xl bg-foreground px-8 font-bold text-background transition-all hover:scale-[1.02] active:scale-95 shadow-xl mt-auto">
                  <span className="relative z-10 flex items-center gap-3 text-lg">
                    Generate Architecture Plan <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                  <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-primary to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </button>
              </form>
            </div>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn delay={0.4} direction="left" className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-16">
              <div>
                <h3 className="text-3xl font-heading font-extrabold tracking-tight mb-6">Direct Line</h3>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Prefer to reach out directly? Use the details below or message us on WhatsApp for an immediate response from our concierge.
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-foreground/5 text-foreground flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-heading mb-2">Global Headquarters</h4>
                    <p className="text-lg text-muted-foreground leading-relaxed">123 Innovation Drive, Tech District<br/>California, CA 90210</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 group">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-foreground/5 text-foreground flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-heading mb-2">Phone & WhatsApp</h4>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-1">+1 (800) 123-4567</p>
                    <p className="text-primary font-semibold cursor-pointer hover:underline">Message on WhatsApp &rarr;</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 group">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-foreground/5 text-foreground flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-heading mb-2">Email Support</h4>
                    <p className="text-lg text-muted-foreground leading-relaxed">hello@onfixpos.com</p>
                    <p className="text-lg text-muted-foreground leading-relaxed">support@onfixpos.com</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
