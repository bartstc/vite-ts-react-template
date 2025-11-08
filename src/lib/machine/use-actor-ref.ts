/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { useActorRef as useXStateActorRef } from "@xstate/react";
import type {
  ActorOptions,
  AnyActorLogic,
  Observer,
  SnapshotFrom,
  IsNotNever,
  RequiredActorOptionsKeys,
  Actor,
} from "xstate";

import { Logger } from "@/lib/logger";

export function useActorRef<TLogic extends AnyActorLogic>(
  machine: TLogic,
  ...[options, observerOrListener]: IsNotNever<
    RequiredActorOptionsKeys<TLogic>
  > extends true
    ? [
        options: ActorOptions<TLogic> & {
          [K in RequiredActorOptionsKeys<TLogic>]: unknown;
        },
        observerOrListener?:
          | Observer<SnapshotFrom<TLogic>>
          | ((value: SnapshotFrom<TLogic>) => void),
      ]
    : [
        options?: ActorOptions<TLogic>,
        observerOrListener?:
          | Observer<SnapshotFrom<TLogic>>
          | ((value: SnapshotFrom<TLogic>) => void),
      ]
): Actor<TLogic> {
  const defaultErrorHandler = (error: unknown) => {
    // todo: notification
    console.error("Unexpected actor error:", error);
    Logger.error(
      error instanceof Error ? error.message : "Unexpected actor error",
      { type: "unexpected-actor-error" }
    );
  };

  const observerWithDefaults: Observer<SnapshotFrom<TLogic>> =
    observerOrListener && typeof observerOrListener === "object"
      ? {
          error: defaultErrorHandler,
          ...observerOrListener,
        }
      : typeof observerOrListener === "function"
        ? {
            next: observerOrListener,
            error: defaultErrorHandler,
          }
        : {
            error: defaultErrorHandler,
          };

  return useXStateActorRef(machine, options, observerWithDefaults);
}
