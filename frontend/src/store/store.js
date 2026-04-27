import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import productReducer from '../Components/Product/productslice';
import ProductdetailReducer from "../Components/Product/Productdetailslice";
import brandReducer from "../Components/Brands/brandlistslice";
import homepagereducer from "../Components/Home/HomePageSlice";
import profileReducer from '../Components/Profile/Profileslice';
import cartReducer from '../Components/Cart/Cartslice';
import searchReducer from '../Components/Search/Searchslice';
import OrdersReducer from "../Components/Checkout/orderSlice";
import reviewReducer from "../Components/Product/ReviewSlice";
import paymentReducer from "../Components/Checkout/paymentSlice";

import locationReducer from './slices/location/locationSlice';
import storeDetailsReducer from './slices/storeDetailsSlice';
import ticketReducer from './slices/tickets/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    productdetail: ProductdetailReducer,
    brandlist: brandReducer,
    homepage: homepagereducer,
    profile: profileReducer,
    cart: cartReducer,
    search: searchReducer,
    order: OrdersReducer,
    review: reviewReducer,
    payment: paymentReducer,
    location: locationReducer,
    storeDetails: storeDetailsReducer,
    tickets: ticketReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
