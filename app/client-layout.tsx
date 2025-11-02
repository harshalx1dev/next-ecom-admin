"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoader } from "@/contexts/loader-context";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setLoading } = useLoader();

  useEffect(() => {
    let timeout: number | undefined | NodeJS.Timeout = undefined;
    
    timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pathname, setLoading]);

  return <>{children}</>;
}
