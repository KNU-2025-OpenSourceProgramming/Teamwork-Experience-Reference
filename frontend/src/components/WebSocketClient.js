import React, { useState, useRef, useEffect } from 'react';

const WebSocketClient = ({ url, onMessage }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 WebSocket 연결
    connectWebSocket();

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  const connectWebSocket = () => {
    try {
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        console.log('WebSocket 연결 성공');
        setIsConnected(true);
        setError(null);
      };

      socketRef.current.onmessage = (event) => {
        console.log('메시지 수신:', event.data);
        if (onMessage) {
          onMessage(event.data);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        setError('WebSocket 연결 중 오류가 발생했습니다.');
        setIsConnected(false);
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket 연결 종료');
        setIsConnected(false);
      };
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
      setError('WebSocket 연결을 설정할 수 없습니다.');
      setIsConnected(false);
    }
  };

  const sendData = (data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(data);
      return true;
    }
    return false;
  };

  return {
    isConnected,
    error,
    sendData
  };
};

export default WebSocketClient;
