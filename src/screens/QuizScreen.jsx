import React, { useState, useEffect } from 'react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import AvatarDisplay from '../components/AvatarDisplay';
import { api } from '../services/api';
import { GAME_CONFIG } from '../utils/constants';

const QuizScreen = ({ userId, onFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // [{id, answer}]
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await api.getQuestions(GAME_CONFIG.QUESTION_COUNT);
        setQuestions(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load questions. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleAnswer = (option) => {
    const currentQ = questions[currentIndex];
    // Map option content to "A", "B", "C", "D" if needed, or just send content.
    // Backend expects content to match column.
    // Let's send the content of the option selected.
    const newAnswers = [...answers, { id: currentQ.id, answer: option }];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finish
      setSubmitting(true);
      // Submit to backend
      api.submitResult({
        userId,
        answers: newAnswers,
        passThreshold: GAME_CONFIG.PASS_THRESHOLD
      })
        .then(result => {
          onFinish(result);
        })
        .catch(err => {
          console.error(err);
          alert("Error submitting results.");
          setSubmitting(false);
        });
    }
  };

  if (loading) return <PixelCard className="text-center">LOADING...</PixelCard>;
  if (submitting) return <PixelCard className="text-center">CALCULATING SCORE...</PixelCard>;
  if (questions.length === 0) return <PixelCard className="text-center">NO QUESTIONS FOUND.</PixelCard>;

  const currentQ = questions[currentIndex];
  // Avatar seed based on question ID to be consistent
  const avatarSeed = `q_${currentQ.id}`;

  return (
    <PixelCard>
      <div className="text-center mb-4">
        <span>QUESTION {currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="text-center mb-4">
        <AvatarDisplay seed={avatarSeed} size={80} />
      </div>

      <div className="mb-4 text-center" style={{ minHeight: '60px' }}>
        {currentQ.question}
      </div>

      <div className="flex-col">
        {currentQ.options.map((opt, idx) => (
          <PixelButton key={idx} onClick={() => handleAnswer(opt)}>
            {opt}
          </PixelButton>
        ))}
      </div>
    </PixelCard>
  );
};

export default QuizScreen;
