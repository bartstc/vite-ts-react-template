import {
  createListCollection,
  Select,
  Spinner,
  useFieldContext,
} from "@chakra-ui/react";
import { useMemo, type ReactNode, type Ref } from "react";

import { useTranslations } from "@/lib/i18n/use-transations";

export interface OptionType<Value = string> {
  label: string;
  value: Value;
}

export interface SelectProps<Value = string> {
  options: OptionType<Value>[];
  value?: Value | Value[] | null;
  onChange?: (value: Value | Value[] | null) => void;
  onBlur?: () => void;
  isMulti?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  isInvalid?: boolean;
  inputId?: string;
  name?: string;
  inputRef?: Ref<HTMLButtonElement>;
  noOptionsMessage?: () => ReactNode;
  loadingMessage?: () => ReactNode;
}

function SelectInput<Value extends string | number = string>(
  props: SelectProps<Value>
) {
  const t = useTranslations("shared.form.select");
  const fieldContext = useFieldContext();
  const {
    options,
    value,
    onChange,
    onBlur,
    isMulti,
    isClearable,
    isDisabled,
    isLoading,
    placeholder,
    isInvalid,
    inputId,
    name,
    inputRef,
    noOptionsMessage,
    loadingMessage,
  } = props;

  const collection = useMemo(
    () =>
      createListCollection<OptionType<Value>>({
        items: options,
        itemToString: (item) => item.label,
        itemToValue: (item) => String(item.value),
      }),
    [options]
  );

  const selectedValues = useMemo<string[]>(() => {
    if (value == null) return [];
    if (Array.isArray(value)) return value.map(String);
    return [String(value)];
  }, [value]);

  const handleValueChange = ({ value: next }: { value: string[] }) => {
    if (!onChange) return;
    if (isMulti) {
      const mapped = next
        .map(
          (sv) =>
            options.find((o: OptionType<Value>) => String(o.value) === sv)
              ?.value
        )
        .filter((v): v is Value => v !== undefined);
      onChange(mapped.length ? mapped : null);
    } else {
      const found = options.find(
        (o: OptionType<Value>) => String(o.value) === next[0]
      );
      onChange(found?.value ?? null);
    }
  };

  const emptyContent = isLoading
    ? (loadingMessage?.() ?? t("loading", "Loading…"))
    : (noOptionsMessage?.() ?? t("noResults", "No results"));

  return (
    <Select.Root
      collection={collection}
      value={selectedValues}
      onValueChange={handleValueChange}
      multiple={isMulti}
      disabled={isDisabled ?? isLoading}
      name={name}
      onInteractOutside={() => onBlur?.()}
      // AIDEV-NOTE: ids.trigger registers our custom inputId with Zag.js so getTriggerEl
      // can find the element — without this, the dismiss exclude list gets null and the
      // same click that opens the select is immediately detected as "outside", closing it
      ids={{ trigger: inputId, label: fieldContext?.ids?.label }}
    >
      {/* AIDEV-NOTE: display:none forces true invisibility — visuallyHiddenStyle alone gets
          overridden by Chakra emotion styles, leaving a full-size native select on top of the trigger */}
      <Select.HiddenSelect style={{ display: "none" }} />
      <Select.Control aria-invalid={isInvalid ?? undefined}>
        <Select.Trigger ref={inputRef}>
          <Select.ValueText placeholder={placeholder ?? ""} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          {isLoading && <Spinner size="xs" />}
          {isClearable && <Select.ClearTrigger />}
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {collection.items.length === 0 || isLoading ? (
            <Select.Item
              item={{ label: "", value: "__empty__" }}
              _disabled={{}}
            >
              {emptyContent}
            </Select.Item>
          ) : (
            collection.items.map((item) => (
              <Select.Item key={String(item.value)} item={item}>
                <Select.ItemText>{item.label}</Select.ItemText>
                {isMulti && <Select.ItemIndicator />}
              </Select.Item>
            ))
          )}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

export { SelectInput };
