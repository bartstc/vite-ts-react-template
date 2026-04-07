---
title: Frontend Model
category: Data Modeling
layer: models/
composedWith: dto-model
---

## Frontend Model

Frontend-friendly domain objects parsed or transformed from `dto-model`. Contains the shape your UI actually needs — renamed fields, computed properties, flattened nesting. Defined in `models/` of the feature slice.

### Constraints

- DTOs are the wire format, frontend models are the app format. When they diverge, map explicitly — don't let DTO shapes leak into components or application.
- Keep models as plain interfaces/types — no methods, no class instances. Domain logic lives in `value-object` if needed.
- If the DTO and frontend model are identical, skip the frontend model. Don't add a layer just for the sake of it.

### Example

```tsx
// models/product.ts — what the UI actually works with
export interface Product {
  id: string;
  name: string; // renamed from dto.title
  price: number;
  category: string;
  imageUrl: string; // renamed from dto.image
  rating: number; // flattened from dto.rating.rate
  reviewCount: number; // flattened from dto.rating.count
}
```
