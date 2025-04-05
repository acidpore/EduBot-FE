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
let retryCount = 0;
const MAX_RETRIES = 1;

/**
 * Format request data based on target API
 * 
 * @param {string} prompt - User prompt
 * @param {Object} parameters - Generation parameters
 * @param {boolean} isDirectAPI - Whether request is for direct API
 * @returns {Object} - Formatted request data
 */
const formatRequestData = (prompt, parameters, isDirectAPI) => {
  // Format sama untuk keduanya karena vercel function sudah disesuaikan
  return {
    prompt,
    parameters
  };
};

/**
 * Format response data from API
 * 
 * @param {Object} responseData - Raw response data
 * @param {boolean} isDirectAPI - Whether response is from direct API
 * @returns {Object} - Formatted response object
 */
const formatResponseData = (responseData, isDirectAPI) => {
  // Extract response data with error handling
  try {
    // Validasi struktur response
    if (!responseData) {
      throw new Error('Empty response received');
    }

    // Kembalikan seperti apa adanya, karena vercel function sudah
    // mengembalikan format yang benar { success: true, data: "content" }
    return responseData;
  } catch (error) {
    console.error('Error formatting response:', error);
    return {
      success: true,
      data: 'Error formatting response: ' + error.message
    };
  }
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
    // Reset retry count
    retryCount = 0;
    
    // Determine API target - selalu gunakan direct API di deployment
    const baseURL = useDirectAPI ? API_URLS.direct : API_URLS.backend;
    const endpoint = '';
    
    // Log request details
    console.log(`Sending request to ${baseURL}${endpoint} (${useDirectAPI ? 'direct' : 'via backend'}):`, 
      { prompt, parameters });
    
    // Format request data
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
  logDetailedError(error);
  
  // If retries are exhausted, return a mock response
  if (retryCount >= MAX_RETRIES) {
    console.log('All retry attempts failed. Returning mock response.');
    return {
      success: true,
      data: `Maaf, layanan AI tidak dapat diakses saat ini. Silakan coba lagi nanti. (Error: ${error.message})`
    };
  }
  
  // Increment retry counter
  retryCount++;
  console.log(`Retry attempt ${retryCount}/${MAX_RETRIES}...`);
  
  // Add delay before retry
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Retry 
  return generateResponse(prompt, parameters);
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
    console.log('Response error details: Status:', error.response.status);
  } else if (error.request) {
    console.error('No response received from server');
  } else {
    console.error('Error setting up request:', error.message);
  }
  
  console.error('Detailed error:', error.name || 'unknown');
};

// Export as named export and default object for flexibility
export default {
  generateResponse
}; 