import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export async function setAlwaysOnTop(value: boolean): Promise<void> {
  const win = getCurrentWindow();
  await win.setAlwaysOnTop(value);
}

export async function openSettingsWindow(): Promise<void> {
  const existing = await WebviewWindow.getByLabel("settings");
  if (existing) {
    await existing.setFocus();
    return;
  }

  new WebviewWindow("settings", {
    url: "index.html#settings",
    title: "Settings",
    width: 450,
    height: 500,
    resizable: true,
    center: true,
  });
}
