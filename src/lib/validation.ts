import { z } from "zod";
import { INCIDENT_TYPES, RECORD_STATUSES } from "@/features/agent/agent.types";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max}자 이내로 입력해 주세요.`)
    .optional()
    .transform((v) => (v ? v : undefined));

/** URL은 느슨하게 검사한다. 이용자가 정확히 기억하지 못할 수 있으므로 http(s) 형식만 권장한다. */
const optionalUrl = z
  .string()
  .trim()
  .max(2048, "URL이 너무 깁니다.")
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^https?:\/\/\S+$/i.test(v), {
    message: "http:// 또는 https:// 로 시작하는 주소를 입력해 주세요. 기억나지 않으면 비워 두어도 됩니다.",
  });

export const recordInputSchema = z.object({
  incidentType: z.enum(INCIDENT_TYPES),
  url: optionalUrl,
  platform: optionalTrimmed(100),
  accountLabel: optionalTrimmed(100),
  discoveredAt: z
    .string()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || !Number.isNaN(new Date(v).getTime()), {
      message: "올바른 날짜와 시각을 입력해 주세요.",
    }),
  notes: optionalTrimmed(4000),
  status: z.enum(RECORD_STATUSES),
});

export type RecordInput = z.infer<typeof recordInputSchema>;

export type FieldErrors = Partial<Record<keyof RecordInput, string>>;

export function validateRecordInput(
  raw: unknown,
): { ok: true; data: RecordInput } | { ok: false; errors: FieldErrors } {
  const result = recordInputSchema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof RecordInput | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
