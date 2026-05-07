import { ShieldCheck, Lock, Server, CheckCircle2 } from "lucide-react";

const badges = [
  { icon: ShieldCheck, title: "PCI-DSS Level 1", desc: "Bank-grade payment security" },
  { icon: Lock, title: "End-to-End Encryption", desc: "Military-grade data protection" },
  { icon: Server, title: "99.999% Uptime SLA", desc: "Zero-downtime architecture" },
  { icon: CheckCircle2, title: "SOC 2 Type II", desc: "Certified enterprise compliance" },
];

export function TrustBanner() {
  return (
    <section className="py-12 border-y border-border/30 bg-background/50 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,92,0,0.03)_50%,transparent_100%)] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          <div className="text-center md:text-left shrink-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Enterprise Grade</p>
            <h3 className="text-2xl font-heading font-extrabold text-foreground">Trusted Infrastructure</h3>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-6 lg:gap-12 w-full">
            {badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <badge.icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{badge.title}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
