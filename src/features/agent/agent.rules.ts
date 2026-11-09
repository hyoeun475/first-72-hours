import type { IncidentType, Urgency } from "./agent.types";

/** 즉각 위험이면 다른 어떤 안내보다 긴급 도움을 먼저 보여준다. */
export function shouldShowEmergencyFirst(urgency: Urgency | undefined): boolean {
  return urgency === "immediate_danger";
}

/** 판단이 어렵다고 답한 경우에도 긴급 경로를 부드럽게 안내한다. */
export function shouldOfferEmergencyGently(urgency: Urgency | undefined): boolean {
  return urgency === "unsure";
}

export const EMERGENCY_MESSAGE =
  "지금 위험하다면 먼저 안전을 확보하는 것이 가장 중요합니다. 대한민국에 계시다면 112로 연락할 수 있습니다. 다른 국가에 계시다면 그 지역의 긴급 신고 번호를 이용해 주세요. 안전해진 뒤에 언제든 다음 안내를 이어서 볼 수 있습니다.";

export const GENTLE_EMERGENCY_NOTICE =
  "판단이 어려운 것도 자연스러운 일입니다. 조금이라도 신체적 위협을 느낀다면 112 또는 여성긴급전화 1366에 연락할 수 있습니다.";

export const REASSURANCE_MESSAGE =
  "당신의 잘못이 아닙니다. 지금 필요한 도움을 함께 찾아보겠습니다.";

export const SUMMARY_DISCLAIMER =
  "이 문서는 이용자가 직접 입력한 내용을 정리한 상담·신고 준비용 참고 초안입니다. 경찰 진술서나 법률문서가 아니며, 법률적 판단이나 사실 확정을 포함하지 않습니다. 제출 전 내용을 직접 검토하고 수정해 주세요.";

export const NOT_A_DEADLINE_NOTICE =
  "'72시간'은 초기 대응을 돕는 서비스 이름일 뿐, 신고·삭제·지원 신청의 기한이 아닙니다. 언제든 도움을 요청할 수 있습니다.";

/** 유형별로 다음 행동 우선순위가 조금씩 다르다. */
export function primaryResourceIdsFor(type: IncidentType | undefined): string[] {
  switch (type) {
    case "distribution_found":
    case "deepfake":
      return ["d4u-center", "police-ecrm", "women-1366"];
    case "distribution_threat":
      return ["police-ecrm", "d4u-center", "women-1366"];
    case "suspected_recording":
      return ["police-112", "women-1366", "d4u-center"];
    case "unsure":
    default:
      return ["women-1366", "d4u-center", "police-112"];
  }
}
