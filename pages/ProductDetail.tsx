import React, { useState } from 'react';
import { ViewContextType } from '../types';
import { ArrowLeft, Star, Truck, Shield } from 'lucide-react';

interface ProductDetailProps {
  store: ViewContextType;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ store }) => {
  const product = store.products.find(p => p.id === store.selectedProductId);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 animate-enter">
      <button 
        onClick={() => store.setView('SHOP')}
        className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-charcoal mb-12 transition-colors max-w-7xl mx-auto"
      >
        <ArrowLeft size={14} /> Back to Collection
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Gallery */}
        <div 
          className="relative aspect-square bg-stone-100 overflow-hidden cursor-zoom-in shadow-xl"
          onMouseEnter={() => setIsHoveringImage(true)}
          onMouseLeave={() => setIsHoveringImage(false)}
        >
          <img 
            src={product.image} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-[2s] ease-luxury ${isHoveringImage ? 'scale-125' : 'scale-100'}`}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center space-y-10">
          <div>
            <span className="text-champagne-600 text-xs uppercase tracking-[0.2em] font-medium block mb-2">{product.category}</span>
            <h1 className="font-serif text-5xl md:text-6xl text-charcoal mb-4">{product.name}</h1>
            <p className="text-2xl font-light text-stone-800">KES {product.price.toLocaleString()}</p>
          </div>

          <p className="font-light text-stone-600 leading-loose max-w-md text-lg">
            {product.description}
          </p>

          <div className="space-y-4 py-6 border-y border-stone-200">
             <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-stone-900">Materials</span>
                <span className="text-stone-600 font-light text-right">{product.materials.join(', ')}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-stone-900">Availability</span>
                <span className="text-green-700 font-light flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span> In Stock (Nairobi HQ)</span>
             </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => { store.addToCart(product); store.toggleCartDrawer(); }}
              className="w-full bg-charcoal text-white py-5 px-8 uppercase tracking-[0.2em] text-xs hover:bg-stone-800 transition-all duration-300 active:scale-[0.98] shadow-lg"
            >
              Add to Bag
            </button>
            <p className="text-center text-xs text-stone-400">Complimentary delivery within Nairobi.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-6 text-center">
            <div className="flex flex-col items-center gap-2">
                <Shield size={18} className="text-stone-400" />
                <span className="text-[10px] uppercase tracking-wide text-stone-500">2 Year Warranty</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <Truck size={18} className="text-stone-400" />
                <span className="text-[10px] uppercase tracking-wide text-stone-500">Free Shipping</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                <Star size={18} className="text-stone-400" />
                <span className="text-[10px] uppercase tracking-wide text-stone-500">Authenticity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
