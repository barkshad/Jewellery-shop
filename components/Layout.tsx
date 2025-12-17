import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, ShieldCheck, Edit, Settings } from 'lucide-react';
import { ViewContextType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  store: ViewContextType;
}

export const Layout: React.FC<LayoutProps> = ({ children, store }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = store.cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] font-sans text-charcoal selection:bg-champagne-200 selection:text-charcoal relative">
      
      {/* Announcement Bar */}
      <div className="bg-[#121212] text-champagne-300 text-[10px] md:text-xs uppercase tracking-widest text-center py-2 z-[60] relative">
        {store.siteConfig.announcementBar}
      </div>

      {/* Navbar */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-700 ease-luxury top-[30px] ${
          scrolled ? 'py-3 md:py-4 glass shadow-sm' : 'py-6 md:py-8 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-charcoal/80 hover:text-charcoal transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div 
            className="flex-1 md:flex-none text-center md:text-left cursor-pointer group"
            onClick={() => store.setView('HOME')}
          >
            <h1 className="font-serif text-2xl md:text-3xl tracking-[0.25em] font-medium group-hover:opacity-80 transition-opacity duration-500 text-liquid-gold">
              AURUM
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-12 text-sm tracking-widest uppercase font-medium text-charcoal/70">
            <button onClick={() => store.setView('HOME')} className="hover:text-champagne-600 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-champagne-600 after:transition-all hover:after:w-full">Home</button>
            <button onClick={() => store.setView('SHOP')} className="hover:text-champagne-600 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-champagne-600 after:transition-all hover:after:w-full">Collections</button>
            <button onClick={() => store.setView('ABOUT')} className="hover:text-champagne-600 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-champagne-600 after:transition-all hover:after:w-full">Maison</button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6 text-charcoal/80">
            <button className="hidden md:block hover:scale-110 transition-transform duration-500 ease-luxury hover:text-champagne-600">
              <Search size={20} strokeWidth={1.5} />
            </button>
             <button 
              className="hidden md:block hover:scale-110 transition-transform duration-500 ease-luxury hover:text-champagne-600"
              onClick={() => store.setView('ADMIN')}
             >
              <User size={20} strokeWidth={1.5} />
            </button>
            <button 
              className="relative hover:scale-110 transition-transform duration-500 ease-luxury hover:text-champagne-600"
              onClick={store.toggleCartDrawer}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-champagne-500 to-champagne-700 text-[10px] text-white shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full glass border-t border-white/20 p-8 flex flex-col gap-8 md:hidden animate-enter h-screen">
            <button onClick={() => { store.setView('HOME'); setMobileMenuOpen(false); }} className="text-left text-lg tracking-widest uppercase font-serif">Home</button>
            <button onClick={() => { store.setView('SHOP'); setMobileMenuOpen(false); }} className="text-left text-lg tracking-widest uppercase font-serif">Collections</button>
            <button onClick={() => { store.setView('ABOUT'); setMobileMenuOpen(false); }} className="text-left text-lg tracking-widest uppercase font-serif">Maison</button>
            <div className="pt-8 border-t border-stone-200">
               <p className="text-xs text-stone-500 mb-4 uppercase tracking-widest">Client Services</p>
               <p className="text-sm font-light mb-2">{store.siteConfig.contactPhone}</p>
               <p className="text-sm font-light">{store.siteConfig.contactEmail}</p>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24 md:pt-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-stone-400 py-20 px-6 relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
           <svg width="400" height="400" viewBox="0 0 100 100">
              <path d="M0 0 L100 0 L50 100 Z" fill="url(#goldGradient)" />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#bf953f" />
                  <stop offset="100%" stopColor="#b38728" />
                </linearGradient>
              </defs>
           </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-liquid-gold tracking-[0.2em]">AURUM</h2>
            <p className="font-light text-sm leading-relaxed max-w-xs text-stone-500">
              Born in Nairobi. <br/>
              Defining African luxury through architectural precision and indigenous materials.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-white text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-2 inline-block">Collections</h3>
            <ul className="space-y-3 font-light text-sm">
              <li className="hover:text-liquid-gold cursor-pointer transition-colors" onClick={() => store.setView('SHOP')}>High Jewellery</li>
              <li className="hover:text-liquid-gold cursor-pointer transition-colors" onClick={() => store.setView('SHOP')}>Bridal</li>
              <li className="hover:text-liquid-gold cursor-pointer transition-colors" onClick={() => store.setView('SHOP')}>Timepieces</li>
              <li className="hover:text-liquid-gold cursor-pointer transition-colors" onClick={() => store.setView('SHOP')}>Gifts</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-white text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-2 inline-block">Maison</h3>
            <ul className="space-y-3 font-light text-sm">
              <li className="hover:text-liquid-gold cursor-pointer transition-colors">Our Heritage</li>
              <li className="hover:text-liquid-gold cursor-pointer transition-colors">Sustainability</li>
              <li className="hover:text-liquid-gold cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-liquid-gold cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-white text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-2 inline-block">Newsletter</h3>
            <div className="flex border-b border-white/20 pb-2 relative group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-transparent w-full outline-none text-white placeholder-stone-600 font-light"
              />
              <button className="text-xs uppercase tracking-widest text-stone-500 group-hover:text-champagne-400 transition-colors">Join</button>
              <div className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-champagne-500 transition-all duration-500 group-hover:w-full"></div>
            </div>
            <div className="flex items-center gap-2 text-xs font-light pt-4">
              <ShieldCheck size={14} className="text-champagne-600"/>
              <span>Secure global shipping</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-light text-stone-600">
          <p>© 2024 AURUM Kenya. All rights reserved.</p>
          
          {/* Admin Button at Footer */}
          <button 
            onClick={() => store.setView('ADMIN')}
            className="flex items-center gap-2 mt-4 md:mt-0 opacity-50 hover:opacity-100 transition-opacity hover:text-champagne-400"
          >
            <Settings size={12} />
            <span>Admin Panel</span>
          </button>
        </div>
      </footer>
    </div>
  );
};