"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Growth",
    price: "$2,500",
    period: "/mo",
    desc: "Mid-market banks and fintechs.",
    limit: "Up to 5,000 entities",
    features: [
      "6 core AI agents",
      "Up to 25 users",
      "50 jurisdictions",
      "OFAC, EU, UN screening",
      "CDD & EDD workflows",
      "API access",
      "SOC 2 Type II",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Tier 1/2 banks and asset managers.",
    limit: "Unlimited entities",
    features: [
      "All 16 AI agents",
      "Unlimited users",
      "120+ jurisdictions",
      "All screening lists + adverse media",
      "Workflow orchestrator",
      "Custom agent training",
      "SSO / SAML / SCIM",
      "Private cloud or on-premise",
      "99.99% uptime SLA",
      "Regulatory exam support",
      "White-label portal",
    ],
    cta: "Contact sales",
    highlighted: true,
  },
  {
    name: "Sovereign",
    price: "Custom",
    period: "",
    desc: "Central banks and regulators.",
    limit: "Dedicated infrastructure",
    features: [
      "Everything in Enterprise",
      "Air-gapped deployment",
      "Custom model hosting",
      "Full data sovereignty",
      "Direct engineering support",
      "Custom regulatory rules",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-300 px-6">
        <div className="mb-16">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.25em] mb-4">
            Pricing
          </p>
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-[#0a0a0a] tracking-[-0.02em] leading-[1.15] max-w-md">
            Replace five point solutions
            <br />
            <span className="text-[#bbb]">with one platform.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-px bg-[#e5e5e5] rounded-lg overflow-hidden">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col p-7 lg:p-8 ${plan.highlighted ? "bg-[#fafafa]" : "bg-white"}`}
            >
              {plan.highlighted && (
                <span className="inline-flex self-start text-[9px] font-bold uppercase tracking-[0.2em] text-white bg-[#0a0a0a] px-2.5 py-1 rounded mb-4">
                  Most popular
                </span>
              )}

              <h3 className="text-[18px] font-bold text-[#0a0a0a]">{plan.name}</h3>
              <p className="text-[12px] text-[#999] mt-1">{plan.desc}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-[28px] font-extrabold text-[#0a0a0a] tracking-tight tabular-nums">
                  {plan.price}
                </span>
                {plan.period && <span className="text-[13px] text-[#999]">{plan.period}</span>}
              </div>
              <p className="text-[11px] text-[#bbb] font-medium uppercase tracking-wider mt-1">{plan.limit}</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#555]">
                    <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#0a0a0a]" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/dashboard" className="mt-7">
                <Button
                  className={`w-full h-10 text-[13px] font-semibold rounded-lg gap-2 ${
                    plan.highlighted
                      ? "bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white"
                      : "bg-white border border-[#ddd] text-[#0a0a0a] hover:bg-[#fafafa]"
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-[#bbb]">
          All plans include SOC 2 Type II · GDPR · EU AI Act conformity · 14-day free trial · Annual contracts save 20%
        </p>
      </div>
    </section>
  );
}
