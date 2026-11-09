import type { SupportResource } from "@/features/agent/agent.types";

/**
 * 공식 지원기관 정보.
 * - 공식 출처로 확인한 값만 넣는다. 추정값은 넣지 않는다.
 * - lastVerifiedAt은 이 파일의 정보를 공식 출처와 대조한 날짜다.
 * - 운영시간·지원 범위는 변동될 수 있으므로 화면에 '최신 확인 필요' 안내를 함께 표시한다.
 */
export const SUPPORT_RESOURCES: SupportResource[] = [
  {
    id: "police-112",
    name: "경찰 긴급신고 112",
    description:
      "지금 신체적 위험이 있거나 즉시 출동이 필요한 상황에서 연락할 수 있는 긴급 신고 번호입니다.",
    phone: "112",
    url: "https://www.police.go.kr",
    sourceLabel: "경찰청 누리집",
    lastVerifiedAt: "2026-11-09",
    note: "대한민국 기준 번호입니다. 다른 국가에 있다면 그 지역의 긴급 신고 번호를 이용해 주세요.",
  },
  {
    id: "women-1366",
    name: "여성긴급전화 1366",
    description:
      "성폭력·디지털 성범죄·스토킹·가정폭력 등으로 긴급한 상담과 보호가 필요할 때 연락할 수 있습니다. 365일 24시간 운영되며, 디지털 성범죄 대표 상담번호로도 안내되고 있습니다.",
    phone: "1366",
    url: "https://www.mogef.go.kr/sp/hrp/sp_hrp_f002.do",
    sourceLabel: "성평등가족부(구 여성가족부) 누리집",
    lastVerifiedAt: "2026-11-09",
    note: "국번 없이 1366. 모든 성별의 피해자가 상담받을 수 있습니다.",
  },
  {
    id: "d4u-center",
    name: "디지털성범죄피해자지원센터",
    description:
      "불법촬영물·합성물 삭제 지원, 유포 현황 모니터링, 상담 및 수사·법률·의료 지원 연계를 제공하는 공공 기관입니다. 한국여성인권진흥원이 운영합니다.",
    phone: "02-735-8994",
    url: "https://d4u.stop.or.kr",
    sourceLabel: "성평등가족부 누리집 기관 안내 및 센터 공식 누리집",
    lastVerifiedAt: "2026-11-09",
    note: "전화 상담 운영시간은 공식 누리집에서 확인해 주세요. 온라인 상담 신청도 가능합니다.",
  },
  {
    id: "police-ecrm",
    name: "경찰청 사이버범죄 신고시스템 (ECRM)",
    description:
      "경찰서를 방문하기 전에 온라인으로 사이버범죄 피해를 신고·상담할 수 있는 공식 시스템입니다. 접수 후 관할 경찰서에서 추가 안내를 받을 수 있습니다.",
    url: "https://ecrm.police.go.kr",
    sourceLabel: "경찰청 누리집",
    lastVerifiedAt: "2026-11-09",
    note: "신고 여부는 이용자가 선택할 수 있습니다. 이 앱은 신고를 대신 접수하지 않습니다.",
  },
  {
    id: "klac-132",
    name: "대한법률구조공단 132",
    description:
      "법률 상담을 받을 수 있는 공공 기관입니다. 무료 소송 지원은 소득 등 조건에 따라 달라질 수 있으므로 자격은 공단에서 직접 안내받아야 합니다.",
    phone: "132",
    url: "https://www.klac.or.kr",
    sourceLabel: "대한법률구조공단 누리집",
    lastVerifiedAt: "2026-11-09",
    note: "상담 운영시간은 공식 누리집에서 확인해 주세요. 이 앱은 개인별 지원 자격을 판단하지 않습니다.",
  },
];

export function getResourceById(id: string): SupportResource | undefined {
  return SUPPORT_RESOURCES.find((r) => r.id === id);
}
