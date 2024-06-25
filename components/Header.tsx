'use client';
import { getCartTotal } from '@/lib/getCartTotal';
import { useCartStore } from '@/store';
import { Heart, History, LocateIcon, Search, ShoppingCart } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import LoginButton from './LoginButton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

function Header() {
  const cart = useCartStore((state) => state.cart);
  const onCart = useCartStore((state) => state.onCart);
  const onFav = useCartStore((state) => state.onFav);
  const total = getCartTotal(cart);
  const onTotal = getCartTotal(onCart);
  const { data: session } = useSession();
  const { onSetCart, onSetFav } = useCartStore();
  
  useEffect(() => {
    const fetchCartAndFavFromFirestore = async (userID: string) => {
      try {
        const cartQuery = await getDocs(collection(db, `users/${userID}/cart`));
        const favQuery = await getDocs(collection(db, `users/${userID}/fav`));
        const cartWithIds = cartQuery.docs.map((doc) => {
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

        // Process favorite data
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

        const extraItems = cartWithIds.filter(
          (item) =>
            !onCart.some((cartItem) => cartItem.fireBaseid === item.fireBaseid)
        );
        onSetCart([...extraItems]);
        const extraFav = favWithIds.filter(
          (item) =>
            !onFav.some((favItem) => favItem.fireBaseid === item.fireBaseid)
        );
        onSetFav([...extraFav]);
      } catch (err) {
        console.error('Error', err);
      }
    };
    if (session?.user.id) {
      fetchCartAndFavFromFirestore(session.user.id);
    }
  }, [session?.user.id]);

  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <header className="flex flex-col md:flex-row bg-slate-700 items-center px-7 py-7 space-x-3">
      <Link href="/" className="mb-5 md:mb-0">
        <Image
          src="/logo.png"
          alt="logo"
          priority={true}
          height={100}
          width={100}
        />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-full w-full flex-1"
      >
        <input
          type="text"
          name="input"
          placeholder="Search Anything.."
          className="flex-1 text-black px-4 rounded-l-full outline-none placeholder:text-sm"
        />
        <button type="submit">
          <Search className="rounded-full h-10 px-2 w-10 bg-lime-400 cursor-pointer" />
        </button>
      </form>

      <div className="flex items-center space-x-5 mt-5 md:mt-0">
        {session ? <Link href={'/history'} className='flex items-center font-bold text-sm hover:bg-slate-800 hover:p-1 text-white space-x-2 rounded-md'>
          <History size={20} />
          <p> Previous Orders</p>
        </Link> : ''}
        <Link
          href={'/favourite'}
          className="flex text-white font-bold items-center space-x-2 rounded-md hover:bg-slate-800 hover:p-1 text-sm"
        >
          <Heart size={20} />
          <p>My Items</p>
        </Link>

        <div>
          {session ? (
            <LoginButton
              image={session?.user?.image}
              name={session?.user?.name}
            />
          ) : (
            <p
              className="text-white font-bold cursor-pointer"
              onClick={() => signIn()}
            >
              Sign In
            </p>
          )}
        </div>

        <Link
          href={'/basket'}
          className="flex text-white font-bold items-center space-x-2 text-sm"
        >
          <div className="flex flex-col text-white font-bold items-center space-x-2 text-sm relative">
            <ShoppingCart size={25} />
            <p className="absolute -top-2 right-0 px-2  bg-yellow-600 rounded-full text-sm">
              {session
                ? onCart.length > 0
                  ? `${onCart.length} `
                  : '0 '
                : cart.length > 0
                ? `${cart.length} `
                : '0 '}
            </p>
            <p className="text-sm">&#x20B9;{session ? onTotal : total}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
