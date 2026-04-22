import type { Month } from './mock-data';

export type PathType = 'no-code' | 'developer';

export function filterMonthsByPath(
  months: Month[],
  pathType: PathType,
): Month[] {
  return months
    .map((month) => ({
      ...month,
      weeks: month.weeks
        .map((week) => ({
          ...week,
          items: week.items.filter(
            (item) => item.pathType === undefined || item.pathType === pathType,
          ),
        }))
        .filter((week) => week.items.length > 0),
    }));
}
