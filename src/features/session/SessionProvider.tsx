"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { IncidentRecord, IncidentType, Urgency } from "@/features/agent/agent.types";
import { createId } from "@/lib/id";
import {
  clearPersistedState,
  loadPersistedState,
  readPersistOptIn,
  savePersistedState,
  writePersistOptIn,
} from "@/lib/storage";
import { nowIso } from "@/lib/time";

export type NewRecordInput = Omit<IncidentRecord, "id" | "createdAt">;

type SessionState = {
  incidentType?: IncidentType;
  urgency?: Urgency;
  records: IncidentRecord[];
  summaryDraft?: string;
  persist: boolean;
  hydrated: boolean;
};

type SessionActions = {
  setIncidentType: (t: IncidentType | undefined) => void;
  setUrgency: (u: Urgency | undefined) => void;
  addRecord: (input: NewRecordInput) => IncidentRecord;
  updateRecord: (id: string, patch: Partial<Omit<IncidentRecord, "id" | "createdAt">>) => void;
  deleteRecord: (id: string) => void;
  setSummaryDraft: (text: string | undefined) => void;
  setPersist: (on: boolean) => void;
  clearAll: () => void;
};

const SessionContext = createContext<(SessionState & SessionActions) | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [incidentType, setIncidentTypeState] = useState<IncidentType | undefined>();
  const [urgency, setUrgencyState] = useState<Urgency | undefined>();
  const [records, setRecords] = useState<IncidentRecord[]>([]);
  const [summaryDraft, setSummaryDraftState] = useState<string | undefined>();
  const [persist, setPersistState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const skipNextSave = useRef(true);

  // 이용자가 이전에 저장을 켜 둔 경우에만 복원한다.
  // localStorage는 외부 시스템이므로 마운트 후 한 번 읽어 상태를 동기화한다(SSR 불일치 방지).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const optIn = readPersistOptIn();
    if (optIn) {
      const saved = loadPersistedState();
      if (saved) {
        setIncidentTypeState(saved.incidentType);
        setUrgencyState(saved.urgency);
        setRecords(saved.records);
        setSummaryDraftState(saved.summaryDraft);
      }
      setPersistState(true);
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (persist) {
      savePersistedState({ incidentType, urgency, records, summaryDraft });
    }
  }, [hydrated, persist, incidentType, urgency, records, summaryDraft]);

  const setIncidentType = useCallback((t: IncidentType | undefined) => setIncidentTypeState(t), []);
  const setUrgency = useCallback((u: Urgency | undefined) => setUrgencyState(u), []);

  const addRecord = useCallback((input: NewRecordInput) => {
    const record: IncidentRecord = { ...input, id: createId(), createdAt: nowIso() };
    setRecords((prev) => [...prev, record]);
    return record;
  }, []);

  const updateRecord = useCallback<SessionActions["updateRecord"]>((id, patch) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch, id: r.id, createdAt: r.createdAt } : r)));
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const setSummaryDraft = useCallback((text: string | undefined) => setSummaryDraftState(text), []);

  const setPersist = useCallback(
    (on: boolean) => {
      setPersistState(on);
      writePersistOptIn(on);
      if (on) savePersistedState({ incidentType, urgency, records, summaryDraft });
      else clearPersistedState();
    },
    [incidentType, urgency, records, summaryDraft],
  );

  const clearAll = useCallback(() => {
    setIncidentTypeState(undefined);
    setUrgencyState(undefined);
    setRecords([]);
    setSummaryDraftState(undefined);
    clearPersistedState();
  }, []);

  const value = useMemo(
    () => ({
      incidentType,
      urgency,
      records,
      summaryDraft,
      persist,
      hydrated,
      setIncidentType,
      setUrgency,
      addRecord,
      updateRecord,
      deleteRecord,
      setSummaryDraft,
      setPersist,
      clearAll,
    }),
    [
      incidentType,
      urgency,
      records,
      summaryDraft,
      persist,
      hydrated,
      setIncidentType,
      setUrgency,
      addRecord,
      updateRecord,
      deleteRecord,
      setSummaryDraft,
      setPersist,
      clearAll,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
