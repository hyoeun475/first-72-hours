import { describe, expect, it } from "vitest";
import { generateSummary, summaryToText, CONFIRM_NEEDED } from "@/features/agent/summary.generator";
import type { IncidentRecord } from "@/features/agent/agent.types";

const base: IncidentRecord = {
  id: "r1",
  incidentType: "distribution_found",
  createdAt: "2026-11-09T05:00:00.000Z",
  status: "unreviewed",
};

describe("generateSummary", () => {
  it("기록이 없으면 모든 항목을 확인 필요로 표시한다", () => {
    const s = generateSummary([]);
    expect(s.incidentType).toBe(CONFIRM_NEEDED);
    expect(s.firstRecognizedAt).toBe(CONFIRM_NEEDED);
    expect(s.platformAndDiscoveryRoute).toBe(CONFIRM_NEEDED);
    expect(s.urls).toEqual([]);
    expect(s.itemsToConfirm.length).toBeGreaterThan(0);
  });

  it("입력한 사실만 포함하고 없는 사실은 추가하지 않는다", () => {
    const s = generateSummary([{ ...base, platform: "인스타그램", url: "https://example.com/p/1" }]);
    const text = summaryToText(s);
    expect(text).toContain("인스타그램");
    expect(text).toContain("https://example.com/p/1");
    expect(text).toContain("촬영물 유포 발견");
    // 입력하지 않은 계정명·메모가 어딘가 생성되지 않았는지: 계정/메모 라벨 자체가 없어야 한다
    expect(text).not.toMatch(/계정: /);
    expect(text).not.toMatch(/메모: /);
    // 죄명·유죄 판단 표현 금지
    expect(text).not.toMatch(/유죄|피의자|범죄자|성폭력처벌법/);
  });

  it("발견 시각 기준으로 시간순 정렬하고, 발견 시각이 없는 기록은 확인 필요로 표시한다", () => {
    const s = generateSummary([
      { ...base, id: "b", discoveredAt: "2026-11-08T10:00:00.000Z", notes: "두 번째" },
      { ...base, id: "a", discoveredAt: "2026-11-07T10:00:00.000Z", notes: "첫 번째" },
      { ...base, id: "c", notes: "시각 없음" },
    ]);
    expect(s.userProvidedTimeline[0]).toContain("첫 번째");
    expect(s.userProvidedTimeline[1]).toContain("두 번째");
    expect(s.userProvidedTimeline[2]).toContain(CONFIRM_NEEDED);
    expect(s.firstRecognizedAt).not.toBe(CONFIRM_NEEDED);
  });

  it("기록 시각과 발견 시각을 구분해서 표시한다", () => {
    const s = generateSummary([{ ...base, discoveredAt: "2026-11-01T00:00:00.000Z" }]);
    expect(s.userProvidedTimeline[0]).toMatch(/발견 .*\(기록 .*\)/);
  });

  it("면책 문구와 참고 초안 표시가 포함된다", () => {
    const text = summaryToText(generateSummary([base]));
    expect(text).toContain("참고 초안");
    expect(text).toContain("법률문서가 아니");
    expect(text).not.toContain("진술서 자동 작성");
  });
});
