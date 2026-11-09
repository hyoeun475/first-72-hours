"use client";

import { EmergencyNotice } from "@/components/EmergencyNotice";
import { IncidentTypeSelector } from "@/components/IncidentTypeSelector";
import { StepGuide } from "@/components/StepGuide";
import { Card, LinkButton, Notice, PageTitle } from "@/components/ui";
import { getResponseGuide } from "@/data/response-guides.ko";
import { INCIDENT_TYPE_LABELS } from "@/features/agent/agent.types";
import { useSession } from "@/features/session/SessionProvider";

export default function GuidePage() {
  const { incidentType, urgency, setIncidentType } = useSession();

  if (!incidentType) {
    return (
      <div className="space-y-4">
        <PageTitle sub="상황을 먼저 선택하면 맞춤 안내를 볼 수 있습니다.">대응 가이드</PageTitle>
        {urgency === "immediate_danger" && <EmergencyNotice compact />}
        <Card>
          <IncidentTypeSelector value={incidentType} onChange={setIncidentType} />
        </Card>
      </div>
    );
  }

  const guide = getResponseGuide(incidentType);

  return (
    <div className="space-y-4">
      <PageTitle sub={`선택한 상황: ${INCIDENT_TYPE_LABELS[incidentType]}`}>{guide.title}</PageTitle>
      {urgency === "immediate_danger" && <EmergencyNotice compact />}
      <StepGuide guide={guide} />
      <Notice tone="neutral">
        이 안내는 선택 가능한 참고 정보입니다. 꼭 이 순서대로 해야 하는 것은 아니며, 언제든 멈추거나 전문기관과 먼저
        상의할 수 있습니다.
      </Notice>
      <div className="flex flex-wrap gap-2">
        <LinkButton href="/records">기록 남기기 (선택)</LinkButton>
        <LinkButton href="/resources" variant="secondary">
          지원기관 보기
        </LinkButton>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer text-muted">다른 상황 선택하기</summary>
        <div className="mt-3">
          <IncidentTypeSelector value={incidentType} onChange={setIncidentType} />
        </div>
      </details>
    </div>
  );
}
