import React, { useState, useEffect, useRef } from 'react';

const EarnSession = () => {
  const [workTime, setWorkTime] = useState(0); // Work timer in seconds
  const [workTimer, setWorkTimer] = useState(null);

  const [breakTime, setBreakTime] = useState(0); // Break timer in seconds
  const [breakTimer, setBreakTimer] = useState(null);

  const [isWorkingSession, setIsWorkingSession] = useState(false); // Flag to track if it's a work session or break session
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(true); // Disable start button when necessary
  const [isResetButtonStart, setIsResetButtonStart] = useState(false); // Control reset button text

  const workTimeRef = useRef(null); // Reference to input for setting custom work time

  // useEffect to handle workTimer logic
  useEffect(() => {
    if (workTime <= 0) {
      // Work Timer reached 0, handle the end of the timer
      handleTimerEnd(workTimer, setWorkTimer, () => {
        setWorkTime(0);
        setBreakTime(0);
      });
    }
  }, [workTime, workTimer]);

  // useEffect to handle breakTimer logic
  useEffect(() => {
    if (breakTime <= 0) {
      // Break Timer reached 0, handle the end of the timer
      handleTimerEnd(breakTimer, setBreakTimer, () => {
        setBreakTime(0);
        if (isWorkingSession) {
          // If it's a work session, start the next work session
          startWorkTimer();
        }
      });
    }
  }, [breakTime, breakTimer, isWorkingSession]);

  // Function to handle the end of a timer
  const handleTimerEnd = (timer, setTimer, callback) => {
    clearInterval(timer);
    setTimer(null);
    callback();
  };

  // Function to start the work timer
  const startWorkTimer = () => {
    setIsWorkingSession(true); // Set working session flag
    setIsStartButtonDisabled(true); // Disable start button during the session
    setIsResetButtonStart(false); // Update reset button text

    const startTime = Date.now(); // Get the current time

    // Set up the work timer to run every second
    setWorkTimer(
      setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
        setWorkTime((prev) => {
          if (prev > 0) {
            if (elapsedTime % 5 === 0) {
              // Increase break timer every 5 seconds during work session
              setBreakTime((prevBreak) => prevBreak + 1);
            }
            return prev - 1; // Decrease work timer by 1 second
          } else {
            // Work Timer is zero, switch to Break Session
            setIsWorkingSession(false);
            handleTimerEnd(workTimer, setWorkTimer, () => startBreakTimer()); // Start the break timer
            return 0;
          }
        });
      }, 1000)
    );

    clearInterval(breakTimer); // Stop the break timer to decrease during work session
  };

  // Function to start the break timer
  const startBreakTimer = () => {
    setIsStartButtonDisabled(true); // Disable start button during break session
    setIsResetButtonStart(false); // Update reset button text

    const startTime = Date.now(); // Get the current time

    // Set up the break timer to run every second
    setBreakTimer(
      setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
        setBreakTime((prev) => {
          if (prev > 0) {
            return prev - 1; // Decrease break timer by 1 second
          } else {
            // Break Timer is zero, switch to Work Session
            handleTimerEnd(breakTimer, setBreakTimer, () => {
              setIsWorkingSession(true);
              setIsStartButtonDisabled(false); // Enable start button for the next work session
            });
            return 0;
          }
        });
      }, 1000)
    );

    clearInterval(workTimer); // Stop the work timer to decrease during break session
  };

  // Function to reset both timers
  const resetTimers = () => {
    setIsWorkingSession(false); // Set working session flag to false
    setIsStartButtonDisabled(true); // Disable start button
    setIsResetButtonStart(true); // Update reset button text

    // Handle the end of both timers
    handleTimerEnd(workTimer, setWorkTimer, () => {
      handleTimerEnd(breakTimer, setBreakTimer, () => {
        setWorkTime(0);
        setBreakTime(0);
      });
    });
  };

  // Function to set custom work time
  const handleSetTime = () => {
    const hours = parseInt(workTimeRef.current.value, 10);
    if (!isNaN(hours) && hours > 0) {
      setWorkTime(hours * 60 * 60); // Convert hours to seconds
      setBreakTime(0);
      setIsStartButtonDisabled(false); // Enable start button
      setIsResetButtonStart(false); // Update reset button text
    }
  };

  // Function to handle Break button click
  const handleBreak = () => {
    if (isWorkingSession && workTime > 0) {
      setIsWorkingSession(false); // Set working session flag to false
      handleTimerEnd(workTimer, setWorkTimer, () => {
        startBreakTimer(); // Start the break timer
      });
    }
  };

  // Function to format time in HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {/* Display work and break timers */}
      <div className="flex flex-row gap-12">
        <div className="text-xl mb-4">Work Timer
          <div className="font-bold text-6xl mb-12">
            {formatTime(workTime)}
          </div>
        </div>
        <div>
          <div className="text-xl mb-2">Break Timer
            <div className="font-bold text-6xl mb-6">
              {formatTime(breakTime)}
            </div>
          </div>
        </div>
      </div>
      {/* Buttons for starting/pausing, resetting, and setting custom time */}
      <div className="flex">
        <button
          onClick={isWorkingSession ? handleBreak : startWorkTimer}
          className={`mr-2 p-2 text-lg bg-${isWorkingSession ? 'yellow' : 'green'}-500 text-white rounded`}
          disabled={isStartButtonDisabled} // Disable the button when the timer is 0
        >
          {isWorkingSession ? 'Break' : 'Start Work'}
        </button>
        <button
          onClick={resetTimers}
          className="mr-2 p-2 text-lg bg-red-500 text-white rounded"
        >
          {isResetButtonStart ? 'Start' : 'Reset'}
        </button>
      </div>
      {/* Section for setting custom work time */}
      <div className="flex flex-col mt-4">
        <label className="block mb-2">Set Work Time (hours): </label>
        <input
          type="number"
          min="1"
          ref={workTimeRef}
          className="p-2 w-40 text-lg border rounded bg-gray-900 text-center" placeholder=" Enter number"
        />
        <button onClick={handleSetTime} className="mt-2 p-2 text-lg bg-blue-500 text-white rounded-lg">
          Set Time
        </button>
      </div>
    </div>
  );
};

export default EarnSession;
