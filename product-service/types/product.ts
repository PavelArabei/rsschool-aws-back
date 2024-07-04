export interface Product {
  id: string,
  title: string,
  description: string,
  price: number
}

export type ProductWithoutId = Omit<Product, 'id'> & { count?: number }

export type Stock = {
  product_id: string,
  count: number
}

export type WholeProduct = Product & Omit<Stock, 'product_id'>
