import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { useTimer } from "../hooks/useTimer";
import "./Timer.css";

interface Props {
  timer: ReturnType<typeof useTimer>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Timer({ timer }: Props) {
  const { t } = useTranslation();

  const {
    state,
    start,
    stop,
    setTime,
    nextSteep,
    prevSteep,
    reset,
  } = timer;

  const [editingTime, setEditingTime] = useState(false);
  const [editMinutes, setEditMinutes] = useState("");
  const [editSeconds, setEditSeconds] = useState("");

  const handleTimeClick = () => {
    if (state.status === "running") return;
    setEditMinutes(String(Math.floor(state.remainingSeconds / 60)));
    setEditSeconds(String(state.remainingSeconds % 60));
    setEditingTime(true);
  };

  const handleTimeSubmit = () => {
    const mins = parseInt(editMinutes, 10) || 0;
    const secs = parseInt(editSeconds, 10) || 0;
    setTime(mins * 60 + secs);
    setEditingTime(false);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTimeSubmit();
    if (e.key === "Escape") setEditingTime(false);
  };

  const handleStartStop = () => {
    if (state.status === "running") {
      stop();
    } else if (state.status === "finished") {
      nextSteep();
    } else {
      start();
    }
  };

  if (!state.presetId) {
    return <div className="timer" />;
  }

  return (
    <div className="timer">
      <div className="timer-row">
        <div className="steep-controls">
          <button
            className="steep-btn"
            onClick={prevSteep}
            disabled={state.steepNumber <= 1 || state.status === "running"}
          >
            &lt;
          </button>
          <span className="steep-label">
            {t("timer.steepCount", { count: state.steepNumber })}
          </span>
          <button
            className="steep-btn"
            onClick={nextSteep}
            disabled={state.status === "running"}
          >
            &gt;
          </button>
        </div>

        <div className="timer-display" onClick={handleTimeClick}>
          {editingTime ? (
            <div className="timer-edit" onClick={(e) => e.stopPropagation()}>
              <input
                type="number"
                className="time-input"
                value={editMinutes}
                onChange={(e) => setEditMinutes(e.target.value)}
                onKeyDown={handleTimeKeyDown}
                min={0}
                autoFocus
              />
              <span className="time-separator">:</span>
              <input
                type="number"
                className="time-input"
                value={editSeconds}
                onChange={(e) => setEditSeconds(e.target.value)}
                onKeyDown={handleTimeKeyDown}
                min={0}
                max={59}
              />
              <button className="time-confirm" onClick={handleTimeSubmit}>
                OK
              </button>
            </div>
          ) : (
            <span
              className={`time-text ${state.status === "finished" ? "finished" : ""}`}
            >
              {formatTime(state.remainingSeconds)}
            </span>
          )}
        </div>

        <button
          className={`control-btn ${state.status === "running" ? "stop" : state.status === "finished" ? "next" : "start"}`}
          onClick={handleStartStop}
          disabled={state.status === "idle" && state.remainingSeconds === 0}
        >
          {state.status === "running" ? "\u25A0" : "\u25B6"}
        </button>
        <button
          className="control-btn reset"
          onClick={reset}
          disabled={state.status === "running"}
        >
          {"\u21BA"}
        </button>
      </div>
    </div>
  );
}
