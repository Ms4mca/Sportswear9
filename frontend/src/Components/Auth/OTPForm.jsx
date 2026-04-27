import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP, clearError } from '../../store/slices/auth/authSlice';

export default function OTPForm({ onClose, onSwitchToSetPassword }) {
  const dispatch = useDispatch();
  const { loading, error, otpEmail } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyOTP({ email: otpEmail, otp }));
    if (!result.error) {
      if (result.payload && result.payload.needsPasswordSet) {
        onSwitchToSetPassword();
      } else {
        onClose();
      }
    }
  };

  const handleResend = () => {
    console.log('Resend OTP to:', otpEmail);
  };

  return (
    <>
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">
        Verify OTP
      </h3>

      <p className="text-sm text-gray-600 text-center mb-6">
        An OTP has been sent to <span className="font-semibold">{otpEmail}</span>
      </p>

      {error && (
        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
            if (error) dispatch(clearError());
          }}
          maxLength={6}
          required
          className="border border-gray-300 rounded-lg p-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>

      <button
        onClick={handleResend}
        className="w-full text-center text-sm text-gray-600 hover:text-blue-500 mt-4 transition"
      >
        Didn't receive OTP? <span className="font-semibold">Resend</span>
      </button>
    </>
  );
}
