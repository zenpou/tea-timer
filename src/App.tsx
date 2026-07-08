import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { emit, listen } from "@tauri-apps/api/event";
import { Timer } from "./components/Timer";
import { Header } from "./components/Header";
import { SettingsWindow } from "./components/SettingsWindow";
import { AlertWindow } from "./components/AlertWindow";
import { useTimer } from "./hooks/useTimer";
import { loadSettings, saveSettings, type AppSettings } from "./store";
import { setAlwaysOnTop, openSettingsWindow, openAlertWindow } from "./window";
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
      if (route === "timer") {
        const startId = s.lastPresetId ?? s.defaultPresetId;
        const preset = s.presets.find((p) => p.id === startId);
        if (preset) timer.selectPreset(preset);
      }
    });
  }, [i18n]);

  // Listen for next-steep event from alert window
  useEffect(() => {
    if (route !== "timer") return;
    let unlisten: (() => void) | undefined;
    listen("timer-next-steep", () => {
      timer.nextSteep();
    })
      .then((fn) => { unlisten = fn; })
      .catch(() => {});
    return () => unlisten?.();
  }, [route, timer]);

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
      <Header
        presets={settings.presets}
        selectedPresetId={timer.state.presetId}
        onSelectPreset={(id) => {
          const preset = settings.presets.find((p) => p.id === id);
          if (preset) timer.selectPreset(preset);
          const updated = { ...settings, lastPresetId: id };
          setSettings(updated);
          settingsRef.current = updated;
          saveSettings(updated);
        }}
        onOpenSettings={() => openSettingsWindow().catch(() => {})}
      />
      <Timer timer={timer} />
    </div>
  );
}

export default App;
