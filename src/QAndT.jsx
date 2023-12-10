// QAndT.jsx
import React, { useState } from 'react';

const QAndT = ({ setH1Text }) => {
  const quotes = [
    '“The only way to do great work is to love what you do.” - Steve Jobs',
    '“The key is not to prioritize what’s on your schedule, but to schedule your priorities.” - Stephen Covey',
    '“Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.” - Paul J. Meyer',
    // Add more quotes as needed
  ];

  const tips = [
    'Set specific goals for the day to stay focused.',
    'Take short breaks to improve overall productivity.',
    'Prioritize tasks to tackle the most important ones first.',
    // Add more tips as needed
  ];

  const [currentQuoteOrTip, setCurrentQuoteOrTip] = useState('');
  const [generationMode, setGenerationMode] = useState('quotes'); // Default mode is quotes

  const generateRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuoteOrTip(quotes[randomIndex]);
  };

  const generateRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setCurrentQuoteOrTip(tips[randomIndex]);
  };

  const generateRandom = () => {
    if (generationMode === 'quotes') {
      generateRandomQuote();
    } else {
      generateRandomTip();
    }
  };

  const handleButtonClickQuotes = () => {
    const newH1Text = 'Quotes';
    setH1Text(newH1Text);
  };

  const handleButtonClickTips = () => {
    const newH1Text = 'Tips';
    setH1Text(newH1Text);
  };

  return (
    <div className="q-and-t-container">
      <p className="quote-or-tip my-12" class="font-normal flex text-center mt-7" >{currentQuoteOrTip}</p>
      <button
        onClick={() => {
          // Assuming setGenerationMode and generateRandomQuote are defined elsewhere
          setGenerationMode('quotes');
          generateRandomQuote();
          handleButtonClickQuotes();
        }}
        className={`font-semibold py-2 px-5 mr-2 hover:bg-gray-900 hover:text-white rounded-xl border-2 ${
          generationMode === 'quotes' ? 'bg-gray-900' : 'bg-gray-800'
        } border-gray-900 absolute left-10 bottom-5`}
      >
        Quotes
      </button>
      <button
        onClick={() => {
          setGenerationMode('tips');
          generateRandomTip();
          handleButtonClickTips();
        }}
        className={`font-semibold py-2 px-5 hover:bg-gray-900 hover:text-white rounded-xl border-2 ${
          generationMode === 'tips' ? 'bg-gray-900' : 'bg-gray-800'
        } border-gray-900 absolute right-16 bottom-5`}
      >
        Tips
      </button>
      
    </div>
  );
};

export default QAndT;
