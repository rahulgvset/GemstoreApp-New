const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const istFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatIST(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${istFormatter.format(d)} IST`;
}

/**
 * Returns the UTC instant range [startUTC, endUTC) covering one IST calendar
 * day, where daysAgo=0 is "today" in IST and daysAgo=9 is 9 days back.
 */
export function getISTDayRangeUTC(daysAgo: number): {
  startUTC: Date;
  endUTC: Date;
  label: string;
} {
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  const y = nowIST.getUTCFullYear();
  const m = nowIST.getUTCMonth();
  const d = nowIST.getUTCDate();

  const targetISTMidnight = Date.UTC(y, m, d - daysAgo, 0, 0, 0, 0);
  const startUTC = new Date(targetISTMidnight - IST_OFFSET_MS);
  const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
  const label = new Date(targetISTMidnight).toISOString().slice(0, 10);

  return { startUTC, endUTC, label };
}

export function istDateKey(date: Date): string {
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}
