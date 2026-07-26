import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { DateVO } from "@/lib/date/date";

type Format = "longTime" | "numeric";

const formats: Record<Format, Intl.DateTimeFormatOptions> = {
  longTime: {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  },
  numeric: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
};

interface Options {
  format: Format;
  fallback: string;
}

const defaultOptions: Options = {
  format: "longTime",
  fallback: "---",
};

export const useFormatDateTime = () => {
  const { i18n } = useTranslation();

  return useCallback(
    (date: Date | string, formatOptions?: Partial<Options>) => {
      const options: Options = {
        ...defaultOptions,
        ...(formatOptions ?? {}),
      };

      if (!DateVO.isValidDateFormat(date)) {
        return options.fallback;
      }

      return Intl.DateTimeFormat(
        i18n.resolvedLanguage,
        formats[options.format]
      ).format(typeof date === "string" ? new Date(date) : date);
    },
    [i18n.resolvedLanguage]
  );
};
