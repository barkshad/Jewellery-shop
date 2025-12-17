import React from 'react';
import { ArrowRight, Star, MapPin, ShieldCheck, Play } from 'lucide-react';
import { ViewContextType } from '../types';

interface HomeProps {
  store: ViewContextType;
}

// Helper component for the crazy animation
const ForgedText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-[0.2em] ${className}`}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, charIndex) => (
            <span
              key={`${wordIndex}-${charIndex}`}
              className="animate-forge"
              style={{ 
                animationDelay: `${150 + (wordIndex * 200) + (charIndex * 50)}ms` 
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

export const Home: React.FC<HomeProps> = ({ store }) => {
  const { products, siteConfig } = store;
  
  return (
    <div className="animate-enter w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-stone-900">
        
        {/* VIDEO BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/50 z-10" />
          
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-90"
            key={siteConfig.heroVideoUrl} // Key forces reload if URL changes in Admin
          >
            <source src={siteConfig.heroVideoUrl} type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 text-center px-6 max-w-6xl mx-auto space-y-10">
          <span className="inline-block text-xs md:text-sm uppercase tracking-[0.4em] text-champagne-200 animate-enter delay-100 border-b border-champagne-400/50 pb-2 drop-shadow-md">
            Nairobi • Paris • New York
          </span>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] drop-shadow-2xl">
             <ForgedText text={siteConfig.heroTitle} />
          </h1>
          
          <p className="font-light text-champagne-50/90 text-lg md:text-2xl max-w-xl mx-auto leading-relaxed animate-enter delay-[2000ms] drop-shadow-md">
            {siteConfig.heroSubtitle}
          </p>
          
          <div className="pt-10 animate-enter delay-[2200ms]">
            <button 
              onClick={() => store.setView('SHOP')}
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-champagne-500 hover:border-champagne-500 hover:text-white transition-all duration-500 ease-luxury shadow-lg hover:shadow-[0_0_30px_rgba(198,149,98,0.5)]"
            >
              <span className="uppercase tracking-[0.2em] text-xs font-bold">{siteConfig.heroButtonText}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-stone-100 pb-8">
            <div className="space-y-2">
              <span className="text-champagne-600 text-xs uppercase tracking-widest">The Collection</span>
              <h2 className="font-serif text-4xl md:text-6xl text-charcoal">Curated in Kenya</h2>
            </div>
            <button 
              onClick={() => store.setView('SHOP')} 
              className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest hover:text-champagne-600 transition-colors mt-8 md:mt-0"
            >
              View All Masterpieces <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.slice(0, 3).map((product, idx) => (
              <div 
                key={product.id}
                onClick={() => { store.selectProduct(product.id); store.setView('PRODUCT'); }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700 ease-luxury">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 z-10 transition-colors duration-700"></div>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-[1.5s] ease-luxury group-hover:scale-110"
                  />
                  {product.isNew && (
                    <span className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest shadow-sm">
                      New Arrival
                    </span>
                  )}
                  <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <span className="bg-white/95 backdrop-blur px-6 py-3 text-[10px] uppercase tracking-widest shadow-lg">
                          Quick View
                      </span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-serif text-2xl mb-1 group-hover:text-champagne-700 transition-colors duration-300">{product.name}</h3>
                        <p className="text-xs uppercase tracking-widest text-stone-500">{product.category}</p>
                    </div>
                    <p className="font-medium tracking-wide text-charcoal text-lg">KES {product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship/Story */}
      <section className="py-40 px-6 bg-stone-900 text-white relative overflow-hidden">
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-10">
             <div className="flex items-center gap-3 text-champagne-400">
                <MapPin size={16} />
                <span className="text-xs uppercase tracking-[0.3em]">Westlands, Nairobi</span>
             </div>
            <h2 className="font-serif text-5xl md:text-7xl leading-[1.1]">
              {siteConfig.aboutTitle}
            </h2>
            <p className="font-light text-stone-300 text-xl leading-relaxed max-w-lg">
              {siteConfig.aboutText}
            </p>
            <div className="flex gap-8 pt-4">
                <div className="space-y-1">
                    <div className="text-3xl font-serif text-champagne-300">24k</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-500">Pure Gold</div>
                </div>
                <div className="space-y-1">
                    <div className="text-3xl font-serif text-champagne-300">100%</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-500">Ethical Sourcing</div>
                </div>
                <div className="space-y-1">
                    <div className="text-3xl font-serif text-champagne-300">1924</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-500">Established</div>
                </div>
            </div>
          </div>
          <div className="h-[700px] w-full relative group">
            <div className="absolute top-6 right-6 w-full h-full border border-white/10 z-0 transition-transform duration-700 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
            <div className="absolute inset-0 bg-stone-800 overflow-hidden shadow-2xl z-10">
                <img src="https://picsum.photos/id/452/800/1000" className="w-full h-full object-cover opacity-80 scale-100 group-hover:scale-105 transition-transform duration-[2s]" alt="craftsman" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10">
                    <p className="font-serif text-2xl italic">"Luxury is patience."</p>
                    <p className="text-xs uppercase tracking-widest mt-2 text-stone-400">Head Artisan, Juma</p>
                </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Signals */}
      <section className="py-24 border-t border-stone-200 bg-champagne-50/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 group">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-champagne-700 group-hover:scale-110 transition-transform duration-500">
                    <Star size={24} fill="currentColor" className="opacity-80" />
                </div>
                <h3 className="font-serif text-2xl">Conflict-Free Sourcing</h3>
                <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">We source Tsavorite and Gold directly from ethical mines in Taita Taveta and Turkana.</p>
            </div>
             <div className="space-y-4 group">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-champagne-700 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck size={24} />
                </div>
                <h3 className="font-serif text-2xl">Lifetime Warranty</h3>
                <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">Every piece crafted in our Nairobi atelier is guaranteed for life against manufacturing defects.</p>
            </div>
             <div className="space-y-4 group">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-champagne-700 group-hover:scale-110 transition-transform duration-500">
                     <MapPin size={24} />
                </div>
                <h3 className="font-serif text-2xl">Pan-African Delivery</h3>
                <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">Secure, insured shipping to Nairobi, Mombasa, Kampala, Kigali, and beyond.</p>
            </div>
        </div>
      </section>
    </div>
  );
};
