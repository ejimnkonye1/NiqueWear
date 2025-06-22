import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  user: null,
  userExpiry: null, // Stores expiration timestamp
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        userExpiry: Date.now() + 3600000, // 1 hour from now
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
        userExpiry: Date.now() + 3600000, // Reset expiry
      };
    case "CLEAR_USER":
      return initialState;
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Check and clear expired user on store load + every minute
const checkExpiry = () => {
  const { userExpiry } = store.getState();
  if (userExpiry && Date.now() > userExpiry) {
    store.dispatch({ type: "CLEAR_USER" });
  }
};

// Run on store rehydration (page load)
persistor.subscribe(checkExpiry);

// Optional: Run every minute to catch expiry
const expiryInterval = setInterval(checkExpiry, 60000);

// Clear interval if needed (e.g., in React's useEffect cleanup)
// clearInterval(expiryInterval);