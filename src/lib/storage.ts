import type { IncidentRecord, IncidentType, Urgency } from "@/features/agent/agent.types";

/**
 * 브라우저 로컬 저장소 어댑터.
 * - 기본값은 저장하지 않음(메모리만). 이용자가 명시적으로 켠 경우에만 저장한다.
 * - 저장되는 것은 글 정보뿐이며, 이 기기를 쓰는 다른 사람으로부터 완전히 보호되지 않는다.
 */
export const STORAGE_KEY = "first72.session.v1";
export const STORAGE_OPT_IN_KEY = "first72.persist.v1";

export type PersistedState = {
  incidentType?: IncidentType;
  urgency?: Urgency;
  records: IncidentRecord[];
  summaryDraft?: string;
};

function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readPersistOptIn(): boolean {
  const s = safeStorage();
  if (!s) return false;
  try {
    return s.getItem(STORAGE_OPT_IN_KEY) === "1";
  } catch {
    return false;
  }
}

export function writePersistOptIn(value: boolean): void {
  const s = safeStorage();
  if (!s) return;
  try {
    if (value) s.setItem(STORAGE_OPT_IN_KEY, "1");
    else s.removeItem(STORAGE_OPT_IN_KEY);
  } catch {
    // ignore
  }
}

export function loadPersistedState(): PersistedState | null {
  const s = safeStorage();
  if (!s) return null;
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      incidentType: parsed.incidentType,
      urgency: parsed.urgency,
      records: Array.isArray(parsed.records) ? parsed.records : [],
      summaryDraft: typeof parsed.summaryDraft === "string" ? parsed.summaryDraft : undefined,
    };
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedState): void {
  const s = safeStorage();
  if (!s) return;
  try {
    s.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / privacy mode
  }
}

export function clearPersistedState(): void {
  const s = safeStorage();
  if (!s) return;
  try {
    s.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
