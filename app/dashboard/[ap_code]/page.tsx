import { createServiceClient } from "@/lib/supabase"
export const dynamic = "force-dynamic"
import { formatKST, formatTime } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function getAPData(apCode: string) {
  const sb = createServiceClient()

  const [pointRes, reportsRes, alertsRes] = await Promise.all([
    sb.from("race_points")
      .select("*")
      .eq("code", apCode)
      .single(),
    sb.from("tp_inventory_reports")
      .select("*")
      .eq("ap_code", apCode)
      .order("reported_at", { ascending: false })
      .limit(20),
    sb.from("tp_alerts")
      .select("*")
      .eq("ap_code", apCode)
      .eq("acknowledged", false)
      .order("triggered_at", { ascending: false })
      .limit(10),
  ])

  return {
    point: pointRes.data,
    reports: reportsRes.data ?? [],
    alerts: alertsRes.data ?? [],
  }
}

export default async function APDetailPage({
  params,
}: {
  params: Promise<{ ap_code: string }>
}) {
  const { ap_code } = await params
  const { point, reports, alerts } = await getAPData(ap_code.toUpperCase())

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
        <ArrowLeft className="w-4 h-4" />
        대시보드로
      </Link>

      {/* AP 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">
          {ap_code.toUpperCase()} — {point?.name ?? ""}
        </h1>
        <div className="flex gap-4 text-sm text-slate-400 mt-1">
          <span>누적 거리: {point?.cumulative_dist_km}km</span>
          {point?.cutoff_time && <span>COT: {formatTime(point.cutoff_time)}</span>}
          {point?.leader_arrival_time && (
            <span>선두 예상: {formatTime(point.leader_arrival_time)}</span>
          )}
        </div>
      </div>

      {/* 활성 경보 */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-red-400">⚠️ 활성 경보</h2>
          {alerts.map(alert => (
            <div key={alert.id} className="rounded-lg border border-red-800 bg-red-950/30 p-3 text-sm">
              <span className="font-medium">[{alert.alert_type}]</span>
              {alert.item_name && <span> {alert.item_name}</span>}
              {alert.current_qty !== null && <span> — 현재 {alert.current_qty}박스</span>}
              {alert.predicted_at && (
                <span className="text-red-400"> (예측 소진: {formatTime(alert.predicted_at)})</span>
              )}
              <span className="text-slate-500 ml-2 text-xs">{formatKST(alert.triggered_at)}</span>
            </div>
          ))}
        </div>
      )}

      {/* 최근 보고 */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">최근 보고</h2>
        {reports.length === 0 ? (
          <p className="text-slate-500 text-sm">보고 데이터 없음</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700">
                  <th className="py-2 pr-4 text-left">시각</th>
                  <th className="py-2 pr-4 text-right">물(팩)</th>
                  <th className="py-2 pr-4 text-right">포카리</th>
                  <th className="py-2 pr-4 text-right">콜라</th>
                  <th className="py-2 pr-4 text-right">바나나</th>
                  <th className="py-2 text-left">발신자</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-2 pr-4 text-slate-300">{formatTime(r.reported_at)}</td>
                    <td className="py-2 pr-4 text-right">{r.water_qty ?? "-"}</td>
                    <td className="py-2 pr-4 text-right">{r.pocari_qty ?? "-"}</td>
                    <td className="py-2 pr-4 text-right">{r.cola_qty ?? "-"}</td>
                    <td className="py-2 pr-4 text-right">{r.banana_qty ?? "-"}</td>
                    <td className="py-2 text-slate-500">{r.reporter ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
