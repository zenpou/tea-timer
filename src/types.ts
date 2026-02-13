export interface TeaPreset {
  id: string;
  name: { ja: string; en: string };
  fixedTimes: number[];
  increment: number;
}

export type TimerStatus = "idle" | "running" | "finished";

export interface TimerState {
  presetId: string | null;
  steepNumber: number;
  remainingSeconds: number;
  totalSeconds: number;
  status: TimerStatus;
}
