import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Actions
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART';

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { product, quantity = 1, selectedOptions = {} } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => 
          item.id === product.id && 
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Item doesn't exist, add new item
        updatedItems = [
          ...state.items,
          {
            ...product,
            quantity,
            selectedOptions
          }
        ];
      }

      // Calculate new totals
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce((total, item) => {
        const price = item.discountPrice || item.price;
        return total + (price * item.quantity);
      }, 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case REMOVE_FROM_CART: {
      const { id, selectedOptions = {} } = action.payload;
      const updatedItems = state.items.filter(
        item => 
          !(item.id === id && 
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
      );

      // Calculate new totals
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce((total, item) => {
        const price = item.discountPrice || item.price;
        return total + (price * item.quantity);
      }, 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case UPDATE_QUANTITY: {
      const { id, quantity, selectedOptions = {} } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { 
          type: REMOVE_FROM_CART, 
          payload: { id, selectedOptions } 
        });
      }

      const updatedItems = state.items.map(item => {
        if (
          item.id === id && 
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
        ) {
          return { ...item, quantity };
        }
        return item;
      });

      // Calculate new totals
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce((total, item) => {
        const price = item.discountPrice || item.price;
        return total + (price * item.quantity);
      }, 0);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  // Try to load cart from localStorage
  const savedCart = localStorage.getItem('cart');
  const initialCartState = savedCart ? JSON.parse(savedCart) : initialState;
  
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Action creators
  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    dispatch({
      type: ADD_TO_CART,
      payload: { product, quantity, selectedOptions }
    });
  };

  const removeFromCart = (id, selectedOptions = {}) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: { id, selectedOptions }
    });
  };

  const updateQuantity = (id, quantity, selectedOptions = {}) => {
    dispatch({
      type: UPDATE_QUANTITY,
      payload: { id, quantity, selectedOptions }
    });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 