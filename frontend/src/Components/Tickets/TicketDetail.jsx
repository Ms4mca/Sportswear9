import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  User, 
  Calendar, 
  Tag, 
  AlertCircle, 
  Clock,
  CheckCircle2,
  Star,
  Send,
  Paperclip,
  Download,
  X,
  Loader2
} from 'lucide-react';
import {
  fetchTicketDetail,
  addTicketReply,
  rateTicket,
  selectCurrentTicket,
  selectTicketsLoading,
  selectTicketsError,
  selectReplyLoading,
  selectReplyError,
  selectRatingLoading,
  selectRatingError,
  clearTicketError
} from '../../store/slices/tickets/ticketSlice';

const TicketDetail = () => {
  const { ticketRef } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const ticket = useSelector(selectCurrentTicket);
  const loading = useSelector(selectTicketsLoading);
  const error = useSelector(selectTicketsError);
  const replyLoading = useSelector(selectReplyLoading);
  const replyError = useSelector(selectReplyError);
  const ratingLoading = useSelector(selectRatingLoading);
  const ratingError = useSelector(selectRatingError);

  const [replyMessage, setReplyMessage] = useState('');
  const [replyFiles, setReplyFiles] = useState([]);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  useEffect(() => {
    if (ticketRef) {
      dispatch(fetchTicketDetail(ticketRef));
    }
  }, [dispatch, ticketRef]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting':
        return 'bg-orange-100 text-orange-800';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setReplyFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setReplyFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyMessage.trim()) {
      return;
    }

    try {
      await dispatch(addTicketReply({
        ticketRef,
        message: replyMessage,
        files: replyFiles.length > 0 ? replyFiles : null
      })).unwrap();
      
      setReplyMessage('');
      setReplyFiles([]);
    } catch (err) {
      console.error('Failed to add reply:', err);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    try {
      await dispatch(rateTicket({
        ticketRef,
        score: rating,
        comment: ratingComment
      })).unwrap();
      
      setShowRating(false);
      setRating(0);
      setRatingComment('');
    } catch (err) {
      console.error('Failed to rate ticket:', err);
    }
  };

  const canReply = ticket && !['resolved', 'closed'].includes(ticket.status);
  const canRate = ticket && ['resolved', 'closed'].includes(ticket.status) && !ticket.csat_score;

  if (loading && !ticket) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Ticket</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => dispatch(fetchTicketDetail(ticketRef))}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
            <Link
              to="/tickets"
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
            >
              Back to Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
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
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{ticket.subject}</h1>
            <span className="text-lg text-gray-500">#{ticket.ticket_ref}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority.toUpperCase()} PRIORITY
            </span>
            <span className="text-gray-600">
              Created {formatDate(ticket.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
            <p className="text-gray-900 capitalize">{ticket.category.replace('_', ' ')}</p>
          </div>
          
          {ticket.order_ref && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Order Reference</label>
              <p className="text-gray-900">{ticket.order_ref}</p>
            </div>
          )}
          
          {ticket.assigned_to_name && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Assigned To</label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{ticket.assigned_to_name}</p>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900">{formatDate(ticket.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
          </div>
        </div>

        {/* Tags */}
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${tag.color}20`, 
                    color: tag.color 
                  }}
                >
                  <Tag className="w-3 h-3" />
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SLA Information */}
        {ticket.sla && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">Service Level Agreement</label>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {ticket.sla.first_response_due_at && (
                  <div>
                    <span className="font-medium">First Response Due:</span>
                    <p className={ticket.sla.first_responded_at ? 'text-green-600' : 'text-orange-600'}>
                      {formatDate(ticket.sla.first_response_due_at)}
                      {ticket.sla.first_responded_at && ' ✓'}
                    </p>
                  </div>
                )}
                
                {ticket.sla.resolution_due_at && (
                  <div>
                    <span className="font-medium">Resolution Due:</span>
                    <p className={ticket.status === 'resolved' ? 'text-green-600' : 'text-orange-600'}>
                      {formatDate(ticket.sla.resolution_due_at)}
                      {ticket.status === 'resolved' && ' ✓'}
                    </p>
                  </div>
                )}
                
                {ticket.sla.response_time_hours && (
                  <div>
                    <span className="font-medium">Response Time:</span>
                    <p className="text-gray-700">{ticket.sla.response_time_hours} hours</p>
                  </div>
                )}
                
                {ticket.sla.resolution_time_hours && (
                  <div>
                    <span className="font-medium">Resolution Time:</span>
                    <p className="text-gray-700">{ticket.sla.resolution_time_hours} hours</p>
                  </div>
                )}
              </div>
              
              {(ticket.sla.overdue || ticket.sla_breached) && (
                <div className="mt-3 flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {ticket.sla.overdue ? 'Overdue' : 'SLA Breached'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attachments */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Attachments</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ticket.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <Paperclip className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(attachment.uploaded_at)}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conversation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Conversation ({ticket.reply_count} replies)
          </h2>
        </div>

        <div className="space-y-6">
          {ticket.replies && ticket.replies.map((reply) => (
            <div
              key={reply.id}
              className={`flex gap-4 ${reply.is_staff ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                reply.is_staff ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <User className="w-5 h-5" />
              </div>
              
              <div className={`flex-1 max-w-3xl ${reply.is_staff ? 'mr-12' : 'ml-12'}`}>
                <div className={`rounded-lg p-4 ${
                  reply.is_staff 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${
                      reply.is_staff ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {reply.author_display}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(reply.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-800 whitespace-pre-wrap mb-3">
                    {reply.message}
                  </p>
                  
                  {reply.attachments && reply.attachments.length > 0 && (
                    <div className="space-y-2">
                      {reply.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                        >
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{attachment.filename}</span>
                          <Download className="w-4 h-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      {canReply && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Reply</h3>
          
          {replyError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-800 text-sm">{replyError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleReplySubmit} className="space-y-4">
            <div>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
                placeholder="Type your reply here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="reply-file-upload"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.doc,.docx"
              />
              <label
                htmlFor="reply-file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
                Attach Files
              </label>
            </div>

            {/* File List */}
            {replyFiles.length > 0 && (
              <div className="space-y-2">
                {replyFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-gray-400" />
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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={replyLoading || !replyMessage.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {replyLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rating Section */}
      {canRate && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate This Ticket</h3>
          <p className="text-gray-600 mb-4">
            How satisfied are you with the resolution of this ticket?
          </p>

          {!showRating ? (
            <button
              onClick={() => setShowRating(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Rate Ticket
            </button>
          ) : (
            <form onSubmit={handleRatingSubmit} className="space-y-4">
              {ratingError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-800 text-sm">{ratingError}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5 stars) *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  rows={3}
                  placeholder="Tell us about your experience..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={ratingLoading || rating === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ratingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Rating'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRating(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Already Rated */}
      {ticket.csat_score && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Thank You for Your Feedback!</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-800">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= ticket.csat_score ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-green-800">({ticket.csat_score}/5)</span>
          </div>
          {ticket.csat_comment && (
            <p className="text-green-800 text-sm">
              <span className="font-medium">Your Comment:</span> {ticket.csat_comment}
            </p>
          )}
          {ticket.csat_at && (
            <p className="text-green-600 text-xs mt-2">
              Rated on {formatDate(ticket.csat_at)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketDetail;