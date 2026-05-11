// src/components/AddToCart.jsx
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cart, addProduct } from '../store/cart.js';

export default function AddToCart({ product }) {
    const $cart = useStore(cart);
    const [qty, setQty] = useState(1);
    const [showToast, setShowToast] = useState(false);

    const sku = product.sku || product.databaseId;
    const isInCart = $cart.some(item => item.sku === sku);

    const handleAdd = () => {
        if (isInCart) return;

        // Force qty to be at least 1 just in case they broke the input
        const finalQty = Math.max(1, parseInt(qty) || 1);

        addProduct({
            sku: sku,
            name: product.name,
            image: product.image?.sourceUrl || '/placeholder.jpg'
        }, finalQty);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const increment = () => setQty(prev => (parseInt(prev) || 0) + 1);
    const decrement = () => setQty(prev => (prev > 1 ? prev - 1 : 1));

    // Allow typing directly into the input
    const handleTyping = (e) => {
        const val = e.target.value;
        if (val === '') {
            setQty(''); // Allow them to temporarily clear it to type
        } else {
            const num = parseInt(val, 10);
            if (!isNaN(num)) setQty(num);
        }
    };

    // If they click away and left it blank or 0, reset to 1
    const handleBlur = () => {
        if (qty === '' || qty < 1) {
            setQty(1);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                
                {!isInCart && (
                    <div className="flex items-center justify-between border border-gray-200 rounded-xl px-2 py-2 bg-white h-full min-h-[56px] w-full sm:w-36 shrink-0">
                        <button onClick={decrement} className="text-gray-400 hover:text-[#E86B21] text-2xl font-light focus:outline-none px-3 select-none">-</button>
                        
                        {/* FIX: Interactive input instead of static span */}
                        <input 
                            type="number" 
                            value={qty}
                            onChange={handleTyping}
                            onBlur={handleBlur}
                            className="font-bold text-[#333333] text-lg text-center w-12 bg-transparent focus:outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                            min="1"
                        />

                        <button onClick={increment} className="text-gray-400 hover:text-[#E86B21] text-2xl font-light focus:outline-none px-3 select-none">+</button>
                    </div>
                )}

                <button 
                    onClick={handleAdd} 
                    disabled={isInCart}
                    className={`px-8 py-4 rounded-xl font-medium transition-all text-lg w-full flex items-center justify-center gap-3 h-full min-h-[56px] ${
                        isInCart 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                            : 'bg-[#E86B21] text-white hover:bg-[#d15f1c] shadow-lg hover:shadow-xl'
                    }`}
                >
                    {isInCart ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Déjà ajouté
                        </>
                    ) : (
                        <>
                            Ajouter au devis
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>

            {isInCart && (
                <a href="/devis" className="text-sm text-[#13522B] font-bold hover:underline text-center sm:text-left mt-1">
                    → Voir mon devis
                </a>
            )}

            <div 
                className={`fixed top-24 right-4 z-[9999] transition-all duration-500 transform ${
                    showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
            >
                <div className="bg-[#13522B] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-green-800 min-w-[300px]">
                    <div className="bg-green-500/20 p-2 rounded-full shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-lg leading-tight mb-1">Produit ajouté !</p>
                        <p className="text-sm opacity-90 font-light line-clamp-1">{product.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}