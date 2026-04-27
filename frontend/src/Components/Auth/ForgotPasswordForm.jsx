import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError } from '../../store/slices/auth/authSlice';

export default function ForgotPasswordForm({ onSwitchToReset, onSwitchToLogin }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword({ email }));
    if (!result.error) {
      setSubmitted(true);
      setTimeout(() => {
        onSwitchToReset();
      }, 2000);
    }
  };

  return (
    <>
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">
        Forgot Password
      </h3>

      <p className="text-sm text-gray-600 text-center mb-6">
        Enter your email address and we'll send you an OTP to reset your password.
      </p>

      {error && (
        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
          OTP sent successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) dispatch(clearError());
          }}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading || submitted}
          className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>

      <button
        onClick={onSwitchToLogin}
        className="w-full text-center text-sm text-gray-600 hover:text-blue-500 mt-4 transition"
      >
        Back to <span className="font-semibold">Login</span>
      </button>
    </>
  );
}
