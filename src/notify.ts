import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export async function notifyTimerFinished(teaName: string): Promise<void> {
  try {
    let granted = await isPermissionGranted();
    if (!granted) {
      const permission = await requestPermission();
      granted = permission === "granted";
    }
    if (granted) {
      sendNotification({
        title: "Tea Timer",
        body: `${teaName}`,
      });
    }
  } catch {
    // Ignore in browser dev mode
  }
}

const SOUND_FILES: Record<string, string> = {
  default: "/sounds/bell.mp3",
  chime: "/sounds/chime.mp3",
  ding: "/sounds/ding.mp3",
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playDefaultBeep(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  } catch {
    // Audio not available
  }
}

export async function playSound(soundType: string): Promise<void> {
  const soundFile = SOUND_FILES[soundType];
  if (!soundFile) {
    playDefaultBeep();
    return;
  }
  try {
    const audio = new Audio(soundFile);
    await audio.play();
  } catch {
    playDefaultBeep();
  }
}
