import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  User,
  Calendar,
  Tag,
  ArrowUpCircle,
  ArrowRightCircle,
  Pause,
  XCircle,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';
import {
  fetchMyTickets,
  selectTickets,
  selectTicketsLoading,
  selectTicketsError,
  clearTicketError
} from '../../store/slices/tickets/ticketSlice';

const TicketList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        return <ArrowRightCircle className="w-4 h-4 text-yellow-500" />;
      case 'waiting':
        return <Pause className="w-4 h-4 text-orange-500" />;
      case 'on_hold':
        return <Pause className="w-4 h-4 text-gray-500" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-400" />;
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
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
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

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['open', 'in_progress', 'waiting', 'on_hold'].includes(ticket.status);
    if (filter === 'resolved') return ['resolved', 'closed'].includes(ticket.status);
    return ticket.status === filter;
  });

  const handleRefresh = () => {
    dispatch(clearTicketError());
    dispatch(fetchMyTickets());
  };

  

  if (loading && tickets.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Support Tickets</h1>
          <p className="text-gray-600">Track and manage your support requests</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Link
            to="/tickets/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span className='hidden sm:inline'>New Ticket</span>
          </Link>
          <Link to={"/tickets/lookup"}>
          <button
            
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
            <Search className="w-4 h-4" />
            <span className='hidden sm:inline'>Lookup Ticket</span>
          </button>
          </Link>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className='hidden sm:inline'>Refresh</span>
          </button>
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

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Tickets' },
            { key: 'active', label: 'Active' },
            { key: 'resolved', label: 'Resolved' },
            { key: 'open', label: 'Open' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'waiting', label: 'Waiting' },
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
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No tickets yet' : `No ${filter} tickets`}
          </h3>
          <p className="text-gray-600 mb-6">
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
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Link
              key={ticket.ticket_id}
              to={`/tickets/${ticket.ticket_ref}`}
              className="block bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                    <span className="text-sm text-gray-500">#{ticket.ticket_ref}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(ticket.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <ArrowUpCircle className={`w-4 h-4 ${getPriorityColor(ticket.priority)}`} />
                      <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{ticket.reply_count} replies</span>
                    </div>
                    
                    {ticket.assigned_to_name && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{ticket.assigned_to_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                  {ticket.updated_at !== ticket.created_at && (
                    <div className="text-xs">
                      Updated: {formatDate(ticket.updated_at)}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {ticket.tags && ticket.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {ticket.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
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
              )}

              {/* SLA Info */}
              {ticket.sla && (ticket.sla.overdue || ticket.sla_breached) && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {ticket.sla.overdue ? 'Overdue' : 'SLA Breached'}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;