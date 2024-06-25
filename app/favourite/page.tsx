'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/firebase';
import { useCartStore } from '@/store';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {};

const Fav = (props: Props) => {
  const clearFavourites = useCartStore((state) => state.clearFavourites);
  const fav = useCartStore((state) => state.fav);
  const onFav = useCartStore((state) => state.onFav);
  const onClearFavourites = useCartStore((state) => state.onClearFavourites);
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleClick = async () => {
    if (session) {
      try {
        const cartRef = await getDocs(
          collection(db, `users/${session.user.id}/fav`)
        );
        cartRef.forEach((doc) => {
          const docRef = doc.ref;
          deleteDoc(docRef);
        });
      } catch (error) {
        console.error('Error removing from cart in Firestore:', error);
      }
      onClearFavourites();
    } else {
      clearFavourites();
    }

    toast({
      description: 'All products removed Successfully!',
      variant: 'destructive',
    });
  };
  return (
    <div className="max-w-7xl mx-auto">
      {session ? (
        <ul className="space-y-5 divide-y-2">
          {onFav.length > 0 ? (
            <Button onClick={handleClick} className="mt-2 ml-2">
              Clear All
            </Button>
          ) : (
            <></>
          )}
          {onFav.length > 0 ? (
            onFav.map((id) => {
              return (
                <Link key={id.asin} href={`/${id.asin}`}>
                  <li
                    key={id.fireBaseid}
                    className="p-5 my-2 flex items-center justify-between border-4 rounded-xl"
                  >
                    {id.thumbnailImage && (
                      <Image
                        src={id.thumbnailImage}
                        alt={id.title}
                        width={100}
                        height={100}
                      />
                    )}

                    <div className="flex space-x-4 pl-4">
                      <div>
                        <p className="line-clamp-1 font-bold">{id.title}</p>
                      </div>
                    </div>
                  </li>
                </Link>
              );
            })
          ) : (
            <div className=" text-center text-4xl mt-12">
              You have no Favourites yet!!
            </div>
          )}
        </ul>
      ) : (
        <ul className="space-y-5 divide-y-2">
          {fav.length > 0 ? (
            <Button onClick={handleClick} className="mt-2 ml-2">
              Clear All
            </Button>
          ) : (
            <></>
          )}

          {fav.length > 0 ? (
            fav.map((id) => {
              return (
                <Link key={id.asin} href={`/${id.asin}`}>
                  <li
                    key={id.asin}
                    className="p-5 my-2 flex items-center justify-between"
                  >
                    {id.thumbnailImage && (
                      <Image
                        src={id.thumbnailImage}
                        alt={id.title}
                        width={100}
                        height={100}
                      />
                    )}

                    <div className="flex space-x-4 pl-4">
                      <div>
                        <p className="line-clamp-2 font-bold">{id.title}</p>
                      </div>
                    </div>
                  </li>
                </Link>
              );
            })
          ) : (
            <div className=" text-center text-4xl mt-12">
              You have no Favourites yet!!
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default Fav;
