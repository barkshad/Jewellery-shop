import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ViewContextType, Product } from '../types';
import { ADMIN_STATS_DATA } from '../constants';
import { 
  Package, DollarSign, TrendingUp, Trash2, Plus, 
  Save, Upload, Loader2, Lock, LogOut, LayoutDashboard, 
  Type, ShoppingBag, ChevronRight, Image as ImageIcon,
  CheckCircle2, AlertCircle, Search, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminProps {
  store: ViewContextType;
}

type AdminTab = 'DASHBOARD' | 'CMS_CONTENT' | 'CMS_PRODUCTS';

export const Admin: React.FC<AdminProps> = ({ store }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // CMS State
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Product Editor State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '12345') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    store.updateSiteConfig({ [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroMediaUrl' | 'image', productId?: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const uploadId = productId || 'config';
    setUploading(`${field}-${uploadId}`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'qqk2urzm');
      
      const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/ds2mbrzcn/${resourceType}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const downloadURL = data.secure_url;
      
      if (field === 'heroMediaUrl') {
        await store.updateSiteConfig({ heroMediaUrl: downloadURL });
      } else if (productId && editingProduct) {
        setEditingProduct({ ...editingProduct, image: downloadURL });
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct({
      id: 'temp-' + Math.random().toString(36).substr(2, 9),
      name: 'New Artifact',
      price: 0,
      category: 'Rings',
      image: 'https://picsum.photos/800/800',
      description: '',
      materials: [],
      isNew: true
    });
    setIsNewProduct(true);
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      if (isNewProduct) {
        await store.addProduct(editingProduct);
      } else {
        await store.updateProduct(editingProduct.id, editingProduct);
      }
      setEditingProduct(null);
      setLastSaved(new Date());
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
     if(window.confirm("Are you sure you want to remove this artifact from the collection? This action cannot be undone.")) {
         await store.deleteProduct(id);
         if(editingProduct?.id === id) setEditingProduct(null);
     }
  }

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    if (name === 'price') {
      setEditingProduct({ ...editingProduct, price: Number(value) });
    } else if (name === 'materials') {
        setEditingProduct({ ...editingProduct, materials: value.split(',').map(s => s.trim()) });
    } else {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-champagne-500/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md relative z-10"
        >
            <div className="glass-dark p-12 text-center rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl text-white tracking-[0.2em] mb-2">AURUM OS</h1>
                    <p className="text-stone-400 text-xs uppercase tracking-widest">Maison Management System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-champagne-500 transition-colors" size={16} />
                        <input 
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Enter Access Code"
                            className={`w-full bg-stone-950/50 border ${loginError ? 'border-red-500' : 'border-stone-800 focus:border-champagne-500'} text-white py-4 pl-12 pr-4 rounded-lg outline-none transition-all placeholder:text-stone-600 font-mono`}
                            autoFocus
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-champagne-600 hover:bg-champagne-500 text-white font-medium py-4 rounded-lg transition-all uppercase tracking-widest text-xs shadow-lg shadow-champagne-900/20"
                    >
                        Authenticate
                    </button>
                </form>

                {loginError && (
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-6 flex items-center justify-center gap-2"
                    >
                        <AlertCircle size={14} /> Invalid Security Credentials
                    </motion.p>
                )}
            </div>
            <p className="text-stone-600 text-[10px] text-center mt-8 uppercase tracking-widest">Restricted Access • Authorized Personnel Only</p>
        </motion.div>
      </div>
    );
  }

  // --- Main CMS Interface ---
  const filteredProducts = store.products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans pt-20 md:pt-0">
        
        {/* Sidebar Navigation */}
        <aside className="fixed top-0 bottom-0 left-0 w-72 bg-stone-900 text-stone-400 hidden md:flex flex-col z-50 shadow-2xl">
            <div className="p-8 border-b border-white/5">
                <h2 className="text-white font-serif text-2xl tracking-[0.2em]">AURUM</h2>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-widest">System Online</span>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                <button 
                    onClick={() => setActiveTab('DASHBOARD')}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'DASHBOARD' ? 'bg-champagne-600 text-white shadow-lg shadow-champagne-900/20' : 'hover:bg-white/5 hover:text-white'}`}
                >
                    <LayoutDashboard size={18} />
                    <span className="text-xs uppercase tracking-widest font-medium">Overview</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab('CMS_CONTENT')}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'CMS_CONTENT' ? 'bg-champagne-600 text-white shadow-lg shadow-champagne-900/20' : 'hover:bg-white/5 hover:text-white'}`}
                >
                    <Type size={18} />
                    <span className="text-xs uppercase tracking-widest font-medium">Website Content</span>
                </button>

                <button 
                    onClick={() => setActiveTab('CMS_PRODUCTS')}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'CMS_PRODUCTS' ? 'bg-champagne-600 text-white shadow-lg shadow-champagne-900/20' : 'hover:bg-white/5 hover:text-white'}`}
                >
                    <ShoppingBag size={18} />
                    <span className="text-xs uppercase tracking-widest font-medium">Inventory</span>
                </button>
            </nav>

            <div className="p-6 border-t border-white/5">
                <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="flex items-center gap-3 text-stone-500 hover:text-red-400 transition-colors w-full px-4"
                >
                    <LogOut size={16} />
                    <span className="text-xs uppercase tracking-widest">Secure Logout</span>
                </button>
            </div>
        </aside>

        {/* Mobile Header (visible only on mobile) */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-stone-900 text-white p-4 z-40 flex justify-between items-center">
             <span className="font-serif tracking-widest">AURUM OS</span>
             <button onClick={() => setIsAuthenticated(false)}><LogOut size={16}/></button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-72 p-6 md:p-12 overflow-y-auto h-screen">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    
                    {/* --- DASHBOARD TAB --- */}
                    {activeTab === 'DASHBOARD' && (
                        <div className="max-w-6xl mx-auto space-y-8">
                            <header className="flex justify-between items-end mb-8">
                                <div>
                                    <h1 className="text-3xl font-serif text-charcoal mb-2">Command Center</h1>
                                    <p className="text-stone-500">Welcome back. Here is today's luxury report.</p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-2xl font-serif text-champagne-600">{new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                    <p className="text-xs uppercase tracking-widest text-stone-400">Nairobi HQ</p>
                                </div>
                            </header>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col justify-between h-40 relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <DollarSign size={80} className="text-champagne-600"/>
                                    </div>
                                    <div className="flex justify-between items-start z-10">
                                        <span className="text-stone-400 text-xs uppercase tracking-widest font-semibold">Total Revenue</span>
                                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-bold">+12.5%</span>
                                    </div>
                                    <div className="z-10">
                                        <div className="text-3xl font-serif text-charcoal">KES 40.2M</div>
                                        <div className="text-xs text-stone-400 mt-1">Current Financial Year</div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col justify-between h-40 relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Package size={80} className="text-champagne-600"/>
                                    </div>
                                    <div className="flex justify-between items-start z-10">
                                        <span className="text-stone-400 text-xs uppercase tracking-widest font-semibold">Orders Fulfilled</span>
                                    </div>
                                    <div className="z-10">
                                        <div className="text-3xl font-serif text-charcoal">1,204</div>
                                        <div className="text-xs text-stone-400 mt-1">Since Inception</div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col justify-between h-40 relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <TrendingUp size={80} className="text-champagne-600"/>
                                    </div>
                                    <div className="flex justify-between items-start z-10">
                                        <span className="text-stone-400 text-xs uppercase tracking-widest font-semibold">Avg. Order Value</span>
                                    </div>
                                    <div className="z-10">
                                        <div className="text-3xl font-serif text-charcoal">KES 245K</div>
                                        <div className="text-xs text-stone-400 mt-1">+5% from last month</div>
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                                <h3 className="font-serif text-xl mb-6 text-charcoal">Revenue Trajectory</h3>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ADMIN_STATS_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" tick={{fill: '#a8a29e', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis tick={{fill: '#a8a29e', fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000000}M`} />
                                            <Tooltip 
                                                cursor={{fill: '#fcfcfc'}}
                                                contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '8px', color: '#fff' }}
                                                itemStyle={{ color: '#d5b083', fontFamily: 'serif' }}
                                            />
                                            <Bar dataKey="revenue" fill="#d5b083" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- CONTENT TAB --- */}
                    {activeTab === 'CMS_CONTENT' && (
                        <div className="max-w-4xl mx-auto">
                            <header className="mb-8 border-b border-stone-200 pb-6 flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-serif text-charcoal mb-2">Content Manager</h1>
                                    <p className="text-stone-500 text-sm">Update text, video, and brand messaging instantly.</p>
                                </div>
                                {lastSaved && (
                                    <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                                        <CheckCircle2 size={12} /> Auto-saved {lastSaved.toLocaleTimeString()}
                                    </span>
                                )}
                            </header>

                            <div className="space-y-8">
                                {/* Hero Section Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                                    <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex items-center gap-3">
                                        <LayoutDashboard size={18} className="text-stone-400" />
                                        <h3 className="font-medium text-charcoal text-sm uppercase tracking-wider">Homepage Experience</h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Main Headline</label>
                                                <input 
                                                    name="heroTitle"
                                                    value={store.siteConfig.heroTitle}
                                                    onChange={handleConfigChange}
                                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-lg font-serif focus:ring-2 focus:ring-champagne-500/20 focus:border-champagne-500 outline-none transition-all" 
                                                />
                                                <p className="text-[10px] text-stone-400">The first text visitors see. Keep it short and impactful.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Hero Background (Video or Image)</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        value={store.siteConfig.heroMediaUrl || ''}
                                                        onChange={handleConfigChange}
                                                        name="heroMediaUrl"
                                                        className="flex-1 bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs font-mono text-stone-500 focus:border-champagne-500 outline-none" 
                                                        placeholder="https://..."
                                                    />
                                                    <label className={`bg-stone-900 text-white px-4 rounded-lg flex items-center cursor-pointer hover:bg-stone-800 transition-all ${uploading === 'heroMediaUrl-config' ? 'opacity-50' : ''}`}>
                                                        {uploading === 'heroMediaUrl-config' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                                                        <input type="file" accept="video/*,image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'heroMediaUrl')} />
                                                    </label>
                                                </div>
                                                <p className="text-[10px] text-stone-400">Supports MP4, JPG, PNG. Max 10MB recommended.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Sub-Headline</label>
                                            <textarea 
                                                name="heroSubtitle"
                                                value={store.siteConfig.heroSubtitle}
                                                onChange={handleConfigChange}
                                                rows={2}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 focus:border-champagne-500 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* About Section Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                                    <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex items-center gap-3">
                                        <Type size={18} className="text-stone-400" />
                                        <h3 className="font-medium text-charcoal text-sm uppercase tracking-wider">Brand Story</h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Section Title</label>
                                            <input 
                                                name="aboutTitle"
                                                value={store.siteConfig.aboutTitle}
                                                onChange={handleConfigChange}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 font-serif focus:border-champagne-500 outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Main Narrative</label>
                                            <textarea 
                                                name="aboutText"
                                                value={store.siteConfig.aboutText}
                                                onChange={handleConfigChange}
                                                rows={5}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 focus:border-champagne-500 outline-none leading-relaxed" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                                    <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex items-center gap-3">
                                        <CheckCircle2 size={18} className="text-stone-400" />
                                        <h3 className="font-medium text-charcoal text-sm uppercase tracking-wider">Contact Details</h3>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                         <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Phone</label>
                                            <input 
                                                name="contactPhone"
                                                value={store.siteConfig.contactPhone}
                                                onChange={handleConfigChange}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 focus:border-champagne-500 outline-none" 
                                            />
                                        </div>
                                         <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Email</label>
                                            <input 
                                                name="contactEmail"
                                                value={store.siteConfig.contactEmail}
                                                onChange={handleConfigChange}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 focus:border-champagne-500 outline-none" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PRODUCTS TAB --- */}
                    {activeTab === 'CMS_PRODUCTS' && (
                         <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
                            
                            {/* Product List Panel */}
                            <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-stone-100 flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-stone-100 bg-stone-50/50">
                                    <div className="relative mb-4">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16}/>
                                        <input 
                                            placeholder="Search inventory..."
                                            value={productSearch}
                                            onChange={(e) => setProductSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:border-champagne-500 outline-none"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleCreateProduct}
                                        className="w-full bg-stone-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
                                    >
                                        <Plus size={16}/> <span className="text-xs uppercase tracking-widest font-bold">Add New Artifact</span>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {filteredProducts.map(p => (
                                        <div 
                                            key={p.id}
                                            onClick={() => { setEditingProduct(p); setIsNewProduct(false); }}
                                            className={`p-4 border-b border-stone-100 cursor-pointer transition-colors flex gap-4 hover:bg-stone-50 ${editingProduct?.id === p.id ? 'bg-champagne-50 border-l-4 border-l-champagne-500' : 'border-l-4 border-l-transparent'}`}
                                        >
                                            <img src={p.image} className="w-12 h-12 object-cover rounded bg-stone-200" alt={p.name} />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-charcoal truncate">{p.name}</div>
                                                <div className="text-xs text-stone-500">KES {p.price.toLocaleString()}</div>
                                            </div>
                                            <ChevronRight size={16} className="text-stone-300 self-center"/>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Editor Panel */}
                            <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col relative">
                                {editingProduct ? (
                                    <>
                                        {/* Editor Header */}
                                        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                                            <div>
                                                <h2 className="font-serif text-2xl text-charcoal">{isNewProduct ? 'Create New Artifact' : 'Edit Artifact'}</h2>
                                                <p className="text-xs text-stone-500 uppercase tracking-widest">{editingProduct.id}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                 <button 
                                                    onClick={() => handleDeleteProduct(editingProduct.id)}
                                                    className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={saveProduct}
                                                    disabled={saving}
                                                    className="bg-champagne-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-champagne-500 transition-colors shadow-lg shadow-champagne-900/10 disabled:opacity-70"
                                                >
                                                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                                                    <span className="text-xs uppercase tracking-widest font-bold">{saving ? 'Saving...' : 'Save Changes'}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Editor Form */}
                                        <div className="flex-1 overflow-y-auto p-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                
                                                {/* Left Column: Media & Price */}
                                                <div className="space-y-6">
                                                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 text-center">
                                                        <div className="relative w-48 h-48 mx-auto mb-4 group cursor-pointer overflow-hidden rounded-lg shadow-sm">
                                                            <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview"/>
                                                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <ImageIcon className="text-white mb-2" size={24}/>
                                                                <span className="text-white text-[10px] uppercase tracking-widest">Change Image</span>
                                                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'image', editingProduct.id)} />
                                                            </div>
                                                            {uploading === `image-${editingProduct.id}` && (
                                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                                    <Loader2 className="animate-spin text-champagne-600" size={32}/>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">Supports JPG, PNG (Max 5MB)</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Price (KES)</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">KES</span>
                                                            <input 
                                                                type="number"
                                                                name="price"
                                                                value={editingProduct.price}
                                                                onChange={handleProductChange}
                                                                className="w-full bg-white border border-stone-200 rounded-lg py-3 pl-12 pr-4 font-mono text-lg focus:border-champagne-500 outline-none" 
                                                            />
                                                        </div>
                                                    </div>

                                                     <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Category</label>
                                                        <select 
                                                            name="category"
                                                            value={editingProduct.category}
                                                            // @ts-ignore
                                                            onChange={handleProductChange}
                                                            className="w-full bg-white border border-stone-200 rounded-lg p-3 focus:border-champagne-500 outline-none appearance-none cursor-pointer" 
                                                        >
                                                            <option value="Rings">Rings</option>
                                                            <option value="Necklaces">Necklaces</option>
                                                            <option value="Earrings">Earrings</option>
                                                            <option value="Watches">Watches</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Right Column: Details */}
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Product Name</label>
                                                        <input 
                                                            name="name"
                                                            value={editingProduct.name}
                                                            onChange={handleProductChange}
                                                            className="w-full bg-white border border-stone-200 rounded-lg p-3 text-xl font-serif focus:border-champagne-500 outline-none" 
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Story / Description</label>
                                                        <textarea 
                                                            name="description"
                                                            value={editingProduct.description}
                                                            onChange={handleProductChange}
                                                            rows={6}
                                                            placeholder="Tell the story of this piece..."
                                                            className="w-full bg-white border border-stone-200 rounded-lg p-3 focus:border-champagne-500 outline-none leading-relaxed" 
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Materials (Comma Separated)</label>
                                                        <input 
                                                            name="materials"
                                                            value={editingProduct.materials.join(', ')}
                                                            onChange={handleProductChange}
                                                            placeholder="e.g. 18k Gold, Diamond, Sapphire"
                                                            className="w-full bg-white border border-stone-200 rounded-lg p-3 focus:border-champagne-500 outline-none" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-stone-400 p-8 text-center">
                                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                                            <Package size={32} className="opacity-50"/>
                                        </div>
                                        <h3 className="text-lg font-serif text-charcoal mb-2">Select an Artifact</h3>
                                        <p className="text-sm max-w-xs mx-auto">Choose a product from the list on the left to edit its details, or create a new one.</p>
                                    </div>
                                )}
                            </div>
                         </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    </div>
  );
};