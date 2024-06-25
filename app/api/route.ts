import Data from '@/app/api/Data.json'
export async function GET() {
  const products = JSON.stringify(Data);
  return new Response(products);
}