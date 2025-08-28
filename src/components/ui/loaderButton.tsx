import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

type LoadingButtonProps = {
  executeAction: () => Promise<boolean> | boolean;
  idleText: string;
  loadingText: string;
  successText: string;
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  timeoutMs?: number; // optional
};

export default function LoadingButton({
  executeAction,
  idleText,
  loadingText,
  successText,
  variant = "default",
  className,
  disabled,
  timeoutMs = 15000,
}: LoadingButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer); 
    };
  }, [timer]);

  const startAction = async () => {
    if (status === "loading") return;

    setStatus("loading");

    const timeoutId = setTimeout(() => {
      setStatus("idle"); // safety reset
    }, timeoutMs);

    setTimer(timeoutId);

    try {
      console.log("Executing action...");
      const result = await executeAction();
      if (result) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const getLabel = () => {
    if (status === "loading") return loadingText;
    if (status === "success") return successText;
    return idleText;
  };

  return (
    <Button
      variant={variant}
      onClick={startAction}
      className={`${className} flex items-center justify-center`}
      disabled={status === "loading" || disabled || status === "success"}
    >
      {status === "loading" && <Loader2 className="animate-spin mr-2" />}
      {getLabel()}
    </Button>
  );
}
