export type DateString =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export function isValidDateString(date: string): boolean {
  return /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(date);
}

export function formatToDateString(date: Date): DateString {
  console.log({ date });
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}` as DateString;

  if (!isValidDateString(dateStr)) {
    throw new Error('Invalid date format');
  }

  return dateStr;
}

export function isWithin30Days(referenceDate: DateString): boolean {
  const referenceDateObj = new Date(referenceDate);
  return (new Date().getTime() - referenceDateObj.getTime()) / (1000 * 60 * 60 * 24) <= 30;
}
