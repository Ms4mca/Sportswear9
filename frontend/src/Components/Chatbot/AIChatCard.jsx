import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ShoppingBag, Package, RefreshCcw, Ruler, Headphones, Sparkles, X, StepBack, Headset, Gem, Venus, Mars  } from "lucide-react";
import cn from "../../utils/cn"; // Import the utility function
import { chatService } from "../../services/chatService"; // Import chat service
import { useAuth } from "../../context/AuthContext"; // For authentication check
import { useNavigate } from "react-router-dom"; // For navigation to product pages
// import BASE_URL from "../../store/Baseurl"; // No longer needed for product images as they are full URLs
import AuthModal from "../Auth/AuthModal"; // Import AuthModal

function AIChatCard({ onClose }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const isInitialLoad = useRef(true);

  // State for AuthModal
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // NEW: State to store pending action for re-attempt after login
  const [pendingAction, setPendingAction] = useState(null);

  const fetchChatResponse = useCallback(async (action = null) => {
    setIsTyping(true);
    try {
      const response = await chatService.sendMessage(action);
      const newMessages = [];

      // NEW: Handle requires_auth first
      if (response.requires_auth) {
        setPendingAction(action); // Store the action that required login
        setAuthMode("login");
        setAuthOpen(true);
        // Add the text message from the response
        if (response.text) {
          newMessages.push({ sender: "ai", text: response.text });
        }
        // Add options if available
        if (response.options && Array.isArray(response.options) && response.options.length > 0) {
          // Ensure options are attached to the last message or a new message if no text
          const lastMsg = newMessages.length > 0 ? newMessages[newMessages.length - 1] : { sender: "ai", text: "" };
          lastMsg.options = response.options.map(opt => {
            let icon = null;
            switch (opt.id) {
              case "login": icon = <Sparkles size={14} />; break; // Assuming 'login' option might have an icon
              case "main": icon = <RefreshCcw size={14} />; break;
              default: icon = null;
            }
            return { ...opt, icon };
          });
          if (newMessages.length === 0) newMessages.push(lastMsg);
        }
        setMessages(prev => [...prev, ...newMessages]);
        setIsTyping(false);
        return; // Stop further processing if auth is required
      }

      // Add AI text message
      if (response.text) {
        newMessages.push({ sender: "ai", text: response.text });
      }

      // Add products if available
      if (response.products && Array.isArray(response.products) && response.products.length > 0) {
        newMessages.push({ sender: "ai", products: response.products });
      }

      // Add order if available
      if (response.order) {
        newMessages.push({ sender: "ai", order: response.order });
      }

      // Add options if available (always present in response)
      if (response.options && Array.isArray(response.options) && response.options.length > 0) {
        // If there are other messages before options, attach options to the last one
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].options = response.options.map(opt => {
            let icon = null;
            switch (opt.id) {
              case "latest_products": icon = <Sparkles size={14} />; break;
              case "mens_products": icon = <Mars size={14} />; break;
              case "womens_products": icon = <Venus size={14} />; break;
              case "best_sellers": icon = <Gem  size={14} />; break;
              case "track_order": icon = <Package size={14} />; break;
              case "size_guide": icon = <Ruler size={14} />; break;
              case "support_menu": icon = <Headphones size={14} />; break;
              case "returns_info": icon = <RefreshCcw size={14} />; break;
              case "main": icon = <StepBack size={14} />; break;
              default: icon = null;
            }
            return { ...opt, icon };
          });
        } else {
          // If only options are returned (shouldn't happen based on spec, but for safety)
          newMessages.push({ sender: "ai", text: "Please choose an option:", options: response.options.map(opt => {
            let icon = null;
            switch (opt.id) {
              case "latest_products": icon = <Sparkles size={14} />; break;
              case "mens_products": icon = <Mars size={14} />; break;
              case "womens_products": icon = <Venus size={14} />; break;
              case "best_sellers": icon = <Gem size={14} />; break;
              case "track_order": icon = <Package size={14} />; break;
              case "size_guide": icon = <Ruler size={14} />; break;
              case "support_menu": icon = <Headset size={14} />; break;
              case "returns_info": icon = <RefreshCcw size={14} />; break;
              case "main": icon = <StepBack size={14} />; break;
              default: icon = null;
            }
            return { ...opt, icon };
          })});
        }
      }

      setMessages(prev => [...prev, ...newMessages]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "ai", text: `Error: ${err.message}. Please try again.` }]);
    } finally {
      setIsTyping(false);
    }
  }, [setAuthOpen, setAuthMode, setPendingAction]); // Add dependencies

  // Initial load: fetch main menu
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      fetchChatResponse();
    }
  }, [fetchChatResponse]);

  // NEW: Effect to retry pending action after successful login
  useEffect(() => {
    if (isAuthenticated && pendingAction) {
      setAuthOpen(false); // Close login modal
      fetchChatResponse(pendingAction);
      setPendingAction(null); // Clear pending action
    }
  }, [isAuthenticated, pendingAction, fetchChatResponse]); // Add dependencies

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOptionClick = (option) => {
    // NEW: Handle special actions like size_guide
    if (option.id === "size_guide") {
      navigate("/SizeGuide"); // Redirect to size guide page
      onClose(); // Close chatbot
      return;
    }

    setMessages(prev => [...prev, { sender: "user", text: option.label }]);
    fetchChatResponse(option.id);
  };

  const handleProductClick = (productUuid) => {
    navigate(`/ProductInfo/${productUuid}`);
    onClose(); // Close chatbot after navigating
  };

  return (
    <div className="relative w-[360px] h-[520px] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 bg-white">

      {/* Soft Background Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-50 rounded-full blur-[80px]"
        />
      </div>

      <div className="relative flex flex-col w-full h-full z-10">
        {/* Header - Glassy White */}
        <div className="px-4 py-4 bg-white/70 backdrop-blur-xl border-b border-zinc-100 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <Bot size={18} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <p className="text-[13px] font-bold text-zinc-800 leading-tight tracking-tight">Sportswear 9</p>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.05em] mt-0.5">AI Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors group">
            <X size={18} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
          </button>
        </div>

        {/* Messages - Scrollbar Hidden + White Gradient Fade */}
        <div
          ref={scrollRef}
          className="flex-1 px-4 py-8 overflow-y-auto space-y-6 scroll-smooth no-scrollbar"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)"
          }}
        >
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={cn("flex flex-col gap-2.5", msg.sender === "ai" ? "items-start" : "items-end")}
            >
              {msg.text && (
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap max-w-[85%] shadow-sm",
                  msg.sender === "ai"
                    ? "bg-gradient-to-br from-zinc-50 to-white text-zinc-800 rounded-bl-none border border-zinc-200/50 backdrop-blur-sm"
                    : "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none font-medium shadow-lg shadow-blue-500/20"
                )}>
                  {msg.text}
                </div>
              )}

              {/* Product Cards */}
              {msg.products && msg.products.length > 0 && (
                <div className="grid grid-cols-2 gap-3 w-full max-w-[85%]">
                  {msg.products.map((product, pIdx) => (
                    <motion.div
                      key={pIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pIdx * 0.1 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => handleProductClick(product.product_uuid)}
                    >
                      <img
                        src={product.image ? product.image : "https://via.placeholder.com/150?text=No+Image"} // REMOVED BASE_URL prefix
                        alt={product.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-2">{product.name}</p>
                        <p className="text-sm font-bold text-blue-600 mt-1">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Order Details */}
              {msg.order && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-3 w-full max-w-[85%]">
                  <p className="text-sm font-semibold text-gray-800">Order ID: {msg.order.order_uuid}</p>
                  <p className="text-sm text-gray-600">Status: <span className="font-medium text-blue-600">{msg.order.status}</span></p>
                  <p className="text-sm text-gray-600">Total: <span className="font-bold">₹{parseFloat(msg.order.total).toLocaleString('en-IN')}</span></p>
                </div>
              )}

              {/* Options */}
              <AnimatePresence>
                {msg.options && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap gap-2 mt-1 max-w-[95%]"
                  >
                    {msg.options.map((opt, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.03, backgroundColor: "rgba(244,244,245,1)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOptionClick(opt)}
                        className="px-3.5 py-2 bg-white border border-zinc-200 rounded-xl text-[12px] text-zinc-600 shadow-sm transition-all flex items-center gap-2 hover:border-zinc-300"
                      >
                        {opt.icon && <span className="opacity-70 text-blue-500">{opt.icon}</span>}
                        {opt.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-1.5 p-3 bg-zinc-100/50 backdrop-blur-md rounded-2xl w-fit rounded-bl-none">
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
            </div>
          )}
        </div>

        {/* Footer - White Transparent, Tight Padding */}
        <div className="pb-1 pt-1 px-4 bg-white/50 backdrop-blur-sm flex flex-col items-center gap-1.5 z-20">
            <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-bold uppercase tracking-[0.15em]">
                <Sparkles size={10} className="text-blue-400" />
                <span>Support Available 24/7</span>
            </div>
            <div className="w-8 h-[3px] bg-zinc-100 rounded-full mb-1"></div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          mode={authMode}
          setMode={setAuthMode}
        />
      )}
    </div>
  );
}

export default AIChatCard;
