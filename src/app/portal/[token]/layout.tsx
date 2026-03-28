import { Providers } from "@/components/providers";
import "@/app/globals.css";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
