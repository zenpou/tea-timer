import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { emit } from "@tauri-apps/api/event";
import { playAlertSound, stopAlertSound } from "../notify";

export function AlertWindow() {
  const { t } = useTranslation();

  useEffect(() => {
    playAlertSound();

    const autoClose = setTimeout(() => {
      stopAlertSound();
      emit("timer-next-steep").catch(() => {});
      getCurrentWindow().close().catch(() => {});
    }, 10000);

    return () => {
      clearTimeout(autoClose);
      stopAlertSound();
    };
  }, []);

  const handleOk = () => {
    stopAlertSound();
    emit("timer-next-steep").catch(() => {});
    getCurrentWindow().close().catch(() => {});
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: "12px",
      padding: "16px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>
        {t("timer.finished")}
      </div>
      <button
        onClick={handleOk}
        style={{
          padding: "0.4em 2em",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        OK
      </button>
    </div>
  );
}
