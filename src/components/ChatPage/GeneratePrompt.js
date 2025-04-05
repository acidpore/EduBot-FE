import React, { useState } from 'react';
import { generateResponse } from '../../api/generate';
import './GeneratePrompt.css';

const GeneratePrompt = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Call the generate API
      const result = await generateResponse(prompt);
      
      if (result.success) {
        setResponse(result.data);
      } else {
        setError(result.message || 'Failed to generate response');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to the server');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-container">
      <h2>Generate AI Response</h2>
      
      <form onSubmit={handleSubmit} className="generate-form">
        <div className="form-group">
          <label htmlFor="prompt">Enter your prompt:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            rows={4}
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading} className="generate-button">
          {loading ? 'Generating...' : 'Generate Response'}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        
        {response && (
          <div className="response-container">
            <h3>Response:</h3>
            <div className="response-content">
              {typeof response === 'object' 
                ? JSON.stringify(response, null, 2) 
                : response}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default GeneratePrompt; 