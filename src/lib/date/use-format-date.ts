import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { DateVO } from "@/lib/date/date";

type Format = "long" | "short" | "longWithoutDay";

const formats: Record<Format, Intl.DateTimeFormatOptions> = {
  long: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  short: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
  longWithoutDay: {
    year: "numeric",
    month: "long",
  },
};

interface Options {
  format: Format;
  fallback: string;
}

const defaultOptions: Options = {
  format: "short",
  fallback: "---",
};

export const useFormatDate = () => {
  const { i18n } = useTranslation();

  return useCallback(
    (date: Date | string, formatOptions?: Partial<Options>) => {
      const options = {
        ...defaultOptions,
        ...(formatOptions ?? {}),
      };

      if (!DateVO.isValidDateFormat(date)) {
        return options.fallback as unknown as string;
      }

      return Intl.DateTimeFormat(
        i18n.resolvedLanguage,
        formats[options.format]
      ).format(typeof date === "string" ? new Date(date) : date);
    },
    [i18n.resolvedLanguage]
  );
};
