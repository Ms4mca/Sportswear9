import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaLock,
  FaTruck,
  FaUndo,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AuthModal from "../Auth/AuthModal";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import visa from "../../assets/visa.jpeg";
import Mastercard from "../../assets/mastercard.png";
import Rupay from "../../assets/RuPay.png";
import Upi from "../../assets/UPI-Logo-vector.webp";
import Bank from "../../assets/online-banking.jpg";
import logo from "../../assets/blacklogo.svg";
import {
  fetchStoreDetails,
  selectStoreDetails,
  selectIsStoreDetailsCacheValid,
} from "../../store/slices/storeDetailsSlice";

const Footer = () => {
  // ===== AUTH MODAL STATES =====
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Get store settings from Redux
  const storeDetails = useSelector(selectStoreDetails);
  const isCacheValid = useSelector(selectIsStoreDetailsCacheValid);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isCacheValid) {
      dispatch(fetchStoreDetails());
    }
  }, [dispatch, isCacheValid]);

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };

  // Current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ===== AUTH MODAL ===== */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />

      <footer className="w-full bg-gradient-to-b from-gray-50 to-white text-gray-700 text-sm overflow-x-hidden pb-16">
        {/* === OUR SPORT COLLECTIONS - Enhanced Design === */}
        <div className="bg-white border-t border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <h2 className="font-bold text-lg md:text-xl text-gray-800">
                Our Sport Collections
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 leading-relaxed">
              {[
                "Compression T-Shirt",
                "Shorts",
                "Sports Tighty",
                "Swim-Wear",
                "Leggings",
                "Lower's",
                "Track Suit",
                "Cargo's",
                "Cargo Short",
                "Half T-shirt",
                "Full T-shirt",
                "Jacket's",
                "Winter Jacket",
                "Stringer's / Vest",
                "Combos",
                "Gym T-Shirt",
                "Women T-Shirt",
                "Running Short's",
                "Tight's",
                "Sport's Bra",
                "Sport's Top",
                "Crop-Top",
                "Yoga Pant",
                "Gym Legging's",
                "Compression Set's",
                "Capri",
                "Sleeve Less",
                "Jersey",
                "Sport's Pant's",
                "Swimwear",
                "Swim Suit's",
                "Beach Wear",
                "Swimming Trunk",
                "Skating Suit",
                "Gym Bags",
                "Bottle's",
                "Gym Glove's",
                "Wrist Supporter",
                "Arm Sleeves",
                "Knee Cap",
                "Gym Belt",
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-xs md:text-sm px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all duration-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === PROMISE STRIP - Enhanced with Icons === */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
              {/* Title */}
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-bold">
                  Our Promise
                </span>
              </div>

              {/* Promise items - now in a single line on all screens */}
              <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 md:gap-6">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="bg-white/20 p-1.5 md:p-2 rounded-full shrink-0">
                    <FaRupeeSign className="text-sm md:text-xl" />
                  </div>
                  <span className="text-[11px] sm:text-xs md:text-base whitespace-nowrap">
                    No Cost EMI
                  </span>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="bg-white/20 p-1.5 md:p-2 rounded-full shrink-0">
                    <FaUndo className="text-sm md:text-xl" />
                  </div>
                  <span className="text-[11px] sm:text-xs md:text-base whitespace-nowrap">
                    Easy Returns
                  </span>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="bg-white/20 p-1.5 md:p-2 rounded-full shrink-0">
                    <FaHeart className="text-sm md:text-xl" />
                  </div>
                  <span className="text-[11px] sm:text-xs md:text-base whitespace-nowrap">
                    1M+ Happy Customers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === MAIN FOOTER CONTENT - Enhanced Grid Layout === */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link to="/" className="block mb-4">
                <img src={logo} alt="SPORTSWEAR9" className="h-12 w-auto" />
              </Link>
              <p className="text-gray-500 mb-4 text-xs leading-relaxed">
                Premium sports and fitness apparel for every athlete. Quality
                gear that moves with you.
              </p>
              {storeDetails?.storePhone && (
                <a
                  href={`https://wa.me/${storeDetails?.storePhone}?text=Hi%20Sportswear9%2C%20I%20have%20a%20question.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-2"
                >
                  <FaWhatsapp size={18} />
                  <span className="text-sm">Chat on WhatsApp</span>
                </a>
              )}
            </div>

            {/* SUPPORT */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-gray-200 pb-2">
                SUPPORT
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/ContactUs"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/SizeGuide"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ShippingDelivery"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/t&c"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/policy"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Cancellation"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Cancellation & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ReturnRefund"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* My Account */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-gray-200 pb-2">
                MY ACCOUNT
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={openLogin}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-left w-full"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={openRegister}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-left w-full"
                  >
                    Register
                  </button>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* ABOUT US */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-gray-200 pb-2">
                ABOUT US
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/OurStory"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Careers"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <span className="text-gray-600">Made in India 🇮🇳</span>
                </li>
              </ul>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-gray-200 pb-2">
                OUR BRANDS
              </h3>
              <ul className="space-y-2">
                {[
                  "Ninq",
                  "Never Lose",
                  "KYK",
                  "Gymific",
                  "Sportinger",
                  "Unbeatable",
                  "WMX",
                  "Work for it",
                  "Train Hard",
                ].map((brand) => (
                  <li key={brand}>
                    <Link
                      to={`/brand/${brand}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {brand}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* === SOCIAL MEDIA & NEWSLETTER SECTION - Redesigned === */}
        <div className="bg-gray-100 border-t border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Follow Us:</span>
                <div className="flex gap-2">
                  <a
                    href="#"
                    className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-all transform hover:scale-110"
                  >
                    <FaFacebook size={18} className="text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition-all transform hover:scale-110"
                  >
                    <FaInstagram size={18} className="text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition-all transform hover:scale-110"
                  >
                    <FaTwitter size={18} className="text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-all transform hover:scale-110"
                  >
                    <FaYoutube size={18} className="text-white" />
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-gray-600">
                {storeDetails?.storePhone && (
                  <a
                    href={`tel:${storeDetails.storePhone}`}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    <FaPhone size={14} />
                    <span className="text-sm">{storeDetails.storePhone}</span>
                  </a>
                )}
                {storeDetails?.storeEmail && (
                  <a
                    href={`mailto:${storeDetails.storeEmail}`}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    <FaEnvelope size={14} />
                    <span className="text-sm">{storeDetails.storeEmail}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* === PAYMENT STRIP - Enhanced === */}
        <div className="border-t border-gray-200 py-4 md:py-6">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
      
      {/* Security Text Section */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <FaLock className="text-green-600 text-sm md:text-base shrink-0" />
        <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
          100% SECURE TRANSACTION
        </span>
        <span className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">
          SSL Encrypted
        </span>
      </div>

      {/* Payment Icons Section */}
      <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
        <img
          src={visa}
          className="h-5 md:h-7 w-auto grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
          alt="Visa"
        />
        <img
          src={Mastercard}
          className="h-5 md:h-7 w-auto grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
          alt="Mastercard"
        />
        <img
          src={Rupay}
          className="h-5 md:h-7 w-auto grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
          alt="RuPay"
        />
        <img
          src={Upi}
          className="h-5 md:h-7 w-auto grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
          alt="UPI"
        />
        <img
          src={Bank}
          className="h-5 md:h-7 w-auto grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
          alt="Netbanking"
        />
      </div>
      
    </div>
  </div>
</div>

        {/* === COPYRIGHT - Enhanced === */}
        <div className="text-gray-900 bg-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
            <p>
              © {currentYear} Sportswear9. All rights reserved. | Designed by
              Yuluweb.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
