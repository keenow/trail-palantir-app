"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import APCard from "./APCard"
import type { APStatus, RacePoint } from "@/types"

// PASS에서 읽은 AP 데이터를 APStatus로 변환
function toAPStatus(rp: RacePoint, inv?: Record<string, number | null>): APStatus {
  const w = inv?.water_qty ?? null
  const p = inv?.pocari_qty ?? null
  const c = inv?.cola_qty ?? null
  const b = inv?.banana_qty ?? null

  let risk: APStatus["risk_level"] = "unknown"
  if (w !== null || p !== null) {
    if (w === 0 || p === 0) risk = "critical"
    else if ((w !== null && w <= 5) || (p !== null && p <= 3)) risk = "warning"
    else risk = "normal"
  }

  return {
    code: rp.code,
    name: rp.name,
    cumulative_dist_km: rp.cumulative_dist_km,
    leader_arrival_time: rp.leader_arrival_time,
    cutoff_time: rp.cutoff_time,
    last_report_at: (inv?.reported_at as unknown as string) ?? null,
    water_qty: w,
    pocari_qty: p,
    cola_qty: c,
    banana_qty: b,
    water_depletion_at: null,
    water_rate: null,
    risk_level: risk,
  }
}

export default function APGrid({ eventId }: { eventId: string }) {
  const [apStatuses, setApStatuses] = useState<APStatus[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    // PASS race_points 읽기
    const { data: racePoints } = await supabase
      .from("race_points")
      .select("id,code,name,cumulative_dist_km,leader_arrival_time,cutoff_time,open_time")
      .neq("code", "S")
      .neq("code", "F")
      .order("cumulative_dist_km")

    // Trail Palantir 최신 잔량 읽기 (테이블이 없으면 null)
    let latestInv: Record<string, Record<string, number | null>> = {}
    try {
      const { data: inv } = await supabase
        .from("tp_latest_inventory")
        .select("*")
        .eq("event_id", eventId)
      if (inv) {
        inv.forEach((r: Record<string, unknown>) => {
          latestInv[r.ap_code as string] = r as Record<string, number | null>
        })
      }
    } catch {}

    if (racePoints) {
      setApStatuses(racePoints.map(rp =>
        toAPStatus(rp as RacePoint, latestInv[rp.code])
      ))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    // Realtime 구독 (tp_inventory_reports 변경 시 재조회)
    const channel = supabase
      .channel("tp_inventory_changes")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "tp_inventory_reports",
      }, () => fetchData())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [eventId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-700 bg-slate-800 p-4 h-48 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {apStatuses.map(ap => <APCard key={ap.code} ap={ap} />)}
    </div>
  )
}
