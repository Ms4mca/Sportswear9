import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, googleLogin, clearError } from "../../store/slices/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginForm({ onSwitchToSignup, onSwitchToForgot, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) onClose();
  };

  const handleGoogleSuccess = async (res) => {
    const result = await dispatch(googleLogin({ accessToken: res.credential }));
    if (!result.error) onClose();
  };

  return (
    <div className="w-full max-w-sm mx-auto px-3 py-3 overflow-y-auto max-h-[80vh]">
      <h3 className="text-lg sm:text-2xl font-bold text-center mb-4">Welcome Back 👋</h3>

      {error && (
        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg mb-3 text-xs sm:text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md transition"
        />

        <button
          type="button"
          onClick={onSwitchToForgot}
          className="text-xs sm:text-sm text-red-500 hover:underline text-right"
        >
          Forgot Password?
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google login */}
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => dispatch(clearError())}
          theme="outline"
          size="medium"
          text="continue_with"
          width="100%"
        />
      </div>

      <p className="text-center text-xs sm:text-sm text-gray-600 mt-3">
        Don’t have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-blue-500 hover:underline font-semibold"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}
