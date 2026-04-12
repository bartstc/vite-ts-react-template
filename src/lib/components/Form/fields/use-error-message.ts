import { get } from "@/lib/get";

import { useFormContextSelector } from "../form-context";

export const useErrorMessage = (name: string): string | undefined => {
  return useFormContextSelector((state) =>
    get<string | undefined, typeof state.formState.errors, string>(
      state.formState.errors,
      `${name}.message`
    )
  );
};
