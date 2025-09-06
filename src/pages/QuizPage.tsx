import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizList } from '../components/Quiz/QuizList';
import { Quiz } from '../types';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuizSelect = (quiz: Quiz) => {
    navigate(`/quiz/${quiz.id}/take`);
  };

  const handleCreateQuiz = () => {
    navigate('/quiz/new');
  };

  return (
    <QuizList
      onQuizSelect={handleQuizSelect}
      onCreateQuiz={handleCreateQuiz}
    />
  );
};