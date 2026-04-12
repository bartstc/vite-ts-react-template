---
title: Form
category: Component Patterns
layer: components/
composedWith: use-case-hook
---

## Form

Context-driven form built on the project's `useForm` / `FormProvider` abstraction over react-hook-form. Use for any user input that submits data — creation forms, edit forms, settings panels, inline editors. Skip for single uncontrolled inputs (search bars, filters) that don't need validation or submit handling.

### Constraints

- ALWAYS add `noValidate` to the `<form>` element — without it, native browser validation fires before react-hook-form, blocking error messages
- ALWAYS type the form with an explicit `interface` for field values — pass it as the generic to `useForm<MyValues>()`
- Use `FormProvider` at the form root. Field components (`TextInput`, `SelectInput`, `NumberInput`, `MoneyInput`, `TextareaInput`) read `control` and `configuration` from context — no prop drilling
- Use the `register` prop on field components for custom validation rules beyond `isRequired`
- Wire `onSubmit` through `form.handleSubmit(handler)` — never call the handler directly
- Set `configuration` in `useForm()` for form-wide visual settings (`size`, `variant`, `autoValidation`). Use `setConfiguration` only for runtime changes

### Conditional Fields

- MUST define conditional field components at **module scope** — never inside the parent component. Inline definitions cause React to remount the field on every parent re-render, destroying field state
- Use `useFieldBasedCondition` to toggle visibility based on another field's value. It handles value caching (when `keepHiddenFieldValue: true`) and cleanup automatically
- Use `useCondition` (lower-level) when you already have a derived boolean from outside the form

### Available Field Components

All fields accept: `name` (required), `label`, `isRequired`, `isDisabled`, `register`. They auto-display validation errors.

| Component       | Stored type        | Notes                                                                      |
| --------------- | ------------------ | -------------------------------------------------------------------------- |
| `TextInput`     | `string`           | Supports `type` (`email`, `password`, etc.)                                |
| `SelectInput`   | `Value \| Value[]` | `isMulti` for multi-select, trigger is `<button role="combobox">` in tests |
| `NumberInput`   | `number \| null`   | Chakra stepper + input                                                     |
| `MoneyInput`    | `number \| null`   | Left addon with `symbol` prop (`$`, `€`)                                   |
| `TextareaInput` | `string`           | Same as TextInput minus `type` and `autofocus`                             |

### Example

```tsx
// ✅ Correct — conditional field at module scope, noValidate, typed values
interface ProductValues {
  name: string;
  price: number;
  hasCoupon: string;
  couponCode: string;
}

const CouponField = () => {
  const isVisible = useFieldBasedCondition<ProductValues>("couponCode", {
    name: "hasCoupon",
    condition: (val) => (val as unknown as string) === "yes",
    defaultValue: "",
  });

  if (!isVisible) return null;
  return <TextInput name="couponCode" label="Coupon Code" />;
};

const CreateProductForm = ({
  onSubmit,
}: {
  onSubmit: (v: ProductValues) => void;
}) => {
  const form = useForm<ProductValues>({
    configuration: { autoValidation: true, size: "md" },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <TextInput name="name" label="Product Name" isRequired />
        <MoneyInput name="price" label="Price" symbol="$" isRequired />
        <SelectInput
          name="hasCoupon"
          label="Has Coupon?"
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
        />
        <CouponField />
        <button type="submit">Create</button>
      </form>
    </FormProvider>
  );
};
```

### Anti-Patterns

- **Prop-drilling control/configuration** — passing `control` or field config as props instead of using `FormProvider` context. Breaks the abstraction and creates coupling
- **Skipping the `register` prop** — adding validation via raw `useController` or `useFormContext` when the field component already accepts `register` for custom rules
- **Testing SelectInput with `getByLabelText`** — the select trigger is `<button role="combobox">`, use `getByRole("combobox", { name: "Label" })` instead

### References

- `@src/lib/components/Form/` — source for `useForm`, `FormProvider`, all field components
- `@src/lib/components/Form/Form.mdx` — full API documentation with props tables
