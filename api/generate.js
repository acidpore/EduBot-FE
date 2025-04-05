import axios from 'axios';

/**
 * Vercel Serverless Function untuk AI Text Generation
 * 
 * Berfungsi sebagai proxy ke API RunPod untuk menghindari masalah CORS
 * dan memungkinkan aplikasi yang dideploy mengakses API.
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Ekstrak data dari request
    const { prompt, parameters = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is required' 
      });
    }

    console.log('Sending prompt to external API:', { prompt, ...parameters });
    
    // Kirim request ke API RunPod
    const response = await axios.post(
      'https://kwir03xxq01508-8000.proxy.runpod.net/generate/',
      {
        prompt,
        max_length: parameters.max_length || 100,
        temperature: parameters.temperature || 0.7,
        top_p: parameters.top_p || 0.9
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 60000 // 60 detik timeout
      }
    );

    console.log('Received response from external API');
    
    // Format dan kirim response ke client
    return res.status(200).json({
      success: true,
      data: response.data.response || 'No response received from AI service'
    });
  } catch (error) {
    // Log error
    console.error('API error:', error.message);
    
    // Log detail error jika ada
    if (error.response) {
      console.error('API response error data:', error.response.data);
      console.error('API response error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from API');
    }
    
    // Kirim error response ke client
    return res.status(500).json({
      success: false,
      message: 'Failed to generate response',
      error: error.message
    });
  }
} 