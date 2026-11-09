"use client";

import { useSyncExternalStore } from "react";
import { EMERGENCY_MESSAGE } from "@/features/agent/agent.rules";
import { LinkButton, Notice } from "./ui";

/** tel: 링크는 전화 기능이 있을 가능성이 높은 환경(모바일 터치 기기)에서만 버튼으로 노출한다. */
export function useCanCall(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => {
      try {
        const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
        const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        return coarse || mobileUa;
      } catch {
        return false;
      }
    },
    () => false,
  );
}

export function EmergencyNotice({ compact = false }: { compact?: boolean }) {
  const canCall = useCanCall();
  return (
    <Notice tone="danger" icon="⚠" title="지금 위험하다면">
      <p>{EMERGENCY_MESSAGE}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {canCall ? (
          <LinkButton href="tel:112" external variant="primary">
            📞 112로 전화하기
          </LinkButton>
        ) : (
          <span className="rounded-lg bg-surface px-3 py-2 text-sm font-semibold">긴급 신고: 112 (대한민국)</span>
        )}
        {canCall ? (
          <LinkButton href="tel:1366" external variant="secondary">
            📞 1366 (24시간 상담)
          </LinkButton>
        ) : (
          <span className="rounded-lg bg-surface px-3 py-2 text-sm">여성긴급전화 1366 (24시간)</span>
        )}
      </div>
      {!compact && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>가능하다면 다른 사람이 있는 안전한 장소로 이동할 수 있습니다.</li>
          <li>믿을 수 있는 사람에게 지금 상황을 알리고 함께 있어 달라고 할 수 있습니다.</li>
          <li>상대방과 혼자 대면하지 않아도 됩니다.</li>
        </ul>
      )}
    </Notice>
  );
}
