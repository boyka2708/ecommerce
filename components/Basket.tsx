'use client';
import { getCartTotal } from '@/lib/getCartTotal';
import groupByID from '@/lib/groupByID';
import { useCartStore } from '@/store';
import Image from 'next/image';
import AddtoCart from './AddtoCart';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import { onGetCartTotal } from '@/lib/onGetCartTotal';
import onGroupById from '@/lib/onGroupById';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useToast } from './ui/use-toast';
import { MouseEvent } from 'react';

type Props = {
  props: () => void | null,
};

const Basket = ({props}: Props) => {
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const onCart = useCartStore((state) => state.onCart);
  const clearBasket = useCartStore((state) => state.clearBasket);
  const onClearBasket = useCartStore((state) => state.onClearBasket);
  const basketTotal = getCartTotal(cart);
  const onBasketTotal = onGetCartTotal(onCart);
  const onGrouped = onGroupById(onCart);
  const grouped = groupByID(cart);
  const {toast} = useToast();
  const checkout = (event: MouseEvent<HTMLButtonElement>) => {
    props() 
  }
  
 async function handleClick() {
    if (session) {
      try {
        const cartRef = await getDocs((collection(
          db,
          `users/${session.user.id}/cart`
        )));
        cartRef.forEach((doc)=>{
          const docRef = doc.ref;
           deleteDoc(docRef);
        })
      } catch (error) {
        console.error('Error removing from cart in Firestore:', error);
      }
      onClearBasket();
    }else{
      clearBasket();
    }

    toast({
      description: "All items removed from cart!",
      variant: "destructive"
    })
  }


  return (
    <div className="max-w-7xl mx-auto">
      {session ? (
        <ul className="space-y-5 divide-y-2">
          {onCart.length > 0 ? (
            <Button onClick={handleClick}>Clear All</Button>
          ) : (
            <></>
          )}

          {Object.keys(onGrouped).map((id) => {
            const item = onGrouped[id][0];
            const total = onGetCartTotal(onGrouped[id]);

            return (
              <li
                key={item.fireBaseid}
                className="p-5 my-2 flex items-center justify-between"
              >
                {item.thumbnailImage && (
                  <Image
                    src={item.thumbnailImage}
                    alt={item.title}
                    width={100}
                    height={100}
                  />
                )}

                <div className="flex space-x-4 pl-4">
                  <div>
                    <p className="line-clamp-2 font-bold">{item.title}</p>
                  </div>

                  <div className="flex flex-col border rounded-md p-5">
                    <AddtoCart product={item} />

                    <p className="mt-4 font-bold text-right">{total}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="space-y-5 divide-y-2">
          {cart.length > 0 ? (
            <Button onClick={handleClick}>Clear All</Button>
          ) : (
            <></>
          )}

          {Object.keys(grouped).map((id) => {
            const item = grouped[id][0];
            const total = getCartTotal(grouped[id]);

            return (
              <li
                key={item.asin}
                className="p-5 my-2 flex items-center justify-between"
              >
                {item.thumbnailImage && (
                  <Image
                    src={item.thumbnailImage}
                    alt={item.title}
                    width={100}
                    height={100}
                  />
                )}

                <div className="flex space-x-4 pl-4">
                  <div>
                    <p className="line-clamp-2 font-bold">{item.title}</p>
                  </div>

                  <div className="flex flex-col border rounded-md p-5">
                    <AddtoCart product={item} />

                    <p className="mt-4 font-bold text-right">{total}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex flex-col justify-end p-5">
        <p className="font-bold text-2xl text-right mb-5">
          Total: &#x20B9; {session ? onBasketTotal : basketTotal}
        </p>
        <Button disabled={session ? false: true} onClick={checkout}>Checkout</Button>
      </div>
    </div>
  );
};

export default Basket;
