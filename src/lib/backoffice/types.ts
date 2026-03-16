export interface APISession {
  id: number;
  training_id: number;
  training_name: string;
  session_type: "OPEN" | "CORPORATE";
  length: number;
  capacity: number;
  date: string;
  location: string;
  address: string;
  pricing: Array<{ currency: "CZK" | "EUR"; amount: number }>;
  status: "DRAFT" | "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  signup_url: string | null;
  create_time: string;
  update_time: string;
  delete_time: string | null;
  purge_time: string | null;
}

export interface SessionsListParams {
  limit?: number;
  sort?: "date";
  order?: "asc" | "desc";
  status?: Array<"DRAFT" | "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED">;
  training_id?: number;
  cursor?: string;
  include_deleted?: boolean;
}

export interface SessionsListResponse {
  items: APISession[];
  next_cursor?: string;
  total?: number;
}

export interface OIDCConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  audience?: string;
}
