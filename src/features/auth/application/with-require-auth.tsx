import { Component, type ComponentType } from "react";

import { type RequireAuthProps, RequireAuth } from "./RequireAuth";

export function withRequireAuth<Props>(
  Wrapper: ComponentType<Props>,
  props?: Omit<RequireAuthProps, "children">
) {
  // eslint-disable-next-line react/display-name
  return class extends Component<Props> {
    render() {
      return (
        <RequireAuth to={props?.to}>
          <Wrapper {...this.props} />
        </RequireAuth>
      );
    }
  };
}
