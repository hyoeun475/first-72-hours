import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RecordForm } from "@/components/RecordForm";

describe("RecordForm", () => {
  it("파일 첨부 입력이 존재하지 않는다", () => {
    render(<RecordForm onSubmit={() => {}} />);
    expect(document.querySelector('input[type="file"]')).toBeNull();
  });

  it("선택 항목을 비운 채 제출할 수 있고 입력값을 그대로 전달한다", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RecordForm onSubmit={onSubmit} defaultType="distribution_threat" />);

    await user.type(screen.getByLabelText(/플랫폼명/), "텔레그램");
    await user.type(screen.getByLabelText(/메모/), "협박 메시지 수신");
    await user.click(screen.getByRole("button", { name: "기록 저장" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0][0];
    expect(values.incidentType).toBe("distribution_threat");
    expect(values.platform).toBe("텔레그램");
    expect(values.notes).toBe("협박 메시지 수신");
    expect(values.url).toBeUndefined();
    expect(values.discoveredAt).toBeUndefined();
  });

  it("잘못된 URL이면 오류를 표시하고 제출하지 않는다", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RecordForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/URL/), "그냥 글자");
    await user.click(screen.getByRole("button", { name: "기록 저장" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByRole("alert")).toHaveTextContent(/https?:\/\//);
  });
});
