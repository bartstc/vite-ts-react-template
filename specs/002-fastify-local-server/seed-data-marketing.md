# Seed Data — Marketing

One marketing record per product (20 total). Each record tracks the product's rating (average + count).

The marketing module in the C# project only stores product IDs and ratings — no product details. Ratings are seeded with realistic-looking initial values so the demo app has data to display.

All `updatedAt` is `null`. `addedAt` should match the corresponding product catalog entry.

---

## Marketing Products

| id (matches product catalog)           | rate | count |
| -------------------------------------- | ---- | ----- |
| `4f968992-1aab-49c9-8913-09405915c1c0` | 3.9  | 120   |
| `4f968992-1aab-49c9-8913-09405915c1c1` | 4.1  | 259   |
| `4f968992-1aab-49c9-8913-09405915c1c2` | 4.7  | 500   |
| `4f968992-1aab-49c9-8913-09405915c1c3` | 2.1  | 430   |
| `4f968992-1aab-49c9-8913-09405915c1c4` | 4.6  | 400   |
| `4f968992-1aab-49c9-8913-09405915c1c5` | 3.9  | 70    |
| `4f968992-1aab-49c9-8913-09405915c1c6` | 3.0  | 400   |
| `4f968992-1aab-49c9-8913-09405915c1c7` | 1.9  | 100   |
| `4f968992-1aab-49c9-8913-09405915c1c8` | 3.3  | 203   |
| `4f968992-1aab-49c9-8913-09405915c1c9` | 2.9  | 470   |
| `4f968992-1aab-49c9-8913-09405915c1d0` | 4.8  | 319   |
| `4f968992-1aab-49c9-8913-09405915c1d1` | 4.8  | 400   |
| `4f968992-1aab-49c9-8913-09405915c1d2` | 3.7  | 250   |
| `4f968992-1aab-49c9-8913-09405915c1d3` | 2.2  | 140   |
| `4f968992-1aab-49c9-8913-09405915c1d4` | 2.6  | 235   |
| `4f968992-1aab-49c9-8913-09405915c1d5` | 2.9  | 340   |
| `4f968992-1aab-49c9-8913-09405915c1d6` | 3.8  | 679   |
| `4f968992-1aab-49c9-8913-09405915c1d7` | 4.7  | 130   |
| `4f968992-1aab-49c9-8913-09405915c1d8` | 4.5  | 146   |
| `4f968992-1aab-49c9-8913-09405915c1d9` | 3.6  | 145   |

## Marketing DTO Shape (for reference)

```json
{
  "id": "4f968992-1aab-49c9-8913-09405915c1c0",
  "rating": {
    "rate": 3.9,
    "count": 120
  },
  "addedAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": null
}
```

## Rating Calculation

When a user submits a new rating via `PATCH /api/marketing/products/:id/rate`:

```
newRate = round(((oldRate * oldCount) + submittedRating) / (oldCount + 1), 2)
newCount = oldCount + 1
```

Example: product has `rate: 3.9, count: 120`. User submits `rating: 5.0`:

```
newRate = round(((3.9 * 120) + 5.0) / 121, 2) = round(473.0 / 121, 2) = 3.91
newCount = 121
```
