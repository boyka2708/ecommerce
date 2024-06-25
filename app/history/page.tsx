'use client';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

// Define the types for form data and items
interface FormData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
}

interface Item {
  asin: string;
  brand: string;
  breadCrumbs: string;
  category: string;
  description: string | null;
  price: number;
  reviewsCount: number;
  stars: number;
  thumbnailImage: string;
  title: string;
  url: string;
}

// Define the type for a history item
interface HistoryItem {
  id: string;
  formdata: string; // Update to string to reflect actual data type
  items: Item[];
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

type Props = {};

// Function to get day of the week from timestamp
function getDayOfWeek(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

const Page = (props: Props) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      console.error('No user session found.');
      return;
    }

    const fetchHistory = async () => {
      try {
        const userId = session.user.id;
        const historyRef = collection(db, `users/${userId}/history`);
        const historySnapshot = await getDocs(historyRef);
        const historyList = historySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as HistoryItem)
        );
        setHistory(historyList);
      } catch (error) {
        console.error('Error fetching history data: ', error);
      }
    };

    fetchHistory();
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className={history.length > 0 ? `text-xl text-center font-bold mt-2` : 'hidden'}>Purchase History</h2>
      {history.length > 0 ? (
        <ul className="">
          {history.map((item) => {
            const formData: FormData = JSON.parse(item.formdata);

            return (
              <li key={item.id} className="mb-4">
                <div>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div>
                        {item.items.map((itemDetail, index) => (
                          <div
                            key={index}
                            className="ml-4 border-4 border-black rounded-lg bg-slate-200 cursor-pointer mt-2 p-2 flex items-center flex-col"
                          >
                            <div className="flex relative h-48 w-48 mt-2 mb-2">
                              <Image
                                src={itemDetail.thumbnailImage}
                                alt="logo"
                                fill={true}
                              />
                            </div>

                            <div className="line-clamp-1">
                              {itemDetail.title}
                            </div>
                            {/* Add other item details as needed */}
                          </div>
                        ))}
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="bg-slate-300">
                      <div className="mx-auto w-full max-w-xl">
                        <DrawerHeader>
                          <DrawerTitle>Ordered On</DrawerTitle>
                          <DrawerDescription className='text-bold'>
                            {`${getDayOfWeek(
                              item.timestamp.seconds
                            )}, ${new Date(
                              item.timestamp.seconds * 1000
                            ).toLocaleString()}`}
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 mb-4">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="flex-1">
                              <div className="text-xl font-bold tracking-tighter flex justify-between">
                                <span>Full Name:</span>
                                <span className="font-normal ">
                                  {formData.fullName}
                                </span>
                              </div>
                              <div className="text-xl font-bold tracking-tighter flex justify-between">
                                <span>Contact Info:</span>
                                <span className="font-normal pl-[76px]">
                                  {formData.phoneNumber}
                                </span>
                              </div>
                              <div className="text-xl font-bold tracking-tighter flex justify-between">
                                <span>Delivery Address: </span>
                                <span className=" font-normal">
                                  {formData.address}, {formData.city},{' '}
                                  {formData.state}, {formData.postalCode}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-4xl font-bold text-center mt-32">
          Please Make your First Order!!
        </div>
      )}{' '}
    </div>
  );
};

export default Page;
