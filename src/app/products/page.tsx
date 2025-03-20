import { Suspense } from 'react';
import Products from './Products';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <Products />
    </Suspense>
  );
}
