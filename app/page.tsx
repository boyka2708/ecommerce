import GridOption from '@/components/GridOption';
import ProductFeed from '@/components/ProductFeed';
import { Product } from '@/lib/Product';
import Data from '@/app/api/Data.json'

export default function Home() {
  const products: Product[] = Data;

  return (
    <main>
      <div className="grid grid-cols-1 grid-flow-row-dense md:grid-cols-4 gap-6 m-6">
        <GridOption
          title="Home Entertainment"
          image="https://homes4india.com/wp-content/uploads/2023/07/01.-Home-Theatre-1080x675.jpg"
          className="bg-pink-200 h-full md:h-32"
        />

        <GridOption
          title="Men's Clothing"
          image="https://images.squarespace-cdn.com/content/v1/547a3834e4b053a861c4874e/ae4ecac8-eb46-460f-9fd1-0d3f29e87c4b/Sustainably+Chic+%7C+Sustainable+Fashion+Blog+%7C+Best+Sustainable+Mens+Clothing+Brands+.jpg"
          className="bg-blue-100 col-span-2 row-span-2"
        />
        <GridOption
          title= "SmartPhones"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1eAQM1tCxQx6El0_UVxA2MOtrG3YhLmLDvQ&s"
          className="bg-pink-200 row-span-2"
        />
        <GridOption
          title="Camera"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrbjuw-aXQvnjYJTklZTtmCPlViPgi8LJYRj3S2Kw-MQ&s"
          className="bg-yellow-100 h-64"
        />
        <GridOption
          title= "Women's Clothing"
          image="https://www.shutterstock.com/image-photo/fashionable-clothes-boutique-store-london-600nw-589577570.jpg"
          className="bg-green-100 h-64 col-span-2"
        />
        <GridOption
          title="Pet Supplies"
          image="https://closerpets.co.uk/cdn/shop/articles/andrew-s-ouo1hbizWwo-unsplash.jpg?v=1653055595"
          className="bg-red-100 col-span-2 row-span-2"
        />
        <GridOption
          title= "Laptop"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ45jO5uSF_p_n61GS1xSd9TeaGRcbyR0i3pfl4AMdVMQ&s"
          className="bg-orange-100 h-64"
        />
        <GridOption
          title="Movies"
          image="https://i.ebayimg.com/images/g/oE8AAOSwKTdj4KBx/s-l1200.webp"
          className="bg-blue-100 h-64"
        />
        <GridOption
          title="Sports"
          image="https://links.papareact.com/sq2"
          className="bg-blue-100 h-64"
        />
        <GridOption
          title="SmartWatch"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-HQyzlPXLtHJgfS-zJjl7d6VPe7HTzVm_T3bMqxdj9g&s"
          className="bg-rose-100 h-64"
        />
        <GridOption
          title="Backpacks"
          image="https://d1nymbkeomeoqg.cloudfront.net/photos/28/60/407515_12136_XXL.jpg"
          className="bg-orange-200 h-64 col-span-2"
        />
      </div>
      <div className='hidden sm:block'>
      <ProductFeed products={products} />
      </div>
    </main>
  );
}
