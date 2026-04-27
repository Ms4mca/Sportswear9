import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError } from '../../store/slices/auth/authSlice';

export default function ResetPasswordForm({ onClose }) {
  const dispatch = useDispatch();
  const { loading, error, otpEmail } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(
      resetPassword({
        email: otpEmail,
        otp: formData.otp,
        newPassword: formData.newPassword,
      })
    );

    if (!result.error) {
      onClose();
    }
  };

  return (
    <>
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">
        Reset Password
      </h3>

      <p className="text-sm text-gray-600 text-center mb-6">
        Enter the OTP sent to <span className="font-semibold">{otpEmail}</span> and your new password.
      </p>

      {(error || validationError) && (
        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg mb-4 text-sm">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="otp"
          placeholder="Enter 6-digit OTP"
          value={formData.otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setFormData({ ...formData, otp: value });
            setValidationError('');
            if (error) dispatch(clearError());
          }}
          maxLength={6}
          required
          className="border border-gray-300 rounded-lg p-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading || formData.otp.length !== 6}
          className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  );
}
