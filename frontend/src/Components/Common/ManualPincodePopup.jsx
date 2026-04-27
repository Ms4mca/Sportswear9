import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, X, Loader2, CheckCircle } from "lucide-react";
import { lookupPincode, clearLocationError } from "../../store/slices/location/locationSlice";

function ManualPincodePopup({ onSave, onClose, initialError = null }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.location);
  const [pincode, setPincode] = useState("");
  const [localError, setLocalError] = useState(initialError || "");
  const [locationDetails, setLocationDetails] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearLocationError());
  }, [dispatch]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(value);
    setLocalError("");
    setLocationDetails(null);
    setIsVerified(false);
    dispatch(clearLocationError());
  };

  const handleVerifyPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      setLocalError("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      const result = await dispatch(lookupPincode(pincode)).unwrap();
      setLocationDetails(result);
      setIsVerified(true);
      setLocalError("");
    } catch (err) {
      setLocalError(err || "Invalid pincode. Please try again.");
      setIsVerified(false);
    }
  };

  const handleSave = () => {
    if (!isVerified || !locationDetails) {
      setLocalError("Please verify your pincode first");
      return;
    }

    onSave({
      pincode,
      city: locationDetails.city,
      state: locationDetails.state,
      country: "India",
      source: "manual",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && pincode.length === 6) {
      handleVerifyPincode();
    }
  };

  return (
    <>
      {/* Backdrop with higher z-index */}
      <div 
        className="fixed inset-0 bg-black/70 z-[99998] backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup with even higher z-index */}
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-lg shadow-xl max-w-sm w-full animate-slideDown pointer-events-auto mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MapPin size={24} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Enter Pincode</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={loading}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={handlePincodeChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter 6-digit pincode"
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-base ${
                      localError || error
                        ? "border-red-500 bg-red-50"
                        : isVerified
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300"
                    }`}
                    disabled={loading}
                    autoFocus
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <button
                    onClick={handleVerifyPincode}
                    disabled={loading || pincode.length !== 6}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center sm:min-w-[80px] w-full sm:w-auto"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>
                {(localError || error) && (
                  <p className="text-red-600 text-sm mt-2">{localError || error}</p>
                )}
              </div>

              {isVerified && locationDetails && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <p className="text-green-800 font-medium">Location Verified</p>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">City:</span> {locationDetails.city}
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">State:</span> {locationDetails.state}
                  </p>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={loading || !isVerified}
                  className="w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-base"
                >
                  Save Location
                </button>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full text-gray-600 py-3 sm:py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:text-gray-400 text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default ManualPincodePopup;