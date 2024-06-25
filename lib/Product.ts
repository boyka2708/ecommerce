export  interface Product {
    asin: string;
    title: string;
    brand: string;
    thumbnailImage: string;
    price: number;
    description: string | null;
    stars: number;
    reviewsCount: number;
    breadCrumbs: string;
    category: string;
  }

  
export  interface ProductswithID{
  asin: string;
  title: string;
  brand: string;
  thumbnailImage: string;
  price: number;
  description: string | null;
  stars: number;
  reviewsCount: number;
  breadCrumbs: string;
  category: string;
  fireBaseid: string;
}