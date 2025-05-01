import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [websocketUrl, setWebsocketUrl] = useState('ws://localhost:3000/audio');
  const socketRef = useRef(null);
  
  useEffect(() => {
    // WebSocket 연결 설정
    setupWebSocket();
    
    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [websocketUrl]);
  
  const setupWebSocket = () => {
    socketRef.current = new WebSocket(websocketUrl);
    
    socketRef.current.onopen = () => {
      console.log('WebSocket is connected.');
      setIsConnected(true);
    };
    
    socketRef.current.onmessage = (event) => {
      setTranscriptions(prev => [...prev, event.data]);
    };
    
    socketRef.current.onclose = () => {
      console.log('WebSocket is closed.');
      setIsConnected(false);
    };
    
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };
  
  const handleRecordingComplete = (audioBlob) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // AudioBlob을 ArrayBuffer로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        const audioArrayBuffer = reader.result;
        socketRef.current.send(audioArrayBuffer);
      };
      reader.readAsArrayBuffer(audioBlob);
    } else {
      console.error('WebSocket is not connected.');
    }
  };
  
  const handleWebSocketUrlChange = (event) => {
    setWebsocketUrl(event.target.value);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>음성 인식 애플리케이션</h1>
        <p>마이크로 말하면 텍스트로 변환됩니다.</p>
      </header>
      
      <main className="App-main">
        <div className="connection-status">
          <p>연결 상태: {isConnected ? '연결됨' : '연결 안됨'}</p>
          <input
            type="text"
            value={websocketUrl}
            onChange={handleWebSocketUrlChange}
            placeholder="WebSocket URL"
          />
        </div>
        
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        
        <div className="transcriptions">
          <h2>변환된 텍스트:</h2>
          {transcriptions.length > 0 ? (
            <ul>
              {transcriptions.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          ) : (
            <p>아직 변환된 텍스트가 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
