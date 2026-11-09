export type IncidentType =
  | "suspected_recording"
  | "distribution_found"
  | "distribution_threat"
  | "deepfake"
  | "unsure";

export type Urgency = "immediate_danger" | "not_immediate" | "unsure";

export type RecordStatus =
  | "unreviewed"
  | "consultation_planned"
  | "report_preparation";

export type AgentInput = {
  incidentType?: IncidentType;
  urgency?: Urgency;
  userText?: string;
};

export type NextActionType = "navigate" | "show_resource" | "open_form";

export type NextAction = {
  id: string;
  label: string;
  description: string;
  actionType: NextActionType;
  href: string;
};

export type AgentResponse = {
  message: string;
  nextActions: NextAction[];
  safetyNotice?: string;
};

export type IncidentRecord = {
  id: string;
  incidentType: IncidentType;
  url?: string;
  platform?: string;
  accountLabel?: string;
  discoveredAt?: string;
  createdAt: string;
  notes?: string;
  status: RecordStatus;
};

export type IncidentSummary = {
  incidentType: string;
  firstRecognizedAt: string;
  platformAndDiscoveryRoute: string;
  urls: string[];
  userProvidedTimeline: string[];
  actionsTaken: string[];
  itemsToConfirm: string[];
  disclaimer: string;
};

export type ResponseGuide = {
  incidentType: IncidentType;
  title: string;
  intro: string;
  canDoNow: string[];
  avoid: string[];
  helpfulToRecord: string[];
  whenToContactExperts: string[];
};

export type SupportResource = {
  id: string;
  name: string;
  description: string;
  phone?: string;
  url: string;
  sourceLabel: string;
  lastVerifiedAt: string;
  note?: string;
};

export type TakedownTemplate = {
  id: string;
  platformCategory: string;
  platformName: string;
  title: string;
  requiredFields: string[];
  bodyTemplate: string;
  officialReportUrl?: string;
  sourceLabel: string;
  lastVerifiedAt?: string;
};

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  suspected_recording: "불법촬영 의심",
  distribution_found: "촬영물 유포 발견",
  distribution_threat: "유포협박",
  deepfake: "딥페이크·합성물",
  unsure: "잘 모르겠음",
};

export const URGENCY_LABELS: Record<Urgency, string> = {
  immediate_danger: "지금 위험하다",
  not_immediate: "당장 위험하지 않다",
  unsure: "판단하기 어렵다",
};

export const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  unreviewed: "미확인",
  consultation_planned: "상담 예정",
  report_preparation: "신고 준비",
};

export const INCIDENT_TYPES = Object.keys(INCIDENT_TYPE_LABELS) as IncidentType[];
export const URGENCIES = Object.keys(URGENCY_LABELS) as Urgency[];
export const RECORD_STATUSES = Object.keys(RECORD_STATUS_LABELS) as RecordStatus[];
