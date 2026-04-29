import { useCallback, useEffect, useMemo } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useWatch,
} from "react-hook-form";

import { useConfigurationValue, useFormContextSelector } from "./form-context";

type Cache = Map<string, unknown>;

const caches = new Map<string, Cache>();

const getCaches = (id: string) => {
  const cache = caches.get(id);

  if (!cache) {
    const newCache: Cache = new Map();
    caches.set(id, newCache);
    return newCache;
  }

  return cache;
};

export const useCache = () => {
  const id = useFormContextSelector((state) => state.id);
  return useMemo(() => getCaches(id), [id]);
};

export const useSave = () => {
  const setValue = useFormContextSelector((state) => state.setValue);
  const cache = useCache();

  return useCallback(
    (name: string) => {
      const value = cache.get(name);

      if (!value) return;

      // AIDEV-NOTE: setValue accepts any value by RHF design (FieldValues = Record<string, any>)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(name as any, value as any, { shouldDirty: true });
      cache.delete(name);
    },
    [cache, setValue]
  );
};

export const useRemove = (keepValue = true) => {
  const getValues = useFormContextSelector((state) => state.getValues);
  const setValue = useFormContextSelector((state) => state.setValue);
  const cache = useCache();
  const unregister = useFormContextSelector((state) => state.unregister);

  return useCallback(
    (name: string, defaultValue?: unknown) => {
      // AIDEV-NOTE: getValues returns any by RHF design when TFieldValues = FieldValues
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = getValues(name as any) as unknown;

      if (!keepValue) unregister(name as never);

      if (!value) return;

      if (keepValue) {
        cache.set(name, value);
      }

      if (defaultValue !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue(name as any, defaultValue as any);
        unregister(name as never, { keepValue: true });
        return;
      }

      unregister(name as never);
    },
    [cache, getValues, keepValue, setValue, unregister]
  );
};

interface UseConditionOption {
  keepValue?: boolean;
  hiddenFieldValue?: unknown;
}

export const useCondition = (
  name: string,
  visibleWhen: boolean,
  { keepValue, hiddenFieldValue }: UseConditionOption = {}
) => {
  const keepHiddenFieldValue = useConfigurationValue("keepHiddenFieldValue");
  const insert = useSave();
  const remove = useRemove(keepValue ?? keepHiddenFieldValue);

  useEffect(
    function syncFieldVisibility() {
      if (!visibleWhen) {
        // eslint-disable-next-line react-you-might-not-need-an-effect/no-pass-data-to-parent
        remove(name, hiddenFieldValue);
      } else {
        insert(name);
      }
    },
    [visibleWhen, hiddenFieldValue, insert, name, remove]
  );

  return visibleWhen;
};

// AIDEV-NOTE: works correctly only when `fields.name` points to a simple (non-nested) field
export const useFieldBasedCondition = <Values extends FieldValues>(
  name: string,
  fields: {
    name: FieldPath<Values>;
    condition: (values: Partial<Values>) => boolean;
    defaultValue?: unknown;
  }
) => {
  const control = useFormContextSelector((state) => state.control);

  const value = useWatch({
    control: control as Control<Values>,
    name: fields.name,
  });

  return useCondition(name, fields.condition(value as Partial<Values>), {
    hiddenFieldValue: fields.defaultValue,
  });
};
