import { createServiceClient } from "@/lib/supabase"
export const dynamic = "force-dynamic"
import APGrid from "@/components/APGrid"
import { formatKST } from "@/lib/utils"

async function getEvent() {
  const sb = createServiceClient()
  const { data } = await sb
    .from("events")
    .select("id,title,date,status")
    .eq("status", "published")
    .order("date", { ascending: false })
    .limit(1)
    .single()
  return data
}

export default async function DashboardPage() {
  const event = await getEvent()

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {event?.title ?? "대회 현황"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {event?.date ? `${event.date} · ` : ""}
            실시간 보급소 현황
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
          실시간 연결
        </div>
      </div>

      {/* 위험도 범례 */}
      <div className="flex gap-4 text-xs">
        {[
          { color: "bg-green-500", label: "정상" },
          { color: "bg-yellow-500", label: "주의 (30% 이하)" },
          { color: "bg-red-500",    label: "위험 (10% 이하)" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-slate-400">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            {label}
          </div>
        ))}
      </div>

      {/* AP 그리드 */}
      {event ? (
        <APGrid eventId={event.id} />
      ) : (
        <div className="text-center py-20 text-slate-500">
          진행 중인 대회가 없습니다
        </div>
      )}
    </div>
  )
}
