import { describe, expect, it } from "vitest";
import { getAgentResponse } from "@/features/agent/agent.flow";
import { INCIDENT_TYPES } from "@/features/agent/agent.types";
import { getResponseGuide, RESPONSE_GUIDES } from "@/data/response-guides.ko";

describe("getAgentResponse", () => {
  it("모든 피해 유형에 대해 가이드로 이어지는 응답을 준다", () => {
    for (const type of INCIDENT_TYPES) {
      const res = getAgentResponse({ incidentType: type, urgency: "not_immediate" });
      expect(res.message.length).toBeGreaterThan(0);
      expect(res.nextActions[0].id).toBe("guide");
      expect(res.nextActions.map((a) => a.id)).toContain("resources");
    }
  });

  it("유형 미선택 시 선택을 안내하고 다음 행동을 제시한다", () => {
    const res = getAgentResponse({});
    expect(res.message).toContain("잘 모르겠음");
    expect(res.nextActions.length).toBeGreaterThan(0);
  });

  it("판단하기 어렵다를 선택하면 부드러운 긴급 안내를 덧붙인다", () => {
    const res = getAgentResponse({ incidentType: "unsure", urgency: "unsure" });
    expect(res.safetyNotice).toMatch(/112|1366/);
  });
});

describe("response guides", () => {
  it("모든 유형에 3~6개 범위의 짧은 단계 안내가 있다", () => {
    for (const guide of Object.values(RESPONSE_GUIDES)) {
      for (const list of [guide.canDoNow, guide.avoid, guide.helpfulToRecord, guide.whenToContactExperts]) {
        expect(list.length).toBeGreaterThanOrEqual(2);
        expect(list.length).toBeLessThanOrEqual(6);
      }
    }
  });

  it("단정적 명령이나 기한 압박 표현을 쓰지 않는다", () => {
    const forbidden = [/반드시/, /72시간 안에/, /늦는다/, /당신 탓/];
    for (const guide of Object.values(RESPONSE_GUIDES)) {
      const text = JSON.stringify(guide);
      for (const re of forbidden) expect(text).not.toMatch(re);
    }
  });

  it("getResponseGuide는 유형과 일치하는 가이드를 돌려준다", () => {
    expect(getResponseGuide("deepfake").incidentType).toBe("deepfake");
  });
});
