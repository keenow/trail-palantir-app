import Link from "next/link"
import { Clock, MapPin, AlertTriangle } from "lucide-react"
import { cn, riskBorder, riskColor, formatTime } from "@/lib/utils"
import StockGauge from "./StockGauge"
import type { APStatus } from "@/types"

// 초기 계획 수량 (하드코딩 — 추후 DB 연동)
const INITIAL = {
  water:  { A1:30, A2:20, A3:20, A4:13, B1:21, CW:9  },
  pocari: { A1:14, A2:14, A3:14, A4:14, B1:14, CW:6  },
  cola:   { A1:8,  A2:8,  A3:8,  A4:8,  B1:8,  CW:4  },
  banana: { A1:0,  A2:7,  A3:0,  A4:4,  B1:2,  CW:0  },
} as const

type APCode = keyof typeof INITIAL.water

export default function APCard({ ap }: { ap: APStatus }) {
  const code = ap.code as APCode
  const isCritical = ap.risk_level === "critical"
  const isWarning  = ap.risk_level === "warning"

  return (
    <Link href={`/dashboard/${ap.code}`}>
      <div className={cn(
        "rounded-xl border bg-slate-800 p-4 hover:bg-slate-750 transition-colors cursor-pointer",
        riskBorder(ap.risk_level)
      )}>
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("text-lg font-bold", riskColor(ap.risk_level))}>
                {ap.code}
              </span>
              {isCritical && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
              {isWarning  && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
            </div>
            <p className="text-sm text-slate-300">{ap.name}</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div className="flex items-center gap-1 justify-end">
              <MapPin className="w-3 h-3" />
              <span>{ap.cumulative_dist_km}km</span>
            </div>
            {ap.cutoff_time && (
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <Clock className="w-3 h-3" />
                <span>COT {formatTime(ap.cutoff_time)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 재고 게이지 */}
        <div className="space-y-2">
          {ap.water_qty !== null  && (
            <StockGauge label="물"    qty={ap.water_qty}  initialQty={INITIAL.water[code]  || 20} unit="팩" />
          )}
          {ap.pocari_qty !== null && (
            <StockGauge label="포카리" qty={ap.pocari_qty} initialQty={INITIAL.pocari[code] || 14} />
          )}
          {ap.cola_qty !== null   && (
            <StockGauge label="콜라"  qty={ap.cola_qty}   initialQty={INITIAL.cola[code]   || 8} />
          )}
          {ap.banana_qty !== null && ap.banana_qty > 0 && (
            <StockGauge label="바나나" qty={ap.banana_qty} initialQty={INITIAL.banana[code] || 7} />
          )}
        </div>

        {/* 예측 소진 */}
        {ap.water_depletion_at && (
          <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-yellow-400">
            ⚠️ 물 예측 소진: {formatTime(ap.water_depletion_at)}
          </div>
        )}

        {/* 마지막 보고 */}
        {ap.last_report_at && (
          <div className="mt-1 text-xs text-slate-500">
            마지막 보고: {formatTime(ap.last_report_at)}
          </div>
        )}
      </div>
    </Link>
  )
}
