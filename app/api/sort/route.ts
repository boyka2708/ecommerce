import Data from '@/app/api/Data.json'; 
import { Product } from '@/lib/Product'; 
import { NextResponse } from 'next/server'; 

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering of this route

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const searchCategory = searchParams.get('searchCategory');
    const value = searchParams.get('value'); // Sort order ('low' or 'high')

    // Parameter Validation
    if (!searchCategory || !value) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Organize Products by Category
    const productsByCategory: { [key: string]: Product[] } = {};
    Data.forEach((product) => {
      productsByCategory[product.category] = productsByCategory[product.category] || [];
      productsByCategory[product.category].push(product);
    });

    const categoryProducts = productsByCategory[searchCategory];

    // Sorting Logic
    const sortedProducts = categoryProducts.sort((a, b) => {
      if (value === 'low') {
        return a.price - b.price; 
      } else if (value === 'high') {
        return b.price - a.price; 
      } else {
        console.warn(`Invalid sortByPrice value: ${value}`);
        return 0; 
      }
    });

    // Send Sorted Products as JSON
    return NextResponse.json(sortedProducts); 
  } catch (error) {
    // Error Handling
    console.error("Error in /api/sort:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
