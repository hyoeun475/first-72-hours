"use client";

import { useMemo, useState } from "react";
import { Button, Card, CopyButton, Field, LinkButton, Notice, PageTitle, inputClass } from "@/components/ui";
import { TAKEDOWN_TEMPLATES, fillTakedownTemplate, type TakedownFields } from "@/data/takedown-templates.ko";
import { useSession } from "@/features/session/SessionProvider";
import { formatKo } from "@/lib/time";

export default function TakedownPage() {
  const { records } = useSession();
  const [templateId, setTemplateId] = useState(TAKEDOWN_TEMPLATES[0].id);
  const [fields, setFields] = useState<TakedownFields>({});
  const [draft, setDraft] = useState("");

  const template = useMemo(
    () => TAKEDOWN_TEMPLATES.find((t) => t.id === templateId) ?? TAKEDOWN_TEMPLATES[0],
    [templateId],
  );

  function fillFromRecord(id: string) {
    const r = records.find((x) => x.id === id);
    if (!r) return;
    setFields((f) => ({
      ...f,
      url: r.url ?? f.url,
      accountLabel: r.accountLabel ?? f.accountLabel,
      discoveredAt: r.discoveredAt ? formatKo(r.discoveredAt) : f.discoveredAt,
    }));
  }

  function generate() {
    setDraft(fillTakedownTemplate(template, fields));
  }

  function set<K extends keyof TakedownFields>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  return (
    <div className="space-y-4">
      <PageTitle sub="플랫폼에 신고하거나 삭제를 요청할 때 쓸 문안 초안입니다. 이 앱이 대신 제출하지는 않습니다.">
        삭제 요청 문안
      </PageTitle>

      <Notice tone="neutral" icon="ℹ">
        템플릿은 법률문서가 아니며, 플랫폼이 삭제를 보장하지는 않습니다. 직접 신고가 부담스럽다면
        디지털성범죄피해자지원센터가 삭제 지원을 대신 진행할 수 있습니다. 촬영물 자체를 첨부할 필요는 없습니다.
      </Notice>

      <Card className="space-y-4">
        <Field id="template" label="플랫폼 유형">
          <select id="template" className={inputClass} value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            {TAKEDOWN_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.platformName}
              </option>
            ))}
          </select>
        </Field>

        {records.length > 0 && (
          <Field id="fromRecord" label="기록에서 불러오기 (선택)">
            <select id="fromRecord" className={inputClass} defaultValue="" onChange={(e) => fillFromRecord(e.target.value)}>
              <option value="">선택 안 함</option>
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.platform ?? "플랫폼 미입력"} · {r.discoveredAt ? formatKo(r.discoveredAt) : "발견 시각 미입력"}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field id="td-url" label="게시물 URL">
          <input id="td-url" type="text" inputMode="url" className={inputClass} value={fields.url ?? ""} onChange={set("url")} placeholder="https://" />
        </Field>
        <Field id="td-account" label="게시자 계정 / 표시명">
          <input id="td-account" type="text" className={inputClass} value={fields.accountLabel ?? ""} onChange={set("accountLabel")} />
        </Field>
        <Field id="td-date" label="발견 일시">
          <input id="td-date" type="text" className={inputClass} value={fields.discoveredAt ?? ""} onChange={set("discoveredAt")} placeholder="예: 2026년 11월 9일 14:30" />
        </Field>
        <Field id="td-reason" label="요청 사유" hint="예: 동의 없이 촬영·게시된 영상, 합성된 이미지 등. 확실하지 않은 내용은 적지 않아도 됩니다.">
          <textarea id="td-reason" rows={3} className={inputClass} value={fields.reason ?? ""} onChange={set("reason")} />
        </Field>

        <Button onClick={generate}>문안 초안 생성</Button>
        <p className="text-xs text-muted">비어 있는 항목은 &lsquo;확인 필요&rsquo;로 표시됩니다. 생성 후 직접 수정할 수 있습니다.</p>
      </Card>

      <Card className="space-y-3">
        <label htmlFor="td-draft" className="block text-sm font-medium">
          {template.title} (직접 수정 가능)
        </label>
        <textarea id="td-draft" rows={14} className={`${inputClass} text-xs leading-relaxed`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="위에서 '문안 초안 생성'을 누르면 여기에 채워집니다." />
        <div className="flex flex-wrap gap-2">
          <CopyButton text={draft} label="문안 복사" />
          {template.officialReportUrl && (
            <LinkButton href={template.officialReportUrl} external variant="secondary">
              공식 신고 페이지 ↗
            </LinkButton>
          )}
        </div>
        <p className="text-xs text-muted">
          출처: {template.sourceLabel}
          {template.lastVerifiedAt ? ` · 확인일: ${template.lastVerifiedAt}` : " · 플랫폼별 공식 신고 경로는 각 플랫폼 도움말에서 최신 확인 필요"}
        </p>
      </Card>
    </div>
  );
}
