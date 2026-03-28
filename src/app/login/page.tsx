"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, Shield, Lock } from "lucide-react";

const agentPulse = [
  "Screening Agent cleared 812 alerts",
  "Entity Agent mapped 47 ownership structures",
  "Document Agent verified 142 documents",
  "Risk Agent scored 56 entities",
  "Regulatory Agent monitored 127 jurisdictions",
  "Investigation Agent drafted 3 SAR narratives",
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveAgent((p) => (p + 1) % agentPulse.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* ─── Left panel — brand + ambient data ─── */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top glow */}
        <div className="absolute -top-40 -right-40 w-100 h-100 bg-white/[0.02] rounded-full blur-[100px]" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-white flex items-center justify-center">
              <span className="text-[10px] font-black text-[#0a0a0a] leading-none">Ag</span>
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight">Agentic</span>
          </Link>
        </div>

        {/* Center — headline + live feed */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg">
          <h1 className="text-[clamp(2rem,3.5vw,3rem)] font-extrabold text-white tracking-[-0.04em] leading-[1.05]">
            Your agents are
            <br />
            already working.
          </h1>
          <p className="mt-4 text-[15px] text-[#555] leading-[1.7]">
            While you were away, 16 AI agents continued screening, scoring,
            verifying, and monitoring your entire portfolio.
          </p>

          {/* Live agent ticker */}
          <div className="mt-10 border-t border-[#1a1a1a] pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-[#444] uppercase tracking-[0.25em]">
                Live — while you were away
              </span>
            </div>

            <div className="space-y-0">
              {agentPulse.map((text, i) => (
                <div
                  key={text}
                  className="py-2.5 border-b border-[#141414] transition-all duration-700"
                  style={{ opacity: activeAgent === i ? 1 : 0.3 }}
                >
                  <p className="text-[13px] text-[#666] font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="relative z-10 grid grid-cols-3 gap-px bg-[#1a1a1a] rounded-lg overflow-hidden">
          {[
            { v: "2,847", l: "Actions today" },
            { v: "96.2%", l: "Accuracy" },
            { v: "23", l: "Need review" },
          ].map((s) => (
            <div key={s.l} className="bg-[#0a0a0a] p-4">
              <div className="text-[18px] font-extrabold text-white tabular-nums leading-none">{s.v}</div>
              <div className="text-[9px] font-semibold text-[#444] uppercase tracking-[0.15em] mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right panel — login form ─── */}
      <div className="flex-1 flex flex-col bg-[#fafafa]">
        {/* Mobile logo */}
        <div className="lg:hidden p-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-[#0a0a0a] flex items-center justify-center">
              <span className="text-[10px] font-black text-white leading-none">Ag</span>
            </div>
            <span className="text-[15px] font-semibold text-[#0a0a0a] tracking-tight">Agentic</span>
          </Link>
        </div>

        {/* Form container — vertically centered */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-[22px] font-extrabold text-[#0a0a0a] tracking-tight">
                Sign in
              </h2>
              <p className="mt-1.5 text-[13px] text-[#888]">
                Access your compliance command center.
              </p>
            </div>

            {/* SSO button */}
            <Button
              variant="outline"
              className="w-full h-11 text-[13px] font-semibold border-[#ddd] bg-white hover:bg-[#f5f5f5] text-[#0a0a0a] rounded-lg mb-4 gap-2.5 justify-center"
            >
              <svg className="h-4 w-4" viewBox="0 0 21 21" fill="none">
                <path d="M10.5 0C4.7 0 0 4.7 0 10.5S4.7 21 10.5 21 21 16.3 21 10.5 16.3 0 10.5 0z" fill="#00A4EF" fillOpacity="0.1"/>
                <path d="M1 1h9v9H1z" fill="#F25022"/>
                <path d="M11 1h9v9h-9z" fill="#7FBA00"/>
                <path d="M1 11h9v9H1z" fill="#00A4EF"/>
                <path d="M11 11h9v9h-9z" fill="#FFB900"/>
              </svg>
              Continue with Microsoft
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 text-[13px] font-semibold border-[#ddd] bg-white hover:bg-[#f5f5f5] text-[#0a0a0a] rounded-lg mb-6 gap-2.5 justify-center"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-[#e5e5e5]" />
              <span className="text-[11px] font-medium text-[#bbb] uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-[#e5e5e5]" />
            </div>

            {/* Email / Password form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "/dashboard";
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-[12px] font-semibold text-[#555] mb-1.5">
                  Work email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 text-[13px] bg-white border-[#ddd] rounded-lg placeholder:text-[#ccc] focus-visible:ring-[#0a0a0a] focus-visible:ring-1 focus-visible:border-[#0a0a0a]"
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-[12px] font-semibold text-[#555]">
                    Password
                  </label>
                  <Link href="#" className="text-[11px] font-medium text-[#999] hover:text-[#0a0a0a] transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    className="h-11 text-[13px] bg-white border-[#ddd] rounded-lg pr-10 placeholder:text-[#ccc] focus-visible:ring-[#0a0a0a] focus-visible:ring-1 focus-visible:border-[#0a0a0a]"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#555] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-[13px] font-semibold bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white rounded-lg gap-2 mt-2"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Security badges */}
            <div className="mt-8 pt-6 border-t border-[#eee]">
              <div className="flex items-center justify-center gap-4">
                {[
                  { icon: Shield, label: "SOC 2 Type II" },
                  { icon: Lock, label: "256-bit encryption" },
                  { icon: Shield, label: "GDPR compliant" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-1.5">
                    <badge.icon className="h-3 w-3 text-[#ccc]" />
                    <span className="text-[10px] font-medium text-[#bbb]">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-6 text-center">
              <p className="text-[12px] text-[#bbb]">
                Don&apos;t have an account?{" "}
                <Link href="/" className="font-semibold text-[#0a0a0a] hover:underline">
                  Request access
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#eee]">
          <span className="text-[10px] text-[#ccc]">&copy; {new Date().getFullYear()} Agentic KYC & CLM Pro</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-[10px] text-[#bbb] hover:text-[#555] transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] text-[#bbb] hover:text-[#555] transition-colors">Terms</Link>
            <Link href="#" className="text-[10px] text-[#bbb] hover:text-[#555] transition-colors">Status</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
