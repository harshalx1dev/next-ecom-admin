"use client";

import useRouter from "@/hooks/use-router";
import { useEffect } from "react";

export default function WaitPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
