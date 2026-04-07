---
title: Dto Model
category: Data Fetching
layer: lib/api/
composedWith: query-options-factory
---

## Dto Model

TypeScript interfaces representing raw API response shapes — the wire format. Never use directly in UI or application logic; map to domain models when the shape diverges. Co-located with the `query-options-factory` that fetches the data.

### Constraints

- DTOs mirror the API contract exactly — no transformations, no computed fields, no UI conveniences. If the API returns `snake_case`, the DTO uses `snake_case`.
- One DTO file per resource endpoint. Shared sub-types (like `Rating`) live in the same file if they're only used by that DTO.
- Enums in DTOs represent server-defined value sets. Use `enum` when the API guarantees a closed set, union types when it doesn't.

### Example

```tsx
export enum Category {
  Men_clothing = "men's clothing",
  Women_clothing = "women's clothing",
  Jewelery = "jewelery",
  Electronics = "electronics",
}

export interface Rating {
  rate: number;
  count: number;
}

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  category: Category;
  image: string;
  price: number;
  rating: Rating;
}
```
