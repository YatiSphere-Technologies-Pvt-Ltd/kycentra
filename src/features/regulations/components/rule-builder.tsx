"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export function RuleBuilder() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("For all corporate clients in EU member states with annual turnover exceeding €50 million, require enhanced due diligence including source of funds documentation, beneficial ownership verification through two independent sources, and senior management approval before onboarding.");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Create New Rule</h3>
        <p className="text-xs text-muted-foreground">Define compliance requirements in plain English — AI translates to executable logic</p>
      </div>

      {/* Step 1: Describe */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1 space-y-4">
        <p className="text-sm font-semibold">Step 1: Describe Your Policy</p>
        <textarea
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-28"
          placeholder="Write your compliance requirement in plain English..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="text-[11px] text-muted-foreground space-y-0.5">
          <p>💡 Be specific about entity types, jurisdictions, and triggers</p>
          <p>💡 Include thresholds, conditions, and required documents</p>
        </div>
        <Button className="gap-1.5" onClick={() => setStep(2)}>
          <Sparkles className="h-3.5 w-3.5" />Generate Rule →
        </Button>
      </div>

      {/* Step 2: AI-generated rule */}
      {step >= 2 && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1 space-y-4">
          <div className="flex items-center gap-2">
            <AIIndicator size={14} />
            <p className="text-sm font-semibold">Step 2: AI-Generated Rule</p>
            <ConfidenceBadge value={92} />
          </div>

          <div className="rounded-lg border border-border p-4" style={{ borderLeft: "3px solid var(--nx-violet-400)" }}>
            <p className="text-xs font-mono text-muted-foreground mb-2">Rule ID: EDD-EU-CORP-HIGH-001</p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground">WHEN:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5 ml-2">
                  <li>Client is being onboarded OR undergoing periodic review</li>
                  <li>Entity type = Legal Entity (Corporate)</li>
                  <li>Jurisdiction ∈ EU Member States (27 countries)</li>
                  <li>Annual turnover &gt; €50,000,000</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">THEN REQUIRE:</p>
                <ul className="space-y-1 ml-2">
                  {["Due diligence level: EDD", "Source of Funds declaration + evidence", "UBO verification via 2 independent sources", "Senior Management sign-off", "Enhanced ongoing monitoring"].map((r) => (
                    <li key={r} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-nx-emerald-500 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">REGULATORY BASIS:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5 ml-2 text-xs">
                  <li>EU 6th AML Directive, Article 18(1)</li>
                  <li>EU Beneficial Ownership Directive 2018/843, Article 30</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI observations */}
          <div className="rounded-lg p-3 space-y-1.5" style={{ backgroundColor: "var(--nx-amber-50)", borderLeft: "3px solid var(--nx-amber-500)" }}>
            <p className="text-xs font-semibold">⚠ AI Observations:</p>
            <p className="text-xs text-muted-foreground">Your €50M threshold is stricter than the directive minimum. The directive applies to all high-risk relationships, not just those over €50M.</p>
            <p className="text-xs text-muted-foreground">2 independent UBO sources exceeds regulatory minimum of 1. This is conservative — document the rationale.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit Rule</Button>
            <Button variant="outline" size="sm" className="gap-1"><Sparkles className="h-3 w-3" />Refine with AI</Button>
            <Button size="sm" onClick={() => setStep(3)}>Run Simulation →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Test & Deploy */}
      {step >= 3 && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1 space-y-4">
          <p className="text-sm font-semibold">Step 3: Test & Deploy</p>

          <div className="space-y-2">
            {[
              { ok: true, text: "Rule syntax valid" },
              { ok: true, text: "No conflicts with existing rules" },
              { ok: true, text: "Regulatory citations verified" },
              { ok: false, text: "1,247 entities match this rule's conditions" },
              { ok: false, text: "892 entities at CDD would upgrade to EDD" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2 text-sm">
                {t.ok ? <CheckCircle2 className="h-4 w-4 text-nx-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-nx-amber-500" />}
                {t.text}
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-muted-foreground">Deploy Options:</p>
            {["Deploy immediately", "Deploy with 90-day transition", "Deploy as draft (requires approval)"].map((opt, i) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="deploy" defaultChecked={i === 2} className="accent-primary" />{opt}
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">Save as Draft</Button>
            <Button size="sm">Submit for Approval</Button>
          </div>
        </div>
      )}
    </div>
  );
}
