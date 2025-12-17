import React, { useState } from 'react';
import { ViewState, CartItem, Product, ViewContextType, SiteConfig } from './types';
import { Layout } from './components/Layout';
import { CartSidebar } from './components/CartSidebar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Admin } from './pages/Admin';
import { INITIAL_PRODUCTS, INITIAL_SITE_CONFIG } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // CMS State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);

  // Store actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleCartDrawer = () => setIsCartOpen(!isCartOpen);

  const selectProduct = (id: string) => {
    setSelectedProductId(id);
  };

  const setView = (view: ViewState) => {
    window.scrollTo(0, 0);
    setCurrentView(view);
  };

  // CMS Actions
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateSiteConfig = (updates: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...updates }));
  };

  const store: ViewContextType = {
    currentView,
    setView,
    selectedProductId,
    selectProduct,
    cart,
    addToCart,
    removeFromCart,
    toggleCartDrawer,
    isCartOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    siteConfig,
    updateSiteConfig
  };

  // Basic Routing Logic
  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <Home store={store} />;
      case 'SHOP':
        return <Shop store={store} />;
      case 'PRODUCT':
        return <ProductDetail store={store} />;
      case 'ADMIN':
        return <Admin store={store} />;
      case 'ABOUT':
      case 'CHECKOUT':
        return (
          <div className="min-h-screen flex items-center justify-center animate-enter">
            <div className="text-center p-6">
               <h1 className="font-serif text-4xl mb-4">Maison Nairobi</h1>
               <p className="text-stone-500 font-light mb-8 max-w-md mx-auto">
                 We are currently upgrading our checkout experience to support M-PESA and international cards seamlessly.
               </p>
               <button onClick={() => setView('HOME')} className="text-xs uppercase tracking-widest border-b border-charcoal">Return Home</button>
            </div>
          </div>
        );
      default:
        return <Home store={store} />;
    }
  };

  return (
    <Layout store={store}>
      {renderView()}
      <CartSidebar store={store} />
    </Layout>
  );
};

export default App;
