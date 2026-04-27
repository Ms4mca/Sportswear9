import React from "react";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import ScrollToTop from "./Components/fix/ScrollToTop";
import Navbar from "./Components/Common/Navbar";
import DecathNav from "./Components/Common/DecathNav";
import MegaMenu from "./Components/Common/MegaMenu";
import Footer from "./Components/Common/Footer";
import BottomNav from "./Components/Common/BottomNav";
import LocationInitializer from "./Components/Common/LocationInitializer";
import Product from "./Components/Product/Product";
import ProductInfo from "./Components/Product/ProductInfo";
import PrivacyPolicy from "./Components/Terms&Policy/PrivacyPolicy";
import TermsOfUse from "./Components/Terms&Policy/TermsOfUse";

import CartPage from "./Components/Cart/CartPage";
import CategoriesPage from "./Components/Search/CategoriesPage";
import OrdersPage from "./Components/Orders/OrdersPage";
import BrandPage from "./Components/Brands/BrandPage";
import ProfilePage from "./Components/Profile/ProfilePage";
import CheckoutPage from "./Components/Checkout/CheckoutPage";
import Error404 from "./Components/Pages/Error404page";
import Home2 from "./Components/Home/Home2";
import ReturnRefund from "./Components/Pages/ReturnRefund";
import ShippingDelivery from "./Components/Pages/ShippingDelivery";
import SizeGuide from "./Components/Pages/SizeGuide";
import CancellationReturnExchange from "./Components/Pages/Cancellation";
import OurStory from "./Components/Pages/OurStory";
import Careers from "./Components/Pages/Careers";
import ContactUs from "./Components/Pages/ContactUs";
import TicketList from "./Components/Tickets/TicketList";
import CreateTicket from "./Components/Tickets/CreateTicket";
import TicketDetail from "./Components/Tickets/TicketDetail";
import GuestTicketLookup from "./Components/Tickets/GuestTicketLookup";
import FloatingChatbotButton from './Components/Chatbot/FloatingChatbotButton'; // Import FloatingChatbotButton




export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <ScrollToTop />
          <Navbar />
          <LocationInitializer />
          {/* <DecathNav /> */}
          <Outlet />
          <Footer />
          <BottomNav />
          <FloatingChatbotButton /> {/* Add FloatingChatbotButton here */}


        </>
      ),
      children: [
        {
          path: "/",
          element: <Home2 />,
        },
        {
          path: "*",
          element: <Error404 />,
        },
        {
          path: "/product/:categoryUUID",
          element: <Product />,
        },
        {
          path: "/sports",
          element: <Product />,
        },
        {
          path: "/categories",
          element: <CategoriesPage />,
        },
        {
          path: "/ContactUs",
          element: <ContactUs />
        },

        {
          path: "/ProductInfo/:id/:title",
          element: <ProductInfo />,
        },
        
        {
          path: "/policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "/t&c",
          element: <TermsOfUse />,
        },
      
        
      
        {
          path: "/orders",
          element: <OrdersPage />,
        },
        {
          path: "/brand/:brandName",
          element: <BrandPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/checkout",
          element: <CheckoutPage />,
        },
        {
          path: "/ReturnRefund",
          element: <ReturnRefund />,
        },
        {
          path: "/ShippingDelivery",
          element: <ShippingDelivery />,
        },
        {
          path: "/SizeGuide",
          element: <SizeGuide />,
        },
        {
          path: "/Cancellation",
          element: <CancellationReturnExchange />,
        },
        {
          path: "/OurStory",
          element: <OurStory />,
        },
        {
          path: "/Careers",
          element: <Careers />,
        },
        {
          path: "/tickets",
          element: <TicketList />,
        },
        {
          path: "/tickets/create",
          element: <CreateTicket />,
        },
        {
          path: "/tickets/lookup",
          element: <GuestTicketLookup />,
        },
        {
          path: "/tickets/:ticketRef",
          element: <TicketDetail />,
        },

      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
