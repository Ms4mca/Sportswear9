import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_CONFIG from "../../../services/apiConfig";

// Cache constants
const LOCATION_CACHE_KEY = "user_location_cache";
const LOCATION_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Helper functions for cache
const getCachedLocation = () => {
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > LOCATION_CACHE_DURATION) {
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error reading cached location:", error);
    return null;
  }
};

const setCachedLocation = (locationData) => {
  try {
    localStorage.setItem(
      LOCATION_CACHE_KEY,
      JSON.stringify({
        data: locationData,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Error caching location:", error);
  }
};

// Async thunks with direct axios calls
export const detectLocationFromIP = createAsyncThunk(
  "location/detectFromIP",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/profile/location/ip/`, {
        withCredentials: true
      })

      const locationData = {
        pincode: response.data.postal_code,
        city: response.data.city,
        state: response.data.state,
        country: response.data.country || "India",
        source: "ip",
        detected: true,
      };

      // Cache the result
      setCachedLocation(locationData);

      return locationData;
    } catch (error) {
      console.error("Error detecting location from IP:", error);
      return rejectWithValue("Failed to detect location from IP");
    }
  }
);

export const detectLocationFromGPS = createAsyncThunk(
  "location/detectFromGPS",
  async (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(rejectWithValue("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(
              `${API_CONFIG.BASE_URL}/profile/location/coords/`,
              {
                params: {
                  lat: latitude,
                  lng: longitude,
                },
                withCredentials: true
              }
            );

            const locationData = {
              pincode: response.data.pincode,
              city: response.data.city,
              state: response.data.state,
              country: response.data.country || "India",
              source: "gps",
              detected: true,
              coordinates: { lat: latitude, lng: longitude }
            };

            // Cache the result
            setCachedLocation(locationData);

            resolve(locationData);
          } catch (error) {
            console.error("Error detecting location from GPS:", error);
            reject(rejectWithValue("Failed to get location from GPS coordinates"));
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (error.code === 1) {
            reject(rejectWithValue("Location permission denied"));
          } else if (error.code === 2) {
            reject(rejectWithValue("Location unavailable"));
          } else {
            reject(rejectWithValue("Failed to get location"));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }
);

// UPDATED: Changed from GET to POST method
export const lookupPincode = createAsyncThunk(
  "location/lookupPincode",
  async (pincode, { rejectWithValue }) => {
    try {
      // Changed to POST method with pincode in request body
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/profile/address/locality/`,
        { pincode: pincode }, // Send pincode in request body
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true

        }
      );

      return {
        pincode: response.data.pincode || pincode,
        city: response.data.city,
        state: response.data.state,
        country: response.data.country || "India",
        source: "pincode",
      };
    } catch (error) {
      console.error("Error looking up pincode:", error);

      // Better error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return rejectWithValue(error.response.data.message || "Invalid pincode or unable to find locality");
      } else if (error.request) {
        // The request was made but no response was received
        return rejectWithValue("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        return rejectWithValue("Failed to lookup pincode");
      }
    }
  }
);

// Initial state with cache check
const getInitialState = () => {
  const cached = getCachedLocation();

  if (cached) {
    return {
      pincode: cached.pincode,
      city: cached.city,
      state: cached.state,
      country: cached.country || "India",
      source: cached.source || "cache",
      gpsPermissionDenied: false,
      gpsAttempted: false,
      loading: false,
      error: null,
      detectionAttempted: true,
      lastLookupResult: null,
    };
  }

  return {
    pincode: null,
    city: null,
    state: null,
    country: "India",
    source: null,
    gpsPermissionDenied: false,
    gpsAttempted: false,
    loading: false,
    error: null,
    detectionAttempted: false,
    lastLookupResult: null,
  };
};

const locationSlice = createSlice({
  name: "location",
  initialState: getInitialState,
  reducers: {
    setLocation: (state, action) => {
      const { pincode, city, state: stateVal, country, source } = action.payload;
      state.pincode = pincode;
      state.city = city;
      state.state = stateVal;
      state.country = country || "India";
      state.source = source || "manual";
      state.error = null;
      state.detectionAttempted = true;

      // Cache the location
      setCachedLocation({
        pincode,
        city,
        state: stateVal,
        country: country || "India",
        source: source || "manual",
      });
    },
    clearLocationError: (state) => {
      state.error = null;
    },
    setGPSPermissionDenied: (state, action) => {
      state.gpsPermissionDenied = action.payload;
    },
    setGPSAttempted: (state, action) => {
      state.gpsAttempted = action.payload;
    },
    resetLocation: (state) => {
      // Clear cache
      localStorage.removeItem(LOCATION_CACHE_KEY);

      state.pincode = null;
      state.city = null;
      state.state = null;
      state.country = "India";
      state.source = null;
      state.gpsPermissionDenied = false;
      state.gpsAttempted = false;
      state.loading = false;
      state.error = null;
      state.detectionAttempted = false;
      state.lastLookupResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Detect from IP
      .addCase(detectLocationFromIP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectLocationFromIP.fulfilled, (state, action) => {
        state.loading = false;
        state.pincode = action.payload.pincode;
        state.city = action.payload.city;
        state.state = action.payload.state;
        state.country = action.payload.country;
        state.source = action.payload.source;
        state.detectionAttempted = true;
        state.error = null;
      })
      .addCase(detectLocationFromIP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.detectionAttempted = true;
      })

      // Detect from GPS
      .addCase(detectLocationFromGPS.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.gpsAttempted = true;
      })
      .addCase(detectLocationFromGPS.fulfilled, (state, action) => {
        state.loading = false;
        state.pincode = action.payload.pincode;
        state.city = action.payload.city;
        state.state = action.payload.state;
        state.country = action.payload.country;
        state.source = action.payload.source;
        state.gpsPermissionDenied = false;
        state.error = null;
        state.detectionAttempted = true;
      })
      .addCase(detectLocationFromGPS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.gpsAttempted = true;
        state.detectionAttempted = true;
        if (action.payload?.includes("permission denied")) {
          state.gpsPermissionDenied = true;
        }
      })

      // Lookup pincode - UPDATED to store result
      .addCase(lookupPincode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastLookupResult = null;
      })
      .addCase(lookupPincode.fulfilled, (state, action) => {
        state.loading = false;
        state.lastLookupResult = action.payload;
        state.error = null;
      })
      .addCase(lookupPincode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.lastLookupResult = null;
      });
  },
});

export const {
  setLocation,
  clearLocationError,
  setGPSPermissionDenied,
  setGPSAttempted,
  resetLocation,
} = locationSlice.actions;

export default locationSlice.reducer;