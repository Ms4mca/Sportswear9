import { MapPin, X, Loader2 } from "lucide-react";

function LocationPermissionPopup({
  onRequestGPS,
  onManualEntry,
  onClose,
  isLoading = false,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full animate-slideDown">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <MapPin size={24} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Your Location
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Allow access to your location for accurate delivery information and
            personalized shopping experience.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 mt-1">✓</div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  Accurate Delivery
                </p>
                <p className="text-gray-600 text-xs">
                  Know exact delivery times
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 mt-1">✓</div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  Better Recommendations
                </p>
                <p className="text-gray-600 text-xs">
                  Products suited for your area
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onRequestGPS}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Detecting...
                </>
              ) : (
                "Allow Location Access"
              )}
            </button>
            <button
              onClick={onManualEntry}
              disabled={isLoading}
              className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Enter Pincode Manually
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:text-gray-400"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationPermissionPopup;