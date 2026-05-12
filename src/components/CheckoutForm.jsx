// src/components/CheckoutForm.jsx
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cart, removeProduct, clearCart } from '../store/cart.js';
import { actions } from 'astro:actions'; 

export default function CheckoutForm() {
    const $cart = useStore(cart);
    const [status, setStatus] = useState('idle'); 
    const [errorMessage, setErrorMessage] = useState('');

    if ($cart.length === 0 && status !== 'success') {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-lg">Votre devis est vide.</p>
                <a href="/#produits" className="text-[#E86B21] font-bold mt-4 inline-block hover:underline">
                    Retour aux produits
                </a>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const formData = new FormData(e.target);
        
        // NO MORE PLAIN TEXT. We stringify the entire cart array and send it to Astro.
        formData.append('CartData', JSON.stringify($cart));

        const { data, error } = await actions.sendDevis(formData);

        if (error) {
            console.error("Erreur d'envoi:", error);
            setErrorMessage(error.message || "Erreur serveur");
            setStatus('error');
        } else {
            setStatus('success');
            clearCart(); 
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-green-100 shadow-sm max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-[#333333] mb-4">Demande envoyée !</h2>
                <p className="text-gray-600 text-lg">Nous avons bien reçu votre demande de devis. Notre équipe vous contactera très rapidement.</p>
                <a href="/#produits" className="mt-8 inline-block bg-[#13522B] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition-colors">
                    Retour aux produits
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
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
                            <button onClick={() => removeProduct(item.sku)} className="text-red-500 hover:text-red-700 p-2">✕</button>
                        </div>
                    ))}
                </div>
                <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 mt-6 w-full text-center">
                    Vider le devis
                </button>
            </div>

            <div className="bg-[#F9F9F9] p-6 md:p-8 rounded-2xl border border-gray-100">
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Vos coordonnées</h2>
                
                {status === 'error' && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 border border-red-100 font-medium">
                        Erreur: {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Nom de l'entreprise / Contact *</label>
                        <input type="text" name="Nom" required disabled={status === 'loading'} className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E86B21] disabled:opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Email *</label>
                        <input type="email" name="Email" required disabled={status === 'loading'} className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E86B21] disabled:opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Téléphone</label>
                        <input type="tel" name="Telephone" disabled={status === 'loading'} className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E86B21] disabled:opacity-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#333333] mb-2">Message supplémentaire</label>
                        <textarea name="Message" rows="3" disabled={status === 'loading'} className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E86B21] disabled:opacity-50"></textarea>
                    </div>

                    <button type="submit" disabled={status === 'loading'} className="bg-[#13522B] text-white font-bold text-lg py-4 rounded-xl hover:bg-green-800 transition-colors mt-2 disabled:opacity-70 flex justify-center items-center gap-2">
                        {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}
                    </button>
                </form>
            </div>
        </div>
    );
}