/**
 * Read-only data access for the embedded Payload CMS (Phase 3).
 *
 * Server-only. Each getter uses Payload's local API (no HTTP) and maps docs to
 * a plain, serializable view-model the pages/components consume. If the
 * collection is empty OR the query throws (e.g. DB unreachable at build), the
 * getter returns the hardcoded DEFAULT_* data so the marketing pages keep
 * rendering exactly as they did pre-CMS. Content added in /admin overrides it.
 *
 * Icons can't live in the DB — collections store a string key (e.g. "Hotel")
 * and the pages map it to a lucide-react component via their own ICON_MAP.
 */

import { getPayload, type Payload } from "payload";
import config from "@payload-config";

let _payload: Promise<Payload> | null = null;
function payload(): Promise<Payload> {
  if (!_payload) _payload = getPayload({ config });
  return _payload;
}

/** Resolve an upload field (depth>=1 → object, else id/undefined) to a URL. */
function uploadUrl(v: unknown): string | undefined {
  if (v && typeof v === "object" && "url" in v) {
    const url = (v as { url?: unknown }).url;
    return typeof url === "string" ? url : undefined;
  }
  return undefined;
}

// ─────────────────────────── Reviews ───────────────────────────

export interface ReviewVM {
  id: string | number;
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
  fullStory: string;
}

