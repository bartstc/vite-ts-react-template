import IntlMessageFormat, {
  PrimitiveType,
  FormatXMLElementFn,
} from "intl-messageformat";

type Format<T> =
  | Record<
      string,
      PrimitiveType | T | FormatXMLElementFn<T, string | T | (string | T)[]>
    >
  | undefined;

export function t<T = void>(message: string, values?: Format<T>) {
  return new IntlMessageFormat(message).format(values);
}
