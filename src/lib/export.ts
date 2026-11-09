import type { IncidentRecord, IncidentType, Urgency } from "@/features/agent/agent.types";

export const EXPORT_SCHEMA_VERSION = 1;

/** 내보내기에 포함되는 필드만 명시적으로 정의한다. 정의되지 않은 값은 포함하지 않는다. */
export type ExportPayload = {
  schemaVersion: number;
  app: "first-72-hours";
  exportedAt: string;
  notice: string;
  incidentType?: IncidentType;
  urgency?: Urgency;
  records: IncidentRecord[];
  summaryDraft?: string;
};

export const EXPORT_NOTICE =
  "이 파일은 이용자가 직접 입력한 글 정보만 담고 있습니다. 이미지·영상은 포함되지 않습니다. 파일을 다른 사람과 공유하거나 클라우드에 올리기 전에 내용을 확인해 주세요.";

const RECORD_KEYS: (keyof IncidentRecord)[] = [
  "id",
  "incidentType",
  "url",
  "platform",
  "accountLabel",
  "discoveredAt",
  "createdAt",
  "notes",
  "status",
];

/** 정의된 키만 남긴 레코드 사본을 만든다. */
export function sanitizeRecord(record: IncidentRecord): IncidentRecord {
  const out: Partial<IncidentRecord> = {};
  for (const key of RECORD_KEYS) {
    const value = record[key];
    if (value !== undefined && value !== "") {
      (out as Record<string, unknown>)[key] = value;
    }
  }
  return out as IncidentRecord;
}

export function buildExportPayload(input: {
  records: IncidentRecord[];
  incidentType?: IncidentType;
  urgency?: Urgency;
  summaryDraft?: string;
  exportedAt?: string;
}): ExportPayload {
  const payload: ExportPayload = {
    schemaVersion: EXPORT_SCHEMA_VERSION,
    app: "first-72-hours",
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    notice: EXPORT_NOTICE,
    records: input.records.map(sanitizeRecord),
  };
  if (input.incidentType) payload.incidentType = input.incidentType;
  if (input.urgency) payload.urgency = input.urgency;
  if (input.summaryDraft?.trim()) payload.summaryDraft = input.summaryDraft;
  return payload;
}

export function exportFileName(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `first-72-hours-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}.json`;
}

/** 브라우저에서 JSON 파일 다운로드를 트리거한다. 서버로 전송하지 않는다. */
export function downloadJson(payload: ExportPayload, fileName = exportFileName()): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** 클립보드 복사. 실패하면 false를 돌려준다(권한 거부 등). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  return false;
}
