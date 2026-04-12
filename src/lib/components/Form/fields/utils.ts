import { equals } from "ramda";
import { type PropsWithChildren } from "react";

export const propsAreEqual = <IProps>(
  propsA: Readonly<PropsWithChildren<IProps>>,
  propsB: Readonly<PropsWithChildren<IProps>>
) => {
  if (propsA === propsB) return true;
  return equals(propsA, propsB);
};
