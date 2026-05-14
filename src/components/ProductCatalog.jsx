// src/components/ProductCatalog.jsx
import { useState } from 'react';

export default function ProductCatalog({ initialProducts, categories }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter logic: Match both the search box and the selected category
    const filteredProducts = initialProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === 'all' 
            ? true 
            : product.productCategories?.nodes?.some(cat => cat.slug === selectedCategory);
            
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT SIDEBAR: FILTERS */}
            <aside className="w-full lg:w-1/4 flex flex-col gap-6 sticky top-28">
                
                {/* Search Bar */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-[#333333] mb-4">Rechercher</h3>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Nom du produit..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E86B21] transition-colors"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Categories Filter */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hidden md:block">
                    <h3 className="text-lg font-bold text-[#333333] mb-4">Catégories</h3>
                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => setSelectedCategory('all')}
                            className={`text-left px-4 py-2 rounded-lg transition-colors font-medium text-sm ${selectedCategory === 'all' ? 'bg-[#13522B] text-white' : 'text-[#333333] hover:bg-gray-50'}`}
                        >
                            Tous les produits ({initialProducts.length})
                        </button>
                        
                        {categories.map(cat => {
                            // Calculate how many products are in this category manually to be safe
                            const count = initialProducts.filter(p => p.productCategories?.nodes?.some(c => c.slug === cat.slug)).length;
                            
                            // Don't show empty categories in the filter list
                            if (count === 0) return null;

                            return (
                                <button 
                                    key={cat.slug}
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    className={`text-left px-4 py-2 rounded-lg transition-colors font-medium text-sm flex justify-between items-center ${selectedCategory === cat.slug ? 'bg-[#13522B] text-white' : 'text-[#333333] hover:bg-gray-50'}`}
                                >
                                    <span>{cat.name}</span>
                                    <span className={`text-xs ${selectedCategory === cat.slug ? 'text-green-200' : 'text-gray-400'}`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Categories Dropdown (Visible only on small screens) */}
                <div className="md:hidden w-full">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 bg-white font-medium text-[#333333] focus:outline-none focus:border-[#E86B21]"
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map(cat => (
                            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </aside>

            {/* RIGHT SIDE: PRODUCT GRID */}
            <div className="w-full lg:w-3/4">
                
                {/* Results Count Header */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#333333]">
                        {selectedCategory === 'all' 
                            ? 'Notre Catalogue' 
                            : categories.find(c => c.slug === selectedCategory)?.name}
                    </h2>
                    <span className="text-gray-500 text-sm font-medium">
                        {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => {
                            const primaryCategory = product.productCategories?.nodes?.[0]?.name || "Général";
                            const imageUrl = product.image?.sourceUrl || "/placeholder.jpg";
                            const desc = product.shortDescription || "";

                            return (
                                <a key={product.slug} href={`/produits/${product.slug}`} className="bg-white p-4 rounded-[1.5rem] shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group focus:outline-none flex flex-col h-full">
                                    <div className="w-full aspect-square bg-[#F9F9F9] rounded-xl mb-5 overflow-hidden transition-colors pointer-events-none p-4 flex items-center justify-center">
                                        <img 
                                            src={imageUrl} 
                                            alt={product.name} 
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                    <span className="text-xs text-[#13522B] font-bold uppercase tracking-widest mb-2 block">{primaryCategory}</span>
                                    <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:text-[#E86B21] transition-colors line-clamp-1">{product.name}</h3>
                                    <div className="text-sm font-light text-[#333333] opacity-70 line-clamp-2 mt-auto" dangerouslySetInnerHTML={{ __html: desc }}></div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="w-full py-32 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#333333] mb-2">Aucun produit trouvé</h3>
                        <p className="text-gray-500 max-w-md">Nous n'avons trouvé aucun produit correspondant à votre recherche. Essayez de modifier vos filtres.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                            className="mt-6 text-[#E86B21] font-bold hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}