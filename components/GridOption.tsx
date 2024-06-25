import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  className?: string;
  image?: string;
};

const GridOption = ({ title, className, image }: Props) => {
  
  return (
    <div className={cn("grid-option relative",className)}>
      <Link href={`/product/${title}`}>
      <h2 className='text-xl font-bold'>{title}</h2>
      {image && (
        <Image
          src={image}
          alt={title}
          layout="fill"
          className="opacity-20 object-cover rounded-md"
        />
      )}
      </Link>
    </div>
  );
};

export default GridOption;
