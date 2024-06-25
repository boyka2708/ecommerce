import {Product} from './Product'


export function getCartTotal(products:Product[]):string{
    const total =products.reduce(
        (acc: number, currentProduct: Product) =>acc + (currentProduct.price ),
        0
    );
  return ` ${total}`
}