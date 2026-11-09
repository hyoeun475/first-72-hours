"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { Card, LinkButton, Notice, PageTitle } from "@/components/ui";
import { useSession } from "@/features/session/SessionProvider";

const SAFETY_ITEMS: { id: string; label: string; detail: string }[] = [
  {
    id: "safe-place",
    label: "지금 안전한 장소에 있다",
    detail: "아니라면 다른 사람이 있는 곳이나 믿을 수 있는 사람의 집으로 이동하는 것을 고려해 볼 수 있습니다.",
  },
  {
    id: "trusted-person",
    label: "믿을 수 있는 사람에게 알릴지 생각해 보았다",
    detail: "누구에게, 언제, 얼마나 알릴지는 전적으로 이용자의 선택입니다. 알리지 않기로 해도 괜찮습니다.",
  },
  {
    id: "no-confront",
    label: "상대방과 직접 대면하지 않아도 된다는 점을 알고 있다",
    detail: "상대방이 아는 사람이거나 가까운 관계라도, 혼자 만나거나 따질 의무는 없습니다. 전문기관과 함께 방법을 검토할 수 있습니다.",
  },
  {
    id: "password",
    label: "주요 계정 비밀번호를 바꿨다",
    detail: "메신저, SNS, 이메일, 클라우드 계정의 비밀번호를 바꾸고 다른 기기의 로그인 세션을 종료하는 것이 도움이 될 수 있습니다.",
  },
  {
    id: "2fa",
    label: "2단계 인증을 켰다",
    detail: "계정 설정에서 2단계 인증(OTP, 인증 앱 등)을 켜면 다른 사람의 접근을 줄이는 데 도움이 됩니다.",
  },
  {
    id: "shared-devices",
    label: "상대방이 접근할 수 있는 기기나 계정이 있는지 확인했다",
    detail: "공유했던 기기, 위치 공유, 클라우드 사진 동기화 등을 점검해 볼 수 있습니다. 확실하지 않으면 전문기관과 함께 확인해도 됩니다.",
  },
  {
    id: "emergency-plan",
    label: "위험해지면 연락할 곳을 정해 두었다",
    detail: "112(긴급), 1366(24시간 상담) 또는 믿을 수 있는 사람의 연락처를 바로 찾을 수 있게 두는 것이 도움이 됩니다.",
  },
];

function SafetyContent() {
  const params = useSearchParams();
  const { urgency } = useSession();
  const showEmergency = urgency === "immediate_danger" || params.get("emergency") === "1";
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      <PageTitle sub="선택형 점검 항목입니다. 체크 여부는 이 화면에만 머물고 저장되지 않습니다.">안전 계획</PageTitle>

      {showEmergency ? (
        <EmergencyNotice />
      ) : (
        <Notice tone="accent" icon="🛡" title="먼저 확인해 볼 것">
          지금 신체적 위협을 느낀다면 다른 안내보다 안전 확보가 우선입니다. 대한민국에서는 112, 상담은 1366(24시간)으로
          연락할 수 있습니다.
        </Notice>
      )}

      <Card>
        <h2 className="mb-2 text-base font-semibold">지금 점검해 볼 수 있는 항목</h2>
        <p className="mb-3 text-xs text-muted">
          모두 할 필요는 없습니다. 상황에 맞는 것만 골라 보세요. 관계 단절, 신고, 가족에게 알리기 등은 어느 것도
          강요되지 않습니다.
        </p>
        <ul className="space-y-2">
          {SAFETY_ITEMS.map((item) => (
            <li key={item.id} className="rounded-lg border border-border p-3">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  checked={!!checked[item.id]}
                  onChange={(e) => setChecked((c) => ({ ...c, [item.id]: e.target.checked }))}
                />
                <span>
                  <span className="font-medium">{item.label}</span>
                  <span className="mt-1 block text-xs text-muted">{item.detail}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <Notice tone="neutral">
        가해자가 아는 사람이거나 같이 사는 사람이라면, 어떤 행동이 상황을 악화시킬 수 있는지 전문기관과 함께 검토하는
        편이 안전합니다. 여성긴급전화 1366과 디지털성범죄피해자지원센터에서 상황에 맞는 안전 계획을 함께 세울 수
        있습니다.
      </Notice>

      <div className="flex flex-wrap gap-2">
        <LinkButton href="/resources">지원기관 보기</LinkButton>
        <LinkButton href="/guide" variant="secondary">
          대응 가이드
        </LinkButton>
      </div>
    </div>
  );
}

export default function SafetyPage() {
  return (
    <Suspense fallback={<PageTitle>안전 계획</PageTitle>}>
      <SafetyContent />
    </Suspense>
  );
}
