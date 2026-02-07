import type { FlatNamespace, KeyPrefix } from "i18next";
import type { FallbackNs } from "react-i18next";
import { useTranslation } from "react-i18next";

type $Tuple<T> = readonly [T?, ...T[]];

export function useTranslations<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(namespace?: KPrefix) {
  return useTranslation<Ns, KPrefix>(undefined, { keyPrefix: namespace }).t;
}
