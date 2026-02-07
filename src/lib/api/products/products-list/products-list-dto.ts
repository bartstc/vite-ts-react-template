import type { Meta } from "@/types/meta";

import type { ProductDto } from "../{product-id}/product-dto";

export interface ProductsListDto {
  products: ProductDto[];
  meta: Meta;
}
