import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Star,
  Calendar,
  User,
  RefreshCw
} from 'lucide-react';
import {
  fetchMyTickets,
  selectTickets,
  selectTicketsLoading,
  selectTicketsError,
  clearTicketError
} from '../../store/slices/tickets/ticketSlice';

const ProfileTickets = () => {
  const dispatch = useDispatch();
  const tickets = useSelector(selectTickets);
  const loading = useSelector(selectTicketsLoading);
  const error = useSelector(selectTicketsError);
  
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'waiting':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <CheckCircle2 className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['open', 'in_progress', 'waiting'].includes(ticket.status);
    if (filter === 'resolved') return ['resolved', 'closed'].includes(ticket.status);
    return ticket.status === filter;
  });

  const handleRefresh = () => {
    dispatch(clearTicketError());
    dispatch(fetchMyTickets());
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="flex space-x-4">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
          <p className="text-gray-600 text-sm">Track and manage your support requests</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/tickets/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'resolved', label: 'Resolved' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-8">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No tickets yet' : `No ${filter} tickets`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "You haven't created any support tickets yet."
              : `You don't have any ${filter} tickets at the moment.`
            }
          </p>
          {filter === 'all' && (
            <Link
              to="/tickets/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Your First Ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.slice(0, 5).map((ticket) => (
            <Link
              key={ticket.ticket_id}
              to={`/tickets/${ticket.ticket_ref}`}
              className="block bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                    <span className="text-xs text-gray-500">#{ticket.ticket_ref}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(ticket.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span className="text-xs">{ticket.reply_count}</span>
                    </div>
                    
                    {ticket.assigned_to_name && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs">{ticket.assigned_to_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                  {ticket.csat_score && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{ticket.csat_score}/5</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Priority and SLA indicators */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {ticket.priority === 'urgent' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      URGENT
                    </span>
                  )}
                  {ticket.priority === 'high' && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      HIGH
                    </span>
                  )}
                </div>
                
                {ticket.sla && (ticket.sla.overdue || ticket.sla_breached) && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {ticket.sla.overdue ? 'Overdue' : 'SLA Breached'}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
          
          {filteredTickets.length > 5 && (
            <div className="text-center pt-4">
              <Link
                to="/tickets"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All Tickets ({filteredTickets.length})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileTickets;