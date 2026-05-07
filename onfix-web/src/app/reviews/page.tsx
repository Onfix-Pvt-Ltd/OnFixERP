import { FadeIn } from "@/components/animations/FadeIn";
import { ReviewsShowcase } from "@/components/reviews/ReviewsShowcase";

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="pt-40 pb-20 container mx-auto px-6 max-w-7xl relative z-10">
        <FadeIn>
           <h1 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
             Loved by <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">1,200+ Operators.</span>
           </h1>
           <p className="text-2xl text-muted-foreground font-medium mb-8 max-w-2xl leading-relaxed">
             Don't just take our word for it. Hear from the high-performance teams running their entire operations on ONFIX.
           </p>
           <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-foreground/5 text-foreground border border-border text-sm font-bold uppercase tracking-widest animate-pulse">
             Scroll down to view cases
           </div>
        </FadeIn>
      </div>

      <ReviewsShowcase />
    </div>
  );
}
