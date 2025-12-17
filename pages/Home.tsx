import React from 'react';
import { ArrowRight, Star, MapPin, ShieldCheck } from 'lucide-react';
import { ViewContextType } from '../types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal, ParallaxImage, MagneticButton, StaggerContainer, StaggerItem } from '../components/Animations';

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
  
  // Parallax for Hero
  const { scrollY } = useScroll();
  const yHeroText = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-stone-900 perspective-1000">
        
        {/* VIDEO BACKGROUND with Parallax */}
        <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: useTransform(scrollY, [0, 1000], [0, 400]) }} // Slow scrolling background
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/50 z-10" />
          
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-90 scale-110" // Scale up to prevent edges showing during parallax
            key={siteConfig.heroVideoUrl}
          >
            <source src={siteConfig.heroVideoUrl} type="video/mp4" />
          </video>
        </motion.div>

        <motion.div 
            style={{ y: yHeroText, opacity: opacityHero }}
            className="relative z-20 text-center px-6 max-w-6xl mx-auto space-y-10"
        >
          <Reveal delay={0.5}>
              <span className="inline-block text-xs md:text-sm uppercase tracking-[0.4em] text-champagne-200 border-b border-champagne-400/50 pb-2 drop-shadow-md">
                Nairobi • Paris • New York
              </span>
          </Reveal>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] drop-shadow-2xl">
             <ForgedText text={siteConfig.heroTitle} />
          </h1>
          
          <Reveal delay={2}>
              <p className="font-light text-champagne-50/90 text-lg md:text-2xl max-w-xl mx-auto leading-relaxed drop-shadow-md">
                {siteConfig.heroSubtitle}
              </p>
          </Reveal>
          
          <Reveal delay={2.2}>
            <div className="pt-10 flex justify-center">
                <MagneticButton onClick={() => store.setView('SHOP')}>
                  <div className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-champagne-500 hover:border-champagne-500 hover:text-white transition-all duration-500 ease-luxury shadow-lg">
                    <span className="uppercase tracking-[0.2em] text-xs font-bold">{siteConfig.heroButtonText}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </MagneticButton>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <Reveal width="100%">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-stone-100 pb-8">
                <div className="space-y-2">
                <span className="text-champagne-600 text-xs uppercase tracking-widest">The Collection</span>
                <h2 className="font-serif text-4xl md:text-6xl text-charcoal">Curated in Kenya</h2>
                </div>
                <MagneticButton onClick={() => store.setView('SHOP')}>
                    <button className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest hover:text-champagne-600 transition-colors mt-8 md:mt-0">
                    View All Masterpieces <ArrowRight size={14} />
                    </button>
                </MagneticButton>
            </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.slice(0, 3).map((product) => (
              <StaggerItem key={product.id}>
                  <div 
                    onClick={() => { store.selectProduct(product.id); store.setView('PRODUCT'); }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700 ease-luxury">
                      {/* LAYOUT ID for Magic Transition */}
                      <motion.div layoutId={`product-image-${product.id}`} className="w-full h-full">
                         <ParallaxImage src={product.image} alt={product.name} className="w-full h-full" speed={0.2} />
                      </motion.div>
                      
                      {product.isNew && (
                        <span className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest shadow-sm">
                          New Arrival
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-serif text-2xl mb-1 group-hover:text-champagne-700 transition-colors duration-300">{product.name}</h3>
                            <p className="text-xs uppercase tracking-widest text-stone-500">{product.category}</p>
                        </div>
                        <p className="font-medium tracking-wide text-charcoal text-lg">KES {product.price.toLocaleString()}</p>
                    </div>
                  </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Craftsmanship/Story */}
      <section className="py-40 px-6 bg-stone-900 text-white relative overflow-hidden">
        {/* Animated Noise Texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-10">
             <Reveal>
                <div className="flex items-center gap-3 text-champagne-400">
                    <MapPin size={16} />
                    <span className="text-xs uppercase tracking-[0.3em]">Westlands, Nairobi</span>
                </div>
             </Reveal>
            <Reveal delay={0.2}>
                <h2 className="font-serif text-5xl md:text-7xl leading-[1.1]">
                {siteConfig.aboutTitle}
                </h2>
            </Reveal>
            <Reveal delay={0.4}>
                <p className="font-light text-stone-300 text-xl leading-relaxed max-w-lg">
                {siteConfig.aboutText}
                </p>
            </Reveal>
            <Reveal delay={0.6}>
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
            </Reveal>
          </div>
          
          <div className="h-[700px] w-full relative group perspective-1000">
             {/* Use Parallax Image here too */}
             <div className="absolute inset-0 border border-white/10 z-0 transform translate-x-4 translate-y-4"></div>
             <div className="absolute inset-0 bg-stone-800 overflow-hidden shadow-2xl z-10">
                 <ParallaxImage src="https://picsum.photos/id/452/800/1000" alt="Craftsman" className="w-full h-full opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <Reveal delay={0.8}>
                    <div className="absolute bottom-10 left-10">
                        <p className="font-serif text-2xl italic">"Luxury is patience."</p>
                        <p className="text-xs uppercase tracking-widest mt-2 text-stone-400">Head Artisan, Juma</p>
                    </div>
                 </Reveal>
             </div>
          </div>
        </div>
      </section>
      
      {/* Trust Signals */}
      <section className="py-24 border-t border-stone-200 bg-champagne-50/20">
        <StaggerContainer className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <StaggerItem>
                <div className="space-y-4 group">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-champagne-700 group-hover:scale-110 transition-transform duration-500">
                        <Star size={24} fill="currentColor" className="opacity-80" />
                    </div>
                    <h3 className="font-serif text-2xl">Conflict-Free Sourcing</h3>
                    <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">We source Tsavorite and Gold directly from ethical mines in Taita Taveta and Turkana.</p>
                </div>
            </StaggerItem>
             <StaggerItem>
                <div className="space-y-4 group">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-champagne-700 group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-serif text-2xl">Lifetime Warranty</h3>
                    <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">Every piece crafted in our Nairobi atelier is guaranteed for life against manufacturing defects.</p>
                </div>
            </StaggerItem>
             <StaggerItem>
                <div className="space-y-4 group">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm text-champagne-700 group-hover:scale-110 transition-transform duration-500">
                        <MapPin size={24} />
                    </div>
                    <h3 className="font-serif text-2xl">Pan-African Delivery</h3>
                    <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">Secure, insured shipping to Nairobi, Mombasa, Kampala, Kigali, and beyond.</p>
                </div>
            </StaggerItem>
        </StaggerContainer>
      </section>
    </div>
  );
};