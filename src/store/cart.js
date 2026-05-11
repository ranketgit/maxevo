// src/store/cart.js
import { persistentAtom } from '@nanostores/persistent';

export const cart = persistentAtom('maxevo_cart', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

// Now accepts a quantity parameter
export function addProduct(product, quantity = 1) {
    const items = cart.get();
    const existing = items.find(item => item.sku === product.sku);

    if (existing) {
        cart.set(items.map(item => 
            item.sku === product.sku ? { ...item, qty: item.qty + quantity } : item
        ));
    } else {
        cart.set([...items, { ...product, qty: quantity }]);
    }
}

export function removeProduct(sku) {
    cart.set(cart.get().filter(item => item.sku !== sku));
}

export function clearCart() {
    cart.set([]);
}