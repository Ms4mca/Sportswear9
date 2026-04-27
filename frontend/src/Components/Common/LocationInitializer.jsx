import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detectLocationFromIP } from "../../store/slices/location/locationSlice";

function LocationInitializer() {
  const dispatch = useDispatch();
  const { pincode, detectionAttempted, gpsPermissionDenied } = useSelector((state) => state.location);

  useEffect(() => {
    // Only attempt IP detection if:
    // 1. No pincode
    // 2. Not attempted detection yet
    // 3. GPS permission was denied (as fallback)
    if (!pincode && !detectionAttempted) {
      // If GPS permission was denied, use IP as fallback
      if (gpsPermissionDenied) {
        dispatch(detectLocationFromIP());
      }
      // Otherwise, let LocationSelector handle GPS first
    }
  }, [dispatch, pincode, detectionAttempted, gpsPermissionDenied]);

  return null;
}

export default LocationInitializer;