const DEFAULT_REVIEWS: ReviewVM[] = [
  { id: 1, name: "The Grand Royale", role: "Sarah Jenkins, GM", text: "Ticket times dropped by 40% and reporting is finally real-time. Completely transformed our F&B operations.", rating: 5, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000", fullStory: "Before ONFIX, The Grand Royale was struggling with disjointed systems. The front desk couldn't communicate with the kitchen, leading to missed room service orders and frustrated guests. By implementing the ONFIX ecosystem, we achieved a 40% reduction in ticket times. Waitstaff now use handheld devices that sync directly to the KDS, and room charges are posted to the PMS instantly without manual reconciliation." },
  { id: 2, name: "Urban Eats", role: "Michael Chen, Director of Ops", text: "The most stable POS we've ever used. The offline-first architecture saved us during a massive internet outage.", rating: 5, image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1000", fullStory: "Urban Eats operates in a high-density downtown area where internet drops are common. Our previous cloud-POS would lock up entirely during an outage. ONFIX's offline-first architecture means our servers never skip a beat. Last month, during a 4-hour ISP outage, we processed over 300 covers without a single glitch. When the internet returned, everything synced to the cloud seamlessly." },
  { id: 3, name: "Vue Resorts", role: "Elena Rodriguez, Owner", text: "Having room management and POS in the exact same system is a game changer. Folio billing is seamless.", rating: 5, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000", fullStory: "As a boutique resort, we want our guests to feel like royalty. Handing them separate bills for the spa, the restaurant, and their room was ruining that illusion. With ONFIX, a guest's profile follows them everywhere. The bartender knows their name, and every single charge is routed to a master folio with zero friction. It has increased our cross-outlet revenue by 22%." },
  { id: 4, name: "The District", role: "David Kim, Chef", text: "KDS is so intuitive. My line cooks learned it in 5 minutes. Highly recommended for fast-paced kitchens.", rating: 5, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=1000", fullStory: "A kitchen is chaos, and bad software makes it worse. The ONFIX Kitchen Display System is designed for speed. Color-coded routing, one-tap bumping, and clear modifiers mean we aren't yelling across the line anymore. It's so intuitive that I don't even have to train new hires on it—they just look at the screen and understand exactly what to do." },
  { id: 5, name: "Lakeside Diner", role: "Tommy Lee, Owner", text: "The inventory tracking is next level. We reduced our food waste by 15% in the first two months.", rating: 5, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000", fullStory: "Tracking inventory across multiple locations was a nightmare. ONFIX's centralized dashboard gives us real-time visibility into stock levels, automatically generates purchase orders, and alerts us when items are running low. It's a game changer." },
  { id: 6, name: "Neon Nights Club", role: "Jessica Alba, Manager", text: "Fastest POS I've ever used. Bartenders can close tabs in seconds, keeping the lines moving.", rating: 5, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1000", fullStory: "In a busy nightclub, speed is everything. The ONFIX POS is lightning fast. With features like pre-authorized tabs and one-tap reordering, our bartenders are processing 30% more drinks per hour." },
];

export async function getReviews(): Promise<ReviewVM[]> {
  try {
    const p = await payload();
    const res = await p.find({ collection: "reviews", sort: "order", limit: 100, depth: 1 });
    if (!res.docs.length) return DEFAULT_REVIEWS;
    return res.docs.map((d) => {
      const doc = d as Record<string, unknown>;
      return {
        id: doc.id as string | number,
        name: String(doc.name ?? ""),
        role: String(doc.role ?? ""),
        text: String(doc.quote ?? ""),
        rating: typeof doc.rating === "number" ? doc.rating : 5,
        image: uploadUrl(doc.photo) ?? String(doc.imageUrl ?? ""),
        fullStory: String(doc.fullStory ?? ""),
      };
    });
  } catch {
    return DEFAULT_REVIEWS;
  }
}

// ─────────────────────────── Partners ──────────────────────────

export interface PartnerVM {
  id: string | number;
  name: string;
  category: string;
  desc: string;
  icon: string;
  logo?: string;
  url?: string;
}

const DEFAULT_PARTNERS: PartnerVM[] = [
  { id: 1, icon: "CreditCard", name: "Stripe", category: "Payments", desc: "Seamless payment processing and reconciliation." },
  { id: 2, icon: "Hotel", name: "Opera PMS", category: "Property Management", desc: "Two-way sync for guest folios and room charges." },
  { id: 3, icon: "PieChart", name: "QuickBooks", category: "Accounting", desc: "Automated daily sales journals and inventory COGS." },
  { id: 4, icon: "Box", name: "MarketMan", category: "Inventory", desc: "Deep API sync for advanced recipe costing." },
  { id: 5, icon: "CreditCard", name: "Square", category: "Payments", desc: "Alternative payment gateway routing." },
  { id: 6, icon: "Hotel", name: "Mews", category: "Property Management", desc: "Next-gen API-first hotel management sync." },
];

export async function getPartners(): Promise<PartnerVM[]> {
  try {
    const p = await payload();
    const res = await p.find({ collection: "partners", sort: "order", limit: 100, depth: 1 });
    if (!res.docs.length) return DEFAULT_PARTNERS;
    return res.docs.map((d) => {
      const doc = d as Record<string, unknown>;
      return {
        id: doc.id as string | number,
        name: String(doc.name ?? ""),
        category: String(doc.category ?? ""),
        desc: String(doc.description ?? ""),
        icon: String(doc.icon ?? "Box"),
        logo: uploadUrl(doc.logo),
        url: typeof doc.url === "string" ? doc.url : undefined,
      };
    });
  } catch {
    return DEFAULT_PARTNERS;
  }
}

// ─────────────────────────── Press kit ─────────────────────────

export interface PressKitItemVM {
  id: string | number;
  title: string;
  type: string;
  fileUrl?: string;
}

const DEFAULT_PRESS_KIT: PressKitItemVM[] = [
  { id: 1, title: "Brand Guidelines", type: "PDF Document" },
  { id: 2, title: "Logo Assets", type: "ZIP (SVG, PNG)" },
  { id: 3, title: "Product Screenshots", type: "ZIP (High-Res)" },
  { id: 4, title: "Executive Headshots", type: "ZIP (High-Res)" },
  { id: 5, title: "Press Release: Series B", type: "PDF Document" },
  { id: 6, title: "Company Fact Sheet", type: "PDF Document" },
];

export async function getPressKit(): Promise<PressKitItemVM[]> {
  try {
    const p = await payload();
    const res = await p.find({ collection: "press-kit", sort: "order", limit: 100, depth: 1 });
    if (!res.docs.length) return DEFAULT_PRESS_KIT;
    return res.docs.map((d) => {
      const doc = d as Record<string, unknown>;
      return {
        id: doc.id as string | number,
        title: String(doc.title ?? ""),
        type: String(doc.assetType ?? ""),
        fileUrl: uploadUrl(doc.file),
      };
    });
  } catch {
    return DEFAULT_PRESS_KIT;
  }
}

// ─────────────────────────── Guides ────────────────────────────

export type GuideCategoryKey =
  | "getting-started"
  | "pos-operations"
  | "automations"
  | "developer-api";

export interface GuideVM {
  id: string | number;
  title: string;
  slug: string;
  category: GuideCategoryKey;
  excerpt: string;
  popular: boolean;
  body?: unknown; // Lexical SerializedEditorState, rendered on the detail page
}

/** Sidebar presentation: icon key + fallback count when CMS has no guides. */
export const GUIDE_CATEGORIES: {
  key: GuideCategoryKey;
  title: string;
  icon: string;
  fallbackCount: string;
}[] = [
  { key: "getting-started", title: "Getting Started", icon: "BookOpen", fallbackCount: "12 articles" },
  { key: "pos-operations", title: "POS Operations", icon: "Terminal", fallbackCount: "24 articles" },
  { key: "automations", title: "Automations", icon: "Zap", fallbackCount: "8 articles" },
  { key: "developer-api", title: "Developer API", icon: "Code", fallbackCount: "Documentation" },
];

const DEFAULT_GUIDES: GuideVM[] = [
  { id: 1, title: "Setting up your first floor plan", slug: "setting-up-your-first-floor-plan", category: "getting-started", excerpt: "Lay out tables, sections, and seats to match your venue.", popular: true },
  { id: 2, title: "Configuring complex happy hour modifiers", slug: "configuring-happy-hour-modifiers", category: "pos-operations", excerpt: "Time-boxed pricing rules and stacked modifiers, done right.", popular: true },
  { id: 3, title: "Syncing room charges to Opera PMS", slug: "syncing-room-charges-to-opera-pms", category: "automations", excerpt: "Post restaurant and bar charges straight to the guest folio.", popular: true },
  { id: 4, title: "Understanding ingredient batch depletion", slug: "understanding-ingredient-batch-depletion", category: "automations", excerpt: "How recipe-based stock deduction and FIFO batches work.", popular: true },
];

export async function getGuides(): Promise<GuideVM[]> {
  try {
    const p = await payload();
    const res = await p.find({ collection: "guides", sort: "order", limit: 200, depth: 0 });
    if (!res.docs.length) return DEFAULT_GUIDES;
    return res.docs.map(mapGuide);
  } catch {
    return DEFAULT_GUIDES;
  }
}

export async function getGuideBySlug(slug: string): Promise<GuideVM | null> {
  try {
    const p = await payload();
    const res = await p.find({
      collection: "guides",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    if (res.docs.length) return mapGuide(res.docs[0]);
  } catch {
    // fall through to defaults
  }
  return DEFAULT_GUIDES.find((g) => g.slug === slug) ?? null;
}

function mapGuide(d: unknown): GuideVM {
  const doc = d as Record<string, unknown>;
  return {
    id: doc.id as string | number,
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    category: (doc.category as GuideCategoryKey) ?? "getting-started",
    excerpt: String(doc.excerpt ?? ""),
    popular: Boolean(doc.popular),
    body: doc.body,
  };
}

// ─────────────────────────── System modules ────────────────────

export interface SystemModuleVM {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  workflow: string;
}

const DEFAULT_SYSTEM_MODULES: SystemModuleVM[] = [
  { id: "pos", title: "Core POS Engine", description: "Lightning-fast, intuitive point of sale designed for high-volume environments.", benefits: ["Offline-first architecture", "Split billing & complex tabs", "Customizable floor plans"], workflow: "Orders are punched in under 3 seconds, instantly routed to the kitchen, and synced to cloud reporting." },
  { id: "qr", title: "QR Ordering & Payments", description: "Empower guests to order and pay from their smartphones.", benefits: ["Higher ticket sizes", "Faster table turnover", "Zero hardware costs"], workflow: "Guest scans QR -> Browse interactive menu -> Orders sent to Kitchen Display System -> Pays via phone." },
  { id: "inventory", title: "Smart Inventory & Recipes", description: "Real-time stock depletion based on recipe configurations.", benefits: ["Automated low-stock alerts", "Waste tracking", "Multi-warehouse support"], workflow: "Sell an item -> Ingredients auto-deduct -> Reorder alerts triggered when stock hits par level." },
  { id: "rooms", title: "Hotel Room Management", description: "Complete PMS seamlessly connected to your restaurant and bars.", benefits: ["Drag-and-drop calendar", "Channel manager integration", "Post restaurant charges to room"], workflow: "Guest checks in -> Orders dinner to room -> Charges sync to final folio at checkout." },
  { id: "kds", title: "Kitchen Command Center", description: "Color-coded, real-time Kitchen Display System that eliminates paper tickets and brings order to the chaos.", benefits: ["Multi-section routing (Hot Kitchen, Bar, Pastry)", "One-tap order bumping & status tracking", "Waiter notification & task claiming"], workflow: "Order enters POS → Routes to correct kitchen section → Cook prepares & bumps → Waiter notified → Guest served." },
  { id: "staff", title: "People & Workforce", description: "Complete HR toolkit from shift scheduling to salary processing, purpose-built for hospitality teams.", benefits: ["Visual roster with reusable shift templates", "Leave request & approval workflows", "Automated salary & deduction calculations"], workflow: "Create shift template → Assign staff to weekly roster → Track attendance → Process payroll → Generate pay records." },
];

// ─────────────────────────── Globals: Site settings ───────────

export interface SiteSettingsVM {
  tagline: string;
  copyrightName: string;
  social: { linkedin: string; twitter: string; instagram: string };
  contact: { address: string; phone: string; email: string };
}

const DEFAULT_SITE_SETTINGS: SiteSettingsVM = {
  tagline:
    "The premium All-in-One Hospitality ERP System. Scale your restaurant, manage your hotel, and streamline operations with enterprise-grade reliability.",
  copyrightName: "ONFIX POS",
  social: { linkedin: "#", twitter: "#", instagram: "#" },
  contact: {
    address: "123 Innovation Drive,\nTech District, CA 90210",
    phone: "+1 (800) 123-4567",
    email: "hello@onfixpos.com",
  },
};

export async function getSiteSettings(): Promise<SiteSettingsVM> {
  try {
    const p = await payload();
    const g = (await p.findGlobal({ slug: "site-settings", depth: 0 })) as Record<string, unknown>;
    const social = (g.social ?? {}) as Record<string, unknown>;
    const contact = (g.contact ?? {}) as Record<string, unknown>;
    return {
      tagline: str(g.tagline, DEFAULT_SITE_SETTINGS.tagline),
      copyrightName: str(g.copyrightName, DEFAULT_SITE_SETTINGS.copyrightName),
      social: {
        linkedin: str(social.linkedin, DEFAULT_SITE_SETTINGS.social.linkedin),
        twitter: str(social.twitter, DEFAULT_SITE_SETTINGS.social.twitter),
        instagram: str(social.instagram, DEFAULT_SITE_SETTINGS.social.instagram),
      },
      contact: {
        address: str(contact.address, DEFAULT_SITE_SETTINGS.contact.address),
        phone: str(contact.phone, DEFAULT_SITE_SETTINGS.contact.phone),
        email: str(contact.email, DEFAULT_SITE_SETTINGS.contact.email),
      },
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

// ─────────────────────────── Globals: Home content ────────────

export interface RoiConfigVM {
  defaultTables: number;
  defaultTicketSize: number;
  defaultTurns: number;
  ticketUpliftPct: number;
  turnsUpliftPct: number;
  minutesSavedPerTurn: number;
  wasteReductionPct: number;
}

export interface HomeContentVM {
  hero: {
    headingLine1: string;
    headingHighlight: string;
    subheading: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  finalCta: { heading: string; subheading: string; buttonLabel: string };
  roi: RoiConfigVM;
}

const DEFAULT_HOME_CONTENT: HomeContentVM = {
  hero: {
    headingLine1: "Operate with",
    headingHighlight: "absolute clarity.",
    subheading:
      "The definitive ERP infrastructure for high-performance hospitality. Seamlessly synchronize POS, inventory, payroll, and room management in real-time.",
    primaryCtaLabel: "Deploy Now",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "See How It Works",
    secondaryCtaHref: "/media",
  },
  finalCta: {
    heading: "Don't let legacy software hold you back.",
    subheading:
      "Join the new standard of hospitality operations. Book a personalized architectural review of your business today.",
    buttonLabel: "Start Your Journey",
  },
  roi: {
    defaultTables: 25,
    defaultTicketSize: 45,
    defaultTurns: 3,
    ticketUpliftPct: 15,
    turnsUpliftPct: 20,
    minutesSavedPerTurn: 10,
    wasteReductionPct: 5,
  },
};

export async function getHomeContent(): Promise<HomeContentVM> {
  try {
    const p = await payload();
    const g = (await p.findGlobal({ slug: "home-content", depth: 0 })) as Record<string, unknown>;
    const hero = (g.hero ?? {}) as Record<string, unknown>;
    const finalCta = (g.finalCta ?? {}) as Record<string, unknown>;
    const roi = (g.roi ?? {}) as Record<string, unknown>;
    const d = DEFAULT_HOME_CONTENT;
    return {
      hero: {
        headingLine1: str(hero.headingLine1, d.hero.headingLine1),
        headingHighlight: str(hero.headingHighlight, d.hero.headingHighlight),
        subheading: str(hero.subheading, d.hero.subheading),
        primaryCtaLabel: str(hero.primaryCtaLabel, d.hero.primaryCtaLabel),
        primaryCtaHref: str(hero.primaryCtaHref, d.hero.primaryCtaHref),
        secondaryCtaLabel: str(hero.secondaryCtaLabel, d.hero.secondaryCtaLabel),
        secondaryCtaHref: str(hero.secondaryCtaHref, d.hero.secondaryCtaHref),
      },
      finalCta: {
        heading: str(finalCta.heading, d.finalCta.heading),
        subheading: str(finalCta.subheading, d.finalCta.subheading),
        buttonLabel: str(finalCta.buttonLabel, d.finalCta.buttonLabel),
      },
      roi: {
        defaultTables: num(roi.defaultTables, d.roi.defaultTables),
        defaultTicketSize: num(roi.defaultTicketSize, d.roi.defaultTicketSize),
        defaultTurns: num(roi.defaultTurns, d.roi.defaultTurns),
        ticketUpliftPct: num(roi.ticketUpliftPct, d.roi.ticketUpliftPct),
        turnsUpliftPct: num(roi.turnsUpliftPct, d.roi.turnsUpliftPct),
        minutesSavedPerTurn: num(roi.minutesSavedPerTurn, d.roi.minutesSavedPerTurn),
        wasteReductionPct: num(roi.wasteReductionPct, d.roi.wasteReductionPct),
      },
    };
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
}

// ─────────────────────────── Globals: About content ───────────

export interface AboutValueVM {
  icon: string;
  title: string;
  desc: string;
}

export interface AboutContentVM {
  hero: { headingLine1: string; headingHighlight: string; subheading: string };
  bigQuote: string;
  origin: { badge: string; heading: string; paragraph: string; quote: string; closing: string };
  values: AboutValueVM[];
}

const DEFAULT_ABOUT_CONTENT: AboutContentVM = {
  hero: {
    headingLine1: "Built by operators.",
    headingHighlight: "Engineered for scale.",
    subheading:
      "We built ONFIX to solve the fragmented nightmare of hospitality software. One system to rule them all.",
  },
  bigQuote:
    "Hospitality deserves software as premium as the guest experience itself.",
  origin: {
    badge: "Our Origin",
    heading: "Born from Frustration",
    paragraph:
      "Years ago, our founders managed a high-volume hotel and restaurant chain. They were using 7 different software platforms: one for the POS, another for inventory, a separate PMS for rooms, and a completely different tool for payroll.",
    quote: "None of them talked to each other. Reporting took days. Mistakes were constant.",
    closing:
      "So we built ONFIX. An uncompromising, enterprise-grade ERP that handles the entire ecosystem natively in real-time.",
  },
  values: [
    { icon: "Target", title: "Absolute Precision", desc: "In hospitality, a single dropped ticket means a bad review. We engineer for 99.999% uptime and zero-latency operations." },
    { icon: "Lightbulb", title: "Continuous Innovation", desc: "We don't just follow trends. We push the boundaries of what a modern POS and PMS can achieve through AI and automation." },
    { icon: "Heart", title: "Customer Obsession", desc: "Our support team works 24/7 because your business never sleeps. Your success is our ultimate metric." },
    { icon: "Shield", title: "Uncompromising Security", desc: "Bank-grade encryption and strict access controls protect your financial data and guest privacy at all times." },
  ],
};

export async function getAboutContent(): Promise<AboutContentVM> {
  try {
    const p = await payload();
    const g = (await p.findGlobal({ slug: "about-content", depth: 0 })) as Record<string, unknown>;
    const hero = (g.hero ?? {}) as Record<string, unknown>;
    const origin = (g.origin ?? {}) as Record<string, unknown>;
    const d = DEFAULT_ABOUT_CONTENT;
    const values = Array.isArray(g.values)
      ? (g.values as Array<Record<string, unknown>>).map((v) => ({
          icon: str(v.icon, "Target"),
          title: str(v.title, ""),
          desc: str(v.desc, ""),
        })).filter((v) => v.title)
      : [];
    return {
      hero: {
        headingLine1: str(hero.headingLine1, d.hero.headingLine1),
        headingHighlight: str(hero.headingHighlight, d.hero.headingHighlight),
        subheading: str(hero.subheading, d.hero.subheading),
      },
      bigQuote: str(g.bigQuote, d.bigQuote),
      origin: {
        badge: str(origin.badge, d.origin.badge),
        heading: str(origin.heading, d.origin.heading),
        paragraph: str(origin.paragraph, d.origin.paragraph),
        quote: str(origin.quote, d.origin.quote),
        closing: str(origin.closing, d.origin.closing),
      },
      values: values.length ? values : d.values,
    };
  } catch {
    return DEFAULT_ABOUT_CONTENT;
  }
}

// small coercion helpers for global fields
function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.length ? v : fallback;
}
function num(v: unknown, fallback: number): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

export async function getSystemModules(): Promise<SystemModuleVM[]> {
  try {
    const p = await payload();
    const res = await p.find({ collection: "system-modules", sort: "order", limit: 100, depth: 0 });
    if (!res.docs.length) return DEFAULT_SYSTEM_MODULES;
    return res.docs.map((d) => {
      const doc = d as Record<string, unknown>;
      const benefits = Array.isArray(doc.benefits)
        ? (doc.benefits as Array<Record<string, unknown>>)
            .map((b) => String(b?.benefit ?? ""))
            .filter(Boolean)
        : [];
      return {
        id: String(doc.moduleId ?? doc.id ?? ""),
        title: String(doc.title ?? ""),
        description: String(doc.description ?? ""),
        benefits,
        workflow: String(doc.workflow ?? ""),
      };
    });
  } catch {
    return DEFAULT_SYSTEM_MODULES;
  }
}
