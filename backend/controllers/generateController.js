/**
 * AI Text Generation Controller
 * 
 * Controller yang menangani permintaan untuk menghasilkan teks dengan AI.
 * Menggunakan API eksternal untuk generate teks.
 */
const axios = require('axios');

// Constants
const API_URL = 'https://kwir03xxq01508-8000.proxy.runpod.net/generate/';
const DEFAULT_PARAMS = {
  max_length: 100,
  temperature: 0.7,
  top_p: 0.9
};
const REQUEST_TIMEOUT = 60000; // 60 seconds

/**
 * Validate request data for AI generation
 * 
 * @param {Object} reqData - Request data to validate
 * @returns {Object|null} - Error object or null if valid
 */
const validateRequest = (reqData) => {
  const { prompt } = reqData;
  
  if (!prompt) {
    return { 
      status: 400,
      success: false, 
      message: 'Prompt is required' 
    };
  }
  
  return null;
};

/**
 * Format request data for external API
 * 
 * @param {string} prompt - User prompt
 * @param {Object} parameters - Optional generation parameters
 * @returns {Object} - Formatted request data
 */
const formatApiRequest = (prompt, parameters) => {
  return {
    prompt,
    max_length: parameters.max_length || DEFAULT_PARAMS.max_length,
    temperature: parameters.temperature || DEFAULT_PARAMS.temperature,
    top_p: parameters.top_p || DEFAULT_PARAMS.top_p
  };
};

/**
 * Extract and format response from external API
 * 
 * @param {Object} apiResponse - Response from external API
 * @returns {Object} - Formatted response
 */
const formatApiResponse = (apiResponse) => {
  const responseText = apiResponse.response || 'No response received from AI service';
  
  return {
    success: true,
    data: responseText
  };
};

/**
 * Handle API request errors
 * 
 * @param {Error} error - Error object
 * @returns {Object} - Error response object
 */
const handleApiError = (error) => {
  console.error('Error in generateResponse:', error.message);
  
  // Log detailed error information
  if (error.response) {
    console.error('API response error data:', error.response.data);
    console.error('API response error status:', error.response.status);
  } else if (error.request) {
    console.error('No response received from API');
  } else {
    console.error('Error setting up request:', error.message);
  }
  
  // Return appropriate error response
  return {
    status: error.response?.status || 500,
    success: false,
    message: error.response?.data?.message || 'Failed to generate response',
    error: error.message
  };
};

/**
 * Main handler for generate response requests
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.generateResponse = async (req, res) => {
  try {
    // Get and validate request data
    const { prompt, parameters = {} } = req.body;
    
    const validationError = validateRequest({ prompt });
    if (validationError) {
      return res.status(validationError.status).json(validationError);
    }

    // Format request for external API
    const apiRequest = formatApiRequest(prompt, parameters);
    console.log('Sending prompt to external API:', apiRequest);
    
    // Call the external API
    const response = await axios.post(
      API_URL,
      apiRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: REQUEST_TIMEOUT
      }
    );

    console.log('Received response from external API:', response.data);

    // Format and return the response
    const formattedResponse = formatApiResponse(response.data);
    return res.status(200).json(formattedResponse);
    
  } catch (error) {
    // Handle errors
    const errorResponse = handleApiError(error);
    return res.status(errorResponse.status).json(errorResponse);
  }
}; 