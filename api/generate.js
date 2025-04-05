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
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    console.log('Proxy: Sending prompt to external API:', { prompt });
    
    // Siapkan data request ke API RunPod
    const requestData = {
      prompt,
      max_length: parameters.max_length || 100,
      temperature: parameters.temperature || 0.7,
      top_p: parameters.top_p || 0.9
    };

    // URL API RunPod
    const apiUrl = 'https://kwir03xxq01508-8000.proxy.runpod.net/generate/';

    // Kirim request ke API RunPod dengan axios
    try {
      const response = await axios.post(
        apiUrl,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 60000 // 60 detik timeout
        }
      );

      console.log('Proxy: Received response from API');
      
      // PENTING: Pastikan struktur respons benar
      // Struktur yang benar untuk frontend adalah { success: true, data: "text content" }
      // runpod API mengembalikan { response: "text content" }
      if (response.data && typeof response.data.response === 'string') {
        // Format ulang response dari API RunPod ke format yang diharapkan frontend
        return res.status(200).json({
          success: true,
          data: response.data.response
        });
      } else {
        console.error('Proxy: Unexpected API response format:', response.data);
        return res.status(200).json({
          success: true,
          data: 'API returned unexpected format. Please try again.'
        });
      }
    } catch (apiError) {
      // Tangani error dari API RunPod
      console.error('Proxy: API error details:', {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status
      });

      // Coba langsung mengembalikan mock response jika API tidak tersedia
      return res.status(200).json({
        success: true,
        data: `[FALLBACK RESPONSE] Maaf, API AI tidak tersedia saat ini. Error: ${apiError.message}`
      });
    }
  } catch (error) {
    // Log error
    console.error('Proxy: Server error:', {
      message: error.message,
      stack: error.stack
    });
    
    // Kirim error response ke client
    return res.status(200).json({  // Ubah ke 200 untuk diproses frontend
      success: false,
      data: `Error: ${error.message}. Silakan coba lagi.`
    });
  }
} 