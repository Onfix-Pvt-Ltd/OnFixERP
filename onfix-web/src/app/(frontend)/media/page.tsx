import { FadeIn } from "@/components/animations/FadeIn";
import { Download } from "lucide-react";
import { getPressKit } from "@/lib/cms";

export const revalidate = 60;

export default async function MediaPage() {
  const items = await getPressKit();

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <FadeIn>
           <h1 className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
             Press & <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Media Kit.</span>
           </h1>
           <p className="text-2xl text-muted-foreground font-medium mb-16 max-w-2xl leading-relaxed">
             Download official ONFIX brand assets, high-resolution product shots, and our latest press releases.
           </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => {
            const card = (
              <div className="group p-10 rounded-[2.5rem] bg-card/80 backdrop-blur-md border border-border/50 hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer flex flex-col justify-between aspect-square relative overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(255,92,0,0.3)] hover:-translate-y-2 h-full">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[linear-gradient(to_right,#ffffff_2px,transparent_2px),linear-gradient(to_bottom,#ffffff_2px,transparent_2px)] bg-[size:30px_30px] transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex justify-between items-start">
                  <div className="h-14 w-14 rounded-2xl bg-foreground/5 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-500">
                    <Download size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-white/80 transition-colors">{item.type}</span>
                </div>

                <h3 className="text-3xl lg:text-4xl font-heading font-bold relative z-10 leading-tight">{item.title}</h3>
              </div>
            );

            return (
              <FadeIn key={item.id} delay={i * 0.1} direction="up">
                {item.fileUrl ? (
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" download className="block h-full">
                    {card}
                  </a>
                ) : (
                  card
                )}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
