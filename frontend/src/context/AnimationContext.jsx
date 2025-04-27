import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import apiService from '../services/api';
import useWebSocket from '../hooks/useWebSocket';

// Create context
const AnimationContext = createContext();

// Custom hook to use the animation context
export const useAnimation = () => {
  return useContext(AnimationContext);
};

// Provider component
export const AnimationProvider = ({ children }) => {
  const [clientId] = useState(() => uuidv4());
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  
  // Initialize WebSocket connection
  const { messages, isConnected } = useWebSocket(clientId);
  
  // Process WebSocket messages
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      if (latestMessage.animation_id === currentAnimation?.id) {
        // Update animation status based on WebSocket message
        if (latestMessage.status === 'completed') {
          setIsLoading(false);
          setVideoUrl(apiService.getAnimationVideoUrl(latestMessage.animation_id));
        } else if (latestMessage.status === 'failed') {
          setIsLoading(false);
          setError(latestMessage.message || 'Animation generation failed');
        } else if (latestMessage.status === 'processing') {
          // Update with progress information if available
          if (latestMessage.data && latestMessage.data.code) {
            setGeneratedCode(latestMessage.data.code);
          }
        }
      }
    }
  }, [messages, currentAnimation]);
  
  // Function to submit a new animation prompt
  const generateAnimation = async (prompt, parameters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      setVideoUrl(null);
      setGeneratedCode(null);
      
      // Submit the prompt to the backend
      const response = await apiService.submitPrompt(prompt, {
        ...parameters,
        client_id: clientId // Include client ID for WebSocket updates
      });
      
      setCurrentAnimation({
        id: response.id,
        prompt,
        parameters,
        status: response.status
      });
      
      // Start polling for status if WebSockets aren't working
      if (!isConnected) {
        pollAnimationStatus(response.id);
      }
      
      return response;
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.detail || 'Failed to generate animation');
      console.error('Error generating animation:', error);
    }
  };
  
  // Fallback polling mechanism if WebSockets aren't available
  const pollAnimationStatus = async (animationId) => {
    try {
      const response = await apiService.checkAnimationStatus(animationId);
      
      if (response.status === 'completed') {
        setIsLoading(false);
        setVideoUrl(apiService.getAnimationVideoUrl(animationId));
      } else if (response.status === 'failed') {
        setIsLoading(false);
        setError(response.message || 'Animation generation failed');
      } else if (response.status === 'processing') {
        // Continue polling after a delay
        setTimeout(() => pollAnimationStatus(animationId), 3000);
      }
    } catch (error) {
      console.error('Error polling animation status:', error);
      // Retry a few times
      setTimeout(() => pollAnimationStatus(animationId), 5000);
    }
  };
  
  // Values to provide through the context
  const value = {
    generateAnimation,
    isLoading,
    error,
    videoUrl,
    generatedCode,
    currentAnimation
  };
  
  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export default AnimationContext;