export type RiskLevel = "critical" | "warning" | "normal" | "unknown"

export interface APStatus {
  code: string
  name: string
  cumulative_dist_km: number
  leader_arrival_time: string | null
  cutoff_time: string | null
  last_report_at: string | null
  water_qty: number | null
  pocari_qty: number | null
  cola_qty: number | null
  banana_qty: number | null
  water_depletion_at: string | null
  water_rate: number | null
  risk_level: RiskLevel
}

export interface InventoryReport {
  id: string
  event_id: string
  ap_code: string
  reported_at: string
  reporter: string | null
  water_qty: number | null
  pocari_qty: number | null
  cola_qty: number | null
  banana_qty: number | null
  raw_content: string | null
}

export interface Alert {
  id: string
  event_id: string
  ap_code: string
  alert_type: "depletion_warning" | "depletion_critical" | "heat" | "incident" | "resupply_needed"
  item_name: string | null
  current_qty: number | null
  predicted_at: string | null
  triggered_at: string
  acknowledged: boolean
}

export interface RacePoint {
  id: string
  code: string
  name: string
  cumulative_dist_km: number
  section_dist_km: number | null
  leader_arrival_time: string | null
  cutoff_time: string | null
  open_time: string | null
  coordinates: { lat: number; lng: number } | null
}
