// src/components/CheckoutForm.jsx
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cart, removeProduct, clearCart } from '../store/cart.js';

export default function CheckoutForm() {
    const $cart = useStore(cart);
    const [isRedirecting, setIsRedirecting] = useState(false);

    if ($cart.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-lg">Votre panier est vide.</p>
                <a href="/#produits" className="text-[#E86B21] font-bold mt-4 inline-block hover:underline">
                    Retour aux produits
                </a>
            </div>
        );
    }

    const handleCheckout = () => {
        setIsRedirecting(true);
        
        // 1. SAFETY CHECK: Ensure no IDs are undefined before sending
        const missingIds = $cart.filter(item => !item.databaseId);
        if (missingIds.length > 0) {
            const names = missingIds.map(i => i.name).join(", ");
            alert(`ERREUR: Impossible de passer à la caisse. Ces produits manquent d'identifiant (databaseId): ${names}. Videz le panier et réessayez.`);
            setIsRedirecting(false);
            return; 
        }

        // 2. Format the payload securely 
        const cartData = $cart.map(item => `${item.databaseId}:${item.qty}`).join(',');
        
        // 3. Send to WordPress
        window.location.href = `https://admin.maxevopackaging.ma/?multi-cart=${cartData}`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* LEFT SIDE: Cart Items */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Vos articles</h2>
                <div className="flex flex-col gap-4">
                    {$cart.map((item) => (
                        <div key={item.sku} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0">
                            <img src={item.image?.sourceUrl || item.image || "/placeholder.jpg"} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-50" />
                            <div className="flex-1">
                                <h3 className="font-bold text-[#333333] text-sm md:text-base">{item.name}</h3>
                                <p className="text-xs text-gray-500">Ref: {item.sku}</p>
                            </div>
                            <div className="text-sm font-bold bg-gray-100 px-3 py-1 rounded">
                                Qté: {item.qty}
                            </div>
                            <button onClick={() => removeProduct(item.sku)} className="text-red-500 hover:text-red-700 p-2">✕</button>
                        </div>
                    ))}
                </div>
                <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 mt-6 w-full text-center">
                    Vider le panier
                </button>
            </div>

            {/* RIGHT SIDE: Checkout Button */}
            <div className="bg-[#F9F9F9] p-6 md:p-8 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center h-fit">
                <h2 className="text-2xl font-bold text-[#333333] mb-4">Prêt à commander ?</h2>
                <p className="text-gray-600 mb-8">
                    Passez à la caisse pour finaliser votre commande en toute sécurité sur notre plateforme.
                </p>
                
                <button 
                    onClick={handleCheckout} 
                    disabled={isRedirecting}
                    className="bg-[#13522B] text-white font-bold text-lg py-4 px-8 w-full rounded-xl hover:bg-[#0d3b1e] transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
                >
                    {isRedirecting ? 'Redirection en cours...' : 'Passer à la caisse'}
                </button>
            </div>
            
        </div>
    );
}