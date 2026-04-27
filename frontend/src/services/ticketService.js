import { makeRequest, API_ENDPOINTS } from "./apiConfig";

export const ticketService = {
  // Create a new ticket
  createTicket: async (ticketData, files = null) => {
    const isMultipart = files && files.length > 0;
    
    let body;
    if (isMultipart) {
      // Use FormData for file uploads
      body = new FormData();
      Object.keys(ticketData).forEach(key => {
        if (Array.isArray(ticketData[key])) {
          ticketData[key].forEach(item => body.append(key, item));
        } else {
          body.append(key, ticketData[key]);
        }
      });
      
      // Add files
      files.forEach(file => {
        body.append('files', file);
      });
    } else {
      body = ticketData;
    }

    return makeRequest(API_ENDPOINTS.TICKETS.CREATE, {
      method: 'POST',
      body: body,
      isMultipart: isMultipart,
    });
  },

  // Get user's tickets
  getMyTickets: async () => {
    return makeRequest(API_ENDPOINTS.TICKETS.MY_TICKETS, {
      method: 'GET',
    });
  },

  // Get ticket detail
  getTicketDetail: async (ticketRef) => {
    return makeRequest(API_ENDPOINTS.TICKETS.DETAIL(ticketRef), {
      method: 'GET',
    });
  },

  // Add reply to ticket
  addReply: async (ticketRef, message, files = null) => {
    const isMultipart = files && files.length > 0;
    
    let body;
    if (isMultipart) {
      body = new FormData();
      body.append('message', message);
      files.forEach(file => {
        body.append('files', file);
      });
    } else {
      body = { message };
    }

    return makeRequest(API_ENDPOINTS.TICKETS.REPLY(ticketRef), {
      method: 'POST',
      body: body,
      isMultipart: isMultipart,
    });
  },

  // Guest ticket lookup
  lookupGuestTicket: async (ticketRef, email) => {
    return makeRequest(`${API_ENDPOINTS.TICKETS.LOOKUP}?ref=${ticketRef}&email=${email}`, {
      method: 'GET',
      skipAuth: true,
    });
  },

  // Rate a ticket
  rateTicket: async (ticketRef, score, comment = '') => {
    return makeRequest(API_ENDPOINTS.TICKETS.RATE(ticketRef), {
      method: 'POST',
      body: { score, comment },
      skipAuth: true, // Can be done without auth
    });
  },
};