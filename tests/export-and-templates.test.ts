import { describe, expect, it } from "vitest";
import { buildExportPayload, sanitizeRecord } from "@/lib/export";
import { fillTakedownTemplate, TAKEDOWN_TEMPLATES, CONFIRM_NEEDED } from "@/data/takedown-templates.ko";
import { validateRecordInput } from "@/lib/validation";
import type { IncidentRecord } from "@/features/agent/agent.types";

describe("export", () => {
  it("정의되지 않은 필드는 내보내기에 포함되지 않는다", () => {
    const dirty = {
      id: "x",
      incidentType: "deepfake",
      createdAt: "2026-11-09T00:00:00.000Z",
      status: "unreviewed",
      imageData: "base64...",
      password: "secret",
    } as unknown as IncidentRecord;
    const clean = sanitizeRecord(dirty);
    expect(Object.keys(clean).sort()).toEqual(["createdAt", "id", "incidentType", "status"]);
  });

  it("페이로드에 안내문과 스키마 버전이 있고 서버 관련 필드가 없다", () => {
    const p = buildExportPayload({ records: [], exportedAt: "2026-11-09T00:00:00.000Z" });
    expect(p.schemaVersion).toBe(1);
    expect(p.notice).toContain("이미지·영상은 포함되지 않습니다");
    expect(JSON.stringify(p)).not.toMatch(/token|userId|email/i);
  });
});

describe("takedown templates", () => {
  it("비어 있는 필드는 확인 필요로 채운다", () => {
    const text = fillTakedownTemplate(TAKEDOWN_TEMPLATES[0], { url: "https://example.com/x" });
    expect(text).toContain("https://example.com/x");
    expect(text).toContain(CONFIRM_NEEDED);
    expect(text).not.toMatch(/\{\{/);
  });

  it("삭제를 보장한다는 표현을 쓰지 않는다", () => {
    for (const t of TAKEDOWN_TEMPLATES) {
      expect(t.bodyTemplate).not.toMatch(/보장/);
    }
  });
});

describe("validation", () => {
  it("URL 형식이 아니면 오류를 돌려주고 비어 있으면 통과한다", () => {
    const bad = validateRecordInput({ incidentType: "unsure", status: "unreviewed", url: "not a url" });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.errors.url).toBeDefined();
    const empty = validateRecordInput({ incidentType: "unsure", status: "unreviewed", url: "" });
    expect(empty.ok).toBe(true);
  });

  it("공백만 있는 선택 필드는 undefined로 정리한다", () => {
    const res = validateRecordInput({ incidentType: "unsure", status: "unreviewed", platform: "   ", notes: " 메모 " });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data.platform).toBeUndefined();
      expect(res.data.notes).toBe("메모");
    }
  });
});
