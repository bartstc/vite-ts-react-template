type DateBase = string | Date;

export class DateVO {
  static isValidDateFormat = (date: unknown) =>
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    !!date && !isNaN(Date.parse(date.toString?.()));

  static isDateBefore = (dateToCheck: DateBase, referenceDate: DateBase) => {
    const parsedDateToCheck =
      typeof dateToCheck === "string" ? new Date(dateToCheck) : dateToCheck;
    const parsedReferenceDate =
      typeof referenceDate === "string"
        ? new Date(referenceDate)
        : referenceDate;

    return parsedDateToCheck < parsedReferenceDate;
  };

  static isDateAfter = (dateToCheck: DateBase, referenceDate: DateBase) => {
    const parsedDateToCheck =
      typeof dateToCheck === "string" ? new Date(dateToCheck) : dateToCheck;
    const parsedReferenceDate =
      typeof referenceDate === "string"
        ? new Date(referenceDate)
        : referenceDate;

    return parsedDateToCheck > parsedReferenceDate;
  };

  static now = () => new Date().toISOString();

  static given = (date: DateBase) => new Date(date).toISOString();

  static past = (min?: DateBase) => {
    const today = new Date();

    return DateVO.range(
      min ?? new Date(today.getFullYear() - 1, today.getMonth()),
      today
    ).toISOString();
  };

  static future = (max?: DateBase) => {
    const today = new Date();

    return DateVO.range(
      today,
      max ?? new Date(today.getFullYear() + 1, today.getMonth())
    ).toISOString();
  };

  static range = (min: DateBase, max: DateBase) => {
    const minValue = new Date(min).getTime();
    const maxValue = new Date(max).getTime();

    const timestamp = Math.floor(
      Math.random() * (maxValue - minValue + 1) + minValue
    );

    return new Date(timestamp);
  };
}
