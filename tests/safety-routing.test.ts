import { describe, expect, it } from "vitest";
import { getAgentResponse } from "@/features/agent/agent.flow";
import { primaryResourceIdsFor, shouldShowEmergencyFirst } from "@/features/agent/agent.rules";
import { SUPPORT_RESOURCES } from "@/data/support-resources.ko";

describe("긴급 분기", () => {
  it("즉각 위험이면 긴급 안내가 가장 먼저 온다", () => {
    const res = getAgentResponse({ incidentType: "distribution_threat", urgency: "immediate_danger" });
    expect(res.nextActions[0].id).toBe("emergency");
    expect(res.message).toContain("112");
    expect(res.safetyNotice).toBeDefined();
  });

  it("유형을 고르지 않아도 즉각 위험이면 긴급 안내를 먼저 보여준다", () => {
    const res = getAgentResponse({ urgency: "immediate_danger" });
    expect(res.nextActions[0].id).toBe("emergency");
  });

  it("shouldShowEmergencyFirst는 immediate_danger에서만 참", () => {
    expect(shouldShowEmergencyFirst("immediate_danger")).toBe(true);
    expect(shouldShowEmergencyFirst("not_immediate")).toBe(false);
    expect(shouldShowEmergencyFirst("unsure")).toBe(false);
    expect(shouldShowEmergencyFirst(undefined)).toBe(false);
  });
});

describe("지원기관 데이터", () => {
  it("모든 기관에 공식 URL, 출처, 확인일이 있다", () => {
    for (const r of SUPPORT_RESOURCES) {
      expect(r.url).toMatch(/^https:\/\//);
      expect(r.sourceLabel.length).toBeGreaterThan(0);
      expect(r.lastVerifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("112와 1366이 포함된다", () => {
    const phones = SUPPORT_RESOURCES.map((r) => r.phone);
    expect(phones).toContain("112");
    expect(phones).toContain("1366");
  });

  it("유형별 우선 기관 ID는 모두 실제 데이터에 존재한다", () => {
    const ids = new Set(SUPPORT_RESOURCES.map((r) => r.id));
    for (const type of ["suspected_recording", "distribution_found", "distribution_threat", "deepfake", "unsure", undefined] as const) {
      for (const id of primaryResourceIdsFor(type)) expect(ids.has(id)).toBe(true);
    }
  });
});
