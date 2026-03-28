import Link from "next/link";

const columns = {
  Platform: [
    "AI Agent Architecture",
    "Entity Intelligence",
    "Screening Workbench",
    "Regulatory Engine",
    "Graph Explorer",
    "Governance Center",
  ],
  Solutions: [
    "Banking & Capital Markets",
    "Asset Management",
    "Fund Administration",
    "Wealth Management",
    "Fintechs & Neobanks",
  ],
  Resources: [
    "Documentation",
    "API Reference",
    "Case Studies",
    "Blog",
    "Changelog",
  ],
  Company: [
    "About",
    "Careers",
    "Partners",
    "Contact",
    "Newsroom",
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a]">
      <div className="mx-auto max-w-300 px-6">
        {/* ─── Main grid ─── */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 py-16 lg:py-20 border-b border-[#1a1a1a]">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded bg-white flex items-center justify-center">
                <span className="text-[9px] font-black text-[#0a0a0a] leading-none">Ag</span>
              </div>
              <span className="text-[14px] font-semibold text-white tracking-tight">
                Agentic
              </span>
            </Link>

            <p className="mt-5 text-[13px] text-[#555] leading-[1.7] max-w-xs">
              The AI-native Client Lifecycle Management platform.
              16 autonomous agents. 120+ jurisdictions.
            </p>

            {/* Compliance badges */}
            <div className="mt-6 flex flex-wrap gap-1">
              {["SOC 2", "ISO 27001", "GDPR", "EU AI Act", "CCPA"].map((c) => (
                <span
                  key={c}
                  className="text-[8px] font-bold text-[#444] uppercase tracking-[0.15em] border border-[#222] rounded px-2 py-1"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(columns).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((label) => (
                    <li key={label}>
                      <Link
                        href="#"
                        className="text-[12px] text-[#666] hover:text-white transition-colors duration-300"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#333]">
              &copy; {new Date().getFullYear()} Agentic KYC &amp; CLM Pro
            </span>
            <span className="text-[#222]">·</span>
            <Link href="#" className="text-[11px] text-[#444] hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-[11px] text-[#444] hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-[11px] text-[#444] hover:text-white transition-colors">Security</Link>
            <Link href="#" className="text-[11px] text-[#444] hover:text-white transition-colors">DPA</Link>
          </div>
          <div className="flex items-center gap-5">
            {["LinkedIn", "Twitter", "GitHub"].map((s) => (
              <Link
                key={s}
                href="#"
                className="text-[11px] font-medium text-[#444] hover:text-white transition-colors duration-300"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
