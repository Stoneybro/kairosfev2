import { useState, useEffect } from "react"
import { Button } from "./button"
import { Loader2 } from "lucide-react"

type Props = {
  executeAction: () => Promise<boolean> | boolean
  idleText: string
  loadingText: string
  successText: string
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost"
  className?: string
  disabled?: boolean
  timeoutMs?: number
}

export default function LoaderButton({
  executeAction,
  idleText,
  loadingText,
  successText,
  variant = "default",
  className,
  disabled,
  timeoutMs = 30000,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => { if (timer) clearTimeout(timer) }
  }, [timer])

  const startAction = async () => {
    if (status === "loading") return
    setStatus("loading")

    const timeoutId = setTimeout(() => setStatus("idle"), timeoutMs)
    setTimer(timeoutId)

    try {
      const result = await executeAction()
      if (result) {
        setStatus("success")
        setTimeout(() => setStatus("idle"), 10000)
      } else setStatus("idle")
    } catch {
      setStatus("idle")
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const label =
    status === "loading" ? loadingText :
    status === "success" ? successText :
    idleText

  return (
    <Button
      type="button"
      variant={variant}
      onClick={startAction}
      className={`${className} flex items-center justify-center`}
      disabled={status === "loading" || disabled || status === "success"}
    >
      {status === "loading" && <Loader2 className="animate-spin mr-2" />}
      {label}
    </Button>
  )
}
