import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Product } from '@/lib/Product';
import AddtoCart from './AddtoCart';
import Link from 'next/link';
import HeartIcon from './Heart';

type Props = {
  products: Product[];
};

function ProductFeed({ products }: Props) {
  if (!products || products.length === 0) {
    return <div>Loading products...</div>;
  }
  const productsByCategory: { [key: string]: Product[] } = {};
  products.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });
  return (
    <div>
      {Object.keys(productsByCategory).map((category) => (
        <>
          <h2 className=' text-cyan-900 mb-2 font-monoton text-center font-extrabold text-3xl uppercase mt-2'>
            {category}
          </h2>
          <Carousel
            opts={{
              loop: true,
            }}
            className="ml-16 mr-16"
          >
            <CarouselContent>
              {productsByCategory[category].map((product) => (
                <CarouselItem
                  className="md:basis-1/2 lg:basis-1/4"
                  key={product.asin}
                >
                  <Card className="flex bg-slate-100 shadow-2xl h-full rounded-md ">
                    
                    <CardContent className=" flex flex-col justify-center items-center">
                      <Link
                        href={`/${product.asin}`}
                        className=" flex flex-col justify-center items-center"
                      >
                        <div className="flex relative h-48 w-48 mt-2 mb-2">
                          <Image
                            src={product.thumbnailImage}
                            alt="img"
                            fill={true}
                          />
                        </div>

                        <h3
                          className=" font-kalam text-xl
                       font-bold line-clamp-2"
                        >
                          {product.title}
                        </h3>
                      </Link>
                      <span className=" text-lg font-medium">
                        {' '}
                        &#x20B9; {product.price}
                      </span>
                      <AddtoCart product={product} />
                    </CardContent>
                    <span className="mr-2 mt-2 cursor-pointer">
                      <HeartIcon products={products} search={product.asin} />
                    </span>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      ))}
    </div>
  );
}

export default ProductFeed;
