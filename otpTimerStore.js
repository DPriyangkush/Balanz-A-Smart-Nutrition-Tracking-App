let timerEndTimestamp = null;

// Set the timer
const setTimerEnd = (timestamp) => {
  timerEndTimestamp = timestamp;
};

// Get the current timer value
const getTimerEnd = () => timerEndTimestamp;

// ✅ Add this to reset/clear the timer
const clearTimerEnd = () => {
  timerEndTimestamp = null;
};

export { setTimerEnd, getTimerEnd, clearTimerEnd };
