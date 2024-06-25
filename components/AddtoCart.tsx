'use client';
import {Product, ProductswithID} from '@/lib/Product';
import { useCartStore } from '@/store';
import { Button } from './ui/button';
import RemoveFromCart from './RemoveFromCart';
import { useSession } from 'next-auth/react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useToast } from './ui/use-toast';

type Props = {
  product: Product;
};

function AddtoCart({ product }: Props) {
  const { data: session } = useSession();
  const [cart, addToCart] = useCartStore((state) => [
    state.cart,
    state.addToCart,
  ]);
  const [onCart, onAddtoCart] = useCartStore((state) => [
    state.onCart,
    state.onAddToCart,
  ]);
  const { toast } = useToast()

  const addToCartFirestore =  async (userID: string, product: Product) => {
    try {
      const cartRef = collection(db, `users/${userID}/cart`);
      await addDoc(cartRef, product);
    } catch (error) {
      console.error('Error adding to cart in Firestore:', error);
    }
  }

  const CartCount = cart.filter((item) => item.asin === product.asin).length;
  const OnCartCount = onCart.filter((item) => item.asin === product.asin).length;
  const handleAdd = async () => {
    if(session){
      await addToCartFirestore(session.user.id, product);
      const cartQuery = await getDocs(collection(db, `users/${session.user.id}/cart`));
      const cartWithIds: ProductswithID[] = cartQuery.docs.map((doc) => {
        // Extract data and ID from doc
        const {
          asin,
          title,
          brand,
          thumbnailImage,
          price,
          description,
          stars,
          reviewsCount,
          breadCrumbs,
          category,
        } = doc.data();
        const fireBaseid = doc.id;

        // Create a new object with ID and existing data
        return {
          fireBaseid,
          asin,
          title,
          brand,
          thumbnailImage,
          price,
          description,
          stars,
          reviewsCount,
          breadCrumbs,
          category,
        };       
      }) ;
      cartWithIds.forEach((item) => {
        const found = onCart.find((cartItem) => cartItem.fireBaseid === item.fireBaseid);
        if (!found) {
          onAddtoCart(item);
        }
      });
    } else {
      addToCart(product);
    }
    toast({
      className:"bg-black text-white",
      title: "Product Added To Cart"
    })
  };

  const isProductInCart = (session ? OnCartCount : CartCount)

  return (
    <>
      {isProductInCart ? (
        <div className="flex space-x-5 items-center">
          <RemoveFromCart product={product} />
          <span>{session ? OnCartCount : CartCount}</span>
          <Button  onClick={handleAdd}>
            +
          </Button>
        </div>
      ) : (
        <Button  onClick={handleAdd}>Add to Cart</Button>
      )}
    </>
  );
}

export default AddtoCart;
