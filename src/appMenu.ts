import { Menu, Submenu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { TeaPreset } from "./types";

type MenuHandler = {
  onSelectPreset: (presetId: string) => void;
  onOpenSettings: () => void;
};

let handler: MenuHandler | null = null;

export function setMenuHandler(h: MenuHandler) {
  handler = h;
}

export async function buildMenu(
  presets: TeaPreset[],
  lang: "ja" | "en"
): Promise<void> {
  try {
    const presetItems = await Promise.all(
      presets.map((p) =>
        MenuItem.new({
          id: `preset_${p.id}`,
          text: p.name[lang],
          action: () => handler?.onSelectPreset(p.id),
        })
      )
    );

    const presetSubmenu = await Submenu.new({
      id: "presets",
      text: lang === "ja" ? "プリセット" : "Presets",
      items: presetItems,
    });

    const settingsItem = await MenuItem.new({
      id: "settings",
      text: lang === "ja" ? "設定" : "Settings",
      action: () => handler?.onOpenSettings(),
    });

    const separator = await PredefinedMenuItem.new({ item: "Separator" });
    const quitItem = await PredefinedMenuItem.new({ item: "Quit" });

    const menu = await Menu.new({
      items: [presetSubmenu, settingsItem, separator, quitItem],
    });

    const win = getCurrentWindow();
    await menu.setAsWindowMenu(win);
  } catch {
    // Ignore in browser dev mode
  }
}
