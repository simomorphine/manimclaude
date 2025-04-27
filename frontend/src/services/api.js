import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  /**
   * Submit a prompt to generate an animation
   * @param {string} prompt - The user's animation prompt
   * @param {Object} parameters - Additional animation parameters
   * @returns {Promise} - Promise resolving to the API response
   */
  submitPrompt: async (prompt, parameters = {}) => {
    try {
      const response = await api.post('/animations/', {
        prompt,
        parameters,
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting prompt:', error);
      throw error;
    }
  },

  /**
   * Check the status of an animation
   * @param {string} animationId - The ID of the animation
   * @returns {Promise} - Promise resolving to the animation status
   */
  checkAnimationStatus: async (animationId) => {
    try {
      const response = await api.get(`/animations/${animationId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking animation status:', error);
      throw error;
    }
  },

  /**
   * Get the URL for the animation video
   * @param {string} animationId - The ID of the animation
   * @returns {string} - The URL to the animation video
   */
  getAnimationVideoUrl: (animationId) => {
    return `${API_BASE_URL}/animations/${animationId}/video`;
  },
};

export default apiService;