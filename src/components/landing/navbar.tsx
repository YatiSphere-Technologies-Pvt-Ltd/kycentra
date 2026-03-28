"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Platform", href: "#features" },
  { label: "Agents", href: "/platform/agents" },
  { label: "Pricing", href: "#pricing" },
  { label: "Company", href: "#company" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-14 max-w-300 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-6 w-6 rounded-[5px] bg-[#0a0a0a] flex items-center justify-center">
            <span className="text-[9px] font-black text-white leading-none">Ag</span>
          </div>
          <span className="text-[14px] font-semibold text-[#0a0a0a] tracking-[-0.02em]">
            Agentic
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 text-[13px] font-medium text-[#666] transition-colors hover:text-[#0a0a0a]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="h-8 px-3 text-[13px] font-medium text-[#666] hover:text-[#0a0a0a] hover:bg-transparent"
            >
              Log in
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="h-8 px-4 text-[13px] font-medium bg-[#0a0a0a] hover:bg-[#171717] text-white rounded-lg">
              Get started
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden h-8 w-8 flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#f0f0f0] px-6 pb-6 pt-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block py-2.5 text-[14px] font-medium text-[#666]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-[#f0f0f0]">
            <Link href="/dashboard"><Button variant="outline" className="w-full text-[13px]">Log in</Button></Link>
            <Link href="/dashboard"><Button className="w-full text-[13px] bg-[#0a0a0a] text-white">Get started</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}
