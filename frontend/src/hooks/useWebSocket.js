import { useState, useEffect, useCallback } from 'react';

const useWebSocket = (clientId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || 'ws://localhost:8000';
  const WS_URL = `${BASE_URL.replace(/^http/, 'ws')}/ws/${clientId}`;

  const connect = useCallback(() => {
    const newSocket = new WebSocket(WS_URL);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      setError(null);
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    newSocket.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Failed to connect to server');
      setIsConnected(false);
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (newSocket.readyState === WebSocket.CLOSED) {
          connect();
        }
      }, 3000);
    };

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [WS_URL]);

  useEffect(() => {
    connect();
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [connect, socket]);

  const sendMessage = useCallback((data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [socket]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isConnected,
    messages,
    error,
    sendMessage,
    clearMessages
  };
};

export default useWebSocket;