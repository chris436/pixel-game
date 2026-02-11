import React, { useState } from 'react';
import Layout from './components/Layout';
import WelcomeScreen from './screens/WelcomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';

function App() {
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, result
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState(null);

  const handleStart = (id) => {
    setUserId(id);
    setGameState('playing');
  };

  const handleFinish = (resultData) => {
    setResult(resultData);
    setGameState('result');
  };

  const handleRetry = () => {
    setGameState('welcome');
    setResult(null);
    setUserId('');
  };

  return (
    <Layout>
      {gameState === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {gameState === 'playing' && <QuizScreen userId={userId} onFinish={handleFinish} />}
      {gameState === 'result' && <ResultScreen result={result} onRetry={handleRetry} />}
    </Layout>
  );
}

export default App;
