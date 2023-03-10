import IntlMessageFormat, {
  PrimitiveType,
  FormatXMLElementFn,
} from "intl-messageformat";

import { locale } from "./locale";

type Format<T> =
  | Record<
      string,
      PrimitiveType | T | FormatXMLElementFn<T, string | T | (string | T)[]>
    >
  | undefined;

export function t<T = void>(message: string, values?: Format<T>) {
  return new IntlMessageFormat(message, locale).format(values) as string;
}
