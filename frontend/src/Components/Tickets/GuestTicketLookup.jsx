import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, AlertCircle, Loader2, Ticket } from 'lucide-react';
import {
  lookupGuestTicket,
  selectGuestTicket,
  selectGuestLoading,
  selectGuestError,
  clearGuestTicket
} from '../../store/slices/tickets/ticketSlice';
import TicketDetail from './TicketDetail';

const GuestTicketLookup = () => {
  const dispatch = useDispatch();
  const guestTicket = useSelector(selectGuestTicket);
  const loading = useSelector(selectGuestLoading);
  const error = useSelector(selectGuestError);

  const [formData, setFormData] = useState({
    ticketRef: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.ticketRef.trim()) {
      errors.ticketRef = 'Ticket reference is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
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
    
    try {
      await dispatch(lookupGuestTicket({
        ticketRef: formData.ticketRef.trim(),
        email: formData.email.trim()
      })).unwrap();
    } catch (err) {
      console.error('Failed to lookup ticket:', err);
    }
  };

  const handleReset = () => {
    dispatch(clearGuestTicket());
    setFormData({ ticketRef: '', email: '' });
    setFormErrors({});
  };

  // If we have a ticket, show the detail view
  if (guestTicket) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Look Up Another Ticket
          </button>
        </div>
        
        {/* Render ticket details similar to TicketDetail component but for guest */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Ticket Reference</label>
              <p className="text-gray-900">{guestTicket.ticket_ref}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                guestTicket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                guestTicket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {guestTicket.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Priority</label>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                guestTicket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                guestTicket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {guestTicket.priority.toUpperCase()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
              <p className="text-gray-900">
                {new Date(guestTicket.created_at).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">Subject</label>
            <p className="text-gray-900 font-medium">{guestTicket.subject}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{guestTicket.description}</p>
            </div>
          </div>

          {guestTicket.replies && guestTicket.replies.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-4">
                Conversation ({guestTicket.replies.length} replies)
              </label>
              <div className="space-y-4">
                {guestTicket.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${
                      reply.is_staff 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${
                        reply.is_staff ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {reply.author_display}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <Ticket className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Look Up Your Ticket</h1>
        <p className="text-gray-600">
          Enter your ticket reference and email address to view your support ticket
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket Reference *
            </label>
            <input
              type="text"
              name="ticketRef"
              value={formData.ticketRef}
              onChange={handleInputChange}
              placeholder="e.g., TKT-000042"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.ticketRef ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.ticketRef && (
              <p className="mt-1 text-sm text-red-600">{formErrors.ticketRef}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              The ticket reference you received when creating the ticket
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              The email address you used when creating the ticket
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Looking up ticket...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Look Up Ticket
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Don't have a ticket yet?{' '}
          <a href="/tickets/create" className="text-blue-600 hover:text-blue-700 font-medium">
            Create a new support ticket
          </a>
        </p>
      </div>
    </div>
  );
};

export default GuestTicketLookup;