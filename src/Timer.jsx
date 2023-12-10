import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ sessionType }) => {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [workTimeRemaining, setWorkTimeRemaining] = useState(workTime * 60);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(breakTime * 60);
  const [isWorking, setIsWorking] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);
  const [isFocusSprintActive, setIsFocusSprintActive] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [timerPaused, setTimerPaused] = useState(false);

  useEffect(() => {
    if (sessionType === 'normal') {
      setWorkTime(25);
      setBreakTime(5);
      setWorkTimeRemaining(25 * 60);
      setBreakTimeRemaining(5 * 60);
    } else if (sessionType === 'focusSprint') {
      setWorkTime(10);
      setWorkTimeRemaining(10 * 60);
      setIsFocusSprintActive(true);
    }
  }, [sessionType]);

  const notificationTimeout = useRef(null);

  const notifyUser = (title, message) => {
    if (Notification.permission === 'granted') {
      clearTimeout(notificationTimeout.current);

      const notification = new Notification(title, { body: message });

      notification.onclick = () => {
        window.focus();
      };

      notificationTimeout.current = setTimeout(() => {
        setNotificationShown(false);
      }, 1000);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          notifyUser(title, message);
        }
      });
    }
  };

  useEffect(() => {
    let timer;

    if (isTimerRunning && !timerPaused) {
      timer = setInterval(() => {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastUpdateTime) / 1000;

        setLastUpdateTime(currentTime);

        if (isWorking) {
          setWorkTimeRemaining((prevTime) => {
            if (prevTime > 0) {
              return prevTime - deltaTime;
            } else {
              clearInterval(timer);
              if (!notificationShown) {
                notifyUser('Break Time!', 'Take a break and relax.');
                setNotificationShown(true);
              }
              setIsWorking(false);
              setBreakTimeRemaining(breakTime * 60);
              return workTime * 60;
            }
          });
        } else {
          setBreakTimeRemaining((prevTime) => {
            if (prevTime > 0) {
              return prevTime - deltaTime;
            } else {
              clearInterval(timer);
              if (!notificationShown) {
                notifyUser('Work Time!', 'Time to get back to work!');
                setNotificationShown(true);
              } else {
                const userResponse = window.confirm('Do you want to continue the working session?');
                if (userResponse) {
                  setIsWorking(true);
                  setWorkTimeRemaining(workTime * 60);
                  setNotificationShown(false);
                  clearTimeout(notificationTimeout.current);
                }
              }
              setIsWorking(true);
              setWorkTimeRemaining(workTime * 60);
              return breakTime * 60;
            }
          });
        }
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isTimerRunning, isWorking, workTime, breakTime, notificationShown, lastUpdateTime, timerPaused]);

  useEffect(() => {
    setWorkTimeRemaining(workTime * 60);
    setBreakTimeRemaining(breakTime * 60);
    setIsWorking(true);
    setNotificationShown(false);
    setLastUpdateTime(performance.now());
  }, [workTime, breakTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsTimerRunning((prev) => !prev);
    setTimerPaused(false);
    setLastUpdateTime(performance.now());
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setIsWorking(true);
    setWorkTimeRemaining(workTime * 60);
    setBreakTimeRemaining(breakTime * 60);
    setNotificationShown(false);
    setLastUpdateTime(performance.now());
  };

  const handleWorkTimeChange = (e) => {
    const newWorkTime = parseInt(e.target.value, 10) || 0;
    setWorkTime(newWorkTime);
    if (isWorking) {
      setWorkTimeRemaining(newWorkTime * 60);
    }
  };

  const handleBreakTimeChange = (e) => {
    setBreakTime(parseInt(e.target.value, 10) || 0);
    if (!isWorking) {
      setBreakTimeRemaining(breakTime * 60);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex flex-row mb-4 fixed right-32 mt-72 z-50">
        {sessionType === 'custom' && (
          <div className="flex flex-col mr-4 ">
            <label htmlFor="workTime" className="mr-2 text-lg">
              Work:
            </label>
            <input
              type="number"
              id="workTime"
              value={workTime}
              onChange={handleWorkTimeChange}
              className="p-2 w-16 text-lg border rounded bg-gray-900"
            />
          </div>
        )}
        {sessionType === 'custom' && (
          <div className="flex flex-col">
            <label htmlFor="breakTime" className="mr-2 text-lg">
              Break:
            </label>
            <input
              type="number"
              id="breakTime"
              value={breakTime}
              onChange={handleBreakTimeChange}
              className="p-2 w-16 text-lg border rounded bg-gray-900"
            />
          </div>
        )}
      </div>
      <div className="text-xl mb-4">
        {isWorking ? 'Working Session' : 'Break Time'}
      </div>
      <div className="text-9xl font-bold mb-12">
        {isWorking ? formatTime(workTimeRemaining) : formatTime(breakTimeRemaining)}
      </div>
      <div className="flex">
        <button
          onClick={handleStartPause}
          className="mr-2 p-3 text-lg bg-slate-800 rounded-lg hover:bg-gray-900 border-2 border-gray-900"
        >
          {isTimerRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="ml-2 p-3 text-lg bg-slate-800 rounded-lg hover:bg-gray-900 border-2 border-gray-900"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
