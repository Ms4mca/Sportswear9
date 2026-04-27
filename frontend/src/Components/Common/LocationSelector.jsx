import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";
import {
  detectLocationFromGPS,
  setLocation,
  clearLocationError,
  setGPSPermissionDenied,
} from "../../store/slices/location/locationSlice";
import LocationPermissionPopup from "./LocationPermissionPopup";
import ManualPincodePopup from "./ManualPincodePopup";

function LocationSelector() {
  const dispatch = useDispatch();
  const { pincode, city, loading, error, detectionAttempted, gpsPermissionDenied } = 
    useSelector((state) => state.location);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [showManualPopup, setShowManualPopup] = useState(false);
  const [gpsAttempted, setGpsAttempted] = useState(false);

  // Automatically request GPS on site load if no location is set
  useEffect(() => {
    const autoRequestGPS = async () => {
      // Only proceed if no pincode, not attempted detection, and not already denied
      if (!pincode && !detectionAttempted && !gpsPermissionDenied && !gpsAttempted) {
        setGpsAttempted(true);
        
        try {
          // Show a small loading state or directly attempt GPS
          await dispatch(detectLocationFromGPS()).unwrap();
        } catch (error) {
          // If GPS fails or user denies, show manual popup
          console.log("GPS detection failed or denied:", error);
          setShowManualPopup(true);
        }
      }
    };

    autoRequestGPS();
  }, [dispatch, pincode, detectionAttempted, gpsPermissionDenied, gpsAttempted]);

  // Handle error from GPS detection
  useEffect(() => {
    if (error && error.includes("permission denied")) {
      setShowManualPopup(true);
      setShowPermissionPopup(false);
    }
  }, [error]);

  // If GPS detection times out or fails without specific error, show manual popup
  useEffect(() => {
    if (detectionAttempted && !pincode && !loading && !error) {
      // This means GPS detection was attempted but didn't get a result
      // Show manual popup after a short delay
      const timer = setTimeout(() => {
        setShowManualPopup(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [detectionAttempted, pincode, loading, error]);

  const handleRequestGPS = async () => {
    setShowPermissionPopup(false);
    try {
      await dispatch(detectLocationFromGPS()).unwrap();
    } catch (error) {
      // If GPS fails, show manual entry
      setShowManualPopup(true);
    }
  };

  const handleManualEntry = (locationData) => {
    dispatch(setLocation({
      ...locationData,
      source: "manual"
    }));
    setShowManualPopup(false);
    dispatch(clearLocationError());
  };

  const handleChangeLocation = () => {
    setShowPermissionPopup(true);
  };

  const handleManualEntryClick = () => {
    setShowPermissionPopup(false);
    setShowManualPopup(true);
    dispatch(clearLocationError());
  };

  const handleClosePermissionPopup = () => {
    setShowPermissionPopup(false);
    // If no location is set, show manual popup after closing permission popup
    if (!pincode) {
      setShowManualPopup(true);
    }
  };

  return (
    <>
      <button
        onClick={handleChangeLocation}
        className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors"
        disabled={loading}
      >
        <MapPin size={24} className="sm:w-[32px] sm:h-[32px] text-blue-600 bg-blue-100 p-1.5 sm:p-2 rounded-full" />
        <div className="text-left hidden sm:block">
          <div className="text-[10px] sm:text-xs text-gray-500">Deliver to</div>
          <div className="text-xs sm:text-sm font-medium text-gray-900 flex items-center">
            {loading ? (
              <>
                <Loader2 size={12} className="animate-spin mr-1" />
                <span className="text-xs">Detecting...</span>
              </>
            ) : (
              pincode ? (pincode.length > 6 ? `${pincode.substring(0, 6)}...` : pincode) : "Select"
            )}
          </div>
        </div>
        <ChevronDown size={14} className="text-gray-400 hidden md:block" />
      </button>

      {showPermissionPopup && (
        <LocationPermissionPopup
          onRequestGPS={handleRequestGPS}
          onManualEntry={handleManualEntryClick}
          onClose={handleClosePermissionPopup}
          isLoading={loading}
        />
      )}

      {showManualPopup && (
        <ManualPincodePopup
          onSave={handleManualEntry}
          onClose={() => setShowManualPopup(false)}
          initialError={error}
        />
      )}
    </>
  );
}

export default LocationSelector;