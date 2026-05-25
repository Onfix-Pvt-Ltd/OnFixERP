"use client";

import { useState, useTransition } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const VENUE_TYPES = [
  "Fine Dining",
  "Quick Service",
  "Hotel / Resort",
  "Cafe / Bakery",
  "Bar / Nightclub",
  "Enterprise",
];

const INTEGRATION_TAGS = [
  "Xero",
  "QuickBooks",
  "UberEats",
  "DoorDash",
  "Stripe",
  "Square",
  "Mailchimp",
  "SevenRooms",
];

export function ContactForm() {
  const [venueType, setVenueType] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleIntegration = (tag: string) => {
    setIntegrations((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            venueType,
            integrations,
            message,
          }),
        });
        const data = (await res.json()) as { ok: boolean; message?: string };
        if (!res.ok || !data.ok) {
          setError(data.message ?? "Couldn't send right now. Please try again.");
          return;
        }
        setSuccess(true);
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  if (success) {
    return (
      <div className="p-8 md:p-12 rounded-[3rem] border border-border/50 bg-card/50 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] min-h-[600px] flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-8">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-3xl font-heading font-extrabold tracking-tight mb-4">
          We got your blueprint.
        </h3>
        <p className="text-lg text-muted-foreground max-w-md">
          Our team will reach out within one business day at{" "}
          <span className="font-bold text-foreground">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 rounded-[3rem] border border-border/50 bg-card/50 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden min-h-[600px] flex flex-col">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Send size={200} />
      </div>

      <h3 className="text-3xl font-heading font-extrabold tracking-tight mb-2 relative z-10">
        Build Your Architecture
      </h3>
      <p className="text-muted-foreground mb-10 relative z-10">
        Select your parameters to calculate your custom integration plan.
      </p>

      <form
        className="space-y-8 relative z-10 flex-1 flex flex-col"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="space-y-4">
          <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">
              1
            </span>
            Venue Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VENUE_TYPES.map((type) => {
              const active = venueType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVenueType(type)}
                  aria-pressed={active}
                  className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition-all text-left ${
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 bg-background hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/30">
          <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">
              2
            </span>
            Current Integrations
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEGRATION_TAGS.map((tag) => {
              const active = integrations.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleIntegration(tag)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                    active
                      ? "bg-primary text-white border-primary"
                      : "border-border/50 bg-background hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {active ? "✓ " : "+ "}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/30">
          <label className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">
              3
            </span>
            Where should we send the blueprint?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/80 transition-all font-medium text-sm"
              placeholder="Full Name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/80 transition-all font-medium text-sm"
              placeholder="Work Email"
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-foreground/80 transition-all font-medium text-sm resize-none"
            placeholder="Anything else we should know? (optional)"
          />
        </div>

        {error && (
          <p
            className="flex items-start gap-2 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="group relative w-full h-16 inline-flex items-center justify-center overflow-hidden rounded-2xl bg-foreground px-8 font-bold text-background transition-all hover:scale-[1.02] active:scale-95 shadow-xl mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-3 text-lg">
            {isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Sending…
              </>
            ) : (
              <>
                Generate Architecture Plan{" "}
                <Send
                  size={20}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </>
            )}
          </span>
          <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-primary to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </form>
    </div>
  );
}
