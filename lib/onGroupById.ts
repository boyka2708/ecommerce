import { ProductswithID } from '@/lib/Product';

function onGroupById(products: ProductswithID[]): Record<string, ProductswithID[]> {
  return products?.reduce(
    (accu: Record<string, ProductswithID[]>, currentProduct: ProductswithID) => {
      const id = currentProduct.asin;
      if (!accu[id]) {
        accu[id] = [];
      }
      accu[id].push(currentProduct);
      return accu;
    },
    {}
  );
}

export default onGroupById;
