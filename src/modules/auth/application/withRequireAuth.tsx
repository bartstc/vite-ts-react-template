import { Component, ComponentType } from "react";

import { IRequireAuthProps, RequireAuth } from "./RequireAuth";

export function withRequireAuth<Props>(
  Wrapper: ComponentType<Props>,
  props?: Omit<IRequireAuthProps, "children">
) {
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
