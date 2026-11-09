/** 현재 시각을 ISO 문자열로 반환한다. 테스트에서 주입 가능하도록 함수로 둔다. */
export function nowIso(): string {
  return new Date().toISOString();
}

/** ISO 문자열을 사람이 읽기 쉬운 한국어 표기로 바꾼다. 파싱 실패 시 원문을 돌려준다. */
export function formatKo(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/** <input type="datetime-local"> 값(로컬 시각)을 ISO 문자열로 변환한다. */
export function localInputToIso(value: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

/** ISO 문자열을 <input type="datetime-local"> 형식(YYYY-MM-DDTHH:mm, 로컬)으로 변환한다. */
export function isoToLocalInput(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 시간순 정렬용 비교. 비어 있는 값은 뒤로 보낸다. */
export function compareIso(a: string | undefined, b: string | undefined): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return new Date(a).getTime() - new Date(b).getTime();
}
