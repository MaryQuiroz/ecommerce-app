import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Sample users for demo
const sampleUsers = [
  {
    id: 'user1',
    email: 'usuario@ejemplo.com',
    password: 'password123',
    name: 'Usuario Demo',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    addresses: [
      {
        id: 'addr1',
        name: 'Casa',
        street: 'Calle Principal 123',
        city: 'Madrid',
        state: 'Madrid',
        zip: '28001',
        country: 'España',
        isDefault: true
      }
    ],
    orders: [],
    wishlist: ['sk001', 'mk002'],
  }
];

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Actions
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';
const REGISTER_REQUEST = 'REGISTER_REQUEST';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAILURE = 'REGISTER_FAILURE';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';
const ADD_ADDRESS = 'ADD_ADDRESS';
const REMOVE_ADDRESS = 'REMOVE_ADDRESS';
const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
const ADD_ORDER = 'ADD_ORDER';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case ADD_TO_WISHLIST:
      return {
        ...state,
        user: {
          ...state.user,
          wishlist: [...state.user.wishlist, action.payload]
        }
      };
    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        user: {
          ...state.user,
          wishlist: state.user.wishlist.filter(id => id !== action.payload)
        }
      };
    case ADD_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          addresses: [...state.user.addresses, action.payload]
        }
      };
    case REMOVE_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.filter(addr => addr.id !== action.payload)
        }
      };
    case UPDATE_ADDRESS:
      return {
        ...state,
        user: {
          ...state.user,
          addresses: state.user.addresses.map(addr => 
            addr.id === action.payload.id ? action.payload : addr
          )
        }
      };
    case ADD_ORDER:
      return {
        ...state,
        user: {
          ...state.user,
          orders: [action.payload, ...state.user.orders]
        }
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  // Try to load auth data from localStorage
  const savedAuth = localStorage.getItem('auth');
  const initialAuthState = savedAuth 
    ? JSON.parse(savedAuth) 
    : { ...initialState, loading: false };
  
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Save auth data to localStorage whenever it changes
  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(state));
    } else if (!state.loading) {
      localStorage.removeItem('auth');
    }
  }, [state]);

  // Simulated auth functions
  const login = (email, password) => {
    dispatch({ type: LOGIN_REQUEST });

    // Simulate API call
    setTimeout(() => {
      const user = sampleUsers.find(u => 
        u.email === email && u.password === password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        dispatch({ 
          type: LOGIN_SUCCESS, 
          payload: userWithoutPassword 
        });
      } else {
        dispatch({ 
          type: LOGIN_FAILURE, 
          payload: 'Credenciales incorrectas' 
        });
      }
    }, 1000);
  };

  const register = (userData) => {
    dispatch({ type: REGISTER_REQUEST });

    // Simulate API call
    setTimeout(() => {
      const existingUser = sampleUsers.find(u => u.email === userData.email);

      if (existingUser) {
        dispatch({ 
          type: REGISTER_FAILURE, 
          payload: 'El correo electrónico ya está registrado' 
        });
      } else {
        const newUser = {
          id: `user${sampleUsers.length + 1}`,
          ...userData,
          addresses: [],
          orders: [],
          wishlist: []
        };
        sampleUsers.push(newUser);
        
        const { password, ...userWithoutPassword } = newUser;
        dispatch({ 
          type: REGISTER_SUCCESS, 
          payload: userWithoutPassword 
        });
      }
    }, 1000);
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const updateProfile = (userData) => {
    dispatch({ 
      type: UPDATE_PROFILE, 
      payload: userData 
    });
  };

  const addToWishlist = (productId) => {
    if (state.user && !state.user.wishlist.includes(productId)) {
      dispatch({ 
        type: ADD_TO_WISHLIST, 
        payload: productId 
      });
    }
  };

  const removeFromWishlist = (productId) => {
    if (state.user) {
      dispatch({ 
        type: REMOVE_FROM_WISHLIST, 
        payload: productId 
      });
    }
  };

  const addAddress = (address) => {
    const newAddress = {
      id: `addr${state.user.addresses.length + 1}`,
      ...address
    };

    dispatch({
      type: ADD_ADDRESS,
      payload: newAddress
    });

    return newAddress;
  };

  const updateAddress = (address) => {
    dispatch({
      type: UPDATE_ADDRESS,
      payload: address
    });
  };

  const removeAddress = (addressId) => {
    dispatch({
      type: REMOVE_ADDRESS,
      payload: addressId
    });
  };

  const addOrder = (order) => {
    const newOrder = {
      id: `order${state.user.orders.length + 1}`,
      date: new Date().toISOString(),
      status: 'procesando',
      ...order
    };

    dispatch({
      type: ADD_ORDER,
      payload: newOrder
    });

    return newOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        addToWishlist,
        removeFromWishlist,
        addAddress,
        updateAddress,
        removeAddress,
        addOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 