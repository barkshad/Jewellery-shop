import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ViewContextType, Product } from '../types';
import { ADMIN_STATS_DATA } from '../constants';
import { Package, DollarSign, Users, TrendingUp, Edit, Trash2, Plus, Save, Upload, Loader2 } from 'lucide-react';

interface AdminProps {
  store: ViewContextType;
}

type AdminTab = 'DASHBOARD' | 'CMS_CONTENT' | 'CMS_PRODUCTS';

export const Admin: React.FC<AdminProps> = ({ store }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [uploading, setUploading] = useState<string | null>(null); // 'heroVideo' | 'productImage' | null
  const [saving, setSaving] = useState(false);
  
  // Local state for editing products to avoid instant re-renders on every keystroke
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Handlers for Site Config
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    store.updateSiteConfig({ [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroVideoUrl' | 'image', productId?: string) => {
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

      if (!response.ok) {
          throw new Error('Upload failed');
      }

      const data = await response.json();
      const downloadURL = data.secure_url;
      
      // Update State
      if (field === 'heroVideoUrl') {
        await store.updateSiteConfig({ heroVideoUrl: downloadURL });
      } else if (productId && editingProduct) {
        setEditingProduct({ ...editingProduct, image: downloadURL });
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  // Handlers for Product Editing
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsNewProduct(false);
  };

  const handleCreateProduct = () => {
    setEditingProduct({
      id: 'temp-' + Math.random().toString(36).substr(2, 9),
      name: '',
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
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
     if(window.confirm("Are you sure you want to delete this product?")) {
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

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-stone-50 animate-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center border-b border-stone-200 pb-6 gap-4">
            <div>
                <h1 className="font-serif text-3xl text-charcoal">Maison Control</h1>
                <p className="text-xs uppercase tracking-widest text-stone-400">Authorized Personnel Only</p>
            </div>
            
            <div className="flex space-x-1 bg-white p-1 rounded-md shadow-sm border border-stone-100">
                <button 
                    onClick={() => setActiveTab('DASHBOARD')}
                    className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'DASHBOARD' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    Dashboard
                </button>
                <button 
                    onClick={() => setActiveTab('CMS_CONTENT')}
                    className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'CMS_CONTENT' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    Edit Content
                </button>
                <button 
                    onClick={() => setActiveTab('CMS_PRODUCTS')}
                    className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'CMS_PRODUCTS' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    Inventory
                </button>
            </div>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'DASHBOARD' && (
            <div className="animate-enter">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass p-6 rounded-none border border-white/40 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-stone-500 text-xs uppercase tracking-widest">Revenue (KES)</span>
                            <DollarSign size={16} className="text-champagne-600" />
                        </div>
                        <div className="text-2xl font-serif">40.2M</div>
                        <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <TrendingUp size={12} /> +12% vs last month
                        </div>
                    </div>
                    {/* ... other stat cards ... */}
                    <div className="glass p-6 rounded-none border border-white/40 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-stone-500 text-xs uppercase tracking-widest">Active Orders</span>
                            <Package size={16} className="text-champagne-600" />
                        </div>
                        <div className="text-2xl font-serif">154</div>
                        <div className="text-xs text-stone-400 mt-2">12 pending delivery</div>
                    </div>
                </div>

                 <div className="lg:col-span-2 glass p-8 border border-white/40">
                    <h3 className="font-serif text-xl mb-6">Revenue Performance (KES)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ADMIN_STATS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                <XAxis dataKey="name" tick={{fill: '#78716c', fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: '#78716c', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000000}M`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#e5e5e5', borderRadius: '0px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#1a1a1a', fontFamily: 'serif' }}
                                    cursor={{fill: 'rgba(213, 176, 131, 0.1)'}}
                                />
                                <Bar dataKey="revenue" fill="#d5b083" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        {/* CONTENT CMS TAB */}
        {activeTab === 'CMS_CONTENT' && (
            <div className="glass p-8 border border-white/40 animate-enter max-w-4xl">
                 <h3 className="font-serif text-2xl mb-6">Website Content</h3>
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-stone-500">Hero Title</label>
                            <input 
                                name="heroTitle"
                                value={store.siteConfig.heroTitle}
                                onChange={handleConfigChange}
                                className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500 font-serif text-lg" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-stone-500">Hero Subtitle</label>
                            <textarea 
                                name="heroSubtitle"
                                value={store.siteConfig.heroSubtitle}
                                onChange={handleConfigChange}
                                rows={3}
                                className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2 bg-white/50 p-4 border border-stone-200 rounded-sm">
                        <label className="text-xs uppercase tracking-widest text-stone-500 block mb-2">Hero Video Background</label>
                        
                        <div className="flex items-center gap-4">
                            <input 
                                type="text"
                                name="heroVideoUrl"
                                value={store.siteConfig.heroVideoUrl}
                                onChange={handleConfigChange}
                                placeholder="https://..."
                                className="flex-1 bg-white border border-stone-200 p-3 focus:outline-none focus:border-champagne-500 font-mono text-xs" 
                            />
                            
                            <label className={`flex items-center gap-2 px-4 py-3 bg-stone-900 text-white cursor-pointer hover:bg-stone-800 transition-colors ${uploading === 'heroVideoUrl-config' ? 'opacity-50 pointer-events-none' : ''}`}>
                                {uploading === 'heroVideoUrl-config' ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Upload size={16} />
                                )}
                                <span className="text-xs uppercase tracking-widest">Upload Video</span>
                                <input 
                                    type="file" 
                                    accept="video/mp4" 
                                    className="hidden" 
                                    onChange={(e) => handleFileUpload(e, 'heroVideoUrl')} 
                                />
                            </label>
                        </div>
                        <p className="text-[10px] text-stone-400 mt-2">Recommended: 1080p MP4, under 10MB.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-stone-500">About Section Title</label>
                        <input 
                            name="aboutTitle"
                            value={store.siteConfig.aboutTitle}
                            onChange={handleConfigChange}
                            className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500 font-serif" 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-stone-500">About Text</label>
                        <textarea 
                            name="aboutText"
                            value={store.siteConfig.aboutText}
                            onChange={handleConfigChange}
                            rows={5}
                            className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-stone-500">Contact Phone</label>
                            <input 
                                name="contactPhone"
                                value={store.siteConfig.contactPhone}
                                onChange={handleConfigChange}
                                className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500" 
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-stone-500">Contact Email</label>
                            <input 
                                name="contactEmail"
                                value={store.siteConfig.contactEmail}
                                onChange={handleConfigChange}
                                className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500" 
                            />
                        </div>
                    </div>
                 </div>
            </div>
        )}

        {/* PRODUCTS CMS TAB */}
        {activeTab === 'CMS_PRODUCTS' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-enter">
                {/* List */}
                <div className="lg:col-span-1 glass p-6 h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-serif text-xl">Inventory</h3>
                        <button onClick={handleCreateProduct} className="p-2 hover:bg-stone-200 rounded-full transition-colors"><Plus size={20}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {store.products.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => handleEditProduct(p)}
                                className={`flex items-center gap-4 p-3 border cursor-pointer transition-colors ${editingProduct?.id === p.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white/40 border-transparent hover:border-stone-300'}`}
                            >
                                <img src={p.image} className="w-12 h-12 object-cover" alt="" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{p.name}</div>
                                    <div className={`text-xs ${editingProduct?.id === p.id ? 'text-stone-400' : 'text-stone-500'}`}>KES {p.price.toLocaleString()}</div>
                                </div>
                                <Edit size={14} className={editingProduct?.id === p.id ? 'text-stone-400' : 'text-stone-400'} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div className="lg:col-span-2 glass p-8">
                    {editingProduct ? (
                        <div className="space-y-6">
                             <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                                <h3 className="font-serif text-2xl">{isNewProduct ? 'Add New Product' : 'Edit Product'}</h3>
                                <button onClick={() => handleDeleteProduct(editingProduct.id)} className="text-red-500 text-xs uppercase tracking-widest hover:text-red-700 flex items-center gap-2">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-stone-500">Name</label>
                                    <input 
                                        name="name"
                                        value={editingProduct.name}
                                        onChange={handleProductChange}
                                        className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500 font-serif text-lg" 
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-stone-500">Price (KES)</label>
                                    <input 
                                        name="price"
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={handleProductChange}
                                        className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500" 
                                    />
                                </div>
                            </div>

                             <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-stone-500">Category</label>
                                <select 
                                    name="category"
                                    value={editingProduct.category}
                                    // @ts-ignore
                                    onChange={handleProductChange}
                                    className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500" 
                                >
                                    <option value="Rings">Rings</option>
                                    <option value="Necklaces">Necklaces</option>
                                    <option value="Earrings">Earrings</option>
                                    <option value="Watches">Watches</option>
                                </select>
                            </div>

                            <div className="space-y-2 bg-white/50 p-4 border border-stone-200 rounded-sm">
                                <label className="text-xs uppercase tracking-widest text-stone-500 block mb-2">Product Image</label>
                                <div className="flex gap-4 items-start">
                                    <img src={editingProduct.image} className="w-16 h-16 object-cover bg-stone-200" alt="Preview" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                             <input 
                                                name="image"
                                                value={editingProduct.image}
                                                onChange={handleProductChange}
                                                className="w-full bg-white border border-stone-200 p-2 text-xs font-mono focus:outline-none focus:border-champagne-500" 
                                            />
                                             <label className={`flex items-center gap-2 px-3 py-2 bg-stone-900 text-white cursor-pointer hover:bg-stone-800 transition-colors ${uploading === `image-${editingProduct.id}` ? 'opacity-50 pointer-events-none' : ''}`}>
                                                {uploading === `image-${editingProduct.id}` ? (
                                                    <Loader2 size={12} className="animate-spin" />
                                                ) : (
                                                    <Upload size={12} />
                                                )}
                                                <span className="text-[10px] uppercase tracking-widest whitespace-nowrap">Upload</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={(e) => handleFileUpload(e, 'image', editingProduct.id)} 
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-stone-500">Description</label>
                                <textarea 
                                    name="description"
                                    value={editingProduct.description}
                                    onChange={handleProductChange}
                                    rows={4}
                                    className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500" 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-stone-500">Materials (comma separated)</label>
                                <input 
                                    name="materials"
                                    value={editingProduct.materials.join(', ')}
                                    onChange={handleProductChange}
                                    className="w-full bg-white/50 border border-stone-200 p-3 focus:outline-none focus:border-champagne-500" 
                                />
                            </div>

                            <div className="pt-6">
                                <button 
                                    onClick={saveProduct}
                                    disabled={saving}
                                    className="w-full bg-stone-900 text-white py-4 uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-stone-400 italic">
                            Select a product to edit or create new.
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
