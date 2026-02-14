import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { emit, listen } from "@tauri-apps/api/event";
import { Timer } from "./components/Timer";
import { SettingsWindow } from "./components/SettingsWindow";
import { AlertWindow } from "./components/AlertWindow";
import { useTimer } from "./hooks/useTimer";
import { loadSettings, saveSettings, type AppSettings } from "./store";
import { setAlwaysOnTop, openSettingsWindow, openAlertWindow } from "./window";
import { buildMenu, setMenuHandler } from "./appMenu";
import "./App.css";

function getRoute(): string {
  return window.location.hash.replace("#", "") || "timer";
}

function App() {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const settingsRef = useRef<AppSettings | null>(null);
  const route = getRoute();

  const onFinish = useCallback(() => {
    openAlertWindow().catch(() => {});
  }, []);

  const timer = useTimer(onFinish);

  // Load settings & auto-select default preset
  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      settingsRef.current = s;
      i18n.changeLanguage(s.language);
      if (s.alwaysOnTop) {
        setAlwaysOnTop(true).catch(() => {});
      }
      if (route === "timer" && s.defaultPresetId) {
        const preset = s.presets.find((p) => p.id === s.defaultPresetId);
        if (preset) timer.selectPreset(preset);
      }
    });
  }, [i18n]);

  // Build menu & set handler (main window only)
  useEffect(() => {
    if (route !== "timer" || !settings) return;

    const lang = i18n.language as "ja" | "en";

    setMenuHandler({
      onSelectPreset: (presetId) => {
        const preset = settings.presets.find((p) => p.id === presetId);
        if (preset) timer.selectPreset(preset);
      },
      onOpenSettings: () => {
        openSettingsWindow().catch(() => {});
      },
    });

    buildMenu(settings.presets, lang);
  }, [settings, i18n.language, route, timer]);

  // Listen for settings-changed event from settings window
  useEffect(() => {
    if (route !== "timer") return;
    let unlisten: (() => void) | undefined;
    listen<string>("settings-changed", () => {
      loadSettings().then((s) => {
        setSettings(s);
        settingsRef.current = s;
        i18n.changeLanguage(s.language);
        setAlwaysOnTop(s.alwaysOnTop).catch(() => {});
      });
    })
      .then((fn) => {
        unlisten = fn;
      })
      .catch(() => {});
    return () => unlisten?.();
  }, [route, i18n]);

  if (!settings) {
    return null;
  }

  // Alert window
  if (route === "alert") {
    return <AlertWindow />;
  }

  // Settings window
  if (route === "settings") {
    return (
      <SettingsWindow
        settings={settings}
        onSettingsChange={(s) => {
          setSettings(s);
          settingsRef.current = s;
          saveSettings(s);
          setAlwaysOnTop(s.alwaysOnTop).catch(() => {});
          emit("settings-changed", "").catch(() => {});
        }}
      />
    );
  }

  // Main timer window
  return (
    <div className="app">
      <Timer timer={timer} />
    </div>
  );
}

export default App;
