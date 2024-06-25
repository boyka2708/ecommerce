'use client';
import { db } from '@/firebase';
import { Product, ProductswithID } from '@/lib/Product';
import { useCartStore } from '@/store';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';

type Props = {
  products: Product[];
  search: string;
};

function HeartIcon({ products, search }: Props) {
  const { data: session } = useSession();
  const [isHeartFilled, setIsHeartFilled] = useState<boolean>(false);
  const addToFavorites = useCartStore((state) => state.addFavourites);
  const onAddToFavourites = useCartStore((state) => state.onAddFavourites);
  const removeFromFavorites = useCartStore((state) => state.removeFavourites);
  const onRemoveFromFavourites = useCartStore(
    (state) => state.onRemoveFromFavourites
  );
  const fav = useCartStore((state) => state.fav);
  const onFav = useCartStore((state) => state.onFav);
  const product = products.find((item) => item.asin === search);
  const isFavorite = fav.some((p: Product) => p.asin === product?.asin);
  const onIsFavorite = onFav.some(
    (p: ProductswithID) => p.asin === product?.asin
  );

  const addToFavFirestore = async (userID: string, product: Product) => {
    try {
      const favRef = collection(db, `users/${userID}/fav`);
      await addDoc(favRef, product);
    } catch (error) {
      console.error('Error adding to fav in Firestore:', error);
    }
  };

  const removeFavFirestore = async (userID: string, product: string) => {
    try {
      const cartRef = doc(db, `users/${userID}/fav/${product}`);
      await deleteDoc(cartRef);
    } catch (error) {
      console.error('Error removing from cart in Firestore:', error);
    }
  };

  const handleHeartClick = async () => {
    if (session) {
      if (onIsFavorite) {
        const productToRemove = onFav.find(
          (item) => item.asin === product?.asin
        );
        await removeFavFirestore(session.user.id, productToRemove?.fireBaseid!);
        onRemoveFromFavourites(productToRemove!);
      } else {
        await addToFavFirestore(session.user.id, product!);
        const favQuery = await getDocs(
          collection(db, `users/${session.user.id}/fav`)
        );
        const favWithIds = favQuery.docs.map((doc) => {
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
        });

        favWithIds.forEach((item) => {
          const found = onFav.find(
            (cartItem) => cartItem.fireBaseid === item.fireBaseid
          );
          if (!found) {
            onAddToFavourites(item);
          }
        });
      }
    } else {
      if (isHeartFilled) {
        removeFromFavorites(product!);
        setIsHeartFilled(false);
      } else {
        addToFavorites(product!);

        setIsHeartFilled(true);
      }
    }
  };

  return (
    <>
      <Heart
      //relative right-20 mt-4 cursor-pointer
        fill={
          isHeartFilled || (session ? onIsFavorite : isFavorite)
            ? 'red'
            : 'none'
        }
        onClick={handleHeartClick}
      />
    </>
  );
}

export default HeartIcon;
