"use client";

import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "admin" | "public";
}

type BadgeVariants = "destructive" | "secondary" | "default" | "outline";

const textMap: Record<ApiAlertProps["variant"], string> = {
  admin: "ADMIN",
  public: "PUBLIC",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeVariants> = {
  admin: "destructive",
  public: "secondary",
};

export const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {

  const copyLink = () => {
    navigator.clipboard.writeText(description);
    toast.success('Copied to clipboard!')
  }

  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button className="cursor-pointer" size={'icon'} variant={"outline"} onClick={copyLink}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
