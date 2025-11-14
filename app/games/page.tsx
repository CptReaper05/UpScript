'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import GameCelebration from '@/components/GameCelebration';
import GameButton from '@/components/GameButton';

const games = [
  {
    id: 'object-recognition',
    name: 'Object Recognition',
    description: 'Match emojis to words',
    icon: '🎯',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'letter-match',
    name: 'Letter Match',
    description: 'Match letters to sounds',
    icon: '🔤',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'sound-game',
    name: 'Sound Game',
    description: 'Listen and identify sounds',
    icon: '🔊',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'word-builder',
    name: 'Word Builder',
    description: 'Build words from letters',
    icon: '🧩',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Match pairs of letters',
    icon: '🧠',
    color: 'from-purple-500 to-purple-600'
  }
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame === 'object-recognition') {
    return <ObjectRecognitionGame onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'letter-match') {
    return <LetterMatchGame onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'sound-game') {
    return <SoundGame onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'word-builder') {
    return <WordBuilderGame onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'memory-match') {
    return <MemoryMatchGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-purple-600 mb-2 text-center">
        🎮 Learning Games
      </h1>
      <p className="text-center text-gray-600 mb-8 text-lg">
        Choose a fun game to play and learn! 🌟
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedGame(game.id)}
            className={`bg-gradient-to-br ${game.color} text-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl text-left relative overflow-hidden group`}
          >
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"
              whileHover={{ scale: 1.5 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="text-7xl mb-4"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {game.icon}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">{game.name}</h2>
            <p className="text-white/90 text-lg">{game.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Object Recognition Game
function ObjectRecognitionGame({ onBack }: { onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'correct' | 'incorrect' | 'complete'>('correct');

  const questions = [
    { emoji: '🍎', word: 'Apple', options: ['Apple', 'Orange', 'Banana', 'Grape'] },
    { emoji: '🐶', word: 'Dog', options: ['Cat', 'Dog', 'Bird', 'Fish'] },
    { emoji: '🚗', word: 'Car', options: ['Car', 'Bus', 'Bike', 'Train'] },
    { emoji: '🏠', word: 'House', options: ['House', 'Tree', 'Sun', 'Moon'] },
    { emoji: '⭐', word: 'Star', options: ['Star', 'Moon', 'Sun', 'Cloud'] },
    { emoji: '🌳', word: 'Tree', options: ['Tree', 'Flower', 'Grass', 'Leaf'] },
    { emoji: '📚', word: 'Book', options: ['Book', 'Pen', 'Paper', 'Desk'] },
    { emoji: '🎈', word: 'Balloon', options: ['Balloon', 'Ball', 'Toy', 'Game'] },
    { emoji: '🌙', word: 'Moon', options: ['Moon', 'Star', 'Sun', 'Cloud'] },
    { emoji: '🌈', word: 'Rainbow', options: ['Rainbow', 'Cloud', 'Sun', 'Rain'] }
  ];

  const current = questions[currentQuestion];
  const shuffledOptions = [...current.options].sort(() => Math.random() - 0.5);

  // Animation handled by framer-motion in JSX

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === current.word;
    setCelebrationType(isCorrect ? 'correct' : 'incorrect');
    setShowCelebration(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => setShowCelebration(false), 2000);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCelebrationType('complete');
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onBack();
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <GameCelebration 
        show={showCelebration} 
        type={celebrationType}
        message={celebrationType === 'correct' ? 'Great Job! 🎉' : celebrationType === 'incorrect' ? 'Try Again! 😊' : `You scored ${score + (selectedAnswer === current.word ? 1 : 0)}/${questions.length}! 🏆`}
      />
      
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-lg"
      >
        <ArrowLeft size={24} />
        <span>Back to Games</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-6">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-9xl mb-4"
            >
              {current.emoji}
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              What is this? 🤔
            </h2>
            <div className="flex items-center justify-center gap-4 text-lg text-gray-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-purple-600 font-bold flex items-center gap-1">
                <Star className="text-yellow-500" size={20} /> {score}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {shuffledOptions.map((option, index) => (
              <GameButton
                key={option}
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
                variant={
                  showResult && option === current.word
                    ? 'success'
                    : showResult && option === selectedAnswer && option !== current.word
                    ? 'danger'
                    : 'default'
                }
                className="text-xl py-6"
              >
                {option}
              </GameButton>
            ))}
          </div>

          {showResult && (
            <div className="mt-6">
              <GameButton
                onClick={handleNext}
                variant="primary"
                className="w-full text-xl py-6"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question ➡️' : 'Finish Game 🏆'}
              </GameButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Letter Match Game
function LetterMatchGame({ onBack }: { onBack: () => void }) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const letters = [
    { letter: 'A', image: '🍎', word: 'Apple' },
    { letter: 'B', image: '🐻', word: 'Bear' },
    { letter: 'C', image: '🐱', word: 'Cat' },
    { letter: 'D', image: '🐶', word: 'Dog' },
    { letter: 'E', image: '🐘', word: 'Elephant' },
    { letter: 'F', image: '🐸', word: 'Frog' },
    { letter: 'G', image: '🦒', word: 'Giraffe' },
    { letter: 'H', image: '🐴', word: 'Horse' }
  ];

  const current = letters[currentLetter];
  const options = [
    { image: current.image, word: current.word, correct: true },
    { image: '🍊', word: 'Orange', correct: false },
    { image: '🐰', word: 'Rabbit', correct: false },
    { image: '🦁', word: 'Lion', correct: false }
  ].sort(() => Math.random() - 0.5);

  const handleSelect = (word: string, correct: boolean) => {
    setSelectedImage(word);
    setShowResult(true);
    if (correct) {
      setScore(score + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleNext = () => {
    if (currentLetter < letters.length - 1) {
      setCurrentLetter(currentLetter + 1);
      setSelectedImage(null);
      setShowResult(false);
    } else {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onBack();
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <GameCelebration 
        show={showCelebration} 
        type={selectedImage === current.word ? 'correct' : 'complete'}
        message={selectedImage === current.word ? 'Perfect! 🎉' : `You scored ${score}/${letters.length}! 🏆`}
      />
      
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-lg"
      >
        <ArrowLeft size={24} />
        <span>Back to Games</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-9xl font-bold text-green-600 mb-4">{current.letter}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Which picture starts with {current.letter}? 🔤
            </h2>
            <p className="text-lg text-gray-600">
              Question {currentLetter + 1} of {letters.length} | Score: <span className="text-green-600 font-bold">{score}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleSelect(option.word, option.correct)}
                disabled={showResult}
                className={`p-6 rounded-2xl text-6xl transition-all transform hover:scale-105 ${
                  showResult && option.correct
                    ? 'bg-green-500 shadow-lg scale-105'
                    : showResult && option.word === selectedImage && !option.correct
                    ? 'bg-red-500 shadow-lg'
                    : 'bg-white shadow-md hover:shadow-lg'
                }`}
              >
                {option.image}
                <div className="text-lg font-bold mt-2 text-gray-800">{option.word}</div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6">
              <GameButton
                onClick={handleNext}
                variant="primary"
                className="w-full text-xl py-6"
              >
                {currentLetter < letters.length - 1 ? 'Next Letter ➡️' : 'Finish Game 🏆'}
              </GameButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sound Game
function SoundGame({ onBack }: { onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const questions = [
    { sound: 'A', letter: 'A', options: ['A', 'E', 'I', 'O'] },
    { sound: 'B', letter: 'B', options: ['B', 'D', 'P', 'T'] },
    { sound: 'C', letter: 'C', options: ['C', 'K', 'S', 'Z'] },
    { sound: 'D', letter: 'D', options: ['D', 'B', 'P', 'T'] },
    { sound: 'E', letter: 'E', options: ['E', 'A', 'I', 'U'] },
    { sound: 'F', letter: 'F', options: ['F', 'V', 'P', 'B'] },
    { sound: 'G', letter: 'G', options: ['G', 'J', 'K', 'C'] },
    { sound: 'H', letter: 'H', options: ['H', 'M', 'N', 'R'] }
  ];

  const current = questions[currentQuestion];
  const shuffledOptions = [...current.options].sort(() => Math.random() - 0.5);

  const playSound = () => {
    setIsPlaying(true);
    // Use Web Speech API to speak the letter
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(current.sound);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
      setTimeout(() => setIsPlaying(false), 1000);
    } else {
      setIsPlaying(false);
    }
  };

  const handleSelect = (letter: string) => {
    setSelectedLetter(letter);
    setShowResult(true);
    const isCorrect = letter === current.letter;
    if (isCorrect) {
      setScore(score + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedLetter(null);
      setShowResult(false);
    } else {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onBack();
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <GameCelebration 
        show={showCelebration} 
        type={selectedLetter === current.letter ? 'correct' : 'complete'}
        message={selectedLetter === current.letter ? 'Excellent! 🎉' : `You scored ${score}/${questions.length}! 🏆`}
      />
      
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-lg"
      >
        <ArrowLeft size={24} />
        <span>Back to Games</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <button
              onClick={playSound}
              disabled={isPlaying}
              className="text-9xl mb-4 bg-yellow-400 rounded-full p-8 hover:bg-yellow-500 transition-all transform hover:scale-110 disabled:opacity-50"
            >
              🔊
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Listen and choose the letter! 👂
            </h2>
            <p className="text-lg text-gray-600">
              Question {currentQuestion + 1} of {questions.length} | Score: <span className="text-yellow-600 font-bold">{score}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {shuffledOptions.map((letter) => (
              <GameButton
                key={letter}
                onClick={() => !showResult && handleSelect(letter)}
                disabled={showResult}
                variant={
                  showResult && letter === current.letter
                    ? 'success'
                    : showResult && letter === selectedLetter && letter !== current.letter
                    ? 'danger'
                    : 'default'
                }
                className="text-5xl py-8"
              >
                {letter}
              </GameButton>
            ))}
          </div>

          {showResult && (
            <div className="mt-6">
              <GameButton
                onClick={handleNext}
                variant="primary"
                className="w-full text-xl py-6"
              >
                {currentQuestion < questions.length - 1 ? 'Next Sound ➡️' : 'Finish Game 🏆'}
              </GameButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Word Builder Game
function WordBuilderGame({ onBack }: { onBack: () => void }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const words = [
    { word: 'CAT', letters: ['C', 'A', 'T', 'D', 'E', 'B'] },
    { word: 'DOG', letters: ['D', 'O', 'G', 'B', 'E', 'F'] },
    { word: 'SUN', letters: ['S', 'U', 'N', 'T', 'A', 'B'] },
    { word: 'MOON', letters: ['M', 'O', 'O', 'N', 'A', 'B', 'C'] },
    { word: 'STAR', letters: ['S', 'T', 'A', 'R', 'B', 'C', 'D'] }
  ];

  const current = words[currentWord];

  useEffect(() => {
    setAvailableLetters([...current.letters].sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
  }, [currentWord]);

  const handleLetterClick = (letter: string, index: number) => {
    if (selectedLetters.length < current.word.length) {
      setSelectedLetters([...selectedLetters, letter]);
      setAvailableLetters(availableLetters.filter((_, i) => i !== index));
    }
  };

  const handleRemoveLetter = (index: number) => {
    const letter = selectedLetters[index];
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
    setAvailableLetters([...availableLetters, letter]);
  };

  const handleCheck = () => {
    const builtWord = selectedLetters.join('');
    if (builtWord === current.word) {
      setScore(score + 1);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        if (currentWord < words.length - 1) {
          setCurrentWord(currentWord + 1);
        } else {
          setTimeout(() => onBack(), 2000);
        }
      }, 2000);
    } else {
      // Reset
      setAvailableLetters([...selectedLetters, ...availableLetters]);
      setSelectedLetters([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <GameCelebration 
        show={showCelebration} 
        type="correct"
        message="Perfect Word! 🎉"
      />
      
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-lg"
      >
        <ArrowLeft size={24} />
        <span>Back to Games</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-white to-red-50 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Build the word! 🧩
            </h2>
            <p className="text-lg text-gray-600">
              Word {currentWord + 1} of {words.length} | Score: <span className="text-red-600 font-bold">{score}</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6 min-h-[120px] flex items-center justify-center gap-3">
            {selectedLetters.length === 0 ? (
              <p className="text-gray-400 text-2xl">Tap letters to build the word</p>
            ) : (
              selectedLetters.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => handleRemoveLetter(index)}
                  className="text-6xl font-bold text-red-600 bg-red-100 rounded-xl p-4 hover:bg-red-200 transition-all transform hover:scale-110"
                >
                  {letter}
                </button>
              ))
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {availableLetters.map((letter, index) => (
              <button
                key={index}
                onClick={() => handleLetterClick(letter, index)}
                className="text-5xl font-bold text-white bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {letter}
              </button>
            ))}
          </div>

          <GameButton
            onClick={handleCheck}
            variant="primary"
            disabled={selectedLetters.length !== current.word.length}
            className="w-full text-xl py-6"
          >
            Check Word ✅
          </GameButton>
        </div>
      </div>
    </div>
  );
}

// Memory Match Game
function MemoryMatchGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Array<{ letter: string; id: number; flipped: boolean; matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  useEffect(() => {
    const newCards = [...letters, ...letters].map((letter, index) => ({
      letter,
      id: index,
      flipped: false,
      matched: false
    })).sort(() => Math.random() - 0.5);
    setCards(newCards);
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, index]);

    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[index];

      if (firstCard.letter === secondCard.letter) {
        newCards[flippedCards[0]].matched = true;
        newCards[index].matched = true;
        setMatches(matches + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1500);
        if (matches + 1 === letters.length) {
          setTimeout(() => onBack(), 2000);
        }
      } else {
        setTimeout(() => {
          newCards[flippedCards[0]].flipped = false;
          newCards[index].flipped = false;
          setCards(newCards);
        }, 1000);
      }
      setFlippedCards([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <GameCelebration 
        show={showCelebration} 
        type="correct"
        message="Match Found! 🎉"
      />
      
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-lg"
      >
        <ArrowLeft size={24} />
        <span>Back to Games</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Memory Match! 🧠
            </h2>
            <div className="flex items-center justify-center gap-6 text-lg">
              <span className="text-purple-600 font-bold">Moves: {moves}</span>
              <span className="text-purple-600 font-bold">Matches: {matches}/{letters.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-2xl text-6xl font-bold transition-all transform ${
                  card.flipped || card.matched
                    ? 'bg-purple-500 text-white scale-100'
                    : 'bg-purple-200 hover:bg-purple-300 scale-95 hover:scale-100'
                }`}
              >
                {card.flipped || card.matched ? card.letter : '?'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
