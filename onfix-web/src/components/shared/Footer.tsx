import Link from "next/link";
import { Mail, MapPin, Phone, Globe } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src="/logos/Onfix%20Oval%20Logo.png" alt="ONFIX POS" className="h-8 w-auto object-contain dark:hidden" />
              <img src="/logos/Onfix%20Oval%20Logo%20Alt.png" alt="ONFIX POS" className="h-8 w-auto object-contain hidden dark:block" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The premium All-in-One Hospitality ERP System. Scale your restaurant, manage your hotel, and streamline operations with enterprise-grade reliability.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">
                LinkedIn
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">
                Twitter
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">
                Instagram
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/system" className="text-sm text-muted-foreground hover:text-primary transition-colors">POS System</Link></li>
              <li><Link href="/system" className="text-sm text-muted-foreground hover:text-primary transition-colors">QR Ordering</Link></li>
              <li><Link href="/system" className="text-sm text-muted-foreground hover:text-primary transition-colors">Inventory</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/partners" className="text-sm text-muted-foreground hover:text-primary transition-colors">Partners</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">Customer Reviews</Link></li>
              <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-primary transition-colors">Guides & Tutorials</Link></li>
              <li><Link href="/media" className="text-sm text-muted-foreground hover:text-primary transition-colors">Media Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">123 Innovation Drive,<br/>Tech District, CA 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">hello@onfixpos.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} ONFIX POS. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
