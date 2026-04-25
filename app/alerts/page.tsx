import { createServiceClient } from "@/lib/supabase"
import { formatKST } from "@/lib/utils"

const ALERT_LABELS: Record<string, string> = {
  depletion_warning:  "⚠️ 소진 주의",
  depletion_critical: "🚨 소진 위험",
  heat:               "🌡️ 고온",
  incident:           "🩹 사건",
  resupply_needed:    "📦 재보급 필요",
}

async function getAlerts() {
  const sb = createServiceClient()
  const { data } = await sb
    .from("tp_alerts")
    .select("*")
    .order("triggered_at", { ascending: false })
    .limit(50)
  return data ?? []
}

export default async function AlertsPage() {
  const alerts = await getAlerts()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">경보 현황</h1>

      {alerts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          경보 없음
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="py-3 pr-4 text-left">AP</th>
                <th className="py-3 pr-4 text-left">유형</th>
                <th className="py-3 pr-4 text-left">품목</th>
                <th className="py-3 pr-4 text-right">현재잔량</th>
                <th className="py-3 pr-4 text-left">예측 소진</th>
                <th className="py-3 pr-4 text-left">발생</th>
                <th className="py-3 text-center">처리</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a.id} className={`border-b border-slate-800 ${!a.acknowledged ? "bg-red-950/10" : ""}`}>
                  <td className="py-3 pr-4 font-medium">{a.ap_code}</td>
                  <td className="py-3 pr-4">{ALERT_LABELS[a.alert_type] ?? a.alert_type}</td>
                  <td className="py-3 pr-4 text-slate-300">{a.item_name ?? "-"}</td>
                  <td className="py-3 pr-4 text-right">{a.current_qty !== null ? `${a.current_qty}박스` : "-"}</td>
                  <td className="py-3 pr-4 text-red-400">{a.predicted_at ? formatKST(a.predicted_at) : "-"}</td>
                  <td className="py-3 pr-4 text-slate-500">{formatKST(a.triggered_at)}</td>
                  <td className="py-3 text-center">
                    {a.acknowledged
                      ? <span className="text-green-500">✓</span>
                      : <span className="text-red-400">미처리</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
