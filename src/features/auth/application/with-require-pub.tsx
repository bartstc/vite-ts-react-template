import { Component, type ComponentType } from "react";

import { type RequirePubProps, RequirePub } from "./RequirePub";

export function withRequirePub<Props>(
  Wrapper: ComponentType<Props>,
  props?: Omit<RequirePubProps, "children">
) {
  // eslint-disable-next-line react/display-name
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
