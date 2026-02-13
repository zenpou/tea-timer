import { useState, useRef, useCallback, useEffect } from "react";
import type { TeaPreset, TimerState } from "../types";

function calcSteepTime(preset: TeaPreset, steepNumber: number): number {
  const index = steepNumber - 1;
  if (index < preset.fixedTimes.length) {
    return preset.fixedTimes[index];
  }
  const lastFixed = preset.fixedTimes[preset.fixedTimes.length - 1];
  const extraSteeps = index - preset.fixedTimes.length + 1;
  return lastFixed + preset.increment * extraSteeps;
}

export function useTimer(onFinish?: () => void) {
  const [state, setState] = useState<TimerState>({
    presetId: null,
    steepNumber: 1,
    remainingSeconds: 0,
    totalSeconds: 0,
    status: "idle",
  });

  const presetRef = useRef<TeaPreset | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const selectPreset = useCallback(
    (preset: TeaPreset) => {
      clearTimer();
      presetRef.current = preset;
      const time = calcSteepTime(preset, 1);
      setState({
        presetId: preset.id,
        steepNumber: 1,
        remainingSeconds: time,
        totalSeconds: time,
        status: "idle",
      });
    },
    [clearTimer]
  );

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.status === "running" || prev.remainingSeconds <= 0) return prev;
      return { ...prev, status: "running" };
    });
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setState((prev) => {
      if (prev.status !== "running") return prev;
      return { ...prev, status: "idle" };
    });
  }, [clearTimer]);

  const setTime = useCallback(
    (seconds: number) => {
      clearTimer();
      setState((prev) => ({
        ...prev,
        remainingSeconds: Math.max(0, seconds),
        totalSeconds: Math.max(0, seconds),
        status: "idle",
      }));
    },
    [clearTimer]
  );

  const goToSteep = useCallback(
    (steepNumber: number) => {
      clearTimer();
      const preset = presetRef.current;
      if (!preset || steepNumber < 1) return;
      const time = calcSteepTime(preset, steepNumber);
      setState((prev) => ({
        ...prev,
        steepNumber,
        remainingSeconds: time,
        totalSeconds: time,
        status: "idle",
      }));
    },
    [clearTimer]
  );

  const nextSteep = useCallback(() => {
    setState((prev) => {
      const next = prev.steepNumber + 1;
      const preset = presetRef.current;
      if (!preset) return prev;
      const time = calcSteepTime(preset, next);
      clearTimer();
      return {
        ...prev,
        steepNumber: next,
        remainingSeconds: time,
        totalSeconds: time,
        status: "idle",
      };
    });
  }, [clearTimer]);

  const prevSteep = useCallback(() => {
    setState((prev) => {
      if (prev.steepNumber <= 1) return prev;
      const next = prev.steepNumber - 1;
      const preset = presetRef.current;
      if (!preset) return prev;
      const time = calcSteepTime(preset, next);
      clearTimer();
      return {
        ...prev,
        steepNumber: next,
        remainingSeconds: time,
        totalSeconds: time,
        status: "idle",
      };
    });
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    const preset = presetRef.current;
    if (!preset) return;
    const time = calcSteepTime(preset, 1);
    setState({
      presetId: preset.id,
      steepNumber: 1,
      remainingSeconds: time,
      totalSeconds: time,
      status: "idle",
    });
  }, [clearTimer]);

  // Timer tick effect
  useEffect(() => {
    if (state.status !== "running") {
      clearTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setState((prev) => {
        if (prev.remainingSeconds <= 1) {
          return { ...prev, remainingSeconds: 0, status: "finished" };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return clearTimer;
  }, [state.status, clearTimer]);

  // Finish callback
  useEffect(() => {
    if (state.status === "finished") {
      clearTimer();
      onFinish?.();
    }
  }, [state.status, clearTimer, onFinish]);

  return {
    state,
    selectPreset,
    start,
    stop,
    setTime,
    goToSteep,
    nextSteep,
    prevSteep,
    reset,
  };
}
