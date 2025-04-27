import React, { useState } from 'react';

const PromptInput = ({ onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedParams, setAdvancedParams] = useState({
    duration: 10,
    quality: 'medium',
    complexity: 'medium',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      return;
    }
    
    onSubmit(prompt, advancedParams);
  };

  const handleParamChange = (name, value) => {
    setAdvancedParams({
      ...advancedParams,
      [name]: value
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="prompt" 
            className="block text-gray-700 text-sm font-bold mb-2">
            Describe the mathematical animation you want to create
          </label>
          <textarea
            id="prompt"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="E.g., Show a visualization of the Pythagorean theorem with animated right triangles"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isProcessing}
          />
        </div>
        
        <div className="mb-4">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>
        
        {showAdvanced && (
          <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Animation Duration</label>
                <select
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  value={advancedParams.duration}
                  onChange={(e) => handleParamChange('duration', parseInt(e.target.value))}
                  disabled={isProcessing}
                >
                  <option value={5}>Short (5s)</option>
                  <option value={10}>Medium (10s)</option>
                  <option value={15}>Long (15s)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Rendering Quality</label>
                <select
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  value={advancedParams.quality}
                  onChange={(e) => handleParamChange('quality', e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="low">Low (Faster)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Slower)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Animation Complexity</label>
                <select
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  value={advancedParams.complexity}
                  onChange={(e) => handleParamChange('complexity', e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="low">Simple</option>
                  <option value="medium">Moderate</option>
                  <option value="high">Complex</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md font-medium text-white 
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
          disabled={isProcessing}
        >
          {isProcessing ? 'Generating Animation...' : 'Generate Animation'}
        </button>
      </form>
    </div>
  );
};

export default PromptInput;