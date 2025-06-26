import { sampleProducts } from '../data/products'; 
import ProductCard from './ProductCard';


export default function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {sampleProducts.map((product) => (
        <ProductCard
          key={product.id} 
          id={product.id}
          name={product.name}
          category={product.category}
          price={product.price}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}