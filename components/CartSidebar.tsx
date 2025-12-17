import React from 'react';
import { X, Minus, Plus, ArrowRight } from 'lucide-react';
import { ViewContextType } from '../types';

interface CartSidebarProps {
  store: ViewContextType;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ store }) => {
  if (!store.isCartOpen) return null;

  const total = store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[60] transition-opacity duration-500"
        onClick={store.toggleCartDrawer}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] glass z-[70] shadow-2xl flex flex-col animate-enter">
        <div className="p-8 border-b border-white/20 flex justify-between items-center">
          <h2 className="font-serif text-2xl tracking-wide">Your Selection</h2>
          <button 
            onClick={store.toggleCartDrawer}
            className="hover:rotate-90 transition-transform duration-500 ease-luxury p-2"
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {store.cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <span className="font-serif text-xl italic">Your bag is empty.</span>
              <button 
                onClick={() => { store.toggleCartDrawer(); store.setView('SHOP'); }}
                className="text-xs uppercase tracking-widest border-b border-charcoal pb-1 hover:border-champagne-600 hover:text-champagne-600 transition-colors"
              >
                Discover our collection
              </button>
            </div>
          ) : (
            store.cart.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-24 h-24 bg-white/40 overflow-hidden relative">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                      <button onClick={() => store.removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-stone-500 text-xs mt-1">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-medium tracking-wide">${item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {store.cart.length > 0 && (
          <div className="p-8 border-t border-white/20 bg-white/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm uppercase tracking-widest text-stone-600">Subtotal</span>
              <span className="font-serif text-2xl">${total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-stone-500 mb-6 font-light">Shipping and taxes calculated at checkout.</p>
            <button 
              className="w-full bg-charcoal text-white py-4 px-6 flex items-center justify-between group hover:bg-stone-800 transition-all duration-500 ease-luxury"
              onClick={() => { store.toggleCartDrawer(); store.setView('CHECKOUT'); }}
            >
              <span className="uppercase tracking-[0.2em] text-xs">Proceed to Checkout</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500 ease-luxury" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
