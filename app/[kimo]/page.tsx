import AddtoCart from '@/components/AddtoCart';
import HeartIcon from '@/components/Heart';
import { Product } from '@/lib/Product';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Data from '@/app/api/Data.json'

type Props = {
  params: {
    kimo: string;
  };
  searchParams: object;
};



export default function Page(search: Props) {
  const products: Product[] = Data;
  const product = products.find((item) => item.asin === search.params.kimo);
  return (
    <>
      {product ? (
        <>
          <div className="flex items-center justify-between">
            <Link href={`product/${product.category}`}>
              <h1 className=" text-lg font-normal ml-3 mt-2 uppercase rounded-2xl inline-block px-2 shadow-xl bg-slate-200">
                {product.category}
              </h1>
            </Link>
            <h1 className="mr-9 text-lg rounded-full px-2 mt-2 shadow-xl bg-slate-200 font-normal pt-1">
              {product.stars}{' '}
              <StarIcon className="inline pb-1 fill-amber-500" />
              {`(${product.reviewsCount})`}
            </h1>
          </div>

          <div className="flex">
            <Image
              alt="logo"
              src={product.thumbnailImage}
              width={250}
              height={250}
              className='mx-auto'
            />
            <span className='mr-4 mt-2'>
            <HeartIcon products={products} search={search.params.kimo} />
            </span>
          </div>

          <p className="text-xl font-semibold mt-2 mb-2 text-center">
            {product.title}
          </p>
          <div className="flex justify-center mb-2">
            <AddtoCart product={product} />
          </div>

          <hr />
          <p className="text-xl font-semibold p-1">
            Price:
            <span className="font-bold">
              {' '}
              &#x20B9; {product.price}
            </span>
          </p>
          <p className="text-xl font-semibold p-1">
            Description:{' '}
            <span className="font-normal">{product.description}</span>
          </p>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
