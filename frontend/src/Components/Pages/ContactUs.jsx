import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSquareWhatsapp } from "react-icons/fa6";
import { Mail, MapPin, Send, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { 
  fetchStoreDetails, 
  selectStoreDetails, 
  selectIsStoreDetailsCacheValid 
} from '../../store/slices/storeDetailsSlice';

// EmailJS configuration from environment variables (secured)
const EMAILJS_CONFIG = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  adminTemplateId: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
  autoReplyTemplateId: import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID
};

// Initialize EmailJS only if public key exists
if (EMAILJS_CONFIG.publicKey) {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

const ContactUs = () => {
  const dispatch = useDispatch();
  
  // Get auth state - try different possible structures
  const authState = useSelector((state) => state.auth || {});
  const { isAuthenticated, user } = authState;
  
  // Get store details from Redux
  const storeDetails = useSelector(selectStoreDetails);
  const isCacheValid = useSelector(selectIsStoreDetailsCacheValid);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  // Fetch store details on component mount
  useEffect(() => {
    if (!isCacheValid) {
      dispatch(fetchStoreDetails());
    }
  }, [dispatch, isCacheValid]);

  // Pre-fill form for logged-in users with their data
  useEffect(() => {
    if (isAuthenticated && user && !userDataLoaded) {
      // Extract user data with multiple fallback options
      const userName = user.full_name || user.name || user.username || user.displayName || '';
      const userEmail = user.email || '';
      
      console.log('User data loaded:', { userName, userEmail }); // For debugging
      
      setFormData(prev => ({
        ...prev,
        name: userName,
        email: userEmail
      }));
      setUserDataLoaded(true);
    } else if (!isAuthenticated) {
      // Reset for non-authenticated users
      setUserDataLoaded(false);
    }
  }, [isAuthenticated, user, userDataLoaded]);

  // Allow manual override if user wants to change their details
  const handleManualOverride = () => {
    setUserDataLoaded(false);
    // Don't clear the fields, just allow editing
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If user manually changes name or email, mark as manually edited
    if (name === 'name' || name === 'email') {
      setUserDataLoaded(false);
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Always validate name and email - allow manual input
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Subject and message are always required
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message should be at least 10 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Reset states
    setFormErrors({});
    setSubmitStatus({ loading: true, success: false, error: null });
    
    try {
      // Check if EmailJS is configured
      if (!EMAILJS_CONFIG.publicKey || !EMAILJS_CONFIG.serviceId) {
        throw new Error('Email service is not properly configured. Please contact the administrator.');
      }

      // Get current timestamp
      const now = new Date();
      const time = now.toLocaleString('en-US', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });

      // Prepare base parameters with current form data
      const baseParams = {
        title: formData.subject,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: time,
        is_authenticated: isAuthenticated ? 'Yes' : 'No',
        store_name: storeDetails?.storeName || 'Our Store'
      };

      // Send admin notification if template ID exists
      if (EMAILJS_CONFIG.adminTemplateId) {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.adminTemplateId,
          {
            ...baseParams,
            to_email: "myninqclub@gmail.com"
          }
        );
      }

      // Send auto-reply to user if template ID exists
      if (EMAILJS_CONFIG.autoReplyTemplateId) {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.autoReplyTemplateId,
          {
            ...baseParams,
            to_name: formData.name,
            to_email: formData.email,
            company_name: storeDetails?.storeName || 'Our Store',
            company_email: storeDetails?.storeEmail || '',
            company_phone: storeDetails?.storePhone || '',
            company_address: storeDetails?.address || '',
            website_link: window.location.origin
          }
        );
      }

      // Success
      setSubmitStatus({ loading: false, success: true, error: null });
      
      // Reset form on success - keep name and email if authenticated
      if (isAuthenticated && user) {
        setFormData(prev => ({
          name: user.full_name || user.name || prev.name,
          email: user.email || prev.email,
          subject: '',
          message: ''
        }));
      } else {
        setFormData({ name: '', email: '', subject: '', message: '' });
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus({ 
        loading: false, 
        success: false, 
        error: error.message || 'Failed to send message. Please try again later.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-26 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Contact {storeDetails?.storeName || 'Us'}
          </h1>
          <p className="text-lg text-gray-600">
            {storeDetails?.description || "Have a question? We'd love to hear from you."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>

              {/* Success Message */}
              {submitStatus.success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
              )}

              {/* EmailJS Warning */}
              {!EMAILJS_CONFIG.publicKey && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">
                    ⚠️ Email service is currently disabled. Please contact the administrator.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">
                    {submitStatus.error}
                  </p>
                </div>
              )}

              {/* User Info Banner for Authenticated Users */}
              {isAuthenticated && userDataLoaded && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Logged in as:</span> {formData.name} ({formData.email})
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        You can edit these fields if you want to use different contact details
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleManualOverride}
                      className="text-xs bg-white px-3 py-1.5 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field - always visible and editable */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Email field - always visible and editable */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Subject field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition ${
                      formErrors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="How can we help?"
                  />
                  {formErrors.subject && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>
                  )}
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition resize-none ${
                      formErrors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 10 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitStatus.loading || !EMAILJS_CONFIG.publicKey}
                  className={`w-full ${
                    submitStatus.loading || !EMAILJS_CONFIG.publicKey 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2`}
                >
                  {submitStatus.loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right column with contact info - keep as is */}
          <div className="space-y-6">
            {storeDetails?.storeEmail && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white p-3 rounded-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm break-all">{storeDetails.storeEmail}</p>
                    <p className="text-xs text-gray-500 mt-1">We'll respond within 24-48 hours</p>
                  </div>
                </div>
              </div>
            )}

            {storeDetails?.storePhone && (
              <a 
                href={`https://wa.me/${storeDetails.storePhone.replace(/\D/g, '')}?text=Hi%20${storeDetails?.storeName || 'there'}%2C%20I%20have%20a%20question.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="text-green-600">
                      <FaSquareWhatsapp size={48} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                      <p className="text-gray-600 text-sm">{storeDetails.storePhone}</p>
                      <p className="text-xs text-green-600 mt-1">Click to chat</p>
                    </div>
                  </div>
                </div>
              </a>
            )}

            {storeDetails?.address && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white p-3 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600 text-sm mb-2">{storeDetails.address}</p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(storeDetails.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline inline-flex items-center gap-1"
                    >
                      View on Google Maps
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>🕒</span> Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-blue-400 border-opacity-30">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-400 border-opacity-30">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Sunday</span>
                  <span className="font-medium text-blue-200">Closed</span>
                </div>
                <p className="text-xs text-blue-200 mt-3 pt-2 border-t border-blue-400 border-opacity-30">
                  ⏱️ We aim to respond within 24 hours during business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;