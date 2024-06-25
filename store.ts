import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Product, ProductswithID } from './lib/Product';

interface CartState {
  cart: Product[];
  fav: Product[];
  onCart: ProductswithID[];
  onFav: ProductswithID[];
  onSetCart: (basket: ProductswithID[]) => void;
  onSetFav: (favs: ProductswithID[]) => void;
  addToCart: (product: Product) => void;
  onAddToCart: (product: ProductswithID) => void;
  removeFromCart: (product: Product) => void;
  onRemoveFromCart: (product: ProductswithID) => void;
  addFavourites: (product: Product) => void;
  onAddFavourites: (product: ProductswithID) => void;
  removeFavourites: (product: Product) => void;
  onRemoveFromFavourites: (product: ProductswithID) => void;
  clearBasket: () => void;
  onClearBasket: () => void;
  clearFavourites: () => void;
  onClearFavourites: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        fav: [],
        onCart: [],
        onFav: [],
        clearBasket() {
          set({ cart: [] });
        },
        onClearBasket() {
          set({ onCart: [] });
        },
        onSetCart: (basket) => {
          set({ onCart: basket });
        },
        onSetFav: (favs) => {
          set({ onFav: favs });
        },
        addToCart: (product) => {
          set((state) => ({
            cart: [...state.cart, product],
          }));
        },
        onAddToCart: (product) => {
          set((state) => ({
            onCart: [...state.onCart, product],
          }));
        },
        removeFromCart: (product) => {
          const productToRemove = get().cart.findIndex((p) => p.asin === product.asin);

          set((state) => {
            const newCart = [...state.cart];
            newCart.splice(productToRemove, 1);
            return { cart: newCart };
          });
        },
        onRemoveFromCart: (product) => {
          const productToRemove = get().onCart.findIndex((p) => p.asin === product.asin);

          set((state) => {
            const newCart = [...state.onCart];
            newCart.splice(productToRemove, 1);
            return { onCart: newCart };
          });
        },
        addFavourites: (product) => {
          const isAlreadyFav = get().fav.some((p) => p.asin === product.asin);
          if (!isAlreadyFav) {
            set((state) => ({
              fav: [...state.fav, product],
            }));
          }
        },
        onAddFavourites: (product) => {
          set((state) => ({
            onFav: [...state.onFav, product],
          }));
        },
        removeFavourites: (product) => {
          const newFav = get().fav.filter((p) => p.asin !== product.asin);
          set({ fav: newFav });
        },
        onRemoveFromFavourites: (product) => {
          const newFav = get().onFav.filter((p) => p.asin !== product.asin);
          set({ onFav: newFav });
        },
        clearFavourites() {
          set({ fav: [] });
        },
        onClearFavourites() {
          set({ onFav: [] });
        },
      }),
      {
        name: 'shopping-cart-storage',
      }
    )
  )
);
