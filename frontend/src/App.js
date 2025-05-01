import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState("로딩 중...");

  useEffect(() => {
    // 백엔드 서버에서 메시지 가져오기 (추후 구현)
    // 현재는 단순 메시지 표시
    setMessage("Hello, World! 이것은 React 앱입니다.");
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        <p>음성 인식 애플리케이션 - 제1차 스프린트</p>
      </header>
    </div>
  );
}

export default App;
