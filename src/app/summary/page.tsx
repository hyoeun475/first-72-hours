"use client";

import { useState } from "react";
import { Button, Card, CopyButton, LinkButton, Notice, PageTitle, inputClass } from "@/components/ui";
import { generateSummary, summaryToText } from "@/features/agent/summary.generator";
import { useSession } from "@/features/session/SessionProvider";
import { buildExportPayload, downloadJson } from "@/lib/export";

export default function SummaryPage() {
  const { records, incidentType, urgency, summaryDraft, setSummaryDraft, clearAll } = useSession();
  const [confirmClear, setConfirmClear] = useState(false);

  function regenerate() {
    const text = summaryToText(generateSummary(records, incidentType));
    setSummaryDraft(text);
  }

  const draft = summaryDraft ?? "";

  return (
    <div className="space-y-4">
      <PageTitle sub="입력한 기록만으로 만든 상담·신고 준비용 참고 초안입니다. 경찰 진술서나 법률문서가 아닙니다.">
        사건 정리 초안
      </PageTitle>

      <Notice tone="neutral" icon="ℹ" title="이 초안은">
        <ul className="list-disc space-y-1 pl-5">
          <li>이용자가 기록한 사실만 시간순으로 정리합니다. 없는 내용은 추가하지 않습니다.</li>
          <li>비어 있는 항목은 &lsquo;확인 필요&rsquo;로 표시합니다.</li>
          <li>죄명·유죄 여부·가해자 신원을 판단하지 않습니다.</li>
          <li>직접 검토하고 수정한 뒤 복사하거나 파일로 내보낼 수 있습니다.</li>
        </ul>
      </Notice>

      <div className="flex flex-wrap gap-2">
        <Button onClick={regenerate}>{draft ? "기록으로 다시 생성" : "기록으로 초안 생성"}</Button>
        <LinkButton href="/records" variant="secondary">
          기록 {records.length}건 보기
        </LinkButton>
      </div>

      {records.length === 0 && !draft && (
        <Notice tone="warn">아직 기록이 없습니다. 기록 없이 생성하면 모든 항목이 &lsquo;확인 필요&rsquo;로 표시됩니다.</Notice>
      )}

      <Card className="space-y-3">
        <label htmlFor="summary-draft" className="block text-sm font-medium">
          초안 (직접 수정할 수 있습니다)
        </label>
        <textarea
          id="summary-draft"
          rows={18}
          className={`${inputClass} font-mono text-xs leading-relaxed`}
          value={draft}
          onChange={(e) => setSummaryDraft(e.target.value)}
          placeholder="위의 '기록으로 초안 생성' 버튼을 누르면 여기에 초안이 채워집니다."
        />
        <div className="flex flex-wrap gap-2">
          <CopyButton text={draft} label="초안 복사" />
          <Button
            variant="secondary"
            onClick={() =>
              downloadJson(buildExportPayload({ records, incidentType, urgency, summaryDraft: draft }))
            }
          >
            JSON 파일로 내보내기
          </Button>
        </div>
        <p className="text-xs text-muted">
          내보내기 파일에는 기록(글 정보)과 이 초안만 담깁니다. 파일은 이 기기에만 저장되며 어디에도 전송되지
          않습니다. 공유 전에 내용을 확인해 주세요.
        </p>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-sm font-semibold">전체 기록 삭제</h2>
        <p className="text-xs text-muted">
          이 앱에 입력한 상황 선택, 모든 기록, 초안을 지웁니다. 브라우저 보관을 켰다면 저장된 내용도 함께 삭제됩니다.
          되돌릴 수 없습니다.
        </p>
        {confirmClear ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="danger"
              onClick={() => {
                clearAll();
                setConfirmClear(false);
              }}
            >
              정말 모두 삭제
            </Button>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              취소
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmClear(true)}>
            전체 삭제
          </Button>
        )}
      </Card>
    </div>
  );
}
