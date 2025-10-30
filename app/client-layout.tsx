"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoader } from "@/contexts/loader-context";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setLoading } = useLoader();

  useEffect(() => {
    // stop loader when the page finishes rendering
    setLoading(false);
  }, [pathname, setLoading]);

  return <>{children}</>;
}
