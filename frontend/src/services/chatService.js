import { makeRequest } from "./apiConfig";

const CHATBOT_ENDPOINT = "/api/v1/chat/";

export const chatService = {
  /**
   * Sends a message/action to the chatbot API.
   * @param {string} action - The action ID to send (e.g., "latest_products").
   *                          If null/undefined, the backend will send the main menu.
   * @returns {Promise<Object>} The chatbot's response.
   */
  sendMessage: async (action = null) => {
    // const body = action ? JSON.stringify({ action }) : JSON.stringify({});
    const body = action ? { action } : {};

    try {
      const response = await makeRequest(CHATBOT_ENDPOINT, {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        // makeRequest automatically handles Authorization header if token exists
        // and skipAuth is not true. We want auth, so don't set skipAuth.
      });
      return response;
    } catch (error) {
      console.error("Chatbot API error:", error);
      throw new Error(error.message || "Failed to communicate with chatbot");
    }
  },
};
