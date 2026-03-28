import { env } from "./env";

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: "Your AI compliance team. Always working. Always current.",
  url: "https://agentickyc.pro",
  links: {
    docs: "/docs",
    support: "/support",
  },
} as const;
