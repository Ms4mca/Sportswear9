import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPassword, clearError } from '../../store/slices/auth/authSlice';

export default function SetPasswordForm({ onClose }) {
  const dispatch = useDispatch();
  const { loading, error, otpEmail } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    password: '',
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

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(
      setPassword({
        email: otpEmail,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );

    if (!result.error) {
      onClose();
    }
  };

  return (
    <>
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">
        Set Password
      </h3>

      <p className="text-sm text-gray-600 text-center mb-6">
        Create a secure password for your account
      </p>

      {(error || validationError) && (
        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg mb-4 text-sm">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Setting Password...' : 'Set Password & Continue'}
        </button>
      </form>
    </>
  );
}
