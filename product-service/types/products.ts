export interface Products {
    id: string,
    title: string,
    description: string,
    price: number
}

export type ProductWithoutId = Omit<Products, 'id'> & { count?: number }
