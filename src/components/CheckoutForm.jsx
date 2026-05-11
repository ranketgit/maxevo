// src/components/CheckoutForm.jsx
import { useStore } from '@nanostores/react';
import { cart, removeProduct, clearCart } from '../store/cart.js';

export default function CheckoutForm() {
    // This hook makes the component update live when the cart changes
    const $cart = useStore(cart);

    if ($cart.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-lg">Votre devis est vide.</p>
                <a href="/#produits" className="text-[#E86B21] font-bold mt-4 inline-block hover:underline">
                    Retour aux produits
                </a>
            </div>
        );
    }

    // Format the cart items into a clean text block to send in the email
    const orderDetails = $cart.map(item => `${item.qty}x ${item.name} (Ref: ${item.sku})`).join('\n');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Side: Cart Items */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Vos articles</h2>
                <div className="flex flex-col gap-4">
                    {$cart.map((item) => (
                        <div key={item.sku} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-50" />
                            <div className="flex-1">
                                <h3 className="font-bold text-[#333333] text-sm md:text-base">{item.name}</h3>
                                <p className="text-xs text-gray-500">Ref: {item.sku}</p>
                            </div>
                            <div className="text-sm font-bold bg-gray-100 px-3 py-1 rounded">
                                Qté: {item.qty}
                            </div>
                            <button 
                                onClick={() => removeProduct(item.sku)}
                                className="text-red-500 hover:text-red-700 p-2"
                                title="Supprimer"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 mt-6 w-full text-center">
                    Vider le devis
                </button>
            </div>

            {/* Right Side: Formspree Email Form */}
            <div className="bg-[#F9F9F9] p-6 md:p-8 rounded-2xl border border-gray-100">
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Vos coordonnées</h2>
                
                {/* Replace YOUR_FORMSPREE_ID with the one you get from formspree.io */}
                <form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST" className="flex flex-col gap-5">
                    
                    {/* Hidden field that attaches the cart data to the email */}
                    <input type="hidden" name="Détails du Devis" value={orderDetails} />

                    <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Nom de l'entreprise / Contact *</label>
                        <input type="text" name="Nom" required className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E86B21]" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Email *</label>
                        <input type="email" name="Email" required className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E86B21]" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Téléphone</label>
                        <input type="tel" name="Telephone" className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E86B21]" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Message supplémentaire</label>
                        <textarea name="Message" rows="3" className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E86B21]"></textarea>
                    </div>

                    <button type="submit" className="bg-[#13522B] text-white font-bold text-lg py-4 rounded-xl hover:bg-green-800 transition-colors mt-2">
                        Envoyer la demande
                    </button>
                </form>
            </div>

        </div>
    );
}