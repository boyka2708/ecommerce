'use client';
import AddtoCart from '@/components/AddtoCart';
import HeartIcon from '@/components/Heart';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/lib/Product';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Data from '@/app/api/Data.json';

type Props = {
  params: {
    product: string;
  };
  searchParams: object;
};

async function Sorted(searchCategory: string, value: string) {
  const res = await fetch(
    `/api/sort?searchCategory=${searchCategory}&value=${value}`
  );
  const data = res.json();
  return data;
}

function Page(search: Props) {
  const [products, Setproducts] = useState<Product[]>(Data);
  const searchCategory = decodeURIComponent(search.params.product);
  const productsByCategory: { [key: string]: Product[] } = {};
  products?.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });
  const categoryProducts = productsByCategory[searchCategory];

  const handleChange = async (value: string) => {
    const res = await Sorted(searchCategory, value);
    Setproducts(res);
  };
  return (
    <main>
      <div className="relative left-2 mt-1">
        <Select onValueChange={handleChange}>
          <SelectTrigger className="w-[180px] bg-zinc-700">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Price</SelectLabel>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoryProducts.map((product: Product) => (
          <div
            key={product.asin}
            className="flex justify-center border rounded-lg mt-2 ml-2 bg-slate-100"
          >
            <div className="flex flex-col justify-center items-center">
              <Link
                href={`/${product.asin}`}
                className=" flex flex-col justify-center items-center"
              >
                <div className="flex relative h-48 w-48 mt-2 mb-2">
                  <Image src={product.thumbnailImage} alt="img" fill={true} />
                </div>
                <h3 className=" pl-2 text-xl font-bold line-clamp-2">
                  {product.title}
                </h3>
                <span className="text-lg font-medium">₹ {product.price}</span>
              </Link>
              <span className="mb-2 mt-1">
                {' '}
                <AddtoCart product={product} />
              </span>
            </div>
            <span className="mt-2 mr-2">
              <HeartIcon products={products!} search={product.asin} />
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Page;
