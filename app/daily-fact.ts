/** Select one stable fact for each Singapore calendar day. */
export function dailyFactIndex(length: number, date = new Date()) {
  if (length <= 1) return 0;
  const singaporeDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  let value = 0;
  for (const character of singaporeDay) value = (value * 31 + character.charCodeAt(0)) >>> 0;
  return value % length;
}
