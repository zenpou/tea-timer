import { useTranslation } from "react-i18next";
import type { TimerState } from "../types";
import "./MiniTimer.css";

interface Props {
  state: TimerState;
  onStart: () => void;
  onStop: () => void;
  onNextSteep: () => void;
  onExpand: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function MiniTimer({
  state,
  onStart,
  onStop,
  onNextSteep,
  onExpand,
}: Props) {
  const { t } = useTranslation();

  const handleAction = () => {
    if (state.status === "running") {
      onStop();
    } else if (state.status === "finished") {
      onNextSteep();
    } else {
      onStart();
    }
  };

  return (
    <div className="mini-timer">
      <span
        className={`mini-time ${state.status === "finished" ? "finished" : ""}`}
      >
        {formatTime(state.remainingSeconds)}
      </span>
      <button className="mini-btn" onClick={handleAction}>
        {state.status === "running"
          ? t("timer.stop")
          : state.status === "finished"
            ? t("timer.nextSteep")
            : t("timer.start")}
      </button>
      <button className="mini-expand-btn" onClick={onExpand} title="Expand">
        &#x26F6;
      </button>
    </div>
  );
}
