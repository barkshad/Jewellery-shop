import React, { useState, useEffect } from 'react';
import { ViewState, CartItem, Product, ViewContextType, SiteConfig } from './types';
import { Layout } from './components/Layout';
import { CartSidebar } from './components/CartSidebar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Admin } from './pages/Admin';
import { INITIAL_PRODUCTS, INITIAL_SITE_CONFIG } from './constants';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // CMS State
  const [products, setProducts] = useState<Product[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Firestore Real-time Listeners
  useEffect(() => {
    if (!db) {
      console.warn("Firestore not initialized. Using initial static data.");
      setProducts(INITIAL_PRODUCTS);
      setIsLoading(false);
      return;
    }

    // 1. Listen to Products
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts: Product[] = [];
      snapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      // If DB is empty, we might want to seed it, but for now just show empty or seeded
      if (fetchedProducts.length === 0 && products.length === 0) {
         // Optional: Seed DB here if needed, or just let Admin add products
      }
      setProducts(fetchedProducts);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    });

    // 2. Listen to Site Config
    const unsubscribeConfig = onSnapshot(doc(db, 'settings', 'main'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setSiteConfig(docSnapshot.data() as SiteConfig);
      } else {
        // Create default config if it doesn't exist
        setDoc(doc(db, 'settings', 'main'), INITIAL_SITE_CONFIG);
      }
    }, (error) => {
      console.error("Error fetching config:", error);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeConfig();
    };
  }, []);

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

  // CMS Actions (Firestore Connected)
  const addProduct = async (product: Product) => {
    if (!db) return;
    try {
      // Create a clean object without the ID (Firestore creates ID)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...productData } = product;
      await addDoc(collection(db, 'products'), productData);
    } catch (e) {
      console.error("Error adding product: ", e);
      alert("Failed to save product to database.");
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!db) return;
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updates);
    } catch (e) {
      console.error("Error updating product: ", e);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error("Error deleting product: ", e);
    }
  };

  const updateSiteConfig = async (updates: Partial<SiteConfig>) => {
    if (!db) return;
    try {
      const configRef = doc(db, 'settings', 'main');
      await updateDoc(configRef, updates);
    } catch (e) {
      console.error("Error updating config: ", e);
    }
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
    updateSiteConfig,
    isLoading
  };

  // Basic Routing Logic
  const renderView = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
           <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-champagne-600" size={32} />
              <span className="text-xs uppercase tracking-widest text-stone-500">Loading Maison...</span>
           </div>
        </div>
      );
    }

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
