// AIDEV-NOTE: XState emits `xstate.error.actor.${id}` on actor rejection. Declaring these
// in a machine's events union types `event.error` as TError, so guards/assign narrow it
// with `instanceof` instead of probing an `unknown` payload off the event.
export interface ErrorActorEvent<TId extends string, TError> {
  type: `xstate.error.actor.${TId}`;
  error: TError;
}
