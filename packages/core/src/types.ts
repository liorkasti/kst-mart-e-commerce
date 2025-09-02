export type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
  thumbnail?: string;
  images?: string[];
};

export type ProductsResponse = {
  products: Product[];
  total?: number;
  skip?: number;
  limit?: number;
};
