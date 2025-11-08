import type {
  MachineContext,
  EventObject,
  ParameterizedObject,
  ActionArgs,
} from "xstate";

export type ProvidedAction<
  TContext extends MachineContext,
  TExpressionEvent extends EventObject,
  TEvent extends EventObject,
  TParams extends ParameterizedObject["params"] | undefined = undefined,
  TResponse = void,
> = (
  args: ActionArgs<TContext, TExpressionEvent, TEvent>,
  params: TParams
) => TResponse;
