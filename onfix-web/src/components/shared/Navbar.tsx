"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "System", href: "/system" },
    { name: "Pricing", href: "/pricing" },
    { name: "Reviews", href: "/reviews" },
    { name: "Media", href: "/media" },
    { name: "Guides", href: "/guides" },
    { name: "Partners", href: "/partners" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-background/70 backdrop-blur-2xl border-b border-border/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            {/* Real Logo integration */}
            <div className="relative h-10 w-auto overflow-hidden">
              <img src="/logos/Onfix%20Oval%20Logo.png" alt="ONFIX POS" className="h-10 w-auto object-contain dark:hidden transform group-hover:scale-105 transition-transform duration-500" />
              <img src="/logos/Onfix%20Oval%20Logo%20Alt.png" alt="ONFIX POS" className="h-10 w-auto object-contain hidden dark:block transform group-hover:scale-105 transition-transform duration-500" />
            </div>
          </Link>

          {/* Desktop Nav - "Dynamic Island" style floating pill when scrolled */}
          <nav className={`hidden md:flex items-center gap-1 transition-all duration-500 ${isScrolled ? 'bg-foreground/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-border/50' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-foreground/70 hover:text-foreground px-4 py-2 rounded-full hover:bg-foreground/5 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 relative z-10">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-semibold text-foreground/70 hover:text-foreground px-4 py-2 rounded-full hover:bg-foreground/5 transition-all"
            >
              Sign in
            </Link>
            <Link
              href="/pricing"
              className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-foreground px-6 font-semibold text-background transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-primary to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden relative z-10">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-[100] bg-background/95 backdrop-blur-3xl border-b border-border shadow-2xl p-6 md:hidden flex flex-col gap-5 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium px-4 py-2 hover:bg-muted rounded-md transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-base font-medium px-4 py-2 hover:bg-muted rounded-md transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-foreground text-background px-4 py-3 rounded-md text-center font-semibold mt-2"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
