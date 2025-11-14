'use client';

import { useState } from 'react';
import Link from 'next/link';
import TracingCanvas from '@/components/TracingCanvas';
import { getAllLetters } from '@/lib/letters';
import { ArrowLeft } from 'lucide-react';

export default function PracticePage() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const letters = getAllLetters();

  if (selectedLetter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedLetter(null)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Letters</span>
        </button>
        
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-purple-600 mb-2">{selectedLetter}</h1>
          <p className="text-gray-600">Trace the letter below</p>
        </div>

        <TracingCanvas
          letter={selectedLetter}
          difficulty="EASY"
          showGuide={true}
          onComplete={(accuracy, stars) => {
            console.log('Completed:', { accuracy, stars });
            // Save progress via API
            fetch('/api/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: 1,
                activityType: 'LETTER_TRACING',
                itemId: selectedLetter,
                accuracy,
                timeSpent: 30,
                stars,
                completed: true
              })
            }).catch(console.error);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Practice Letters
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Choose a letter to practice tracing
      </p>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className="aspect-square bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center text-3xl font-bold text-purple-600 hover:bg-purple-50"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}

