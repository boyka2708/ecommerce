"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useCartStore } from '@/store';

type Props = {
  name?: string | null;
  image?: string | null;
};
function LoginButton({ name, image }: Props) {
  const clear = useCartStore((state) => state.onClearBasket);
  function handleClick(){
    signOut();
    clear();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {image && (
            <Image
              src={image}
              alt={name || ''}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{name}</DropdownMenuItem>
        <DropdownMenuItem onClick={handleClick}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LoginButton;
