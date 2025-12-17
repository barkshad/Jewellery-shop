import { Product, SiteConfig } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tsavorite Rift Ring',
    price: 450000,
    category: 'Rings',
    image: 'https://picsum.photos/id/112/800/800', 
    description: 'A tribute to the Taita Hills. A rare 2-carat green Tsavorite garnet set in hand-forged 18k Kenyan gold. The band mimics the textures of the Great Rift Valley.',
    materials: ['18k Kenyan Gold', 'Green Tsavorite'],
    isNew: true
  },
  {
    id: '2',
    name: 'Mara Dawn Pendant',
    price: 320000,
    category: 'Necklaces',
    image: 'https://picsum.photos/id/449/800/800', 
    description: 'Inspired by the sunrise over the Masai Mara. A suspended teardrop of orange sapphire, encased in an intricate champagne gold cage.',
    materials: ['18k Champagne Gold', 'Orange Sapphire'],
  },
  {
    id: '3',
    name: 'Nairobi Chrono Executive',
    price: 1850000,
    category: 'Watches',
    image: 'https://picsum.photos/id/175/800/800', 
    description: 'Designed in Westlands, crafted in Switzerland. A titanium skeleton dial revealing the heartbeat of modern African timekeeping.',
    materials: ['Titanium', 'Sapphire Crystal', 'Rift Leather'],
  },
  {
    id: '4',
    name: 'Kilifi Pearl Drops',
    price: 280000,
    category: 'Earrings',
    image: 'https://picsum.photos/id/250/800/800', 
    description: 'Cascading chains of gold capturing the fluidity of the Indian Ocean. A statement of coastal elegance.',
    materials: ['24k Gold Vermeil', 'Freshwater Pearls'],
    isNew: true
  },
  {
    id: '5',
    name: 'Turkana Obsidian Signet',
    price: 195000,
    category: 'Rings',
    image: 'https://picsum.photos/id/230/800/800',
    description: 'A modern interpretation of heritage. Black obsidian from the north, set in brushed platinum. Strength in silence.',
    materials: ['Platinum', 'Black Obsidian'],
  },
  {
    id: '6',
    name: 'Savanna Constellation Cuff',
    price: 640000,
    category: 'Rings',
    image: 'https://picsum.photos/id/350/800/800',
    description: 'Structured yet delicate, this cuff wraps the wrist like the starry night sky over the savanna.',
    materials: ['18k Rose Gold', 'Pave Diamonds'],
  }
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  heroTitle: "The Heart of Kenyan Luxury",
  heroSubtitle: "From the depths of the Rift Valley to the atelier in Nairobi. Rare gemstones, architectural precision, eternal brilliance.",
  heroButtonText: "Explore the Collection",
  aboutTitle: "Forged in the Rift, Worn by the World",
  aboutText: "Every piece begins as a sketch in our Westlands studio. We source Tsavorite from Taita, Sapphires from Turkana, and Gold from the heart of the land. It takes over 200 hours of masterful precision to transform raw earth into the artifacts you see today.",
  contactEmail: "concierge@aurum.co.ke",
  contactPhone: "+254 700 000 000",
  announcementBar: "Complimentary shipping within Nairobi & Mombasa • Worldwide shipping available"
};

export const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Earrings', 'Watches'];

export const ADMIN_STATS_DATA = [
  { name: 'Jan', revenue: 4500000 },
  { name: 'Feb', revenue: 5200000 },
  { name: 'Mar', revenue: 4800000 },
  { name: 'Apr', revenue: 6100000 },
  { name: 'May', revenue: 5500000 },
  { name: 'Jun', revenue: 6700000 },
  { name: 'Jul', revenue: 7200000 },
];
