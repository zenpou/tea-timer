let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

let stopHandle: (() => void) | null = null;

export function playAlertSound(): void {
  stopAlertSound();

  try {
    const ctx = getAudioContext();
    let stopped = false;
    let timeout: ReturnType<typeof setTimeout>;

    const playBeep = () => {
      if (stopped) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
      timeout = setTimeout(playBeep, 700);
    };

    playBeep();

    const autoStop = setTimeout(() => {
      stopped = true;
      clearTimeout(timeout);
    }, 10000);

    stopHandle = () => {
      stopped = true;
      clearTimeout(timeout);
      clearTimeout(autoStop);
    };
  } catch {
    // Audio not available
  }
}

export function stopAlertSound(): void {
  if (stopHandle) {
    stopHandle();
    stopHandle = null;
  }
}
