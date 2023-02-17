import { dayjs } from "./dayjs";
import { getLocale } from "./locale";

class DateObject {
  static formatDate(
    date: string | Date,
    format = getLocale().dateFormat
  ): string {
    if (!date) {
      return "---";
    }

    return dayjs(date).format(format);
  }

  static formatDateTime(
    date: string | Date,
    format = getLocale().dateTimeFormat
  ): string {
    if (!date) {
      return "---";
    }

    return dayjs(date).format(format);
  }

  static formatRelativeTime(
    date: string | Date,
    format = getLocale().dateTimeFormat
  ): string {
    if (!date) {
      return "---";
    }

    return dayjs().to(date);
  }
}

export { DateObject as Date };
