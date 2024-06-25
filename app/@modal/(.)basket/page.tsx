'use client';
import Basket from '@/components/Basket';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

function BasketInterception() {
  const router = useRouter();
  const onDismiss = () => router.back();
  const callback = () =>{
    onDismiss();
    setTimeout(() => {
      router.push('/shipping');
    }, 1000);
    
  }

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss();
        }
      }}
    >
      <DialogContent className="h-4/5 w-full overflow-scroll max-w-3xl">
        <DialogHeader>
          <DialogTitle>Basket</DialogTitle>
          <DialogDescription>Your Items:</DialogDescription>
        </DialogHeader>

        <Basket props ={callback}/> 

      </DialogContent>
    </Dialog>
  );
}

export default BasketInterception;
