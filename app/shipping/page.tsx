'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast'; // Make sure you have this component
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Product } from '@/lib/Product';
import { Fragment, useRef, useState } from 'react';
import { Loc } from '@/lib/Address';
import { LocateIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer } from 'recharts'; // Recharts components
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  express: z.boolean().default(false).optional(),
});

export default function ShippingPage() {
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.onCart);
  const { toast } = useToast();
  const router = useRouter();
  const groupedCartItems: (Product & { quantity: number })[] = [];
  const asinMap: { [asin: string]: number } = {};
  const onCart = useCartStore((state) => state.onCart);
  const [address, setAddress] = useState<Loc>();
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const drawerContentRef = useRef<HTMLDivElement>(null);

  const handleExpressDeliveryChange = () => {
    setExpressDelivery(!expressDelivery); // Toggle the state
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // Call getAddressFromCoords here with the retrieved coordinates
          getAddressFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => alert(error.message),
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const getAddressFromCoords = async (
    latitude: number | null,
    longitude: number | null
  ) => {
    if (latitude !== null && longitude !== null) {
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=941182c205344d8d8e67be703f182042`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.status === 200) {
        setAddress(data);
        form.setValue('city', data.features[0].properties.city);
        form.setValue('state', data.features[0].properties.state);
        form.setValue('postalCode', data.features[0].properties.postcode);
        return address; // Update your UI to display the retrieved address/pincode
      } else {
        console.error('Error retrieving address:', data.error_message);
      }
    } else {
      console.error('Latitude or Longitude is null, skipping API call');
    }
  };
  cartItems.forEach((item) => {
    if (asinMap[item.asin]) {
      asinMap[item.asin]++; // Increment quantity
    } else {
      asinMap[item.asin] = 1; // Initialize quantity
      groupedCartItems.push({ ...item, quantity: 1 }); // Add to new array
    }
  });

  groupedCartItems.forEach((item) => {
    item.quantity = asinMap[item.asin]; // Update quantity based on asinMap
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      state: '',
     postalCode: '',
     phoneNumber: '',

    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
   
    try {
        const response = await fetch('/api/checkout_session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartItems: onCart, userId: session?.user?.id, expressDelivery, formdata:values }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { id } = await response.json();
        router.push(`/checkout/${id}`);
      } catch (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Error",
          description: "Failed to create a checkout session. Please try again later.",
        });
    }
  }

  return (
    <main className="flex gap-x-6 flex-col lg:flex-row pb-[55px]">
      <div className="w-2/5 hidden lg:block bg-slate-100 border-2 max-h-96 overflow-y-scroll mx-auto my-auto">
        {groupedCartItems.map((items) => (
          <div key={items.asin} className="flex mt-2 items-center">
            <Image
              src={items.thumbnailImage}
              alt="log"
              width={50}
              height={50}
            />
            <div className="ml-3">
              <p className="line-clamp-1">{items.title}</p>
              <p>Qty:{items.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="default"
            className="lg:hidden mt-2 w-64 mx-auto block"
          >
            Your Products
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div
            ref={drawerContentRef}
            className="mx-auto w-full max-w-sm overflow-y-auto max-h-[75vh]"
          >
            <DrawerHeader>
              <DrawerTitle>Items: {cartItems.length}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <ResponsiveContainer
                className="hidden sm:block"
                width="100%"
                height={200}
              >
                <Fragment>
                  {' '}
                  {groupedCartItems.map((items) => (
                    <div key={items.asin} className="flex mb-2">
                      <Image
                        src={items.thumbnailImage}
                        alt={items.title}
                        width={60}
                        height={60}
                      />
                      <div className="ml-2">
                        <p className="line-clamp-1">{items.title}</p>
                        <p>Qty: {items.quantity}</p>
                      </div>
                    </div>
                  ))}
                </Fragment>
              </ResponsiveContainer>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="mx-auto border-4 mt-8 bg-slate-100 rounded-sm">
        <div className="flex items-center space-x-5 mt-5 md:mt-0 absolute pl-80 pt-2">
          {location.latitude && location.longitude ? (
            <></>
          ) : (
            <div className=" gap-1 items-center justify-center text-sm flex cursor-pointer">
              <LocateIcon onClick={getLocation} size={15} />
              <p className="text-xs font-semibold">Locate Me</p>
            </div>
          )}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-96 ml-3 mr-3 mb-2 mt-2"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>

                  <FormControl>
                    <Textarea placeholder="Complete Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact No.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> 
            <div className="flex items-center justify-center mt-1 space-x-2">
              <Label htmlFor="delivery">Express Delivery (200 extra)</Label>
              <Switch
                id="delivery"
                checked={expressDelivery}
                onCheckedChange={handleExpressDeliveryChange}
              />
            </div>
            <Button className='ml-28' type="submit">Proceed To Pay</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
