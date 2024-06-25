'use client';
import { Product } from '@/lib/Product';
import { useCartStore } from '@/store';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useToast } from './ui/use-toast';

type Props = {
  product: Product;
};

function RemoveFromCart({ product }: Props) {
  const { data: session } = useSession();
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const onCart = useCartStore((state) => state.onCart);
  const onRemoveFromCart = useCartStore((state) => state.onRemoveFromCart);
  const {toast} = useToast();
  const handleRemove = async () => {
    if (session) {
      const productToRemove = onCart.find((item) => item.asin === product.asin);
      try {
        const cartRef = doc(
          db,
          `users/${session.user.id}/cart/${productToRemove?.fireBaseid}`
        );
        await deleteDoc(cartRef);
        onRemoveFromCart(productToRemove!)
      } catch (error) {
        console.error('Error removing from cart in Firestore:', error);
      }
    } else {
      removeFromCart(product);
    }

    toast({
      variant: "destructive",
      description:"Product Removed From Cart"
    })
  };
  return <Button variant="destructive" onClick={handleRemove}>-</Button>;
}

export default RemoveFromCart;
