import { Component, ComponentType } from "react";

import { IRequirePubProps, RequirePub } from "./RequirePub";

export function withRequirePub<Props>(
  Wrapper: ComponentType<Props>,
  props?: Omit<IRequirePubProps, "children">
) {
  return class extends Component<Props> {
    render() {
      return (
        <RequirePub to={props?.to}>
          <Wrapper {...this.props} />
        </RequirePub>
      );
    }
  };
}
