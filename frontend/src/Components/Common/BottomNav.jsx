import { useState } from "react";
import { Home, Search, Heart, ShoppingBag, User, MessageCircle, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../store/slices/auth/authSlice";
import { FiLogOut } from "react-icons/fi";
import AuthModal from "../Auth/AuthModal";
import { motion, AnimatePresence } from "framer-motion";
import AIChatCard from "../Chatbot/AIChatCard"; 


const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, profile } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State for chat modal

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-16 relative">

          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
          >
            <Home
              size={22}
              className={`${isActive("/") ? "text-blue-600" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Home
            </span>
          </button>

          {/* Explore */}
          <button
            onClick={() => navigate("/categories")}
            className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
          >
            <Search
              size={22}
              className={`${isActive("/categories") ? "text-blue-600" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/categories") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/categories") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Explore
            </span>
          </button>

          {/* Orders */}
          <button
            onClick={() => navigate("/orders")}
            className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
          >
            <ShoppingBag
              size={22}
              className={`${isActive("/orders") ? "text-blue-600" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/orders") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/orders") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Orders
            </span>
          </button>

          {/* Chatbot - NEW */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
          >
            <MessageCircle
              size={22}
              className={`${isChatOpen ? "text-blue-600" : "text-gray-600"} transition-colors`}
              strokeWidth={isChatOpen ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isChatOpen ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Chatbot
            </span>
          </button>

          {/* Profile */}
          {isAuthenticated ? (
            <div className="relative flex flex-col items-center justify-center flex-1 h-full">
              <button
                onClick={() => navigate("/profile")}
                className="flex flex-col items-center justify-center"
              >
                <User
                  size={22}
                  className={`${isActive("/profile") ? "text-blue-600" : "text-gray-600"} transition-colors`}
                  strokeWidth={isActive("/profile") ? 2.5 : 2}
                />
                <span className={`text-[10px] mt-1 font-medium ${
                  isActive("/profile") ? "text-blue-600" : "text-gray-600"
                }`}>
                  {profile?.full_name?.split(" ")[0] || "Profile"}
                </span>
              </button>
            </div>
          ) : (
            <button
              className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
              onClick={() => {
                setAuthMode("login");
                setAuthOpen(true);
              }}
            >
              <User
                size={22}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              />
              <span className="text-[10px] mt-1 font-medium text-gray-600">
                Profile
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          mode={authMode}
          setMode={setAuthMode}
        />
      )}

      {/* Chat Modal for Mobile */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Chat Card Modal */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50"
            >
              <div className="bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="font-semibold text-lg">Chat Assistant</h3>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="h-[60vh] overflow-y-auto">
                  <AIChatCard onClose={() => setIsChatOpen(false)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomNav;