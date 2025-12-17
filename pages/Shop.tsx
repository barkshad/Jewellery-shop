import React, { useState } from 'react';
import { ViewContextType } from '../types';
import { CATEGORIES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer, StaggerItem, Reveal } from '../components/Animations';

interface ShopProps {
  store: ViewContextType;
}

export const Shop: React.FC<ShopProps> = ({ store }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { products } = store;

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Reveal width="100%">
        <div className="text-center mb-16 space-y-4">
            <h1 className="font-serif text-5xl md:text-6xl text-charcoal">The Collection</h1>
            <p className="font-light text-stone-500 max-w-lg mx-auto">Discover timeless artifacts forged for the modern era.</p>
        </div>
      </Reveal>

      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-stone-200 pb-6 sticky top-24 bg-white/80 backdrop-blur z-40 py-4 transition-all">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 relative ${
              activeCategory === cat 
                ? 'text-charcoal' 
                : 'text-stone-400 hover:text-champagne-600'
            }`}
          >
            {cat}
            {activeCategory === cat && (
                <motion.div 
                    layoutId="activeCategory"
                    className="absolute -bottom-2 left-0 right-0 h-[1px] bg-charcoal"
                />
            )}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
            <StaggerItem key={product.id} className="h-full">
                <div 
                    onClick={() => { store.selectProduct(product.id); store.setView('PRODUCT'); }}
                    className="group cursor-pointer flex flex-col h-full"
                >
                    <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700 ease-luxury">
                        {/* MAGIC LAYOUT TRANSITION: The image morphs between routes */}
                        <motion.img 
                            layoutId={`product-image-${product.id}`}
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-luxury group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-luxury bg-white/90 backdrop-blur border-t border-white/40">
                            <button className="w-full text-center text-xs uppercase tracking-widest hover:text-champagne-600 transition-colors">
                            View Details
                            </button>
                        </div>
                    </div>
                    
                    <div className="text-center space-y-2 mt-auto">
                        <h3 className="font-serif text-xl group-hover:text-champagne-700 transition-colors duration-300">{product.name}</h3>
                        <p className="text-xs uppercase tracking-widest text-stone-500">{product.category}</p>
                        <p className="font-medium text-charcoal pt-1">KES {product.price.toLocaleString()}</p>
                    </div>
                </div>
            </StaggerItem>
            ))}
        </AnimatePresence>
      </StaggerContainer>
    </div>
  );
};