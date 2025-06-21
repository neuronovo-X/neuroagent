import React from 'react';
import './App.css';
import MindloopInterface from './components/MindloopInterface';

function App() {
  return (
    <div className="App">
      {/* Современный минималистичный фон */}
      <div className="modern-background"></div>
      
      {/* Главный контейнер */}
      <div className="main-container">
        <MindloopInterface />
      </div>
    </div>
  );
}

export default App;
