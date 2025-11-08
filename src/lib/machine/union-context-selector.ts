/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "@xstate/react";
import type { ActorRef, MachineSnapshot, SnapshotFrom } from "xstate";

export const useUnionContextSelector = <
  Selected,
  UnionContext extends { type: string },
  Context extends { type: string },
>(
  actor: ActorRef<
    MachineSnapshot<Context, any, any, any, any, any, any, any>,
    any
  >,
  unionType: Context["type"] | Context["type"][],
  selector: (
    state: MachineSnapshot<UnionContext, any, any, any, any, any, any, any>
  ) => Selected
) => {
  const allowedTypes = Array.isArray(unionType) ? unionType : [unionType];

  return useSelector(actor, (state) =>
    allowedTypes.includes(state?.context.type)
      ? selector(
          state as unknown as SnapshotFrom<
            ActorRef<
              MachineSnapshot<UnionContext, any, any, any, any, any, any, any>,
              any
            >
          >
        )
      : undefined
  );
};
