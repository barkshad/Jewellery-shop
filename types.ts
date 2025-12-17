export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Necklaces' | 'Rings' | 'Earrings' | 'Watches';
  image: string;
  description: string;
  materials: string[];
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  aboutTitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  announcementBar: string;
}

export type ViewState = 'HOME' | 'SHOP' | 'PRODUCT' | 'CART' | 'ADMIN' | 'CHECKOUT' | 'ABOUT';

export interface ViewContextType {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  
  selectedProductId: string | null;
  selectProduct: (id: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  toggleCartDrawer: () => void;
  isCartOpen: boolean;
  
  // CMS & Data
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  siteConfig: SiteConfig;
  updateSiteConfig: (updates: Partial<SiteConfig>) => void;
}
