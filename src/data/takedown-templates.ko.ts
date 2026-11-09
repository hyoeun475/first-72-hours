import type { TakedownTemplate } from "@/features/agent/agent.types";

/**
 * 플랫폼 유형별 삭제·차단 요청 문안 템플릿.
 * - 템플릿은 법률문서가 아니며, 플랫폼이 삭제를 보장한다는 표현을 쓰지 않는다.
 * - {{필드명}} 자리에 이용자가 입력한 값이 들어간다. 비어 있으면 '확인 필요'로 표시한다.
 * - 플랫폼 공식 신고 페이지 URL은 공식 출처로 확인된 경우에만 넣는다. 확인되지 않은 URL은 비워 둔다.
 */
export const TAKEDOWN_TEMPLATES: TakedownTemplate[] = [
  {
    id: "sns",
    platformCategory: "SNS",
    platformName: "SNS (인스타그램, X, 페이스북 등)",
    title: "SNS 게시물 삭제 요청 문안",
    requiredFields: ["url", "discoveredAt", "reason"],
    bodyTemplate: `안녕하세요.

아래 게시물은 제 동의 없이 게시된 성적 촬영물 또는 합성물로, 제 인격권과 사생활을 침해하고 있습니다. 해당 게시물과 관련 계정에 대한 삭제·차단 조치를 요청드립니다.

- 게시물 URL: {{url}}
- 게시자 계정: {{accountLabel}}
- 발견 일시: {{discoveredAt}}
- 요청 사유: {{reason}}

저는 해당 콘텐츠의 당사자이며, 이 콘텐츠의 게시에 동의한 적이 없습니다. 빠른 검토와 조치를 부탁드립니다.

감사합니다.`,
    sourceLabel: "일반 문안 (플랫폼별 신고 양식은 각 플랫폼 공식 도움말에서 확인)",
  },
  {
    id: "community",
    platformCategory: "커뮤니티",
    platformName: "커뮤니티·게시판 사이트",
    title: "커뮤니티 게시물 삭제 요청 문안",
    requiredFields: ["url", "discoveredAt", "reason"],
    bodyTemplate: `운영자님께.

아래 게시물은 제 동의 없이 게시된 성적 촬영물 또는 합성물입니다. 피해 당사자로서 해당 게시물의 삭제와 게시자에 대한 조치를 요청드립니다.

- 게시물 URL: {{url}}
- 게시자 표시명: {{accountLabel}}
- 발견 일시: {{discoveredAt}}
- 요청 사유: {{reason}}

삭제 처리 결과를 회신해 주시면 감사하겠습니다. 필요한 경우 관련 기관(디지털성범죄피해자지원센터, 경찰)과 함께 절차를 진행할 예정입니다.

감사합니다.`,
    sourceLabel: "일반 문안",
  },
  {
    id: "messenger",
    platformCategory: "메신저",
    platformName: "메신저·오픈채팅",
    title: "메신저 계정·대화방 신고 문안",
    requiredFields: ["accountLabel", "discoveredAt", "reason"],
    bodyTemplate: `신고 내용

아래 계정(또는 대화방)에서 제 동의 없이 성적 촬영물 또는 합성물이 공유되거나, 이를 유포하겠다는 협박이 있었습니다. 해당 계정에 대한 이용 제한과 관련 콘텐츠 삭제를 요청드립니다.

- 계정명 / 대화방: {{accountLabel}}
- 관련 링크 (있는 경우): {{url}}
- 발생 일시: {{discoveredAt}}
- 신고 사유: {{reason}}

저는 피해 당사자이며, 필요한 경우 수사기관의 요청에 따라 추가 정보를 제공할 수 있습니다.`,
    sourceLabel: "일반 문안",
  },
  {
    id: "video",
    platformCategory: "동영상 플랫폼",
    platformName: "동영상 플랫폼",
    title: "동영상 삭제 요청 문안",
    requiredFields: ["url", "discoveredAt", "reason"],
    bodyTemplate: `안녕하세요.

아래 영상은 제 동의 없이 게시된 성적 촬영물 또는 합성 영상으로, 제 사생활과 인격권을 심각하게 침해합니다. 피해 당사자로서 해당 영상의 삭제와 업로더 계정에 대한 조치를 요청드립니다.

- 영상 URL: {{url}}
- 업로더 계정: {{accountLabel}}
- 발견 일시: {{discoveredAt}}
- 요청 사유: {{reason}}

빠른 검토를 부탁드립니다. 감사합니다.`,
    sourceLabel: "일반 문안",
  },
  {
    id: "other",
    platformCategory: "기타",
    platformName: "기타 사이트",
    title: "일반 삭제 요청 문안",
    requiredFields: ["url", "discoveredAt", "reason"],
    bodyTemplate: `담당자님께.

아래 주소에 제 동의 없이 게시된 성적 촬영물 또는 합성물이 있어 삭제를 요청드립니다.

- URL: {{url}}
- 게시자 (확인된 경우): {{accountLabel}}
- 발견 일시: {{discoveredAt}}
- 요청 사유: {{reason}}

저는 해당 콘텐츠의 당사자이며 게시에 동의한 적이 없습니다. 조치 결과를 알려 주시면 감사하겠습니다.`,
    sourceLabel: "일반 문안",
  },
];

export function getTakedownTemplate(id: string): TakedownTemplate | undefined {
  return TAKEDOWN_TEMPLATES.find((t) => t.id === id);
}

export type TakedownFields = {
  url?: string;
  accountLabel?: string;
  discoveredAt?: string;
  reason?: string;
};

export const CONFIRM_NEEDED = "확인 필요";

/** 템플릿의 {{필드}} 자리를 입력값으로 채운다. 비어 있으면 '확인 필요'. */
export function fillTakedownTemplate(
  template: TakedownTemplate,
  fields: TakedownFields,
): string {
  return template.bodyTemplate.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = fields[key as keyof TakedownFields];
    const trimmed = value?.trim();
    return trimmed ? trimmed : CONFIRM_NEEDED;
  });
}
