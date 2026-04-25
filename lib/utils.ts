import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { RiskLevel } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskLevel(qty: number | null, initialQty: number): RiskLevel {
  if (qty === null) return "unknown"
  if (qty === 0) return "critical"
  const ratio = qty / initialQty
  if (ratio <= 0.1) return "critical"
  if (ratio <= 0.3) return "warning"
  return "normal"
}

export function riskColor(level: RiskLevel) {
  switch (level) {
    case "critical": return "text-red-500"
    case "warning":  return "text-yellow-500"
    case "normal":   return "text-green-500"
    default:         return "text-gray-400"
  }
}

export function riskBg(level: RiskLevel) {
  switch (level) {
    case "critical": return "bg-red-500"
    case "warning":  return "bg-yellow-500"
    case "normal":   return "bg-green-500"
    default:         return "bg-gray-400"
  }
}

export function riskBorder(level: RiskLevel) {
  switch (level) {
    case "critical": return "border-red-500"
    case "warning":  return "border-yellow-500"
    case "normal":   return "border-green-500"
    default:         return "border-gray-600"
  }
}

export function formatTime(iso: string | null) {
  if (!iso) return "-"
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Seoul"
  })
}

export function formatKST(iso: string | null) {
  if (!iso) return "-"
  return new Date(iso).toLocaleString("ko-KR", {
    month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
    hour12: false, timeZone: "Asia/Seoul"
  })
}
