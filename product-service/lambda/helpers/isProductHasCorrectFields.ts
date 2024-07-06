import { ProductWithoutId } from '../../types/product';

export const isProductHasCorrectFields = (product: ProductWithoutId) => {
  return !!product.title && !!product.description && !!product.price;
};
