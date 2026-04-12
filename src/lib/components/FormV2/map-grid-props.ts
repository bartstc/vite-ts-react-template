import { type ConditionalValue } from "@chakra-ui/react";

export type GridProp =
  | "colSpan"
  | "colStart"
  | "colEnd"
  | "rowEnd"
  | "rowStart"
  | "rowSpan";

type SpanValue = ConditionalValue<number | "auto">;

export function mapGridProps({
  colSpan,
  colStart,
  colEnd,
  rowEnd,
  rowSpan,
  rowStart,
}: Record<GridProp, SpanValue | undefined>): Record<string, unknown> {
  const raw: Record<string, unknown> = {
    gridColumn: spanFn(colSpan),
    gridRow: spanFn(rowSpan),
    gridColumnStart: colStart,
    gridColumnEnd: colEnd,
    gridRowStart: rowStart,
    gridRowEnd: rowEnd,
  };
  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined)
  );
}

function spanFn(span?: SpanValue): unknown {
  if (span == null) return undefined;
  if (span === "auto") return "auto";
  if (typeof span === "number") return `span ${span}/span ${span}`;
  // Responsive object — map each breakpoint value
  if (typeof span === "object") {
    return Object.fromEntries(
      Object.entries(span as Record<string, number | "auto">).map(
        ([bp, val]) => [bp, val === "auto" ? "auto" : `span ${val}/span ${val}`]
      )
    );
  }
  return undefined;
}
