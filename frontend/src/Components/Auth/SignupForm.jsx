import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signUp, clearError, googleLogin } from "../../store/slices/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";

export default function SignupForm({ onSwitchToLogin, onSwitchToOTP, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setValidationError("");
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.agreeToTerms) return setValidationError("Please agree to the Terms & Policy");
  if (formData.password !== formData.confirmPassword)
    return setValidationError("Passwords do not match");
  if (formData.password.length < 6)
    return setValidationError("Password must be at least 6 characters");

  const genderMap = {
    Male: "M",
    Female: "F",
    Other: "O",
    "Prefer not to say": "n",
  };

  const result = await dispatch(
    signUp({
      fullName: formData.fullName,
      gender: genderMap[formData.gender] || "",
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword, // Add this line!
    })
  );
  
  if (!result.error) onSwitchToOTP();
};

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto px-3 py-4 overflow-y-auto max-h-[80vh]">
      <h3 className="text-lg sm:text-2xl font-bold text-center mb-4">Create Account ✨</h3>

      {(error || validationError) && (
        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg mb-3 text-xs sm:text-sm text-center">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md transition"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
          <option>Prefer not to say</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <label className="flex items-start gap-2 text-xs sm:text-sm">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-600 leading-snug">
            By continuing, I agree to the{" "}
            <Link to="/t&c" className="text-blue-500 hover:underline">
              Terms
            </Link>{" "}
            &{" "}
            <Link to="/policy" className="text-blue-500 hover:underline">
              Policy
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition font-semibold text-sm sm:text-base disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Continue"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={(res) => dispatch(googleLogin({ accessToken: res.credential }))}
          onError={() => dispatch(clearError())}
          theme="outline"
          size="medium"
          text="continue_with"
          width="100%"
        />
      </div>

      <p className="text-center text-xs sm:text-sm text-gray-600 mt-3">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:underline font-semibold"
        >
          Login
        </button>
      </p>
    </div>
  );
}
