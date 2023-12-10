import React, { useState, useEffect, useRef } from 'react';

const FocusSprint = ({ onSprintEnd }) => {
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);

  const notificationTimeout = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        const now = performance.now();
        setElapsedTime((prev) => prev + (now - startTime) / 1000);
        setStartTime(now);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimerRunning, startTime]);

  useEffect(() => {
    if (elapsedTime >= 600) {
      setIsTimerRunning(false);
      setElapsedTime(0);
      setNotificationShown(true);

      // Notify user after 15 minutes (900,000 milliseconds)
      notificationTimeout.current = setTimeout(() => {
        setNotificationShown(false);
        onSprintEnd(false);
      }, 900000);
    }
  }, [elapsedTime, onSprintEnd]);

  const handleStartPause = () => {
    if (!isTimerRunning && elapsedTime < 600) {
      setIsTimerRunning(true);
      setStartTime(performance.now());
    } else {
      setIsTimerRunning(false);
    }
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setStartTime(0);
    setElapsedTime(0);
    setNotificationShown(false);
    clearTimeout(notificationTimeout.current);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="text-xl mb-4">Focus Sprint</div>
      <div className="text-9xl font-bold mb-8">{formatTime(600 - elapsedTime)}</div>
      <div className="flex mt-4">
        <button onClick={handleStartPause} className="mr-2 p-3 text-lg bg-slate-800 rounded-lg hover:bg-gray-900 border-2 border-gray-900">
          {isTimerRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleReset} className="ml-2 p-3 text-lg bg-slate-800 rounded-lg hover:bg-gray-900 border-2 border-gray-900">
          Reset
        </button>
      </div>
      {notificationShown && (
        <div className="mt-4 text-sm text-gray-500">
          Notification: Take a break and relax!
        </div>
      )}
    </div>
  );
};

export default FocusSprint;
