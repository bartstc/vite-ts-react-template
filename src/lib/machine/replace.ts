import { assign } from "xstate";

/**
 * Replaces the current context of the machine.
 *
 * Similar behavior to `assign`, only that this action clears out any existing
 * context properties not returned by the assignment.
 *
 * @param assignment A function that returns an object that represents the new
 *   context which should replace the current.
 */
export const replace: typeof assign = (assignment) =>
  typeof assignment === "function"
    ? assign((args, params) => {
        const result = assignment(args, params);

        // Explicitly set omitted properties to `undefined`
        // to "erase" them from the context.
        const eraser: Record<string, unknown> = {};
        Object.keys(args.context).forEach((key) => {
          if (!(key in result)) {
            eraser[key] = undefined;
          }
        });

        return { ...result, ...eraser };
      })
    : assign(assignment);
