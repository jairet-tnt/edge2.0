export interface Client {
  id: string;
  name: string;
  status: "active" | "disabled";
  spend: number;
  impressions: number;
  cpm: number;
  clicks: number;
  cpc: number;
  ctr: number;
  purchases: number;
  cpa: number;
  roas: number;
  platformPurchases: number;
  platformPurchasesDelta?: number;
  targetDelta: number;
  targetDeltaPercent: number;
  budgetToday: number;
  budget: number;
}

export interface DashboardMetrics {
  earnings: number;
  sales: number;
}

export type FilterTab = 
  | "CLIENT" 
  | "PRODUCER" 
  | "WRITER" 
  | "EDITOR" 
  | "ACCOUNT" 
  | "CAMPAIGN" 
  | "ADSET" 
  | "AD";

export type ClientSubTab = 
  | "CLIENT" 
  | "FUNNEL" 
  | "PLATFORM" 
  | "ACCOUNT" 
  | "CAMPAIGN" 
  | "ADSET" 
  | "AD";

export interface DateRange {
  start: Date;
  end: Date;
}

export type HierarchyLevel = "client" | "brand" | "platform" | "adAccount";

export interface HierarchyRow extends Client {
  level: HierarchyLevel;
  children?: HierarchyRow[];
  customMetrics?: Record<string, number | string | null>;
}

export interface CustomField {
  id: string;
  label: string;
}


