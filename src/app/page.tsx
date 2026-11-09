"use client";

import Link from "next/link";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { IncidentTypeSelector, UrgencySelector } from "@/components/IncidentTypeSelector";
import { Card, LinkButton, Notice, PageTitle } from "@/components/ui";
import { getAgentResponse } from "@/features/agent/agent.flow";
import { NOT_A_DEADLINE_NOTICE, REASSURANCE_MESSAGE } from "@/features/agent/agent.rules";
import { useSession } from "@/features/session/SessionProvider";

export default function HomePage() {
  const { incidentType, urgency, setIncidentType, setUrgency } = useSession();
  const response = getAgentResponse({ incidentType, urgency });
  const emergency = urgency === "immediate_danger";

  return (
    <div className="space-y-5">
      <PageTitle sub={NOT_A_DEADLINE_NOTICE}>첫 72시간</PageTitle>

      <Notice tone="accent" icon="🌱">
        <p className="text-base font-medium">{REASSURANCE_MESSAGE}</p>
        <p className="mt-1 text-xs text-muted">
          이 앱은 입력한 내용을 서버나 외부 AI로 보내지 않습니다. 기록은 기본적으로 이 화면을 닫으면 사라집니다.
        </p>
      </Notice>

      <Card>
        <UrgencySelector value={urgency} onChange={setUrgency} />
      </Card>

      {emergency && <EmergencyNotice />}

      <Card>
        <IncidentTypeSelector value={incidentType} onChange={setIncidentType} />
      </Card>

      <Card className="space-y-3">
        <p className="text-sm">{response.message}</p>
        {response.safetyNotice && !emergency && (
          <Notice tone="warn" icon="ℹ">
            {response.safetyNotice}
          </Notice>
        )}
        <ul className="grid gap-2">
          {response.nextActions.map((action, i) => (
            <li key={action.id}>
              <Link
                href={action.href}
                className={`block rounded-lg border px-3 py-3 transition hover:bg-accent-soft ${
                  i === 0 ? "border-accent bg-accent-soft" : "border-border"
                }`}
              >
                <span className="block text-sm font-semibold">{action.label}</span>
                <span className="block text-xs text-muted">{action.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        {!incidentType && !emergency && (
          <p className="text-xs text-muted">상황을 선택하면 맞춤 가이드와 기록 도구가 열립니다.</p>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        <LinkButton href="/resources" variant="secondary">
          지원기관 바로 보기
        </LinkButton>
        <LinkButton href="/safety" variant="secondary">
          안전 계획
        </LinkButton>
      </div>

      <p className="text-xs text-muted">
        이 서비스는 교육·지원 목적의 프로토타입입니다. 수사기관, 변호사, 상담사를 대체하지 않습니다. 화면 캡처나 알림을
        통해 내용이 노출될 수 있으니 주변을 확인해 주세요.
      </p>
    </div>
  );
}
