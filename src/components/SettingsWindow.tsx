import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Settings } from "./Settings";
import { PresetEditor } from "./PresetEditor";
import type { AppSettings } from "../store";
import type { TeaPreset } from "../types";

interface Props {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

type View = "settings" | "presetEditor";

export function SettingsWindow({ settings, onSettingsChange }: Props) {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("settings");

  const handlePresetsChange = (presets: TeaPreset[], defaultPresetId: string) => {
    onSettingsChange({ ...settings, presets, defaultPresetId });
    setView("settings");
  };

  if (view === "presetEditor") {
    return (
      <div className="app" style={{ overflow: "auto", height: "100vh" }}>
        <PresetEditor
          presets={settings.presets}
          defaultPresetId={settings.defaultPresetId}
          onSave={handlePresetsChange}
          onClose={() => setView("settings")}
        />
      </div>
    );
  }

  return (
    <div className="app" style={{ overflow: "auto", height: "100vh" }}>
      <Settings
        settings={settings}
        onChange={onSettingsChange}
        onClose={() => {
          getCurrentWindow().close().catch(() => {});
        }}
      />
      <div style={{ padding: "0 1.5rem 1rem" }}>
        <button onClick={() => setView("presetEditor")}>
          {t("preset.edit")}
        </button>
      </div>
    </div>
  );
}
