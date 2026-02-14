import { useTranslation } from "react-i18next";
import type { AppSettings } from "../store";
import "./Settings.css";

interface Props {
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
  onClose: () => void;
}

export function Settings({ settings, onChange, onClose }: Props) {
  const { t, i18n } = useTranslation();

  const update = (partial: Partial<AppSettings>) => {
    onChange({ ...settings, ...partial });
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    update({ language: lang });
  };

  return (
    <div className="settings">
      <h2>{t("settings.title")}</h2>

      <div className="settings-section">
        <label className="settings-row">
          <span>{t("settings.language")}</span>
          <select
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </label>

        <label className="settings-row">
          <span>{t("settings.alwaysOnTop")}</span>
          <input
            type="checkbox"
            checked={settings.alwaysOnTop}
            onChange={(e) => update({ alwaysOnTop: e.target.checked })}
          />
        </label>
      </div>

      <div className="settings-footer">
        <button className="settings-close-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
