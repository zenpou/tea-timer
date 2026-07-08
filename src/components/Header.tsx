import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTranslation } from "react-i18next";
import type { TeaPreset } from "../types";
import "./Header.css";

interface Props {
  presets: TeaPreset[];
  selectedPresetId: string | null;
  onSelectPreset: (id: string) => void;
  onOpenSettings: () => void;
}

export function Header({ presets, selectedPresetId, onSelectPreset, onOpenSettings }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ja" | "en";

  const win = getCurrentWindow();
  const handleMinimize = () => win.minimize().catch(() => {});
  const handleClose = () => win.close().catch(() => {});

  const handleMouseDown = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (tag === "button" || tag === "select" || tag === "option" || tag === "input") return;
    win.startDragging().catch(() => {});
  };

  return (
    <div className="header" onMouseDown={handleMouseDown}>
      <select
        className="preset-select"
        value={selectedPresetId ?? ""}
        onChange={(e) => onSelectPreset(e.target.value)}
      >
        {presets.map((p) => (
          <option key={p.id} value={p.id}>{p.name[lang]}</option>
        ))}
      </select>
      <button className="header-action-btn" onClick={onOpenSettings}>{t("settings.title")}</button>
      <div className="header-drag" />
      <button className="wm-btn" onClick={handleMinimize} title="Minimize">─</button>
      <button className="wm-btn close" onClick={handleClose} title="Close">✕</button>
    </div>
  );
}
