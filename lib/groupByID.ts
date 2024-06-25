import {Product} from './Product';

function groupByID(products: Product[]): Record<string, Product[]> {
  return products?.reduce(
    (accu: Record<string, Product[]>, currentProduct: Product) => {
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

export default groupByID;
