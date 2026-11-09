"use client";

import { ResourceCard } from "@/components/ResourceCard";
import { LinkButton, Notice, PageTitle } from "@/components/ui";
import { SUPPORT_RESOURCES } from "@/data/support-resources.ko";
import { primaryResourceIdsFor } from "@/features/agent/agent.rules";
import { useSession } from "@/features/session/SessionProvider";

export default function ResourcesPage() {
  const { incidentType } = useSession();
  const priority = primaryResourceIdsFor(incidentType);
  const sorted = [...SUPPORT_RESOURCES].sort((a, b) => {
    const ia = priority.indexOf(a.id);
    const ib = priority.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div className="space-y-4">
      <PageTitle sub="공식 출처로 확인한 기관만 안내합니다. 연락 여부와 순서는 이용자가 선택할 수 있습니다.">
        지원기관
      </PageTitle>

      <Notice tone="accent" icon="🤝">
        어느 곳에 먼저 연락해도 괜찮습니다. 한 곳에 연락하면 다른 필요한 기관으로 연결해 주는 경우가 많습니다. 이
        앱은 신고나 삭제 요청을 대신 접수하지 않습니다.
      </Notice>

      <div className="space-y-3">
        {sorted.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <LinkButton href="/takedown" variant="secondary">
          플랫폼 삭제 요청 문안 만들기
        </LinkButton>
        <LinkButton href="/safety" variant="secondary">
          안전 계획
        </LinkButton>
      </div>

      <p className="text-xs text-muted">
        법률 지원과 국선변호 등 제도는 이용 조건과 절차가 달라질 수 있습니다. 이 앱은 개인별 자격을 판단하지 않으며,
        공식 안내 페이지에서 확인하도록 연결만 합니다.
      </p>
    </div>
  );
}
