import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100;
  return (
    <div className="w-20 h-20">
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "28px",
          pathColor: "#F0002F",
          textColor: "#4B171F",
          trailColor: "#E4E4E6",
        })}
      />
    </div>
  );
}

export default Timer;
