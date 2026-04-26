import { useTranslation } from "react-i18next";

// AIDEV-NOTE: Maps a dotted prefix to an i18next namespace + keyPrefix so call sites
// can keep the "features.carts.item" / "pages.products" / "shared.x" form while
// resources live in flat per-area JSON files (carts.json, pages.json, shared.json...).
// The "features." prefix is stripped because nested directories under public/ caused
// HTTP backend loads to fail (only top-level locale files were resolved reliably).
function resolveNamespace(path: string) {
  const segments = path.split(".");

  if (segments[0] === "features" && segments[1]) {
    return {
      ns: segments[1],
      keyPrefix: segments.slice(2).join(".") || undefined,
    };
  }

  return {
    ns: segments[0],
    keyPrefix: segments.slice(1).join(".") || undefined,
  };
}

export function useTranslations(namespace: string) {
  const { ns, keyPrefix } = resolveNamespace(namespace);
  return useTranslation(ns, { keyPrefix }).t;
}
