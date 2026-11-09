import { compareIso, formatKo } from "@/lib/time";
import { SUMMARY_DISCLAIMER } from "./agent.rules";
import {
  INCIDENT_TYPE_LABELS,
  RECORD_STATUS_LABELS,
  type IncidentRecord,
  type IncidentSummary,
  type IncidentType,
} from "./agent.types";

export const CONFIRM_NEEDED = "확인 필요";

function clean(value: string | undefined): string | undefined {
  const t = value?.trim();
  return t ? t : undefined;
}

/**
 * 입력된 기록만으로 사건 정리 초안을 만든다.
 * - 사용자가 입력하지 않은 사실은 절대 추가하지 않는다.
 * - 비어 있는 항목은 '확인 필요'로 표시한다.
 * - 죄명·유죄 여부·가해자 신원을 판단하지 않는다.
 */
export function generateSummary(
  records: IncidentRecord[],
  fallbackType?: IncidentType,
): IncidentSummary {
  const sorted = [...records].sort((a, b) =>
    compareIso(a.discoveredAt ?? a.createdAt, b.discoveredAt ?? b.createdAt),
  );

  const typeSet = new Set<IncidentType>(sorted.map((r) => r.incidentType));
  if (typeSet.size === 0 && fallbackType) typeSet.add(fallbackType);
  const incidentType =
    typeSet.size > 0
      ? Array.from(typeSet).map((t) => INCIDENT_TYPE_LABELS[t]).join(", ")
      : CONFIRM_NEEDED;

  const discoveredTimes = sorted.map((r) => r.discoveredAt).filter((v): v is string => !!v);
  const firstRecognizedAt =
    discoveredTimes.length > 0 ? formatKo(discoveredTimes.sort(compareIso)[0]) : CONFIRM_NEEDED;

  const platforms = Array.from(
    new Set(sorted.map((r) => clean(r.platform)).filter((v): v is string => !!v)),
  );
  const platformAndDiscoveryRoute = platforms.length > 0 ? platforms.join(", ") : CONFIRM_NEEDED;

  const urls = Array.from(new Set(sorted.map((r) => clean(r.url)).filter((v): v is string => !!v)));

  const userProvidedTimeline = sorted.map((r) => {
    const parts: string[] = [];
    parts.push(r.discoveredAt ? `발견 ${formatKo(r.discoveredAt)}` : `발견 시각 ${CONFIRM_NEEDED}`);
    parts.push(`(기록 ${formatKo(r.createdAt)})`);
    parts.push(INCIDENT_TYPE_LABELS[r.incidentType]);
    const platform = clean(r.platform);
    if (platform) parts.push(`플랫폼: ${platform}`);
    const account = clean(r.accountLabel);
    if (account) parts.push(`계정: ${account}`);
    const notes = clean(r.notes);
    if (notes) parts.push(`메모: ${notes}`);
    return parts.join(" · ");
  });

  const actionsTaken = Array.from(
    new Set(sorted.map((r) => `진행 상태: ${RECORD_STATUS_LABELS[r.status]}`)),
  );

  const itemsToConfirm: string[] = [];
  if (discoveredTimes.length === 0) itemsToConfirm.push("최초 인지 일시");
  if (platforms.length === 0) itemsToConfirm.push("발견 경로 및 플랫폼");
  if (urls.length === 0) itemsToConfirm.push("URL 또는 계정 정보");
  if (sorted.every((r) => !clean(r.notes))) itemsToConfirm.push("사건 경위에 대한 이용자 설명");
  if (sorted.length === 0) itemsToConfirm.push("기록된 사건 정보가 없습니다. 기록을 추가하면 초안이 채워집니다.");

  return {
    incidentType,
    firstRecognizedAt,
    platformAndDiscoveryRoute,
    urls,
    userProvidedTimeline,
    actionsTaken,
    itemsToConfirm,
    disclaimer: SUMMARY_DISCLAIMER,
  };
}

/** 요약 객체를 복사·편집 가능한 텍스트로 바꾼다. */
export function summaryToText(summary: IncidentSummary): string {
  const lines: string[] = [];
  lines.push("[사건 정리 초안]");
  lines.push("");
  lines.push(`1. 사건 유형: ${summary.incidentType}`);
  lines.push(`2. 최초 인지 일시: ${summary.firstRecognizedAt}`);
  lines.push(`3. 발견 경로 및 플랫폼: ${summary.platformAndDiscoveryRoute}`);
  lines.push("4. URL 또는 계정 정보:");
  if (summary.urls.length === 0) lines.push(`   - ${CONFIRM_NEEDED}`);
  for (const u of summary.urls) lines.push(`   - ${u}`);
  lines.push("5. 이용자가 설명한 사건 경위 (시간순):");
  if (summary.userProvidedTimeline.length === 0) lines.push(`   - ${CONFIRM_NEEDED}`);
  for (const t of summary.userProvidedTimeline) lines.push(`   - ${t}`);
  lines.push("6. 현재까지 취한 조치:");
  if (summary.actionsTaken.length === 0) lines.push(`   - ${CONFIRM_NEEDED}`);
  for (const a of summary.actionsTaken) lines.push(`   - ${a}`);
  lines.push("7. 확인이 필요한 사항:");
  if (summary.itemsToConfirm.length === 0) lines.push("   - 없음");
  for (const i of summary.itemsToConfirm) lines.push(`   - ${i}`);
  lines.push("");
  lines.push(`※ ${summary.disclaimer}`);
  return lines.join("\n");
}
