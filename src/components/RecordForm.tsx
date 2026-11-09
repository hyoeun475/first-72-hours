"use client";

import { useState } from "react";
import {
  INCIDENT_TYPES,
  INCIDENT_TYPE_LABELS,
  RECORD_STATUSES,
  RECORD_STATUS_LABELS,
  type IncidentRecord,
  type IncidentType,
} from "@/features/agent/agent.types";
import { isoToLocalInput, localInputToIso } from "@/lib/time";
import { validateRecordInput, type FieldErrors, type RecordInput } from "@/lib/validation";
import { Button, Field, inputClass } from "./ui";

export type RecordFormValues = Omit<IncidentRecord, "id" | "createdAt">;

export function RecordForm({
  initial,
  defaultType,
  onSubmit,
  onCancel,
  submitLabel = "기록 저장",
}: {
  initial?: IncidentRecord;
  defaultType?: IncidentType;
  onSubmit: (values: RecordFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [incidentType, setIncidentType] = useState<IncidentType>(
    initial?.incidentType ?? defaultType ?? "unsure",
  );
  const [url, setUrl] = useState(initial?.url ?? "");
  const [platform, setPlatform] = useState(initial?.platform ?? "");
  const [accountLabel, setAccountLabel] = useState(initial?.accountLabel ?? "");
  const [discoveredLocal, setDiscoveredLocal] = useState(isoToLocalInput(initial?.discoveredAt));
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [status, setStatus] = useState(initial?.status ?? "unreviewed");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateRecordInput({
      incidentType,
      url,
      platform,
      accountLabel,
      discoveredAt: localInputToIso(discoveredLocal),
      notes,
      status,
    });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    const data: RecordInput = result.data;
    onSubmit({
      incidentType: data.incidentType,
      url: data.url,
      platform: data.platform,
      accountLabel: data.accountLabel,
      discoveredAt: data.discoveredAt,
      notes: data.notes,
      status: data.status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <p className="text-xs text-muted">
        모든 항목은 선택 사항입니다. 기억나는 것만 적어도 됩니다. 이미지·영상은 첨부하지 않습니다.
      </p>

      <Field id="incidentType" label="사건 유형">
        <select
          id="incidentType"
          className={inputClass}
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value as IncidentType)}
        >
          {INCIDENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {INCIDENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>

      <Field id="url" label="URL (선택)" hint="게시물이나 계정 주소. 앱이 이 주소를 방문하지는 않습니다." error={errors.url}>
        <input
          id="url"
          type="url"
          inputMode="url"
          className={inputClass}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? "url-error" : "url-hint"}
        />
      </Field>

      <Field id="platform" label="플랫폼명 (선택)" error={errors.platform}>
        <input
          id="platform"
          type="text"
          className={inputClass}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="예: 인스타그램, 텔레그램, 커뮤니티 이름"
          aria-invalid={!!errors.platform}
        />
      </Field>

      <Field id="accountLabel" label="계정명 / 게시자 표시명 (선택)" error={errors.accountLabel}>
        <input
          id="accountLabel"
          type="text"
          className={inputClass}
          value={accountLabel}
          onChange={(e) => setAccountLabel(e.target.value)}
          aria-invalid={!!errors.accountLabel}
        />
      </Field>

      <Field
        id="discoveredAt"
        label="발견 일시 (선택)"
        hint="처음 알게 된 시각. 기록 생성 시각은 자동으로 따로 저장됩니다."
        error={errors.discoveredAt}
      >
        <input
          id="discoveredAt"
          type="datetime-local"
          className={inputClass}
          value={discoveredLocal}
          onChange={(e) => setDiscoveredLocal(e.target.value)}
          aria-invalid={!!errors.discoveredAt}
        />
      </Field>

      <Field id="notes" label="메모 (선택)" hint="기억나는 상황을 글로 적어 둘 수 있습니다." error={errors.notes}>
        <textarea
          id="notes"
          rows={4}
          className={inputClass}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-invalid={!!errors.notes}
        />
      </Field>

      <Field id="status" label="진행 상태">
        <select
          id="status"
          className={inputClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as IncidentRecord["status"])}
        >
          {RECORD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {RECORD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
}
