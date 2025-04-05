/**
 * API Service for AI Text Generation
 * 
 * Service that provides integration with AI text generation API.
 * Includes fallback mechanism to direct API if backend is unavailable.
 */
import axios from 'axios';

// Constants
const TIMEOUT_MS = 60000; 
const DEFAULT_PARAMS = {
  max_length: 100,
  temperature: 0.7,
  top_p: 0.9
};

// API configuration
const API_URLS = {
  backend: '/api',
  direct: '/api/generate'  // Gunakan Vercel Serverless Function
};

// Runtime state - ubah ke true untuk selalu gunakan API langsung
// dalam deployment, backend tidak tersedia
let useDirectAPI = true; // Default menggunakan direct API untuk deployment

/**
 * Format request data based on target API
 * 
 * @param {string} prompt - User prompt
 * @param {Object} parameters - Generation parameters
 * @param {boolean} isDirectAPI - Whether request is for direct API
 * @returns {Object} - Formatted request data
 */
const formatRequestData = (prompt, parameters, isDirectAPI) => {
  if (isDirectAPI) {
    return {
      prompt,
      max_length: parameters.max_length || DEFAULT_PARAMS.max_length,
      temperature: parameters.temperature || DEFAULT_PARAMS.temperature,
      top_p: parameters.top_p || DEFAULT_PARAMS.top_p
    };
  }
  
  return { prompt, parameters };
};

/**
 * Format response data from API
 * 
 * @param {Object} responseData - Raw response data
 * @param {boolean} isDirectAPI - Whether response is from direct API
 * @returns {Object} - Formatted response object
 */
const formatResponseData = (responseData, isDirectAPI) => {
  if (isDirectAPI) {
    // Direct API returns {response: "text"}
    return {
      success: true,
      data: responseData.response
    };
  }
  
  // Backend returns {success: true, data: "text"}
  return responseData;
};

/**
 * Generate a response using the AI model
 * 
 * @param {string} prompt - The prompt to send to the AI
 * @param {Object} parameters - Optional parameters for the generate API
 * @returns {Promise<Object>} - The response from the API
 */
export const generateResponse = async (prompt, parameters = {}) => {
  try {
    // Determine API target
    const baseURL = useDirectAPI ? API_URLS.direct : API_URLS.backend;
    const endpoint = useDirectAPI ? '/generate/' : '/generate';
    
    // Log request details
    console.log(`Sending request to ${baseURL}${endpoint} (${useDirectAPI ? 'direct' : 'via backend'}):`, 
      { prompt, parameters });
    
    // Format request data based on target
    const requestData = formatRequestData(prompt, parameters, useDirectAPI);
    
    // Send request
    const response = await axios({
      method: 'POST',
      url: `${baseURL}${endpoint}`,
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: TIMEOUT_MS,
      withCredentials: false
    });
    
    console.log('Response received:', response.data);
    
    // Process and return formatted response
    return formatResponseData(response.data, useDirectAPI);
  } catch (error) {
    // Handle error with fallback mechanism
    return handleRequestError(error, prompt, parameters);
  }
};

/**
 * Handle request errors with fallback option
 * 
 * @param {Error} error - The error object
 * @param {string} prompt - Original prompt for retry
 * @param {Object} parameters - Original parameters for retry
 * @returns {Promise<Object>} - Result from retry or throws error
 */
const handleRequestError = async (error, prompt, parameters) => {
  console.error('Request failed:', error.message);
  
  // Try fallback to direct API if backend connection failed
  if (!useDirectAPI && (error.message.includes('ECONNREFUSED') || error.message.includes('Network Error'))) {
    console.log('Backend connection failed, switching to direct API...');
    useDirectAPI = true;
    return generateResponse(prompt, parameters);
  }
  
  // Log detailed error information
  logDetailedError(error);
  
  // Re-throw the error for caller to handle
  throw error;
};

/**
 * Log detailed error information
 * 
 * @param {Error} error - The error object
 */
const logDetailedError = (error) => {
  if (error.response) {
    console.error('Error response:', {
      status: error.response.status,
      data: error.response.data
    });
  } else if (error.request) {
    console.error('No response received from server');
  } else {
    console.error('Error setting up request:', error.message);
  }
};

// Export as named export and default object for flexibility
export default {
  generateResponse
}; 