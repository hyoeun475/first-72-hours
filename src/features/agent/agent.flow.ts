import { getResponseGuide } from "@/data/response-guides.ko";
import {
  EMERGENCY_MESSAGE,
  GENTLE_EMERGENCY_NOTICE,
  REASSURANCE_MESSAGE,
  shouldOfferEmergencyGently,
  shouldShowEmergencyFirst,
} from "./agent.rules";
import type { AgentInput, AgentResponse, NextAction } from "./agent.types";

const ACTION_GUIDE: NextAction = {
  id: "guide",
  label: "상황별 대응 가이드 보기",
  description: "선택한 상황에 맞는 짧은 단계 안내를 확인합니다.",
  actionType: "navigate",
  href: "/guide",
};

const ACTION_RECORD: NextAction = {
  id: "record",
  label: "기록 남기기 (선택)",
  description: "URL, 플랫폼, 발견 시각, 메모 같은 글 정보만 기록합니다.",
  actionType: "open_form",
  href: "/records",
};

const ACTION_SUMMARY: NextAction = {
  id: "summary",
  label: "사건 정리 초안 만들기 (선택)",
  description: "입력한 기록만으로 상담·신고 준비용 참고 초안을 만듭니다.",
  actionType: "navigate",
  href: "/summary",
};

const ACTION_RESOURCES: NextAction = {
  id: "resources",
  label: "지원기관 확인",
  description: "공식 출처로 확인한 상담·신고·삭제 지원 경로를 봅니다.",
  actionType: "show_resource",
  href: "/resources",
};

const ACTION_SAFETY: NextAction = {
  id: "safety",
  label: "안전 계획 살펴보기",
  description: "지금 안전한지 확인하고 선택할 수 있는 안전 항목을 봅니다.",
  actionType: "navigate",
  href: "/safety",
};

const ACTION_EMERGENCY: NextAction = {
  id: "emergency",
  label: "긴급 도움 안내 보기",
  description: "112 등 긴급 신고 경로와 지금 할 수 있는 일을 먼저 안내합니다.",
  actionType: "show_resource",
  href: "/safety?emergency=1",
};

/**
 * 규칙 기반 에이전트. 외부 LLM 없이 상태에 따라 메시지와 다음 행동을 돌려준다.
 * - 즉각 위험이면 긴급 안내를 가장 먼저 제시한다.
 * - 사용자가 말하지 않은 사실을 추가하지 않는다.
 */
export function getAgentResponse(input: AgentInput): AgentResponse {
  const { incidentType, urgency } = input;

  if (shouldShowEmergencyFirst(urgency)) {
    return {
      message: EMERGENCY_MESSAGE,
      nextActions: [ACTION_EMERGENCY, ACTION_SAFETY, ACTION_RESOURCES, ACTION_GUIDE],
      safetyNotice: "안전이 확보된 뒤에 원하면 일반 안내를 이어서 볼 수 있습니다.",
    };
  }

  if (!incidentType) {
    return {
      message: `${REASSURANCE_MESSAGE} 먼저 지금 상황에 가장 가까운 항목을 골라 주세요. 잘 모르겠다면 '잘 모르겠음'을 선택해도 괜찮습니다.`,
      nextActions: [ACTION_RESOURCES, ACTION_SAFETY],
      safetyNotice: shouldOfferEmergencyGently(urgency) ? GENTLE_EMERGENCY_NOTICE : undefined,
    };
  }

  const guide = getResponseGuide(incidentType);
  const nextActions: NextAction[] = [ACTION_GUIDE, ACTION_RECORD, ACTION_SUMMARY, ACTION_RESOURCES, ACTION_SAFETY];

  return {
    message: `${guide.title}. ${guide.intro}`,
    nextActions,
    safetyNotice: shouldOfferEmergencyGently(urgency) ? GENTLE_EMERGENCY_NOTICE : undefined,
  };
}
