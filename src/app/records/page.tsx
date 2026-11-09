"use client";

import { useState } from "react";
import { RecordForm } from "@/components/RecordForm";
import { Button, Card, Collapsible, LinkButton, Notice, PageTitle } from "@/components/ui";
import {
  INCIDENT_TYPE_LABELS,
  RECORD_STATUS_LABELS,
  type IncidentRecord,
} from "@/features/agent/agent.types";
import { useSession } from "@/features/session/SessionProvider";
import { formatKo } from "@/lib/time";

export default function RecordsPage() {
  const { records, incidentType, addRecord, updateRecord, deleteRecord, persist, setPersist, hydrated } =
    useSession();
  const [mode, setMode] = useState<"list" | "new" | { edit: string }>(records.length === 0 ? "new" : "list");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const editing: IncidentRecord | undefined =
    typeof mode === "object" ? records.find((r) => r.id === mode.edit) : undefined;

  return (
    <div className="space-y-4">
      <PageTitle sub="URL, 플랫폼, 발견 시각, 메모 같은 글 정보만 기록합니다. 이미지·영상은 저장하지 않습니다.">
        기록
      </PageTitle>

      <Card>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={persist}
            disabled={!hydrated}
            onChange={(e) => setPersist(e.target.checked)}
          />
          <span>
            <span className="font-medium">이 기기 브라우저에 기록 보관하기</span>
            <span className="block text-xs text-muted">
              끄면 화면을 닫을 때 기록이 사라집니다. 켜면 새로고침 후에도 남지만, 같은 기기를 쓰는 다른 사람이나
              악성 프로그램으로부터 완전히 보호되지는 않습니다. 언제든 끄거나 전체 삭제할 수 있습니다.
            </span>
          </span>
        </label>
      </Card>

      {mode === "new" && (
        <Card>
          <h2 className="mb-3 text-base font-semibold">새 기록</h2>
          <RecordForm
            defaultType={incidentType}
            onSubmit={(values) => {
              addRecord(values);
              setMode("list");
            }}
            onCancel={records.length > 0 ? () => setMode("list") : undefined}
          />
        </Card>
      )}

      {editing && (
        <Card>
          <h2 className="mb-3 text-base font-semibold">기록 수정</h2>
          <RecordForm
            initial={editing}
            submitLabel="수정 저장"
            onSubmit={(values) => {
              updateRecord(editing.id, values);
              setMode("list");
            }}
            onCancel={() => setMode("list")}
          />
        </Card>
      )}

      {mode === "list" && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setMode("new")}>+ 새 기록</Button>
            {records.length > 0 && (
              <LinkButton href="/summary" variant="secondary">
                사건 정리 초안 만들기
              </LinkButton>
            )}
          </div>

          {records.length === 0 && (
            <Notice tone="neutral">아직 기록이 없습니다. 기억나는 것만 적어도 괜찮습니다.</Notice>
          )}

          <ul className="space-y-3">
            {records.map((r) => (
              <li key={r.id}>
                <Card className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-sm font-semibold">{INCIDENT_TYPE_LABELS[r.incidentType]}</h2>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs">
                      {RECORD_STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                    <dt className="text-muted">발견 일시</dt>
                    <dd>{r.discoveredAt ? formatKo(r.discoveredAt) : "확인 필요"}</dd>
                    <dt className="text-muted">기록 생성</dt>
                    <dd>{formatKo(r.createdAt)}</dd>
                    {r.platform && (
                      <>
                        <dt className="text-muted">플랫폼</dt>
                        <dd>{r.platform}</dd>
                      </>
                    )}
                  </dl>
                  {(r.url || r.accountLabel || r.notes) && (
                    <Collapsible summary="상세 내용 보기 (URL·계정·메모)">
                      <dl className="space-y-1 text-xs">
                        {r.url && (
                          <div>
                            <dt className="text-muted">URL</dt>
                            <dd className="break-all">{r.url}</dd>
                          </div>
                        )}
                        {r.accountLabel && (
                          <div>
                            <dt className="text-muted">계정</dt>
                            <dd>{r.accountLabel}</dd>
                          </div>
                        )}
                        {r.notes && (
                          <div>
                            <dt className="text-muted">메모</dt>
                            <dd className="whitespace-pre-wrap">{r.notes}</dd>
                          </div>
                        )}
                      </dl>
                    </Collapsible>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button variant="secondary" onClick={() => setMode({ edit: r.id })}>
                      수정
                    </Button>
                    {confirmDelete === r.id ? (
                      <>
                        <Button
                          variant="danger"
                          onClick={() => {
                            deleteRecord(r.id);
                            setConfirmDelete(null);
                          }}
                        >
                          정말 삭제
                        </Button>
                        <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                          취소
                        </Button>
                      </>
                    ) : (
                      <Button variant="danger" onClick={() => setConfirmDelete(r.id)}>
                        삭제
                      </Button>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
