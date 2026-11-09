"use client";

import type { SupportResource } from "@/features/agent/agent.types";
import { useCanCall } from "./EmergencyNotice";
import { Card, LinkButton } from "./ui";

export function ResourceCard({ resource }: { resource: SupportResource }) {
  const canCall = useCanCall();
  return (
    <Card>
      <h2 className="text-base font-semibold">{resource.name}</h2>
      <p className="mt-1 text-sm">{resource.description}</p>
      {resource.note && <p className="mt-2 text-xs text-muted">{resource.note}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {resource.phone &&
          (canCall ? (
            <LinkButton href={`tel:${resource.phone.replace(/-/g, "")}`} external variant="primary">
              📞 {resource.phone}
            </LinkButton>
          ) : (
            <span className="inline-flex min-h-11 items-center rounded-lg bg-accent-soft px-4 text-sm font-semibold">
              📞 {resource.phone}
            </span>
          ))}
        <LinkButton href={resource.url} external variant="secondary">
          공식 누리집 열기 ↗
        </LinkButton>
      </div>
      <p className="mt-3 text-xs text-muted">
        출처: {resource.sourceLabel} · 확인일: {resource.lastVerifiedAt}. 운영시간과 지원 범위는 변경될 수 있어 최신
        정보는 공식 누리집에서 확인해 주세요.
      </p>
    </Card>
  );
}
