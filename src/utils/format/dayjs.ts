import day from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/pl";
import relativeTime from "dayjs/plugin/relativeTime";

import { locale } from "./locale";

day.locale(locale);
day.extend(relativeTime);

export { day as dayjs };
