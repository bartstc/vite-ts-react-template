import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const useRelativeTime = () => {
  const { i18n } = useTranslation();

  return useCallback(
    (date: Date | string) => {
      const timeMs =
        date instanceof Date ? date.getTime() : new Date(date).getTime();
      const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
      const cutoffs = [
        60,
        3600,
        86400,
        86400 * 7,
        86400 * 30,
        86400 * 365,
        Infinity,
      ];
      const units = [
        "second",
        "minute",
        "hour",
        "day",
        "week",
        "month",
        "year",
      ];
      const unitIndex = cutoffs.findIndex(
        (cutoff) => cutoff > Math.abs(deltaSeconds)
      );
      const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

      const rtf = new Intl.RelativeTimeFormat(i18n.resolvedLanguage, {
        numeric: "auto",
      });

      return rtf.format(
        Math.floor(deltaSeconds / divisor),
        units[unitIndex] as Intl.RelativeTimeFormatUnit
      );
    },
    [i18n.resolvedLanguage]
  );
};
