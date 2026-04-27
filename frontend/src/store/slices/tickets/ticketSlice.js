import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketService } from '../../../services/ticketService';

// Initial state
const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  replyLoading: false,
  replyError: null,
  ratingLoading: false,
  ratingError: null,
  guestTicket: null,
  guestLoading: false,
  guestError: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
};

// Async thunks
export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async ({ ticketData, files }, { rejectWithValue }) => {
    try {
      const response = await ticketService.createTicket(ticketData, files);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create ticket');
    }
  }
);

export const fetchMyTickets = createAsyncThunk(
  'tickets/fetchMyTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketService.getMyTickets();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tickets');
    }
  }
);

export const fetchTicketDetail = createAsyncThunk(
  'tickets/fetchTicketDetail',
  async (ticketRef, { rejectWithValue }) => {
    try {
      const response = await ticketService.getTicketDetail(ticketRef);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ticket details');
    }
  }
);

export const addTicketReply = createAsyncThunk(
  'tickets/addReply',
  async ({ ticketRef, message, files }, { rejectWithValue }) => {
    try {
      const response = await ticketService.addReply(ticketRef, message, files);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add reply');
    }
  }
);

export const lookupGuestTicket = createAsyncThunk(
  'tickets/lookupGuestTicket',
  async ({ ticketRef, email }, { rejectWithValue }) => {
    try {
      const response = await ticketService.lookupGuestTicket(ticketRef, email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Ticket not found');
    }
  }
);

export const rateTicket = createAsyncThunk(
  'tickets/rateTicket',
  async ({ ticketRef, score, comment }, { rejectWithValue }) => {
    try {
      const response = await ticketService.rateTicket(ticketRef, score, comment);
      return { ticketRef, score, comment, ...response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to rate ticket');
    }
  }
);

// Slice
const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearTicketError: (state) => {
      state.error = null;
      state.createError = null;
      state.replyError = null;
      state.ratingError = null;
      state.guestError = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
    clearGuestTicket: (state) => {
      state.guestTicket = null;
      state.guestError = null;
    },
    resetTicketState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        // Add the new ticket to the list if we have tickets loaded
        if (state.tickets.length > 0) {
          // We don't have the full ticket object, just the creation response
          // We'll need to refetch the tickets list or add a minimal object
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // Fetch my tickets
      .addCase(fetchMyTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Handle both array and paginated response
        if (Array.isArray(action.payload)) {
          state.tickets = action.payload;
          state.pagination = {
            count: action.payload.length,
            next: null,
            previous: null,
          };
        } else if (action.payload.results) {
          state.tickets = action.payload.results;
          state.pagination = {
            count: action.payload.count || 0,
            next: action.payload.next,
            previous: action.payload.previous,
          };
        } else {
          state.tickets = [];
        }
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tickets = [];
      })

      // Fetch ticket detail
      .addCase(fetchTicketDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentTicket = action.payload;
      })
      .addCase(fetchTicketDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentTicket = null;
      })

      // Add reply
      .addCase(addTicketReply.pending, (state) => {
        state.replyLoading = true;
        state.replyError = null;
      })
      .addCase(addTicketReply.fulfilled, (state, action) => {
        state.replyLoading = false;
        state.replyError = null;
        
        // Add the new reply to current ticket if it's loaded
        if (state.currentTicket) {
          state.currentTicket.replies.push(action.payload);
          state.currentTicket.reply_count += 1;
          state.currentTicket.updated_at = action.payload.created_at;
          
          // Update status if it was waiting
          if (state.currentTicket.status === 'waiting') {
            state.currentTicket.status = 'in_progress';
          }
        }
      })
      .addCase(addTicketReply.rejected, (state, action) => {
        state.replyLoading = false;
        state.replyError = action.payload;
      })

      // Guest ticket lookup
      .addCase(lookupGuestTicket.pending, (state) => {
        state.guestLoading = true;
        state.guestError = null;
      })
      .addCase(lookupGuestTicket.fulfilled, (state, action) => {
        state.guestLoading = false;
        state.guestError = null;
        state.guestTicket = action.payload;
      })
      .addCase(lookupGuestTicket.rejected, (state, action) => {
        state.guestLoading = false;
        state.guestError = action.payload;
        state.guestTicket = null;
      })

      // Rate ticket
      .addCase(rateTicket.pending, (state) => {
        state.ratingLoading = true;
        state.ratingError = null;
      })
      .addCase(rateTicket.fulfilled, (state, action) => {
        state.ratingLoading = false;
        state.ratingError = null;
        
        // Update the ticket rating in current ticket and tickets list
        const { ticketRef, score, comment } = action.payload;
        
        if (state.currentTicket && state.currentTicket.ticket_ref === ticketRef) {
          state.currentTicket.csat_score = score;
          state.currentTicket.csat_comment = comment;
          state.currentTicket.csat_at = new Date().toISOString();
        }
        
        // Update in tickets list
        const ticketIndex = state.tickets.findIndex(t => t.ticket_ref === ticketRef);
        if (ticketIndex !== -1) {
          state.tickets[ticketIndex].csat_score = score;
          state.tickets[ticketIndex].csat_comment = comment;
          state.tickets[ticketIndex].csat_at = new Date().toISOString();
        }
      })
      .addCase(rateTicket.rejected, (state, action) => {
        state.ratingLoading = false;
        state.ratingError = action.payload;
      });
  },
});

// Actions
export const {
  clearTicketError,
  clearCurrentTicket,
  clearGuestTicket,
  resetTicketState,
} = ticketSlice.actions;

// Selectors
export const selectTickets = (state) => state.tickets?.tickets || [];
export const selectCurrentTicket = (state) => state.tickets?.currentTicket;
export const selectTicketsLoading = (state) => state.tickets?.loading || false;
export const selectTicketsError = (state) => state.tickets?.error;
export const selectCreateLoading = (state) => state.tickets?.createLoading || false;
export const selectCreateError = (state) => state.tickets?.createError;
export const selectReplyLoading = (state) => state.tickets?.replyLoading || false;
export const selectReplyError = (state) => state.tickets?.replyError;
export const selectGuestTicket = (state) => state.tickets?.guestTicket;
export const selectGuestLoading = (state) => state.tickets?.guestLoading || false;
export const selectGuestError = (state) => state.tickets?.guestError;
export const selectRatingLoading = (state) => state.tickets?.ratingLoading || false;
export const selectRatingError = (state) => state.tickets?.ratingError;
export const selectTicketsPagination = (state) => state.tickets?.pagination || { count: 0, next: null, previous: null };

// Reducer
export default ticketSlice.reducer;