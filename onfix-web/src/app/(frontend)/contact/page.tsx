import type { Metadata } from "next";
import { FadeIn } from "@/components/animations/FadeIn";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — OnFix POS",
  description:
    "Book a personalized architectural review of your business operations. Our engineers are ready to assist.",
};

export default function ContactPage() {
  return (
    <div className="pt-40 pb-32 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <FadeIn>
          <div className="max-w-4xl mb-24 md:mb-32">
            <h1 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Let&apos;s build <br />
              <span className="text-primary">the future together.</span>
            </h1>
            <p className="text-2xl text-muted-foreground font-medium max-w-2xl">
              Book a personalized architectural review of your business operations. Our engineers are ready to assist.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <FadeIn delay={0.2} direction="right" className="lg:col-span-7">
            <ContactForm />
          </FadeIn>

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
                    <p className="text-lg text-muted-foreground leading-relaxed">123 Innovation Drive, Tech District<br />California, CA 90210</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-foreground/5 text-foreground flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-white">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-heading mb-2">Phone &amp; WhatsApp</h4>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-1">+1 (800) 123-4567</p>
                    <p className="text-primary font-semibold cursor-pointer hover:underline">Message on WhatsApp →</p>
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
