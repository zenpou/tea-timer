import {
  readTextFile,
  writeTextFile,
  mkdir,
  exists,
  BaseDirectory,
} from "@tauri-apps/plugin-fs";
import type { TeaPreset } from "./types";
import { defaultPresets } from "./presets";

export interface AppSettings {
  language: string;
  alwaysOnTop: boolean;
  notification: {
    enabled: boolean;
    sound: boolean;
    soundType: string;
  };
  presets: TeaPreset[];
  defaultPresetId: string;
}

const SETTINGS_FILE = "settings.json";
const APP_DIR = "tea-timer";

function getDefaultSettings(): AppSettings {
  return {
    language: "ja",
    alwaysOnTop: false,
    notification: {
      enabled: true,
      sound: true,
      soundType: "default",
    },
    presets: [...defaultPresets],
    defaultPresetId: defaultPresets[0].id,
  };
}

async function ensureDir(): Promise<void> {
  const dirExists = await exists(APP_DIR, {
    baseDir: BaseDirectory.AppData,
  });
  if (!dirExists) {
    await mkdir(APP_DIR, {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    await ensureDir();
    const filePath = `${APP_DIR}/${SETTINGS_FILE}`;
    const fileExists = await exists(filePath, {
      baseDir: BaseDirectory.AppData,
    });
    if (!fileExists) {
      const defaults = getDefaultSettings();
      await saveSettings(defaults);
      return defaults;
    }
    const content = await readTextFile(filePath, {
      baseDir: BaseDirectory.AppData,
    });
    const parsed = JSON.parse(content) as Partial<AppSettings>;
    // Merge with defaults to handle missing fields
    const defaults = getDefaultSettings();
    return {
      ...defaults,
      ...parsed,
      notification: { ...defaults.notification, ...parsed.notification },
      presets: parsed.presets ?? defaults.presets,
      defaultPresetId: parsed.defaultPresetId ?? defaults.defaultPresetId,
    };
  } catch {
    return getDefaultSettings();
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await ensureDir();
    const filePath = `${APP_DIR}/${SETTINGS_FILE}`;
    await writeTextFile(filePath, JSON.stringify(settings, null, 2), {
      baseDir: BaseDirectory.AppData,
    });
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}
