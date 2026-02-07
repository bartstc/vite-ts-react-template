type DateBase = string | Date;

export const generateDate = {
  now: () => new Date().toISOString(),
  given: (date: DateBase) => new Date(date).toISOString(),
  past: (min?: DateBase) => {
    const today = new Date();

    return range(
      min ?? new Date(today.getFullYear() - 1, today.getMonth()),
      today
    ).toISOString();
  },
  future: (max?: DateBase) => {
    const today = new Date();

    return range(
      today,
      max ?? new Date(today.getFullYear() + 1, today.getMonth())
    ).toISOString();
  },
};

const range = (min: DateBase, max: DateBase) => {
  const minValue = new Date(min).getTime();
  const maxValue = new Date(max).getTime();

  const timestamp = Math.floor(
    Math.random() * (maxValue - minValue + 1) + minValue
  );

  return new Date(timestamp);
};
