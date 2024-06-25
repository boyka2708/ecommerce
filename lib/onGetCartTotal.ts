import {ProductswithID} from './Product'


export function onGetCartTotal(products:ProductswithID[]):string{
    const total =products.reduce(
        (acc: number, currentProduct: ProductswithID) =>acc + (currentProduct.price ),
        0
    );
  return ` ${total.toFixed(2)}`
}