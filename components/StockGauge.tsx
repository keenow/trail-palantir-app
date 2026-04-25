"use client"
import { cn } from "@/lib/utils"

interface StockGaugeProps {
  label: string
  qty: number | null
  initialQty: number
  unit?: string
}

export default function StockGauge({ label, qty, initialQty, unit = "박스" }: StockGaugeProps) {
  if (qty === null) return null

  const pct = Math.min(100, Math.max(0, (qty / initialQty) * 100))
  const color =
    qty === 0 ? "bg-red-500" :
    pct <= 10  ? "bg-red-400" :
    pct <= 30  ? "bg-yellow-400" :
                 "bg-green-400"

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className={cn("font-medium", qty === 0 ? "text-red-400" : "text-slate-200")}>
          {qty}{unit}
          {qty === 0 && " ⚠️"}
        </span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
