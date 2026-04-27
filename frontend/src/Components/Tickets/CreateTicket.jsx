import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
  FileText,
  Image,
  Paperclip,
  Copy,
  Check
} from 'lucide-react';
import {
  createTicket,
  selectCreateLoading,
  selectCreateError,
  clearTicketError
} from '../../store/slices/tickets/ticketSlice';

const CreateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectCreateLoading);
  const error = useSelector(selectCreateError);
  const { isAuthenticated, user } = useSelector((state) => state.auth || { isAuthenticated: false, user: null });

  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    order_ref: '',
    name: user?.full_name || '',
    email: user?.email || '',
    cc_emails: [],
  });

  const [files, setFiles] = useState([]);
  const [ccEmail, setCcEmail] = useState('');
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const categories = [
    { value: 'order', label: 'Order Issue' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'shipping', label: 'Shipping Issue' },
    { value: 'return', label: 'Return / Refund' },
    { value: 'product', label: 'Product Question' },
    { value: 'account', label: 'Account Issue' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', description: 'General questions, no urgency' },
    { value: 'medium', label: 'Medium', description: 'Standard issues' },
    { value: 'high', label: 'High', description: 'Order errors, payment issues' },
    { value: 'urgent', label: 'Urgent', description: 'Critical failures, security issues' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format.`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addCcEmail = () => {
    if (ccEmail && ccEmail.includes('@') && !formData.cc_emails.includes(ccEmail)) {
      setFormData(prev => ({
        ...prev,
        cc_emails: [...prev.cc_emails, ccEmail]
      }));
      setCcEmail('');
    }
  };

  const removeCcEmail = (email) => {
    setFormData(prev => ({
      ...prev,
      cc_emails: prev.cc_emails.filter(e => e !== email)
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.category) errors.category = 'Category is required';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.description.trim()) errors.description = 'Description is required';

    if (!isAuthenticated) {
      if (!formData.name.trim()) errors.name = 'Name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    dispatch(clearTicketError());

    try {
      const result = await dispatch(createTicket({ 
        ticketData: formData, 
        files: files.length > 0 ? files : null 
      })).unwrap();
      
      setSuccess(result);
      setCopied(false);
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };

  const handleCopyTicketId = () => {
    if (success?.ticket_ref) {
      navigator.clipboard.writeText(success.ticket_ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeSuccessModal = () => {
    setSuccess(null);
    navigate('/tickets');
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-4 h-4" />;
    } else {
      return <Paperclip className="w-4 h-4" />;
    }
  };

  // Success Modal
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={closeSuccessModal}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Icon */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Ticket Created Successfully!</h2>
            <p className="text-gray-600 mt-1">Your support ticket has been submitted</p>
          </div>

          {/* Ticket ID Card */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Ticket Reference Number</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-mono font-bold text-blue-600">
                {success.ticket_ref}
              </span>
              <button
                onClick={handleCopyTicketId}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email Notification */}
          <div className="text-sm text-gray-600 mb-6 text-center">
            <p>You will receive email updates at:</p>
            <p className="font-medium text-gray-900">
              {success.email || formData.email || user?.email}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            
            <button
              onClick={closeSuccessModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/tickets')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Support Ticket</h1>
          <p className="text-gray-600">Describe your issue and we'll help you resolve it</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
            )}
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Brief description of your issue"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.subject && (
              <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              placeholder="Please provide detailed information about your issue..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {priorities.map(priority => (
                <label
                  key={priority.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.priority === priority.value
                      ? 'border-blue-600 ring-2 ring-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {priority.label}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {priority.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Reference */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Reference (Optional)
            </label>
            <input
              type="text"
              name="order_ref"
              value={formData.order_ref}
              onChange={handleInputChange}
              placeholder="e.g., ORD-00042"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              If your issue relates to a specific order, please provide the order ID
            </p>
          </div>
        </div>

        {/* Contact Information (for guests) */}
        {!isAuthenticated && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Options</h3>
          
          {/* CC Emails */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CC Emails (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                placeholder="additional@email.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCcEmail())}
              />
              <button
                type="button"
                onClick={addCcEmail}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            {formData.cc_emails.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.cc_emails.map((email, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeCcEmail(email)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Additional people who should receive updates about this ticket
            </p>
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drop files here or click to upload
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
                Choose Files
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Max 10MB per file. Supported: Images, PDF, Word documents, Text files
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Ticket...
              </>
            ) : (
              'Create Ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;