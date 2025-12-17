import React from 'react';
import { ArrowRight, Star, MapPin, ShieldCheck, Gem } from 'lucide-react';
import { ViewContextType } from '../types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal, ParallaxImage, MagneticButton, StaggerContainer, StaggerItem, TiltCard, FloatingParticles } from '../components/Animations';

interface HomeProps {
  store: ViewContextType;
}

// Helper component for the crazy animation with Liquid Gold
const ForgedText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-[0.25em] ${className}`}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap">
          {word.split("").map((char, charIndex) => (
            <span
              key={`${wordIndex}-${charIndex}`}
              className="animate-forge text-liquid-gold" // Added liquid gold class
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
    <div className="w-full overflow-x-hidden bg-[#fcfcfc]">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0c0a09] perspective-1000">
        
        {/* Floating Particles for Atmosphere */}
        <FloatingParticles count={30} />

        {/* VIDEO BACKGROUND with Parallax */}
        <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: useTransform(scrollY, [0, 1000], [0, 400]) }} // Slow scrolling background
        >
          <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-[#0c0a09]/30 z-10" />
          
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-80 scale-110" 
            key={siteConfig.heroVideoUrl}
          >
            <source src={siteConfig.heroVideoUrl} type="video/mp4" />
          </video>
        </motion.div>

        <motion.div 
            style={{ y: yHeroText, opacity: opacityHero }}
            className="relative z-20 text-center px-6 max-w-6xl mx-auto space-y-12"
        >
          <Reveal delay={0.5}>
              <div className="flex items-center justify-center gap-4">
                 <div className="h-[1px] w-12 bg-champagne-400/50"></div>
                 <span className="inline-block text-xs md:text-sm uppercase tracking-[0.4em] text-champagne-100 drop-shadow-md font-light">
                    Nairobi • Paris • New York
                 </span>
                 <div className="h-[1px] w-12 bg-champagne-400/50"></div>
              </div>
          </Reveal>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] drop-shadow-2xl py-4">
             <ForgedText text={siteConfig.heroTitle} />
          </h1>
          
          <Reveal delay={2}>
              <p className="font-light text-champagne-50/80 text-lg md:text-2xl max-w-xl mx-auto leading-relaxed drop-shadow-lg">
                {siteConfig.heroSubtitle}
              </p>
          </Reveal>
          
          <Reveal delay={2.2}>
            <div className="pt-10 flex justify-center">
                <MagneticButton onClick={() => store.setView('SHOP')}>
                  <div className="group relative inline-flex items-center gap-4 px-12 py-5 metallic-sheen bg-white/5 backdrop-blur-md border border-white/20 text-white hover:border-champagne-500/50 hover:text-champagne-100 transition-all duration-500 ease-luxury shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                    <span className="uppercase tracking-[0.25em] text-xs font-bold relative z-10">{siteConfig.heroButtonText}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform relative z-10" />
                  </div>
                </MagneticButton>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-32 px-6 bg-[#fcfcfc] relative">
        <div className="max-w-7xl mx-auto">
          <Reveal width="100%">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                <div className="space-y-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagne-600 to-champagne-400 text-xs uppercase tracking-[0.25em] font-bold">The Collection</span>
                    <h2 className="font-serif text-5xl md:text-7xl text-charcoal">Curated in <span className="text-liquid-gold italic pr-2">Kenya</span></h2>
                </div>
                <MagneticButton onClick={() => store.setView('SHOP')}>
                    <button className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest hover:text-champagne-600 transition-colors mt-8 md:mt-0 border-b border-stone-200 pb-1 hover:border-champagne-600">
                        View All Masterpieces <ArrowRight size={14} />
                    </button>
                </MagneticButton>
            </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {products.slice(0, 3).map((product) => (
              <StaggerItem key={product.id}>
                  {/* TILT CARD applied here */}
                  <TiltCard 
                    onClick={() => { store.selectProduct(product.id); store.setView('PRODUCT'); }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 mb-8 shadow-sm group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-700 ease-luxury">
                      {/* LAYOUT ID for Magic Transition */}
                      <motion.div layoutId={`product-image-${product.id}`} className="w-full h-full">
                         <ParallaxImage src={product.image} alt={product.name} className="w-full h-full" speed={0.2} />
                      </motion.div>
                      
                      {product.isNew && (
                        <span className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-champagne-500 animate-pulse"></span> New Arrival
                        </span>
                      )}

                      {/* Hover Overlay with shiny button */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <span className="bg-white/90 backdrop-blur text-charcoal px-6 py-3 uppercase tracking-widest text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">View</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start border-t border-stone-100 pt-6">
                        <div className="space-y-1">
                            <h3 className="font-serif text-2xl group-hover:text-champagne-700 transition-colors duration-300">{product.name}</h3>
                            <p className="text-[10px] uppercase tracking-widest text-stone-400">{product.category}</p>
                        </div>
                        <p className="font-serif text-lg text-charcoal italic">KES {product.price.toLocaleString()}</p>
                    </div>
                  </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Craftsmanship/Story */}
      <section className="py-40 px-6 bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Animated Noise Texture & Particles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
        <FloatingParticles count={15} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12">
             <Reveal>
                <div className="flex items-center gap-3 text-champagne-400">
                    <MapPin size={16} />
                    <span className="text-xs uppercase tracking-[0.3em]">Westlands, Nairobi</span>
                </div>
             </Reveal>
            <Reveal delay={0.2}>
                <h2 className="font-serif text-5xl md:text-7xl leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-stone-200 to-stone-500">
                {siteConfig.aboutTitle}
                </h2>
            </Reveal>
            <Reveal delay={0.4}>
                <p className="font-light text-stone-400 text-xl leading-relaxed max-w-lg">
                {siteConfig.aboutText}
                </p>
            </Reveal>
            <Reveal delay={0.6}>
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                    <div className="space-y-2">
                        <div className="text-4xl font-serif text-liquid-gold">24k</div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-500">Pure Gold</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl font-serif text-liquid-gold">100%</div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-500">Ethical Sourcing</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-4xl font-serif text-liquid-gold">1924</div>
                        <div className="text-[10px] uppercase tracking-widest text-stone-500">Established</div>
                    </div>
                </div>
            </Reveal>
          </div>
          
          <div className="h-[700px] w-full relative group perspective-1000">
             {/* Use Parallax Image here too */}
             <div className="absolute inset-0 border border-champagne-500/20 z-0 transform translate-x-6 translate-y-6"></div>
             <div className="absolute inset-0 bg-stone-900 overflow-hidden shadow-2xl z-10 metallic-sheen">
                 <ParallaxImage src="https://picsum.photos/id/452/800/1000" alt="Craftsman" className="w-full h-full opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                 <Reveal delay={0.8}>
                    <div className="absolute bottom-12 left-12">
                        <Gem size={32} className="text-champagne-400 mb-4" strokeWidth={1} />
                        <p className="font-serif text-3xl italic text-white/90">"Luxury is patience."</p>
                        <p className="text-xs uppercase tracking-widest mt-4 text-champagne-500">Head Artisan, Juma</p>
                    </div>
                 </Reveal>
             </div>
          </div>
        </div>
      </section>
      
      {/* Trust Signals */}
      <section className="py-32 border-t border-stone-200 bg-gradient-to-b from-white to-[#fcfcfc]">
        <StaggerContainer className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <StaggerItem>
                <div className="space-y-6 group">
                    <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-lg shadow-champagne-100 text-champagne-600 group-hover:scale-110 transition-transform duration-500 border border-champagne-100">
                        <Star size={28} fill="currentColor" className="opacity-80" />
                    </div>
                    <h3 className="font-serif text-2xl group-hover:text-liquid-gold transition-colors">Conflict-Free Sourcing</h3>
                    <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">We source Tsavorite and Gold directly from ethical mines in Taita Taveta and Turkana.</p>
                </div>
            </StaggerItem>
             <StaggerItem>
                <div className="space-y-6 group">
                    <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-lg shadow-champagne-100 text-champagne-600 group-hover:scale-110 transition-transform duration-500 border border-champagne-100">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="font-serif text-2xl group-hover:text-liquid-gold transition-colors">Lifetime Warranty</h3>
                    <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">Every piece crafted in our Nairobi atelier is guaranteed for life against manufacturing defects.</p>
                </div>
            </StaggerItem>
             <StaggerItem>
                <div className="space-y-6 group">
                    <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-lg shadow-champagne-100 text-champagne-600 group-hover:scale-110 transition-transform duration-500 border border-champagne-100">
                        <MapPin size={28} />
                    </div>
                    <h3 className="font-serif text-2xl group-hover:text-liquid-gold transition-colors">Pan-African Delivery</h3>
                    <p className="text-sm font-light text-stone-500 px-8 leading-relaxed">Secure, insured shipping to Nairobi, Mombasa, Kampala, Kigali, and beyond.</p>
                </div>
            </StaggerItem>
        </StaggerContainer>
      </section>
    </div>
  );
};