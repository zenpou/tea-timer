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

  const updateNotification = (
    partial: Partial<AppSettings["notification"]>
  ) => {
    onChange({
      ...settings,
      notification: { ...settings.notification, ...partial },
    });
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

      <div className="settings-section">
        <h3>{t("settings.notification")}</h3>

        <label className="settings-row">
          <span>{t("settings.notificationEnabled")}</span>
          <input
            type="checkbox"
            checked={settings.notification.enabled}
            onChange={(e) =>
              updateNotification({ enabled: e.target.checked })
            }
          />
        </label>

        <label className="settings-row">
          <span>{t("settings.soundEnabled")}</span>
          <input
            type="checkbox"
            checked={settings.notification.sound}
            onChange={(e) => updateNotification({ sound: e.target.checked })}
          />
        </label>

        <label className="settings-row">
          <span>{t("settings.soundType")}</span>
          <select
            value={settings.notification.soundType}
            onChange={(e) =>
              updateNotification({ soundType: e.target.value })
            }
            disabled={!settings.notification.sound}
          >
            <option value="default">Default (Beep)</option>
            <option value="chime">Chime</option>
            <option value="ding">Ding</option>
          </select>
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
