export interface Project {
  id: string;
  name: string;
  status: "ACTIVE" | "DISABLED";
  minute_limit: number;
  hourly_limit: number;
  daily_limit: number;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  status: "ACTIVE" | "REVOKED";
  last_used_at: string | null;
  created_at: string;
}

export interface Gateway {
  id: string;
  device_id: string;
  name: string;
  status: string;
  selected_sim_slot: number | null;
  selected_subscription_id: string | null;
  battery_level: number | null;
  network_type: string | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
  sent_count?: number;
  failed_count?: number;
}

export interface Job {
  id: string;
  to: string;
  status: string;
  attempts: number;
  created_at: string;
  sent_at: string | null;
  failed_at: string | null;
}

export interface BlockedNumber {
  phone: string;
  reason: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  event: string;
  project_id: string | null;
  gateway_id: string | null;
  job_id: string | null;
  phone_masked: string | null;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface Stats {
  sms_today: number;
  sms_sent: number;
  sms_failed: number;
  queued_jobs: number;
  processing_jobs: number;
  online_gateways: number;
  offline_gateways: number;
  active_projects: number;
}
