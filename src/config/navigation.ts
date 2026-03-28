import {
  LayoutDashboard,
  Building2,
  Briefcase,
  ShieldCheck,
  ClipboardCheck,
  BookOpen,
  BarChart3,
  Settings,
  UserPlus,
  GitBranch,
  Activity,
  Workflow,
  ShieldAlert,
  CircleCheckBig,
  BrainCircuit,
  Users,
  Plug,
  Shield,
  Database,
  Bell,
  Palette,
  LayoutGrid,
  Radio,
  TrendingUp,
  Network,
  FlaskConical,
  Layers,
} from "lucide-react";
import type { NavItem } from "@/types";

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    label: "",
    items: [
      { title: "Home", href: "/dashboard", icon: LayoutDashboard },
      { title: "Approvals", href: "/approvals", icon: CircleCheckBig, badge: "23" },
    ],
  },
  {
    label: "COMPLIANCE",
    items: [
      { title: "Entities", href: "/entities", icon: Building2 },
      { title: "Cases", href: "/cases", icon: Briefcase },
      { title: "Screening", href: "/screening", icon: ShieldCheck },
      { title: "Monitoring", href: "/monitoring", icon: Activity },
      { title: "Onboarding", href: "/onboarding", icon: UserPlus },
      { title: "Reviews", href: "/reviews", icon: ClipboardCheck },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { title: "Graph Explorer", href: "/graph/explorer", icon: GitBranch },
      { title: "Regulations", href: "/regulations", icon: BookOpen },
      { title: "Governance", href: "/governance", icon: ShieldAlert },
      { title: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "PLATFORM",
    items: [
      { title: "Workflows", href: "/workflows", icon: Workflow },
      {
        title: "AI Agents",
        href: "/agents/catalog",
        icon: BrainCircuit,
        children: [
          { title: "Catalog", href: "/agents/catalog", icon: LayoutGrid },
          { title: "Live Monitor", href: "/agents/monitor", icon: Radio },
          { title: "Performance", href: "/agents/performance", icon: TrendingUp },
          { title: "Orchestration", href: "/agents/orchestration", icon: GitBranch },
          { title: "Sandbox", href: "/agents/sandbox", icon: FlaskConical },
          { title: "Versions", href: "/agents/versions", icon: Layers },
        ],
      },
      {
        title: "Settings",
        href: "/settings/users",
        icon: Settings,
        children: [
          { title: "Users & Teams", href: "/settings/users", icon: Users },
          { title: "Organization", href: "/settings/organization", icon: Building2 },
          { title: "Integrations", href: "/settings/integrations", icon: Plug },
          { title: "Audit", href: "/settings/audit", icon: Shield },
          { title: "Data & Privacy", href: "/settings/data", icon: Database },
          { title: "Notifications", href: "/settings/notifications", icon: Bell },
          { title: "Branding", href: "/settings/branding", icon: Palette },
        ],
      },
    ],
  },
];

export const bottomNavItems: NavItem[] = [];

export const mainNavItems: NavItem[] = [
  ...navSections.flatMap((s) => s.items),
];
