export function formatBigNumber(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    const v = abs / 1_000_000;
    const s = v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
    return `${sign}${s}M`;
  }
  if (abs >= 1000) {
    const v = abs / 1000;
    const s = v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
    return `${sign}${s}K`;
  }
  return `${sign}${Math.round(abs)}`;
}

export function formatTrafficAxis(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000) {
    const v = n / 1000;
    const s = v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
    return `${s} K`;
  }
  return `${Math.round(n)}`;
}

export function deltaParts(
  current: number,
  previous: number | null | undefined
): { text: string; up: boolean } | null {
  if (previous == null) return null;
  const d = current - previous;
  if (d === 0) return { text: "0", up: true };
  const up = d > 0;
  const body = formatBigNumber(d);
  return { text: up ? `+${body}` : body, up };
}

export function shortMonthLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleString("en", { month: "short" });
}
