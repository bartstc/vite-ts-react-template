import {
  createListCollection,
  Portal,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { useMemo, type ReactNode, type Ref } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    ? (loadingMessage?.() ?? t("shared.form.select.loading", "Loading…"))
    : (noOptionsMessage?.() ?? t("shared.form.select.noResults", "No results"));

  return (
    <Select.Root
      collection={collection}
      value={selectedValues}
      onValueChange={handleValueChange}
      multiple={isMulti}
      disabled={isDisabled ?? isLoading}
      name={name}
      onInteractOutside={() => onBlur?.()}
    >
      <Select.HiddenSelect />
      <Select.Control aria-invalid={isInvalid ?? undefined}>
        <Select.Trigger id={inputId} ref={inputRef}>
          <Select.ValueText placeholder={placeholder ?? ""} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          {isLoading && <Spinner size="xs" />}
          {isClearable && <Select.ClearTrigger />}
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
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
      </Portal>
    </Select.Root>
  );
}

export { SelectInput };
