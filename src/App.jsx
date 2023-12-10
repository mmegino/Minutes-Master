// App.jsx
import React, { useState } from 'react';
import Timer from './Timer';
// import EarnSession from './EarnSession';
import QAndT from './QAndT';
import FocusSprint from './FocusSprint';

const App = () => {
  const [sessionType, setSessionType] = useState('normal'); // 'custom', 'normal', 'earn'
  const [h1Text, setH1Text] = useState('Quotes and Tips');

  const handleSessionTypeChange = (type) => {
    setSessionType(type);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-slate-800 text-gray-300">
      <h1 className="text-5xl font-bold mb-14 text-center mt-16">Productivity Timer</h1>
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-col items-start justify-start m-8 ">
          {sessionType !== 'earn' && sessionType !== 'focusSprint' && <Timer sessionType={sessionType} />}
          {sessionType === 'earn' && <EarnSession />}
          {sessionType === 'focusSprint' && (
            <FocusSprint onSprintEnd={() => setSessionType('normal')} />
          )}
        </div>
        <div className={`p-5 items-start ml-8 fixed right-0 top-0 mt-60 mr-20 border-gray-900 border-2 rounded-3xl ${sessionType === 'custom' ? 'pb-24 bg-gray-700' : 'bg-gray-700'}`}> 
          {/* the upper is the right container */}
          <label htmlFor="sessionType" className="text-lg font-bold mb-2">
            Select Mode
          </label>
          <div className="flex flex-col m-4 ">
            {/* <button
              className={`font-semibold px-5 py-3 mb-4 hover:bg-gray-900 hover:text-white rounded-xl border-2 border-gray-900 ${sessionType === 'earn' ? 'bg-gray-900 text-white' : 'bg-slate-800 text-white'}`}
              onClick={() => handleSessionTypeChange('earn')}
            >
              Earn Session
            </button> */}
            <button
              className={`font-semibold px-5 py-3 mb-4 hover:bg-gray-900 hover:text-white rounded-xl border-2 border-gray-900 ${sessionType === 'focusSprint' ? 'bg-gray-900 text-white' : 'bg-slate-800 text-white'}`}
              onClick={() => handleSessionTypeChange('focusSprint')}
            >
              Focus Sprint
            </button>
            <button
              className={`font-semibold px-5 py-3 mb-4 hover:bg-gray-900 hover:text-white rounded-xl border-2 border-gray-900 ${sessionType === 'normal' ? 'bg-gray-900 text-white' : 'bg-slate-800 text-white'}`}
              onClick={() => handleSessionTypeChange('normal')}
            >
              Pomodoro
            </button>
            <button
              className={`font-semibold px-5 py-3 mb-4 hover:bg-gray-900 hover:text-white rounded-xl border-2 border-gray-900 ${sessionType === 'custom' ? 'bg-gray-900 text-white' : 'bg-slate-800 text-white'}`}
              onClick={() => handleSessionTypeChange('custom')}
            >
              Custom Mode
            </button>
          </div>
        </div>
      </div>
      <div className="p-7 border-2 rounded-3xl fixed left-12 top-52 w-1/5 h-96 cursor-pointer bg-gray-700 border-gray-900">
        <h1 className="text-xl text-center font-semibold bg-gray-900 py-2 rounded-xl">{h1Text}</h1>
        <QAndT setH1Text={setH1Text} />
      </div>
    </div>
  );
};

export default App;
